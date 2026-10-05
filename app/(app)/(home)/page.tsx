import type { Metadata } from "next"

import { siteConfig } from "@/config/site"
import {
  getBrandCarCounts,
  getBrands,
} from "@/db/queries/brand-repository"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { buildOrganizationJsonLd } from "@/lib/seo/structured-data"
import { JsonLd } from "@/components/json-ld"

import { AreasWeServe } from "./components/areas-we-serve"
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

export default async function HomePage() {
  const [brands, carCounts] = await Promise.all([
    getBrands(),
    getBrandCarCounts(),
  ])

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
        {/* One rhythm for the whole page: 56px between sections on mobile,
            80px from lg, and a wider 100px approach into the closing CTA. */}
        <div className="pt-14 lg:pt-section">
          <BrowseCarTypes brands={brands} carCounts={carCounts} />
        </div>
        <div className="pt-14 lg:pt-section">
          <AreasWeServe />
        </div>
        <div className="pt-14 lg:pt-section">
          <Testimonials />
        </div>
        <div className="pb-14 pt-section sm:pb-section sm:pt-section-lg">
          <CallToAction />
        </div>
      </main>
    </>
  )
}
