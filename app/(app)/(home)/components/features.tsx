"use client"

import { ClickIcon } from "@/components/icons/click"
import { FilterSearchIcon } from "@/components/icons/filter-search"
import { MapPinIcon } from "@/components/icons/map-pin"
import { ShieldCheckIcon } from "@/components/icons/shield-check"
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/motion"

const features = [
  {
    icon: ClickIcon,
    title: "Hassle-Free Booking",
    description:
      "Book your perfect car in just a few clicks. Enjoy seamless reservations and fantastic deals.",
    accent: "#f8e33f",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure & Reliable",
    description:
      "Drive with confidence. Our vehicles are thoroughly inspected and fully insured for your peace of mind.",
    accent: "#34d399",
  },
  {
    icon: MapPinIcon,
    title: "Simple Navigation",
    description:
      "Navigate with ease. Our user-friendly tools make every journey smooth and enjoyable.",
    accent: "#60a5fa",
  },
  {
    icon: FilterSearchIcon,
    title: "Smart Filters",
    description:
      "Find exactly what you need. Apply filters to tailor your search for the best match.",
    accent: "#c084fc",
  },
]

export function Features() {
  return (
    <section>
      <div className="mx-auto max-w-none px-5 sm:max-w-[90%] sm:px-0 2xl:max-w-7xl">
        <FadeUp>
          <div className="text-center">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent sm:text-xs">
              Why Choose Us
            </p>
            <h2 className="text-balance text-[21px] font-bold tracking-tight sm:text-[24px] lg:text-[28px]">
              Discover What Sets Us Apart
            </h2>
          </div>
        </FadeUp>
        <div className="pt-10 lg:pt-12">
          <StaggerContainer
            className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-5"
            staggerDelay={0.12}
          >
            {features.map(({ icon: Icon, title, description, accent }, index) => (
              <StaggerItem key={index}>
                <div className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:border-neutral-800 dark:bg-neutral-900 dark:hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)]">
                  {/* Accent glow on hover */}
                  <div
                    className="absolute -right-6 -top-6 size-24 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
                    style={{ background: accent }}
                  />

                  <div
                    className="mb-4 inline-flex size-10 items-center justify-center rounded-xl"
                    style={{ background: `${accent}15` }}
                  >
                    <Icon className="size-[18px] shrink-0" style={{ color: accent }} />
                  </div>
                  <h3 className="mb-2 text-[15px] font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                    {title}
                  </h3>
                  <p className="text-[14px] leading-[22px] text-neutral-500 dark:text-neutral-400">
                    {description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}
