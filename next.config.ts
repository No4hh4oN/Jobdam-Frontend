import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 빌드시 ESLint 무시
  },
  images: {
    domains: ["cdn.gyoseung.me"], // 외부 이미지 허용
  },
};

export default nextConfig;
