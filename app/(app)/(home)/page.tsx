import type { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { buildOrganizationJsonLd } from "@/lib/seo/structured-data"
import { JsonLd } from "@/components/json-ld"

import { BrowseCarTypes } from "./components/browse-car-types"
import { CallToAction } from "./components/call-to-action"
import { Hero } from "./components/hero"
import { Testimonials } from "./components/testimonials"

export const metadata: Metadata = buildPageMetadata({
  title: "Golden Exotics | Exotic & Luxury Car Rental in Miami",
  description:
    "Rent exotic and luxury cars in Miami from the world's most iconic brands. See real daily prices, check availability and book online in minutes.",
  path: "/",
  absoluteTitle: true,
})

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={buildOrganizationJsonLd({
          name: siteConfig.name,
          url: siteConfig.url,
          // El icono de 512px y no logo.svg: Google pide un logo cuadrado y
          // rastreable, y el raster evita sorpresas con SVG.
          logo: "/icon-512.png",
        })}
      />
      <main id="main-content">
        <Hero />
        <div className="pt-14 lg:pt-16">
          <BrowseCarTypes />
        </div>
        <div className="pt-14 lg:pt-20">
          <Testimonials />
        </div>
        <div className="pb-14 pt-24 sm:pb-20 sm:pt-36">
          <CallToAction />
        </div>
      </main>
    </>
  )
}
