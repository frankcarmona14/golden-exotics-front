import Link from "next/link"

import { siteConfig } from "@/config/site"

import { CarhiveLogoNew } from "./icons/carhive-logo-new"
import { Button } from "./ui/button"

export function LogoLink() {
  return (
    <Button
      variant={"link"}
      className="-ml-1 h-auto rounded-sm p-1 pl-0 text-black hover:text-black dark:text-white dark:hover:text-white"
      asChild
    >
      <Link href="/" aria-label={`${siteConfig.name} home`}>
        <CarhiveLogoNew className="h-10 w-auto shrink-0 lg:h-12" />
      </Link>
    </Button>
  )
}
