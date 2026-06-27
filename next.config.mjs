/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },

  // Proxy all /api/* requests through Vercel to Render so cookies are
  // same-origin. Without this, browsers block cross-origin cookies and
  // every authenticated request returns 401 after login.
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBase) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
