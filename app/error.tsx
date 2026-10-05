"use client"

import { useEffect } from "react"

import { AppChromeHeader } from "@/components/app-chrome-header"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="[--site-header-height:60px]">
      <AppChromeHeader />
      <div className="mx-auto w-full max-w-none px-5 sm:max-w-[90%] sm:px-0 xl:max-w-6xl">
        <main
          id="main-content"
          className="flex w-full flex-col items-center justify-center gap-4 py-52"
        >
          <h2 className="text-center text-heading-sm">
            Something went wrong!
          </h2>
          <p className="mb-4 max-w-prose text-center text-neutral-600 dark:text-neutral-400">
            It seems like there&apos;s a hiccup on our end. Our team is working
            hard to fix the issue. We appreciate your patience and
            understanding.
          </p>
          <Button
            className="text-body xl:hidden"
            onClick={
              // Attempt to recover by trying to re-render the current route
              () => reset()
            }
          >
            Try again
          </Button>
          <Button
            size="lg"
            className="hidden text-body xl:flex"
            onClick={
              // Attempt to recover by trying to re-render the current route
              () => reset()
            }
          >
            Try again
          </Button>
        </main>
      </div>
    </div>
  )
}
