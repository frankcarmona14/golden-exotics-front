/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // NEXT_DIST_DIR permite un build de producción en local sin pisar el .next
  // del servidor de desarrollo (p. ej. para medir con Lighthouse).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async redirects() {
    return [
      // La categoría se creó como "lamborgini"; corregida en Medusa con
      // src/scripts/rename-lamborghini-category.ts del backend.
      {
        source: "/brands/lamborgini",
        destination: "/brands/lamborghini",
        permanent: true,
      },
    ]
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "goldenexoticsclub.com",
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
