"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { FadeUp } from "@/components/motion"

export function CallToAction() {
  return (
    <section>
      <div className="mx-auto max-w-none px-5 sm:max-w-[90%] sm:px-0 lg:max-w-page">
        <FadeUp>
          <div className="relative overflow-hidden rounded-card border border-border bg-muted px-8 py-14 dark:border-transparent sm:px-14 sm:py-16">
            {/* Background decoration */}
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 size-48 rounded-full bg-accent/5 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
              <div>
                {/* The button is this section's single accent, so the eyebrow
                    stays neutral instead of competing with it. */}
                <p className="mb-3 text-caption font-semibold uppercase tracking-[0.2em] text-subtle">
                  Start now
                </p>
                <h2 className="text-balance text-heading-sm sm:text-heading lg:text-heading-lg">
                  Ready to Hit the Road?
                  <br />
                  <span className="text-muted-foreground">
                    Start Your Adventure Today
                  </span>
                </h2>
              </div>
              <div className="shrink-0">
                <Button
                  size="lg"
                  className="bg-accent text-body-sm font-semibold text-accent-foreground shadow-none transition-colors duration-300 hover:bg-accent-hover dark:shadow-[0_0_30px_rgba(248,227,63,0.3)] dark:hover:shadow-[0_0_40px_rgba(248,227,63,0.4)]"
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
