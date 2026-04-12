import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mern-fyp-bucket.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
  reactCompiler: false,
  reactStrictMode:false,
};

export default nextConfig;