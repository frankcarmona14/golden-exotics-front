"use client"

import Link from "next/link"
import { carBrands } from "@/data/car-brands"

import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

export function BrowseCarTypes() {
  return (
    <section>
      <div className="mx-auto w-full max-w-none px-5 sm:max-w-[90%] sm:px-0 2xl:max-w-8xl">
        <FadeUp>
          <div className="flex items-end justify-between">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent sm:text-xs">
                Explore Brands
              </p>
              <h2 className="text-balance text-[21px] font-bold tracking-tight sm:text-[24px] lg:text-[28px]">
                Drive the Legends
              </h2>
            </div>
            <Link
              href="/cars"
              className="hidden text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white sm:block"
            >
              View all brands →
            </Link>
          </div>
        </FadeUp>

        <div className="pt-7">
          <div className="relative">
            <div className="before:pointer-events-none before:absolute before:-left-1 before:top-0 before:z-10 before:h-full before:w-[7%] before:bg-gradient-to-r before:from-white before:content-[''] dark:before:from-neutral-950 lg:before:-left-10" />
            <div className="after:pointer-events-none after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[7%] after:bg-gradient-to-l after:from-white after:content-[''] dark:after:from-neutral-950 lg:after:-right-5" />
            <Carousel>
              <CarouselContent className="m-0 space-x-4 sm:space-x-5">
                {carBrands.map(({ id, slug, name, tagline, gradientFrom, gradientTo, logoColor }, index) => {
                  return (
                    <CarouselItem
                      key={id}
                      className="relative basis-[72%] p-0 sm:basis-[45%] md:basis-[36%] lg:basis-[28%] xl:basis-[23%]"
                    >
                      <Button
                        variant={"link"}
                        className="m-0 flex size-full p-0 ring-inset"
                        asChild
                      >
                        <Link
                          href={{
                            pathname: "/cars",
                          }}
                          className="absolute inset-0 z-20 size-full rounded-2xl"
                        />
                      </Button>
                      <div
                        className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.06] transition-transform duration-500 ease-out hover:scale-[1.02]"
                        style={{
                          background: `linear-gradient(145deg, ${gradientFrom}, ${gradientTo})`,
                        }}
                      >
                        {/* Decorative elements */}
                        <div
                          className="absolute -right-8 -top-8 size-32 rounded-full opacity-[0.07] blur-2xl"
                          style={{ background: logoColor }}
                        />
                        <div
                          className="absolute -bottom-12 -left-12 size-40 rounded-full opacity-5 blur-3xl"
                          style={{ background: logoColor }}
                        />

                        {/* Content */}
                        <div className="relative flex h-full flex-col justify-between p-6">
                          {/* Brand badge */}
                          <div>
                            <div
                              className="mb-3 inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
                              style={{
                                borderColor: `${logoColor}30`,
                                color: logoColor,
                                background: `${logoColor}10`,
                              }}
                            >
                              Premium
                            </div>
                          </div>

                          {/* Brand info */}
                          <div>
                            <h3 className="text-[22px] font-bold leading-tight tracking-tight text-white sm:text-[24px]">
                              {name}
                            </h3>
                            <p className="mt-1.5 text-[13px] font-medium italic text-white/40">
                              &ldquo;{tagline}&rdquo;
                            </p>

                            {/* CTA */}
                            <div className="mt-5 flex items-center gap-2">
                              <span
                                className="inline-flex items-center rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-all duration-300"
                                style={{
                                  background: `${logoColor}20`,
                                  borderColor: `${logoColor}30`,
                                }}
                              >
                                Explore →
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom accent line */}
                        <div
                          className="absolute bottom-0 left-0 h-[2px] w-full opacity-60"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${logoColor}, transparent)`,
                          }}
                        />
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="-left-4 z-30 lg:-left-12" />
              <CarouselNext className="-right-4 z-30 lg:-right-12" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  )
}
