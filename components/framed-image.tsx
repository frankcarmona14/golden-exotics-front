import type { CSSProperties, ReactNode } from "react"

import { framingStyles, type ImageFraming } from "@/lib/image-framing"

/**
 * Applies the admin's photo framing to an `object-cover` image filling its
 * box. Without framing it renders the image as-is (centred, no zoom).
 *
 * The zoom goes on a wrapper, not the image, so the image keeps its own
 * transforms (e.g. the card's hover scale). The box must clip its overflow.
 */
export function FramedImage({
  framing,
  children,
}: {
  framing: ImageFraming | null
  children: (imageStyle: CSSProperties | undefined) => ReactNode
}) {
  if (!framing) return <>{children(undefined)}</>

  const styles = framingStyles(framing)
  return (
    <div className="absolute inset-0" style={styles.wrapper}>
      {children(styles.image)}
    </div>
  )
}
