import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "w7.pngwing.com",
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  transpilePackages: [
    "@trpc/client",
    "@trpc/react-query",
    "@trpc/server",
    "@tanstack/react-query",
  ],
  // Next 16 + React 19 has a flaky bug where the internal special pages
  // (/_global-error, /_not-found) crash during static prerender with a
  // null React dispatcher ("Cannot read properties of null"). The failing
  // page changes between builds — a parallel build-worker race. Forcing
  // single-worker, sequential static generation (min pages per worker set
  // above the total page count, concurrency 1) avoids the race, and a retry
  // count self-heals any remaining transient failure.
  experimental: {
    staticGenerationRetryCount: 3,
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 1000,
  },
};

export default nextConfig;
