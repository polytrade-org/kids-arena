import Replicate from "replicate";

const FLUX_SCHNELL = "black-forest-labs/flux-schnell" as const;

// Map of visual style → image-generation modifier appended to the prompt.
const STYLE_MODIFIERS: Record<string, string> = {
  REALISTIC: "semi-realistic digital painting, soft lighting",
  CARTOON: "cartoon illustration, bold lines, flat colors",
  ANIME: "anime style, expressive eyes, clean lineart",
  PIXEL: "16-bit pixel art, crisp pixels, retro game style",
};

let _client: Replicate | null = null;
function client(): Replicate {
  if (!_client) {
    const auth = process.env.REPLICATE_API_TOKEN;
    if (!auth) throw new Error("REPLICATE_API_TOKEN is not set");
    _client = new Replicate({ auth });
  }
  return _client;
}

export type GenerateVisualInput = {
  name: string;
  vibeDescription: string;
  visualStyle: "REALISTIC" | "CARTOON" | "ANIME" | "PIXEL";
};

export type GenerateVisualResult = {
  visualUrl: string;
  promptUsed: string;
};

/**
 * Generates a single character portrait via Flux Schnell on Replicate.
 * Throws on failure; the caller saves status=FAILED and offers retry.
 */
export async function generateCharacterVisual(
  input: GenerateVisualInput
): Promise<GenerateVisualResult> {
  // Keep the vibe excerpt short — Flux works best with focused prompts.
  const vibeExcerpt = input.vibeDescription.slice(0, 200);
  const styleModifier = STYLE_MODIFIERS[input.visualStyle] ?? "digital art";

  const prompt = `${styleModifier} portrait of ${input.name}, ${vibeExcerpt}, kid-friendly, vibrant colors, character design, centered composition, no text, no watermark`;

  const output = (await client().run(FLUX_SCHNELL, {
    input: {
      prompt,
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 90,
    },
  })) as unknown;

  const url = await extractFirstImageUrl(output);
  if (!url) throw new Error("Replicate returned no image URL.");
  return { visualUrl: url, promptUsed: prompt };
}

/**
 * Replicate's JS SDK returns different shapes depending on the model:
 *   - string[] of URLs
 *   - FileOutput[] (with async .url() method)
 *   - Single string or FileOutput
 * Handle all of them defensively.
 */
async function extractFirstImageUrl(output: unknown): Promise<string | null> {
  if (output == null) return null;

  if (Array.isArray(output)) {
    if (output.length === 0) return null;
    return extractFirstImageUrl(output[0]);
  }

  if (typeof output === "string") {
    return output;
  }

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
