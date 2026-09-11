import type { SelectCar, SelectLocation } from "@/lib/schema-types"
import {
  getCarImagePublicId,
  getLocalCarImagePath,
} from "@/lib/cloudinary"

import { cars as carsSeed } from "./cars"
import { locations as locationsSeed } from "./locations"

const now = new Date()

const useCloudinary =
  typeof process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME === "string" &&
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.length > 0

/**
 * Mock cars in SelectCar format so the frontend can run without a database.
 * Once Medusa is connected, the data comes from the DB.
 * imageUrl: Cloudinary ID if configured; otherwise a local path under /public.
 */
export const mockCars: SelectCar[] = carsSeed.map((car, index) => ({
  id: index + 1,
  slug: car.slug,
  name: car.name,
  bodyStyle: car.bodyStyle,
  powertrain: car.powertrain,
  transmission: car.transmission,
  seats: car.seats,
  description: car.description,
  features: car.features,
  rating: String(car.rating),
  reviewCount: String(car.reviewCount),
  unlimitedMileage: car.unlimitedMileage ?? false,
  imageUrl: useCloudinary
    ? (getCarImagePublicId(car.bodyStyle) ?? getLocalCarImagePath(car.bodyStyle))
    : getLocalCarImagePath(car.bodyStyle),
  images: [],
  pricePerDay: String(car.pricePerDay),
  currency: car.currency,
  priceId: car.priceId ?? "",
  status: car.status ?? "active",
  metadata: car.metadata ?? null,
  rentalConfiguration: null,
  createdAt: now,
  updatedAt: now,
}))

const locationImageBySlug: Record<string, string> = {
  cancun: "/assets/images/locations/cancun.jpg",
  dubai: "/assets/images/locations/dubai.jpg",
  paris: "/assets/images/locations/paris.jpg",
  rio: "/assets/images/locations/rio.jpg",
  rome: "/assets/images/locations/rome.jpg",
  sydney: "/assets/images/locations/sydney.jpg",
}

/**
 * Mock locations en formato SelectLocation para usar el frontend sin base de datos.
 */
export const mockLocations: SelectLocation[] = locationsSeed.map((loc, index) => ({
  id: index + 1,
  slug: loc.slug,
  name: loc.name,
  latitude: loc.latitude,
  longitude: loc.longitude,
  imageUrl: locationImageBySlug[loc.slug] ?? null,
  featured: loc.featured ?? false,
  createdAt: now,
  updatedAt: now,
}))
