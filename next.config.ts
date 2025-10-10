import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow data URLs for base64 images
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // This is important for base64 images
    unoptimized: false,
  },
};

export default nextConfig;
