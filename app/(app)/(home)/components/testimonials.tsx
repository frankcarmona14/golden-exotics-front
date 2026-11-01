"use client"

import Image from "next/image"
import { testimonials } from "@/data/testimonials"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { FilledStarIcon } from "@/components/icons/filled-star"
import { FadeUp } from "@/components/motion"

export function Testimonials() {
  return (
    <section>
      <div className="mx-auto max-w-none px-5 sm:max-w-[90%] sm:px-0 2xl:max-w-8xl">
        <FadeUp>
          <div className="text-center">
            <p className="mb-3 text-caption font-semibold uppercase tracking-[0.2em] text-subtle">
              Testimonials
            </p>
            <h2 className="text-balance text-heading-sm sm:text-heading lg:text-heading-lg">
              What Our Customers Are Saying
            </h2>
          </div>
        </FadeUp>
        <FadeUp delay={0.08} className="pt-8 lg:pt-10">
          <div className="relative">
            <Carousel>
              {/* The edges fade by masking the viewport, not by painting the
                  page colour over it: the background carries light now, and a
                  flat overlay showed up as a dark bar. 24px is the card's
                  padding, so the fade never reaches the text. */}
              <CarouselContent
                viewportClassName="[mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]"
                className="m-0 flex items-stretch space-x-5 lg:space-x-6"
              >
                {testimonials.map(({ id, name, comment, imageUrl, rating }) => {
                  return (
                    <CarouselItem
                      key={id}
                      className="flex h-full p-0 sm:basis-1/2 md:basis-1/3 xl:basis-1/4"
                    >
                      {/* No per-card reveal here: the carousel clips its own
                          overflow, so an observer per card leaves the ones
                          off to the right stuck at opacity 0. The whole row
                          reveals together instead, one observer up the tree. */}
                      <div className="flex size-full">
                        {/* In dark the surface step alone separates the card from
                            the canvas; a border there only adds noise. Light has
                            no such step, so it keeps a hairline plus the lift. */}
                        <figure className="flex size-full min-h-0 min-w-0 flex-col rounded-card border border-border bg-card p-6 shadow-lift transition-transform duration-300 ease-smooth motion-safe:hover:-translate-y-1 dark:border-transparent dark:shadow-none dark:hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] md:h-[320px] md:min-h-0 lg:h-[340px]">
                          {/* Rating Section */}
                          <div
                            className="flex shrink-0 items-center gap-0.5"
                            aria-label={`Rating: ${rating} out of 5`}
                          >
                            {[...Array(rating)].map((_, starIndex) => (
                              <FilledStarIcon
                                key={starIndex}
                                className="size-[14px] text-accent"
                              />
                            ))}
                          </div>
                          <div className="min-h-0 flex-1 pt-4">
                            {/* Comment Section */}
                            <blockquote className="text-pretty text-body-sm text-neutral-600 dark:text-neutral-400 lg:text-body">
                              &ldquo;{comment}&rdquo;
                            </blockquote>
                          </div>
                          <div className="shrink-0 pt-6">
                            {/* Reviewer Information */}
                            <figcaption className="flex items-center gap-3">
                              <Image
                                src={imageUrl}
                                alt={name}
                                className="size-8 shrink-0 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-800"
                              />
                              <div>
                                <p className="text-body-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                  {name}
                                </p>
                                <p className="text-caption text-subtle">
                                  Verified Customer
                                </p>
                              </div>
                            </figcaption>
                          </div>
                        </figure>
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="-left-4 z-20 lg:-left-12" />
              <CarouselNext className="-right-4 z-20 lg:-right-12" />
            </Carousel>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
