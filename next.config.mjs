// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add the images configuration block
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // Optional: you can specify the port if needed, but usually not for standard Cloudinary
        // port: '',
        // Optional: you can specify a specific path, or use a wildcard for all paths
        pathname: "/hrdoqhgcp/image/upload/**",
      },
    ],
    // If you are on an older Next.js version (v12 or earlier), you would use 'domains' instead:
    // domains: ['res.cloudinary.com'],
  },

  // Your existing rewrites configuration
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
