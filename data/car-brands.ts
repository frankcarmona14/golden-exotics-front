export interface CarBrand {
  id: string
  slug: string
  name: string
  tagline: string
  /**
   * Texto de la página de la marca cuando su categoría en Medusa no tiene
   * descripción. La del admin manda.
   */
  description?: string
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
    description:
      "Mercedes-Benz covers both sides of a Miami trip: the comfort to cross town in traffic and the AMG performance for the open stretches. The G-Class is the one people recognize from across the street, boxy, loud and built like nothing else on the road, and it suits valet lines on Collins Avenue as well as a drive down to Key Biscayne. Every Mercedes we rent is listed here with its real daily price and live availability.",
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
    description:
      "Lamborghini is the name most people picture when they think of an exotic car in Miami. The Urus brings that sharp design and a twin-turbo V8 into an SUV with four real seats and room for luggage, so it works for an airport pick-up as well as a night out in South Beach. Every Lamborghini we rent is listed here with its real daily price and live availability.",
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
