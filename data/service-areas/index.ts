import { fortLauderdaleArea, fortLauderdaleCities } from "./fort-lauderdale"
import { miamiArea, miamiCoreCities } from "./miami-core"
import { miamiOuterCities } from "./miami-outer"
import { pompanoBeachArea, pompanoBeachCities } from "./pompano-beach"
import type { ServiceArea, ServiceCity } from "./types"
import { westPalmBeachArea, westPalmBeachCities } from "./west-palm-beach"

export type { ServiceArea, ServiceCity } from "./types"

/** De sur a norte, que es como se lee la costa. */
export const SERVICE_AREAS: ServiceArea[] = [
  miamiArea,
  fortLauderdaleArea,
  pompanoBeachArea,
  westPalmBeachArea,
]

export const SERVICE_CITIES: ServiceCity[] = [
  ...miamiCoreCities,
  ...miamiOuterCities,
  ...fortLauderdaleCities,
  ...pompanoBeachCities,
  ...westPalmBeachCities,
]
