import type { SelectCar } from "@/lib/schema-types"
import {
  getCarImagePublicId,
  getLocalCarImagePath,
} from "@/lib/cloudinary"

import { cars as carsSeed } from "./cars"

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
