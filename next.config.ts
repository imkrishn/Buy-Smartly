import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'avatars.githubusercontent.com'],  // Add Cloudinary's domain here
  },
  //reactStrictMode: false,
};

export default nextConfig;
