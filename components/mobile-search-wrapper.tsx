import { getLocations } from "@/db/queries/location-repository"

import { MobileSearch } from "./mobile-search"

export async function MobileSearchWrapper() {
  const locations = await getLocations()

  if (!locations) return null

  return <MobileSearch locations={locations} />
}
