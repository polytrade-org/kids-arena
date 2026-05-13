import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomBytes } from "node:crypto";

// Cloudflare R2 is S3-compatible. Uses the S3 client pointed at a custom endpoint.
// Env vars (set in .env.local and Vercel):
//   R2_ACCOUNT_ID         - Cloudflare account ID
//   R2_ACCESS_KEY_ID      - API token access key
//   R2_SECRET_ACCESS_KEY  - API token secret
//   R2_BUCKET             - bucket name (e.g. "kids-arena-assets")
//   R2_PUBLIC_BASE_URL    - public URL prefix for objects in this bucket
//                           (custom domain or https://pub-<hash>.r2.dev)

let _client: S3Client | null = null;
function client(): S3Client {
  if (_client) return _client;

  const accountId = required("R2_ACCOUNT_ID");
  const accessKeyId = required("R2_ACCESS_KEY_ID");
  const secretAccessKey = required("R2_SECRET_ACCESS_KEY");

  _client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return _client;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

function publicUrlFor(key: string): string {
  const base = required("R2_PUBLIC_BASE_URL").replace(/\/+$/, "");
  return `${base}/${key}`;
}

export type UploadResult = {
  key: string;
  publicUrl: string;
};

/**
 * Fetches `sourceUrl` and uploads the bytes to R2 under `keyPrefix`/<random>.<ext>.
 * Used to persist Replicate-delivered images before their signed URLs expire.
 *
 * Throws if the source fetch fails or the upload errors.
 */
export async function uploadFromUrl(
  sourceUrl: string,
  keyPrefix: string,
  options: { contentType?: string; ext?: string } = {}
): Promise<UploadResult> {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Source fetch failed (${response.status}) for ${sourceUrl}`);
  }
  const contentType =
    options.contentType ?? response.headers.get("content-type") ?? "application/octet-stream";
  const ext = options.ext ?? guessExt(contentType, sourceUrl);
  const buffer = Buffer.from(await response.arrayBuffer());

  const key = `${keyPrefix.replace(/\/+$/, "")}/${randomBytes(12).toString("hex")}.${ext}`;
  await client().send(
    new PutObjectCommand({
      Bucket: required("R2_BUCKET"),
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return { key, publicUrl: publicUrlFor(key) };
}

function guessExt(contentType: string, sourceUrl: string): string {
  const ct = contentType.toLowerCase();
  if (ct.includes("webp")) return "webp";
  if (ct.includes("png")) return "png";
  if (ct.includes("jpeg") || ct.includes("jpg")) return "jpg";
  if (ct.includes("gif")) return "gif";
  if (ct.includes("mp4")) return "mp4";
  if (ct.includes("webm")) return "webm";

  const urlExt = sourceUrl.split("?")[0].split(".").pop();
  if (urlExt && urlExt.length <= 5) return urlExt.toLowerCase();

  return "bin";
}
