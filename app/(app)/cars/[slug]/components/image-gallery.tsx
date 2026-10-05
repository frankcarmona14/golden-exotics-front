"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  carName: string
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={cn("size-4", className)}
    >
      <path
        fillRule="evenodd"
        d="M2 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2Zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V2Zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2ZM2 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7Zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7Zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7ZM2 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2Zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2Zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn("size-5", className)}
    >
      <path
        fillRule="evenodd"
        d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn("size-5", className)}
    >
      <path
        fillRule="evenodd"
        d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn("size-5", className)}
    >
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  )
}

export function ShowAllPhotosButton({ images, carName }: ImageGalleryProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + images.length) % images.length)
    },
    [images.length]
  )

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
      if (e.key === "Tab") {
        const root = dialogRef.current
        if (!root) return
        const focusable = root.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, prev, next])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      closeRef.current?.focus()
    } else {
      document.body.style.overflow = ""
      triggerRef.current?.focus()
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (images.length <= 1) return null

  return (
    <>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setActiveIndex(0)
          setOpen(true)
        }}
        className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-tight border border-neutral-900 bg-white px-3.5 py-2 text-body-sm font-semibold text-neutral-900 shadow-sm transition-[transform,box-shadow] hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
      >
        <GridIcon />
        Show all photos
      </button>

      {/* Fullscreen gallery modal */}
      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${carName} photos`}
          className="fixed inset-0 z-[100] flex flex-col bg-black"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between px-4 py-3 md:px-6">
            <span className="text-body-sm font-medium tabular-nums text-white/70">
              {activeIndex + 1} / {images.length}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-11 items-center gap-1.5 rounded-full bg-white/10 px-3 text-body-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <XIcon className="size-4" />
              Close
            </button>
          </div>

          {/* Main image */}
          <div className="relative flex flex-1 items-center justify-center px-12 md:px-20">
            {/* Prev */}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:left-4 md:size-12"
            >
              <ChevronLeft className="size-6" />
            </button>

            <div className="relative size-full">
              <Image
                key={activeIndex}
                src={images[activeIndex]}
                alt={`${carName} - ${activeIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Next */}
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:right-4 md:size-12"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="shrink-0 border-t border-white/10 bg-black/80 backdrop-blur-sm">
            <div className="flex gap-2 overflow-x-auto px-4 py-3 md:justify-center md:px-6">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show photo ${i + 1} of ${images.length}`}
                  aria-current={i === activeIndex}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "relative size-14 shrink-0 overflow-hidden rounded-tight transition-[opacity,box-shadow] md:size-16",
                    i === activeIndex
                      ? "ring-2 ring-white ring-offset-1 ring-offset-black"
                      : "opacity-50 hover:opacity-80"
                  )}
                >
                  <Image
                    src={src}
                    alt={`${carName} thumbnail ${i + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
