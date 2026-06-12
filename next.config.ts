import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // @google/earthengine uses native Node.js APIs — must not be bundled
  serverExternalPackages: ["@google/earthengine"],
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://panda-project-be-production.up.railway.app";
    return [
      {
        source: "/proxy/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
