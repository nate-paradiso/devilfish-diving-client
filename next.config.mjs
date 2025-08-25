/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/arcgis-proxy/:path*",
        destination: "http://localhost:8888/:path*",
      },
    ];
  },
};

export default nextConfig;
