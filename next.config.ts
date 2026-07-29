import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /work was the old route; keep any existing links and indexed URLs alive.
  async redirects() {
    return [{ source: "/work", destination: "/experience", permanent: true }];
  },
};

export default nextConfig;
