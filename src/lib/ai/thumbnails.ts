import Replicate from "replicate";
import {
  THUMBNAIL_NICHE_HINTS,
  THUMBNAIL_PROMPT_TEMPLATE_V1,
  THUMBNAIL_PROMPT_VERSION,
  THUMBNAIL_STYLE_HINTS,
  THUMBNAIL_VARIANT_HINTS,
} from "./prompts";
import { uploadFromUrl } from "@/lib/storage/r2";

// Flux Pro renders text legibly enough for thumbnails; Schnell doesn't.
const FLUX_PRO = "black-forest-labs/flux-1.1-pro" as const;

// Hard ceiling per variant. The plan accepts that a variant can fail —
// we save it with status=FAILED and surface a placeholder in the grid.
const VARIANT_TIMEOUT_MS = 45_000;
const VARIANTS_PER_SET = 8;

let _client: Replicate | null = null;
function client(): Replicate {
  if (_client) return _client;
  const auth = process.env.REPLICATE_API_TOKEN;
  if (!auth) throw new Error("REPLICATE_API_TOKEN is not set");
  _client = new Replicate({ auth });
  return _client;
}

export type ThumbnailGenInput = {
  setId: string;
  videoDescription: string;
  titleText: string;
  niche: "CARS" | "GAMING" | "ANIME" | "SPORTS" | "GENERAL";
  stylePreset:
    | "BRIGHT_ENERGETIC"
    | "MYSTERIOUS"
    | "COMEDIC"
    | "PROFESSIONAL";
};

export type ThumbnailVariantResult = {
  position: number;
  status: "READY" | "FAILED";
  imageUrl: string | null;
  promptUsed: string;
};

export type ThumbnailGenResult = {
  variants: ThumbnailVariantResult[];
  promptVersion: string;
};

/**
 * Generates VARIANTS_PER_SET thumbnails in parallel via Flux Pro on Replicate,
 * uploads each to R2, and returns per-variant results. Individual failures
 * don't abort the set — failed positions come back with status=FAILED.
 */
export async function generateThumbnailSet(
  input: ThumbnailGenInput
): Promise<ThumbnailGenResult> {
  const styleHint = THUMBNAIL_STYLE_HINTS[input.stylePreset] ?? "vibrant";
  const nicheHint = THUMBNAIL_NICHE_HINTS[input.niche] ?? "creative content";

  const tasks = Array.from({ length: VARIANTS_PER_SET }, (_, i) =>
    generateOneVariant({
      position: i,
      videoDescription: input.videoDescription,
      titleText: input.titleText,
      niche: nicheHint,
      styleHint,
      variantHint: THUMBNAIL_VARIANT_HINTS[i] ?? "creative angle",
      setId: input.setId,
    })
  );

  const settled = await Promise.allSettled(tasks);
  const variants = settled.map<ThumbnailVariantResult>((r, i) => {
    if (r.status === "fulfilled") return r.value;
    console.error(`Thumbnail variant ${i} failed:`, r.reason);
    return {
      position: i,
      status: "FAILED",
      imageUrl: null,
      promptUsed: "",
    };
  });

  return { variants, promptVersion: THUMBNAIL_PROMPT_VERSION };
}

async function generateOneVariant(params: {
  position: number;
  videoDescription: string;
  titleText: string;
  niche: string;
  styleHint: string;
  variantHint: string;
  setId: string;
}): Promise<ThumbnailVariantResult> {
  const prompt = THUMBNAIL_PROMPT_TEMPLATE_V1({
    videoDescription: params.videoDescription,
    titleText: params.titleText,
    niche: params.niche,
    styleHint: params.styleHint,
    variantHint: params.variantHint,
  });

  const runPromise = client().run(FLUX_PRO, {
    input: {
      prompt,
      aspect_ratio: "16:9",
      output_format: "webp",
      output_quality: 90,
      safety_tolerance: 1, // Flux Pro: 1 (strictest) … 6 (most permissive)
    },
  });
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`Variant ${params.position} timed out after ${VARIANT_TIMEOUT_MS}ms`)),
      VARIANT_TIMEOUT_MS
    )
  );

  const output = (await Promise.race([runPromise, timeoutPromise])) as unknown;
  const replicateUrl = await extractFirstImageUrl(output);
  if (!replicateUrl) {
    throw new Error(`Variant ${params.position}: Replicate returned no image URL`);
  }

  const upload = await uploadFromUrl(
    replicateUrl,
    `thumbnails/${params.setId}`,
    { contentType: "image/webp", ext: "webp" }
  );

  return {
    position: params.position,
    status: "READY",
    imageUrl: upload.publicUrl,
    promptUsed: prompt,
  };
}

async function extractFirstImageUrl(output: unknown): Promise<string | null> {
  if (output == null) return null;
  if (Array.isArray(output)) {
    if (output.length === 0) return null;
    return extractFirstImageUrl(output[0]);
  }
  if (typeof output === "string") return output;
  if (typeof output === "object") {
    const o = output as { url?: unknown };
    if (typeof o.url === "function") {
      const result = (o.url as () => unknown)();
      const resolved = await Promise.resolve(result);
      if (typeof resolved === "string") return resolved;
      if (resolved instanceof URL) return resolved.toString();
    }
    if (typeof o.url === "string") return o.url;
  }
  return null;
}
