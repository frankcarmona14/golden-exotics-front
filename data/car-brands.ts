export interface CarBrand {
  id: string
  slug: string
  name: string
  tagline: string
  logoColor: string
  gradientFrom: string
  gradientTo: string
  imageUrl: string
}

export const carBrands: CarBrand[] = [
  {
    id: "mercedes-benz",
    slug: "mercedes-benz",
    name: "Mercedes-Benz",
    tagline: "The Best or Nothing",
    logoColor: "#00adef",
    gradientFrom: "#0f172a",
    gradientTo: "#1e293b",
    imageUrl: "/assets/images/brands/mercedes.jpg",
  },
  {
    id: "lamborghini",
    slug: "lamborghini",
    name: "Lamborghini",
    tagline: "Expect the Unexpected",
    logoColor: "#ddb321",
    gradientFrom: "#1a1a0a",
    gradientTo: "#2d2a10",
    imageUrl: "/assets/images/brands/lamborghini.jpg",
  },
  {
    id: "bmw",
    slug: "bmw",
    name: "BMW",
    tagline: "The Ultimate Driving Machine",
    logoColor: "#0066b1",
    gradientFrom: "#0c1829",
    gradientTo: "#1a2d47",
    imageUrl: "/assets/images/brands/bmw.jpg",
  },
  {
    id: "porsche",
    slug: "porsche",
    name: "Porsche",
    tagline: "There Is No Substitute",
    logoColor: "#c01422",
    gradientFrom: "#1a0a0a",
    gradientTo: "#2d1010",
    imageUrl: "/assets/images/brands/porsche.jpg",
  },
  {
    id: "tesla",
    slug: "tesla",
    name: "Tesla",
    tagline: "Electric Revolution",
    logoColor: "#cc0000",
    gradientFrom: "#0a0a0a",
    gradientTo: "#1a1a1a",
    imageUrl: "/assets/images/brands/tesla.jpg",
  },
  {
    id: "audi",
    slug: "audi",
    name: "Audi",
    tagline: "Vorsprung durch Technik",
    logoColor: "#bb0a30",
    gradientFrom: "#111111",
    gradientTo: "#222222",
    imageUrl: "/assets/images/brands/audi.jpg",
  },
]
