import { LogoSlider } from "@/app/(app)/(home)/components/logo-slider"
import { getBrands } from "@/db/queries/brand-repository"
import { AppChromeHeader } from "@/components/app-chrome-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactLauncher } from "@/components/contact/contact-launcher"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Todas las marcas de la flota, tengan ya coches publicados o no: la franja
  // dice qué marcas alquilamos, no enlaza a sus páginas.
  const brands = await getBrands()

  return (
    <div className="flex min-h-screen flex-col [--site-header-height:60px] md:[--site-header-height:76px]">
      <AppChromeHeader />
      {children}
      <section className="bg-muted py-10">
        <div className="relative mx-auto h-10 min-h-10 w-full max-w-none overflow-x-hidden px-5 sm:max-w-[90%] sm:px-0 2xl:max-w-8xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/5 bg-gradient-to-r from-muted from-40% to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/5 bg-gradient-to-l from-muted from-40% to-transparent" />
          <div className="flex h-full items-center justify-center">
            <LogoSlider
              brands={brands.map(({ handle, name, logoUrl }) => ({
                handle,
                name,
                logoUrl,
              }))}
            />
          </div>
        </div>
      </section>
      <SiteFooter />
      <ContactLauncher />
    </div>
  )
}
