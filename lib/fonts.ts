import { Inter as FontSans, Inter_Tight as FontDisplay } from "next/font/google"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: "variable",
})

/* Headline voice. Inter Tight shares Inter's skeleton but with tighter
   sidebearings, so large type sets as a solid block instead of drifting
   apart. Only used from `subheading` up — body stays on Inter. */
export const fontDisplay = FontDisplay({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: "variable",
})
