import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function QuoteNotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-5 py-40 text-center"
    >
      <h1 className="text-heading-sm">
        We could not find this quote
      </h1>
      <p className="max-w-prose text-body leading-relaxed text-neutral-600 dark:text-neutral-400">
        Check that the link is complete, or contact us and we will send it
        again.
      </p>
      <Button size="lg" className="mt-4" asChild>
        <Link href="/cars">Explore cars</Link>
      </Button>
    </main>
  )
}
