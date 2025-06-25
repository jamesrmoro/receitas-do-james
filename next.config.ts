import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['jamesrmoro.me'], // ✅ Adicione todos os domínios externos que você usa nas imagens
  },
};

export default nextConfig;
