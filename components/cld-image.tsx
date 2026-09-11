"use client"

import Image from "next/image"
import { CldImage as CldImageDefault, CldImageProps } from "next-cloudinary"

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const useCloudinary = Boolean(
  cloudName && cloudName.length > 0
)

/**
 * Uses Cloudinary when configured; otherwise falls back to next/image with the same API.
 * This lets the project work without a Cloudinary account (using images in /public).
 */
const CldImage = (props: CldImageProps) => {
  if (!useCloudinary) {
    const { src, alt, fill, className, sizes, priority } = props
    const srcStr = typeof src === "string" ? src : undefined
    if (!srcStr) return null
    return (
      <Image
        src={srcStr}
        alt={alt ?? ""}
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
      />
    )
  }
  return <CldImageDefault {...props} />
}

export default CldImage
