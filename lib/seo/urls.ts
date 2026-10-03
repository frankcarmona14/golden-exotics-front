import { siteConfig } from "@/config/site"

/** Convierte una ruta del sitio ("/cars/x") en URL absoluta del dominio público. */
export function absoluteUrl(path: string = "/", baseUrl = siteConfig.url) {
  if (/^https?:\/\//i.test(path)) return path
  const normalized = path.startsWith("/") ? path : `/${path}`
  return normalized === "/" ? baseUrl : `${baseUrl}${normalized}`
}

/**
 * Las imágenes de coche pueden llegar como URL absoluta (Medusa), como ruta de
 * /public (datos mock) o como public ID de Cloudinary. Open Graph y JSON-LD
 * exigen una URL absoluta y rastreable, así que normalizamos aquí; si no se
 * puede construir una URL válida devolvemos undefined para omitir la imagen
 * en lugar de publicar una rota.
 */
export function toAbsoluteImageUrl(
  src: string | null | undefined,
  options: { baseUrl?: string; cloudinaryCloudName?: string } = {}
): string | undefined {
  if (!src) return undefined
  if (/^https?:\/\//i.test(src)) return src
  if (src.startsWith("//")) return `https:${src}`
  if (src.startsWith("/")) return absoluteUrl(src, options.baseUrl)

  const cloudName =
    options.cloudinaryCloudName ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (cloudName) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/${src}`
  }
  return undefined
}
