import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.gyoseung.me"], // 외부 이미지 허용
  },
};

export default nextConfig;
