import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
      ],
    }];
  },
  allowedDevOrigins: ["192.168.31.126"],
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"*",
        port:'',
        pathname:"/**"
      }
    ]
  },
};

export default nextConfig;
