/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["chrome-aws-lambda"],
    serverActions: {
      bodySizeLimit: "10mb", // Allow up to 10MB payloads for server actions
    },
  },
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Allow up to 10MB payloads for API routes
    },
  },
};

export default nextConfig;
