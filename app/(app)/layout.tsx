import { LogoSlider } from "@/app/(app)/(home)/components/logo-slider"
import { AppChromeHeader } from "@/components/app-chrome-header"
import { SiteFooter } from "@/components/site-footer"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col [--site-header-height:60px]">
      <AppChromeHeader />
      {children}
      <section className="border-t border-neutral-100 bg-neutral-50/80 py-10 dark:border-neutral-800/60 dark:bg-neutral-900/30">
        <div className="relative mx-auto h-10 min-h-10 w-full max-w-none overflow-x-hidden px-5 sm:max-w-[90%] sm:px-0 2xl:max-w-8xl">
          <div className="before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[30%] before:bg-gradient-to-r before:from-neutral-50/80 before:content-[''] dark:before:from-neutral-900/30" />
          <div className="after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[30%] after:bg-gradient-to-l after:from-neutral-50/80 after:content-[''] dark:after:from-neutral-900/30" />
          <div className="flex h-full items-center justify-center">
            <LogoSlider />
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
