import { BrowseCarTypes } from "./components/browse-car-types"
import { CallToAction } from "./components/call-to-action"
import { Hero } from "./components/hero"
import { Testimonials } from "./components/testimonials"

export default function HomePage() {
  return (
    <>
      <main>
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
