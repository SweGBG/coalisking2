import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
  // CRiNTRO Loader: phones keep the film frames for a week (and use them while revalidating for a month),
  // so return visits load instantly. Put re-made frames in a new folder to skip the cache entirely.
  async headers() {
    return [
      { source: "/video/m/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }] },
      { source: "/video/:file(coal-.*)", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
    ];
  },
};
export default nextConfig;
