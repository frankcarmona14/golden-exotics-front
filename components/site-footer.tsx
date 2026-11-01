import Link from "next/link"

import { siteConfig } from "@/config/site"

import { LogoLink } from "./logoLink"
import { Button } from "./ui/button"

type FooterLink = {
  label: string
  href: string
  external?: boolean
}

type FooterSection = {
  title: string
  links: FooterLink[]
}

const footerLinks: FooterSection[] = [
  {
    title: "Services",
    links: [
      { label: "Browse cars", href: "/cars" },
      { label: "Brands", href: "/brands" },
      { label: "Driver requirements", href: "/driver-requirements" },
      { label: "Insurance options", href: "/driver-requirements#insurance" },
      { label: "Corporate rentals", href: "/" },
      { label: "FAQs", href: "/" },
    ],
  },
  {
    // Las áreas y las ciudades más buscadas; el resto cuelga de /locations.
    // Un pie con todas las ciudades parece relleno de palabras clave.
    title: "Locations",
    links: [
      // MIA primero: es el aeropuerto principal del cliente.
      { label: "Miami Airport (MIA)", href: "/locations/miami-international-airport" },
      { label: "Miami", href: "/locations/miami-area" },
      { label: "Miami Beach", href: "/locations/miami-beach" },
      { label: "Fort Lauderdale", href: "/locations/fort-lauderdale-area" },
      { label: "Pompano Beach", href: "/locations/pompano-beach-area" },
      { label: "West Palm Beach", href: "/locations/west-palm-beach-area" },
      { label: "Boca Raton", href: "/locations/boca-raton" },
      { label: "All locations", href: "/locations" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help center", href: "/" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
      { label: "Cancellation policy", href: "/cancellation-policy" },
      { label: "Accessibility", href: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Contact us", href: "/contact" },
      { label: "Blog", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Press", href: "/" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Youtube", href: "https://youtube.com", external: true },
      { label: "Twitter", href: "https://twitter.com", external: true },
      { label: "Instagram", href: "https://instagram.com", external: true },
      { label: "Facebook", href: "https://facebook.com", external: true },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden py-14">
      {/* Dark only: in light mode the same light reads as a stain. */}
      <div
        aria-hidden
        className="footer-horizon pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-[420px] dark:block"
      />
      <div className="mx-auto w-full max-w-none px-5 text-sm sm:max-w-[90%] sm:px-0 xl:max-w-6xl">
        <div className="grid grid-cols-12 items-start justify-center gap-y-12">
          <div className="col-span-full md:col-span-3">
            <LogoLink />
            <p className="mt-4 max-w-[220px] text-body-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              Exotic and luxury car rental in Miami, FL.
            </p>
          </div>
          <nav className="col-span-full grid grid-cols-2 gap-x-6 gap-y-11 sm:grid-cols-3 md:col-span-9 lg:grid-cols-5">
            {footerLinks.map((section) => (
              <ul
                key={section.title}
                className="flex flex-col gap-3 lg:gap-3.5"
              >
                <div className="pb-1.5">
                  <h2 className="whitespace-nowrap text-balance text-body-sm font-bold uppercase tracking-wider text-neutral-950 dark:text-neutral-50">
                    {section.title}
                  </h2>
                </div>
                {section.links.map((link) => (
                  <li
                    key={`${section.title}-${link.label}`}
                    className="text-neutral-500 dark:text-neutral-400"
                  >
                    <Button
                      variant={"link"}
                      className="h-auto text-balance rounded-none p-0 text-body-sm font-normal leading-none transition-colors hover:text-neutral-950 dark:hover:text-white sm:text-sm"
                      asChild
                    >
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href}>{link.label}</Link>
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
            ))}
          </nav>
          <div className="col-span-full pt-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-body-sm text-neutral-500 dark:text-neutral-400">
                &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
                reserved. &middot; Miami, FL
              </p>
              <div className="flex items-center gap-4 text-body-sm text-neutral-500 dark:text-neutral-400">
                <Link
                  href="/terms"
                  className="transition-colors hover:text-neutral-950 dark:hover:text-white"
                >
                  Terms
                </Link>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-neutral-950 dark:hover:text-white"
                >
                  Privacy
                </Link>
                <Link
                  href="/cancellation-policy"
                  className="transition-colors hover:text-neutral-950 dark:hover:text-white"
                >
                  Cancellation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
