/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mongodb", "cloudinary"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;