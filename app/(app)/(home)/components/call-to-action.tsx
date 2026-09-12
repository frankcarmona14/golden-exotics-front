"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { FadeUp } from "@/components/motion"

export function CallToAction() {
  return (
    <section>
      <div className="mx-auto max-w-none px-5 sm:max-w-[90%] sm:px-0 lg:max-w-4xl">
        <FadeUp>
          <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-14 sm:px-14 sm:py-16">
            {/* Background decoration */}
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 size-48 rounded-full bg-accent/5 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent sm:text-xs">
                  Start now
                </p>
                <h2 className="text-balance text-[24px] font-bold leading-tight tracking-tight text-white sm:text-[28px] md:text-[32px]">
                  Ready to Hit the Road?
                  <br />
                  <span className="text-neutral-200">
                    Start Your Adventure Today
                  </span>
                </h2>
              </div>
              <div className="shrink-0">
                <Button
                  className="rounded-full bg-accent px-7 py-6 text-[14px] font-bold text-accent-foreground shadow-none transition-colors duration-300 hover:bg-accent-hover dark:shadow-[0_0_30px_rgba(248,227,63,0.3)] dark:hover:shadow-[0_0_40px_rgba(248,227,63,0.4)]"
                  asChild
                >
                  <Link href="/cars">Explore Our Cars</Link>
                </Button>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
