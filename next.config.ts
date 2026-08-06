import type { NextConfig } from "next";

// URL absolue du backend FAUCON. Le navigateur n'appelle jamais directement ce
// domaine : toutes les requêtes API passent par le proxy ci-dessous, ce qui
// évite tout blocage CORS (le mobile natif n'y est pas soumis, le navigateur si).
const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
