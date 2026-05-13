import type { NextConfig } from "next";

const r2PublicHost = (() => {
  try {
    return process.env.R2_PUBLIC_BASE_URL
      ? new URL(process.env.R2_PUBLIC_BASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "replicate.delivery" },
      { protocol: "https", hostname: "pbxt.replicate.delivery" },
      // R2 public dev domain
      { protocol: "https", hostname: "*.r2.dev" },
      // Custom R2 domain (resolved from env at build time)
      ...(r2PublicHost ? [{ protocol: "https" as const, hostname: r2PublicHost }] : []),
    ],
  },
};

export default nextConfig;
