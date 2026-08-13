import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lastfm.freetls.fastly.net" },
    ],
  },

  // Old routes; keep any existing links and indexed URLs alive.
  async redirects() {
    return [
      { source: "/work", destination: "/experience", permanent: true },
      { source: "/honors", destination: "/background", permanent: true },
    ];
  },
};

export default nextConfig;
