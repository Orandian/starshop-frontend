import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "oyoazrgseubztzqrrrbu.supabase.co",
      },
      {
        protocol: "https",
        hostname: "godmsmdzhgmulwjiywqq.supabase.co",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "star-shop.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "kintai-s3-bucket.s3.ap-northeast-1.amazonaws.com",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  }
};

export default nextConfig;
