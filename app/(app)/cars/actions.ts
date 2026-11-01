"use server"

import { findAvailableCars } from "./lib/find-cars"

/** Cuántos coches daría el catálogo con esta query, antes de navegar a ella. */
export async function countAvailableCars(query: string): Promise<number> {
  const { cars } = await findAvailableCars(new URLSearchParams(query))
  return cars.length
}
