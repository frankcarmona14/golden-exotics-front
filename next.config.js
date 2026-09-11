/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "carhive.eduam.dev",
      },
      {
        protocol: "https",
        hostname: "carhive.vercel.app",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Medusa backend local
        protocol: "http",
        hostname: "localhost",
        port: "9000",
      },
      {
        // Medusa file storage / S3 / cualquier dominio con imágenes de productos
        protocol: "https",
        hostname: "**",
      },
    ],
  },
}

module.exports = nextConfig
