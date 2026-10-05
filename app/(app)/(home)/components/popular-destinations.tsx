"use client"

import Image from "next/image"
import Link from "next/link"
import { locationsWithImages } from "@/data/locations-with-images"

import { SearchParams } from "@/lib/types"
import { formatAmountForDisplay } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/motion"

export function PopularDestinations() {
  const featuredLocations = locationsWithImages.filter(
    (location) => location.featured === true
  )

  return (
    <section>
      <div className="mx-auto w-full max-w-none px-5 sm:max-w-[90%] sm:px-0 2xl:max-w-8xl">
        <FadeUp>
          <div className="flex items-end justify-between">
            <div>
              <p className="mb-2 text-caption font-semibold uppercase tracking-[0.2em] text-subtle">
                Top Destinations
              </p>
              <h2 className="text-balance text-heading-sm sm:text-heading lg:text-heading-lg">
                Where to Rent Next
              </h2>
            </div>
          </div>
        </FadeUp>
        <div className="pt-7">
          <StaggerContainer
            className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 md:grid-cols-5"
            staggerDelay={0.08}
          >
            {featuredLocations.map(
              (
                {
                  id,
                  slug,
                  imageUrl,
                  latitude,
                  longitude,
                  name,
                  startingPrice,
                },
                index
              ) => (
                <StaggerItem
                  key={id}
                  className={`${index === featuredLocations.length - 1 ? "md:hidden" : ""}`}
                >
                  <article className="group relative">
                    <Button
                      variant={"link"}
                      className="m-0 flex size-full p-0"
                      asChild
                    >
                      <Link
                        href={{
                          pathname: "/cars",
                          query: {
                            [SearchParams.LOCATION]: slug,
                            [SearchParams.LAT]: latitude,
                            [SearchParams.LNG]: longitude,
                          },
                        }}
                        className="absolute left-0 top-0 z-10 size-full"
                      />
                    </Button>
                    <div className="relative aspect-square overflow-hidden rounded-card">
                      <Image
                        src={imageUrl}
                        alt={name}
                        quality={85}
                        priority
                        fill
                        sizes="(max-width: 550px) 50vw, (max-width: 950px) 33.33vw, 20vw"
                        className="rounded-card object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-hover:will-change-transform"
                        placeholder="blur"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                      {/* Price badge */}
                      <div className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-caption font-bold text-neutral-900 backdrop-blur-sm dark:bg-black/70 dark:text-white dark:shadow-lg">
                        from {formatAmountForDisplay(startingPrice, "usd")}
                      </div>
                    </div>
                    <div className="pt-3 sm:pt-3.5">
                      <h3 className="truncate text-body-sm font-semibold leading-[22px] text-neutral-950 transition-colors group-hover:text-accent-hover dark:text-neutral-50 sm:text-body">
                        {name}
                      </h3>
                      <p className="truncate text-body-sm leading-[21px] text-neutral-500 dark:text-neutral-400 sm:text-body-sm sm:leading-[26px]">
                        Luxury rentals available
                      </p>
                    </div>
                  </article>
                </StaggerItem>
              )
            )}
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}
