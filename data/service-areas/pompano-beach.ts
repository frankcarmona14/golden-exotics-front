import type { ServiceArea, ServiceCity } from "./types"

export const pompanoBeachArea: ServiceArea = {
  slug: "pompano-beach-area",
  name: "Pompano Beach Area",
  shortName: "Pompano Beach",
  county: "Broward County",
  intro: [
    "Northern Broward is where the county slows down a little. On the coast, Pompano Beach, Lighthouse Point, Deerfield Beach and Lauderdale-by-the-Sea trade high-rise density for fishing piers, canal homes and long open stretches of A1A. Inland, Coconut Creek, Coral Springs, Parkland and Margate are leafy, planned suburbs laid out along the Sawgrass Expressway and Florida's Turnpike.",
    "Golden Exotics rents exotic and luxury cars across the whole stretch. Book online with real daily prices and live availability, then pick the car up at our location at 1551 NW 79th Ave in Miami, or ask us to arrange delivery to your home, hotel or the airport. Whether you want a convertible for the beach road or a luxury SUV for a weekend with family, the cities below are all within easy reach.",
  ],
  status: "draft",
}

export const pompanoBeachCities: ServiceCity[] = [
  {
    slug: "pompano-beach",
    name: "Pompano Beach",
    areaSlug: "pompano-beach-area",
    kind: "city",
    intro: [
      "Pompano Beach has reinvented its waterfront over the last decade. The rebuilt pier, the restaurants around the Fishing Village and the beach park along A1A have turned the east end of Atlantic Boulevard into a place people drive to, not just through. Rolling up to dinner by the ocean in a convertible fits right in.",
      "The city is also a practical base. I-95 and Florida's Turnpike both cut through it, so a car rented here can reach Palm Beach, Fort Lauderdale or the Everglades side of the county without much fuss. Many visitors stay in the beachfront condos and want a car that matches the view from the balcony.",
      "Golden Exotics serves Pompano Beach from our pick-up location in Miami. Reserve online at real daily prices, see live availability, and either collect the car yourself or ask us to arrange delivery to your address or hotel.",
    ],
    highlights: [
      {
        title: "Pompano Beach Pier and Fishing Village",
        text: "The rebuilt pier at the foot of Atlantic Boulevard anchors a small district of waterfront restaurants and bars, a natural first stop on an evening drive.",
      },
      {
        title: "A1A north to Hillsboro Inlet",
        text: "Head north on A1A from the pier and the road narrows toward Hillsboro Inlet, with the historic lighthouse visible across the water.",
      },
      {
        title: "Atlantic Boulevard",
        text: "The city's main east-west street links the beach with US-1, I-95 and the Turnpike, so it is the usual way in and out by car.",
      },
      {
        title: "Pompano Beach Amphitheater",
        text: "The open-air venue known locally as The Amp hosts concerts through the cooler months, a good excuse for a night out in something special.",
      },
    ],
    faqs: [
      {
        question: "How do I get a rental car from your Miami location to Pompano Beach?",
        answer: "You can pick the car up at 1551 NW 79th Ave in Miami and drive north on I-95 or Florida's Turnpike. If you would rather not make the trip, ask us to arrange delivery to your Pompano Beach address or hotel.",
      },
      {
        question: "Where can I park near the Pompano Beach Pier?",
        answer: "There is public paid parking around the pier and the beach park off A1A, including a garage close to the Fishing Village. Spaces fill on weekends, so arriving early helps.",
      },
      {
        question: "Can I see what cars are available for my dates?",
        answer: "Yes. Our booking site shows real daily prices and checks availability live, so you see exactly what you can reserve for your Pompano Beach trip.",
      },
    ],
    nearby: ["lighthouse-point", "deerfield-beach", "lauderdale-by-the-sea", "margate", "fort-lauderdale"],
    status: "draft",
  },
  {
    slug: "lighthouse-point",
    name: "Lighthouse Point",
    areaSlug: "pompano-beach-area",
    kind: "city",
    intro: [
      "Lighthouse Point is a small residential city built around water. Most streets end at a canal, many homes have a boat behind them, and the Hillsboro Inlet sits just to the north, giving residents a short run to the open Atlantic. It is quiet, well kept and mostly private.",
      "That makes a rental car here less about nightlife and more about occasions: a weekend guest who wants something memorable in the driveway, a drive up Federal Highway to dinner in Boca Raton, or a convertible for a family visit. Neighbors notice what is parked outside, and a supercar or luxury SUV makes an impression without any need to go far.",
      "Golden Exotics covers Lighthouse Point from our Miami pick-up location. Prices and availability are live online, and delivery to your home can be arranged on request.",
    ],
    highlights: [
      {
        title: "Hillsboro Inlet",
        text: "The inlet at the city's northern edge is one of the busiest boating passages in the county, with the Hillsboro Inlet Lighthouse standing on the far side.",
      },
      {
        title: "Cap's Place",
        text: "A historic waterfront restaurant on the Intracoastal, reached by a short boat shuttle, and a long-standing local favorite for a special dinner.",
      },
      {
        title: "Federal Highway (US-1)",
        text: "The city's commercial spine runs north to Deerfield Beach and Boca Raton and south to Pompano Beach, lined with restaurants and shops.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver a rental car to a home in Lighthouse Point?",
        answer: "Yes, delivery to your address can be arranged on request when you book. You can also pick the car up yourself at our location in Miami.",
      },
      {
        question: "What is a good short drive from Lighthouse Point?",
        answer: "Cross to A1A and follow the coast south past the Hillsboro Inlet toward Pompano Beach, or north toward Deerfield Beach and Boca Raton for dinner.",
      },
    ],
    nearby: ["pompano-beach", "deerfield-beach", "boca-raton", "lauderdale-by-the-sea"],
    status: "draft",
  },
  {
    slug: "deerfield-beach",
    name: "Deerfield Beach",
    areaSlug: "pompano-beach-area",
    kind: "city",
    intro: [
      "Deerfield Beach is the last Broward city before Palm Beach County begins, and it has a relaxed, small-town beach feel. The fishing pier and the boardwalk along A1A draw early walkers and surfers, and the beachfront is lined with low-key cafes rather than towers.",
      "For drivers, it sits at a useful crossroads. Hillsboro Boulevard runs from the ocean straight across to I-95 and Florida's Turnpike, and Boca Raton is just across the canal to the north. Visitors often split their time between the two, and having a convertible or a sports car makes that back-and-forth part of the fun.",
      "Book with Golden Exotics online using real daily prices and live availability. Pick the car up at our Miami location, or ask us to arrange delivery to your Deerfield Beach hotel, condo or home.",
    ],
    highlights: [
      {
        title: "Deerfield Beach International Fishing Pier",
        text: "A long pier at the foot of Hillsboro Boulevard, popular at sunrise and a classic spot for a photo with the car parked nearby.",
      },
      {
        title: "Deerfield Beach Boardwalk",
        text: "The beachfront promenade along A1A has casual restaurants, a lifeguarded beach and easy short-term parking.",
      },
      {
        title: "Quiet Waters Park",
        text: "A large county park on the west side of the city with lakes, trails and a cable water-ski park.",
      },
    ],
    faqs: [
      {
        question: "Is Deerfield Beach a good base for visiting Boca Raton?",
        answer: "Yes. Boca Raton begins just north of the Hillsboro Canal, so a rental car lets you move easily between the two by A1A, Federal Highway or I-95.",
      },
      {
        question: "Where should I park a rental car at Deerfield Beach?",
        answer: "There is metered public parking along A1A and around the pier. On busy weekends a spot a little away from the pier is usually easier to find.",
      },
    ],
    nearby: ["boca-raton", "lighthouse-point", "pompano-beach", "coconut-creek", "parkland"],
    status: "draft",
  },
  {
    slug: "lauderdale-by-the-sea",
    name: "Lauderdale-by-the-Sea",
    areaSlug: "pompano-beach-area",
    kind: "city",
    intro: [
      "Lauderdale-by-the-Sea is a seaside town of a few blocks squeezed between the Intracoastal and the ocean. Buildings stay low, A1A slows to a stroll through the center, and the reef sits close enough to shore that people snorkel straight off the beach.",
      "It is the kind of place where you park once and walk. A rental car here works best for getting in and out in style: a cruise down A1A to Fort Lauderdale, a drive up the coast to Pompano Beach, or simply arriving at your hotel in a car you have wanted to drive for years. Commercial Boulevard connects the town to the mainland and to I-95.",
      "Golden Exotics serves Lauderdale-by-the-Sea from our Miami location. Book online with real daily prices and live availability, then pick up the car or ask us to arrange delivery to your hotel.",
    ],
    highlights: [
      {
        title: "Anglin's Fishing Pier",
        text: "The town's pier at the end of Commercial Boulevard is its landmark, surrounded by small restaurants and ice cream shops.",
      },
      {
        title: "Snorkeling off the beach",
        text: "A shallow reef lies close to shore, so the beach is a well-known spot for snorkeling without a boat.",
      },
      {
        title: "A1A south to Fort Lauderdale",
        text: "The coastal road continues south through Galt Ocean Mile to Fort Lauderdale beach, a classic drive with the top down.",
      },
    ],
    faqs: [
      {
        question: "Is parking easy in Lauderdale-by-the-Sea?",
        answer: "The town has metered public lots and street parking near the pier, but the center is small and fills up on weekends. Many hotels in town have their own parking.",
      },
      {
        question: "Can you deliver a car to my hotel in Lauderdale-by-the-Sea?",
        answer: "Delivery to your hotel can be arranged on request when you book. You can also collect the car yourself at our location in Miami.",
      },
    ],
    nearby: ["pompano-beach", "fort-lauderdale", "lighthouse-point", "las-olas"],
    status: "draft",
  },
  {
    slug: "coconut-creek",
    name: "Coconut Creek",
    areaSlug: "pompano-beach-area",
    kind: "city",
    intro: [
      "Coconut Creek calls itself the butterfly capital of the world, and its quiet, tree-lined streets back that up. It is a green, residential city on the northern edge of Broward, with parks, preserves and gated neighborhoods instead of a downtown skyline.",
      "Evenings are a different story around the Seminole Casino Coconut Creek and the Promenade, where dinner and entertainment bring people in from across the county. An exotic car turns a night out there into an occasion. Getting around is straightforward, too: the Sawgrass Expressway and Florida's Turnpike are close by, and the beaches of Pompano and Deerfield are a short drive east.",
      "Reserve with Golden Exotics online, with real daily prices and live availability. Pick the car up at our Miami location or ask us to arrange delivery to your door in Coconut Creek.",
    ],
    highlights: [
      {
        title: "Butterfly World",
        text: "A large butterfly park inside Tradewinds Park, and one of the best-known attractions in north Broward.",
      },
      {
        title: "Seminole Casino Coconut Creek",
        text: "The casino and its restaurants and live entertainment make it a popular evening destination.",
      },
      {
        title: "The Promenade at Coconut Creek",
        text: "An open-air shopping and dining center with restaurants and a pleasant place to walk after dinner.",
      },
    ],
    faqs: [
      {
        question: "What is the easiest way to drive from your Miami location to Coconut Creek?",
        answer: "Florida's Turnpike north is the most direct route from our location at 1551 NW 79th Ave. Delivery to your Coconut Creek address can also be arranged on request.",
      },
      {
        question: "Is Coconut Creek far from the beach?",
        answer: "Not at all. Head east on Sample Road or Hillsboro Boulevard and you reach the coast at Pompano Beach or Deerfield Beach in a short drive.",
      },
    ],
    nearby: ["margate", "coral-springs", "parkland", "deerfield-beach", "pompano-beach"],
    status: "draft",
  },
  {
    slug: "coral-springs",
    name: "Coral Springs",
    areaSlug: "pompano-beach-area",
    kind: "city",
    intro: [
      "Coral Springs is one of Broward's largest planned cities, built around wide boulevards, parks and good schools. Life here revolves around family, sports and community events, and the roads are straight, well kept and easy to navigate.",
      "That is exactly why an exotic car stands out. Residents rent for birthdays, anniversaries, proms and graduation weekends, or for a road trip to the Keys or the Gulf Coast. The Sawgrass Expressway on the city's western edge connects quickly to I-75 and Alligator Alley, while University Drive and Sample Road lead to shopping and dining.",
      "Golden Exotics serves Coral Springs from our Miami location. See real daily prices and live availability online, then pick the car up or ask us to arrange delivery to your home.",
    ],
    highlights: [
      {
        title: "Coral Springs Center for the Arts",
        text: "The city's performing arts venue hosts concerts, comedy and touring shows throughout the year.",
      },
      {
        title: "Coral Square",
        text: "The regional shopping mall at Atlantic Boulevard and University Drive, with plenty of parking.",
      },
      {
        title: "Sawgrass Expressway",
        text: "The toll road along the western edge of the city links to I-75 and Alligator Alley, the gateway to a drive across the state.",
      },
    ],
    faqs: [
      {
        question: "Can I rent an exotic car in Coral Springs for a special event?",
        answer: "Yes. Many customers book for birthdays, anniversaries and celebrations. Reserve online for your dates and ask us to arrange delivery to your home if that suits you.",
      },
      {
        question: "How do I get from your Miami location to Coral Springs?",
        answer: "From 1551 NW 79th Ave, Florida's Turnpike or the Sawgrass Expressway via I-75 both lead north toward Coral Springs. Delivery can also be arranged on request.",
      },
    ],
    nearby: ["parkland", "coconut-creek", "margate", "sunrise"],
    status: "draft",
  },
  {
    slug: "parkland",
    name: "Parkland",
    areaSlug: "pompano-beach-area",
    kind: "city",
    intro: [
      "Parkland sits at the far northwest corner of Broward, right where the suburbs meet the Everglades. Large lots, horse properties and gated communities give it a more spacious, private feel than anywhere else in the county, and a strict focus on green space keeps it that way.",
      "People here tend to rent for the drive itself. Loxahatchee Road heads west toward the edge of the Everglades, the Sawgrass Expressway offers smooth miles toward I-75, and Boca Raton's restaurants are just across the county line. A luxury SUV also suits family weekends and visitors staying in large homes with long driveways.",
      "Golden Exotics serves Parkland from our location in Miami. Book online at real daily prices with live availability, and ask us to arrange delivery to your home if you would rather not make the trip south.",
    ],
    highlights: [
      {
        title: "Pine Trail Park",
        text: "The city's largest park, with sports fields, trails and a playground, at the center of Parkland's community life.",
      },
      {
        title: "Terramar Park",
        text: "A neighborhood park with lakes, sports courts and shaded paths, popular with local families.",
      },
      {
        title: "Loxahatchee Road",
        text: "The road toward the western edge of Parkland leads out to the Everglades boundary, one of the most open drives in the county.",
      },
    ],
    faqs: [
      {
        question: "Do you deliver rental cars to gated communities in Parkland?",
        answer: "Delivery to your Parkland home can be arranged on request. Let us know about any gate access details when you book.",
      },
      {
        question: "Where is a good drive from Parkland?",
        answer: "Take the Sawgrass Expressway to I-75 for open highway miles, or head north into Boca Raton for dinner along Federal Highway or Mizner Park.",
      },
    ],
    nearby: ["coral-springs", "coconut-creek", "boca-raton", "deerfield-beach"],
    status: "draft",
  },
  {
    slug: "margate",
    name: "Margate",
    areaSlug: "pompano-beach-area",
    kind: "city",
    intro: [
      "Margate is a compact, established city in the middle of north Broward, bordered by Coconut Creek, Coral Springs and Pompano Beach. State Road 7 runs through the middle of it, and the neighborhoods on either side are mostly single-family homes and canals.",
      "Its central location is its main advantage for anyone renting a car. Florida's Turnpike is just to the east, the Sawgrass Expressway is a few miles north, and Atlantic Boulevard takes you straight to the beach in Pompano. A weekend in a convertible can cover the coast, Fort Lauderdale and the Palm Beaches without ever feeling far from home.",
      "Golden Exotics serves Margate from our pick-up location at 1551 NW 79th Ave in Miami. Reserve online with real daily prices and live availability, or ask us to arrange delivery to your address.",
    ],
    highlights: [
      {
        title: "Calypso Cove",
        text: "The city's aquatic center with water slides and pools, a summer favorite for local families.",
      },
      {
        title: "Atlantic Boulevard to the beach",
        text: "Head east on Atlantic Boulevard through Pompano Beach and you end at the ocean and the pier.",
      },
      {
        title: "State Road 7 (US-441)",
        text: "The main north-south road through Margate, lined with restaurants and everyday shopping.",
      },
    ],
    faqs: [
      {
        question: "How far is Margate from the beach?",
        answer: "Less than 10 miles. Atlantic Boulevard runs east from Margate straight to Pompano Beach and the ocean.",
      },
      {
        question: "Can you deliver a rental car to Margate?",
        answer: "Yes, delivery to your Margate address can be arranged on request. You can also pick the car up at our Miami location.",
      },
    ],
    nearby: ["coconut-creek", "coral-springs", "pompano-beach", "sunrise"],
    status: "draft",
  },
]
