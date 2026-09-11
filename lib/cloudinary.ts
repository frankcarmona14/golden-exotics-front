/** Cloudinary IDs for car images (when NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is configured). */
export const getCarImagePublicId = (bodyStyle: string): string | null => {
  switch (bodyStyle) {
    case "hatchback":
      return "carhive/cars/hatchback_hawhtv"
    case "minivan":
      return "carhive/cars/minivan_vlkx4g"
    case "sedan":
      return "carhive/cars/sedan_rfl011"
    case "sports-car":
      return "carhive/cars/sports-car_hmxtaj"
    case "pickup-truck":
      return "carhive/cars/pickup-truck_ihwn41"
    case "suv":
      return "carhive/cars/suv_rdgyby"
    default:
      return null
  }
}

/** Local /public path to a car image (when Cloudinary is not configured). */
export const getLocalCarImagePath = (bodyStyle: string): string => {
  const pathByStyle: Record<string, string> = {
    hatchback: "/assets/images/cars/hatchback.jpg",
    minivan: "/assets/images/cars/minivan.jpg",
    sedan: "/assets/images/cars/sedan.jpg",
    "sports-car": "/assets/images/cars/sports-car.jpg",
    "pickup-truck": "/assets/images/cars/pickup-truck.jpg",
    suv: "/assets/images/cars/suv.jpg",
  }
  return pathByStyle[bodyStyle] ?? pathByStyle.sedan
}
