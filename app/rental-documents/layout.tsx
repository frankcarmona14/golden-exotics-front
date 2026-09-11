import { AppChromeHeader } from "@/components/app-chrome-header"

export default function RentalDocumentsTokenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col [--site-header-height:60px]">
      <AppChromeHeader />
      {children}
    </div>
  )
}
