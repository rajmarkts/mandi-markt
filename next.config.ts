import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  // Enable React strict mode for better development
  reactStrictMode: true,
  // Disable x-powered-by header for security
  poweredByHeader: false,
  
  // Turbopack configuration
  turbopack: {
    // Keep webpack for PWA support
  },
  
  // PWA headers for offline support
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
