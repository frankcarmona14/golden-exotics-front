"use client"

import Link from "next/link"

import type { Brand } from "@/db/queries/brand-repository"

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
import { BrandCard } from "@/components/brand-card"

export function BrowseCarTypes({
  brands,
  carCounts,
}: {
  brands: Brand[]
  carCounts: Record<string, number>
}) {
  if (brands.length === 0) return null

  return (
    <section>
      <div className="mx-auto w-full max-w-none px-5 sm:max-w-[90%] sm:px-0 2xl:max-w-8xl">
        <FadeUp>
          <div className="flex items-end justify-between">
            <div>
              <p className="mb-3 text-caption font-semibold uppercase tracking-[0.2em] text-subtle">
                Explore Brands
              </p>
              <h2 className="text-balance text-heading-sm sm:text-heading lg:text-heading-lg">
                Drive the Legends
              </h2>
            </div>
            <Link
              href="/brands"
              className="hidden shrink-0 text-body-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white sm:block"
            >
              View all brands →
            </Link>
          </div>
        </FadeUp>

        <div className="pt-7">
          <div className="relative">
            <Carousel>
              <CarouselContent className="m-0 space-x-4 sm:space-x-5">
                {brands.map((brand) => (
                  <CarouselItem
                    key={brand.handle}
                    className="relative basis-[88%] p-0 sm:basis-[70%] lg:basis-[48%] xl:basis-2/5"
                  >
                    <BrandCard
                      brand={brand}
                      carCount={carCounts[brand.handle]}
                    />
                  </CarouselItem>
                ))}
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
