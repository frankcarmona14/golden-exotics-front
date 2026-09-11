"use client"

import { createContext, useContext, useState, ReactNode } from "react"

import type { GuestInfo } from "@/lib/medusa/rental"

interface GuestContextValue {
  guest: GuestInfo | null
  setGuest: (g: GuestInfo | null) => void
}

const GuestContext = createContext<GuestContextValue>({
  guest: null,
  setGuest: () => {},
})

export function GuestProvider({ children }: { children: ReactNode }) {
  const [guest, setGuest] = useState<GuestInfo | null>(null)
  return (
    <GuestContext.Provider value={{ guest, setGuest }}>
      {children}
    </GuestContext.Provider>
  )
}

export function useGuest() {
  return useContext(GuestContext)
}
