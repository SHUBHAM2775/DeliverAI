import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/slots/recommend/:uuid",
        destination: "http://localhost:8000/api/slots/recommend/:uuid",
      },
    ];
  },
};

export default nextConfig;
