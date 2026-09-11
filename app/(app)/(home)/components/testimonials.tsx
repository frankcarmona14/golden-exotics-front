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
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent sm:text-xs">
              Testimonials
            </p>
            <h2 className="text-balance text-[21px] font-bold tracking-tight sm:text-[24px] lg:text-[28px]">
              What Our Customers Are Saying
            </h2>
          </div>
        </FadeUp>
        <div className="pt-8 lg:pt-10">
          <div className="relative">
            <div className="before:absolute before:-left-1 before:top-0 before:z-10 before:h-full before:w-[7%] before:bg-gradient-to-r before:from-white before:content-[''] dark:before:from-neutral-950 lg:before:-left-16 lg:before:w-[10%]"></div>
            <Carousel>
              <CarouselContent className="m-0 flex items-stretch space-x-5 lg:space-x-6">
                {testimonials.map(({ id, name, comment, imageUrl, rating }) => {
                  return (
                    <CarouselItem
                      key={id}
                      className="flex h-full p-0 sm:basis-1/2 md:basis-1/3 xl:basis-1/4"
                    >
                      <figure className="flex size-full min-h-0 min-w-0 flex-col rounded-2xl border border-neutral-100 bg-white p-7 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:border-neutral-800 dark:bg-neutral-900 dark:hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] md:h-[320px] md:min-h-0 lg:h-[340px]">
                        {/* Rating Section */}
                        <div
                          className="flex shrink-0 items-center gap-0.5"
                          aria-label={`Rating: ${rating} out of 5`}
                        >
                          {[...Array(rating)].map((_, index) => (
                            <FilledStarIcon
                              key={index}
                              className="size-[14px] text-accent"
                            />
                          ))}
                        </div>
                        <div className="min-h-0 flex-1 pt-4">
                          {/* Comment Section */}
                          <blockquote className="text-balance text-[14px] leading-[24px] text-neutral-600 dark:text-neutral-400 sm:text-[15px] lg:text-[15px] lg:leading-[26px]">
                            &ldquo;{comment}&rdquo;
                          </blockquote>
                        </div>
                        <div className="shrink-0 pt-7">
                          {/* Reviewer Information */}
                          <figcaption className="flex items-center gap-3">
                            <Image
                              src={imageUrl}
                              alt={name}
                              className="size-8 shrink-0 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-800"
                            />
                            <div>
                              <p className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100">
                                {name}
                              </p>
                              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                                Verified Customer
                              </p>
                            </div>
                          </figcaption>
                        </div>
                      </figure>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="-left-4 z-20 lg:-left-12" />
              <CarouselNext className="-right-4 z-20 lg:-right-12" />
            </Carousel>
            <div className="after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[7%] after:bg-gradient-to-l after:from-white after:content-[''] dark:after:from-neutral-950 lg:after:-right-12 lg:after:w-[9%]"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
