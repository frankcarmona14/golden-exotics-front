import { ReactNode } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "@/components/icons/chevron-left"

export default function CarLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      {/* Mobile: back button — below global app nav */}
      <div className="sticky top-[var(--site-header-height)] z-40 bg-white backdrop-blur-md dark:bg-background/80 md:hidden">
        <div className="mx-auto w-full max-w-none px-5 sm:max-w-[90%] sm:px-0 xl:max-w-6xl">
          <header className="flex h-[var(--site-header-height)] items-center">
            <Button
              variant={"link"}
              type="button"
              className="-ml-2 rounded-full pl-2 text-neutral-800 hover:underline dark:text-neutral-200"
              asChild
            >
              <Link href="/cars">
                <ChevronLeftIcon className="size-5 shrink-0" />
                <span className="ml-1 text-center text-base font-semibold">
                  Cars
                </span>
              </Link>
            </Button>
          </header>
        </div>
      </div>
      {children}
    </div>
  )
}
