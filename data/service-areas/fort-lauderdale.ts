import type { ServiceArea, ServiceCity } from "./types"

export const fortLauderdaleArea: ServiceArea = {
  slug: "fort-lauderdale-area",
  name: "Fort Lauderdale Area",
  shortName: "Fort Lauderdale",
  county: "Broward County",
  intro: [
    "Broward County runs from the beaches along A1A to the suburbs that stop at the edge of the Everglades, and an exotic car fits both ends of it. Spend a morning on Las Olas Boulevard, an afternoon on the coast road past Fort Lauderdale Beach, and an evening out west in Weston or Sunrise, all linked by I-95, I-595 and Florida's Turnpike.",
    "Golden Exotics rents supercars, luxury SUVs and convertibles from our location at 1551 NW 79th Ave in Miami, just south of the county line. You can collect the car there or ask us to arrange delivery to your home, hotel or Fort Lauderdale-Hollywood International Airport. Booking is online with real daily prices, and availability is checked live, so the car you choose is the car you get.",
  ],
  status: "draft",
}

export const fortLauderdaleCities: ServiceCity[] = [
  {
    slug: "fort-lauderdale",
    name: "Fort Lauderdale",
    areaSlug: "fort-lauderdale-area",
    kind: "city",
    intro: [
      "Fort Lauderdale is a city built around water. The New River winds through downtown, canals cut through nearly every east-side neighborhood, and the Intracoastal Waterway separates the mainland from a beach that runs for miles along A1A. Driving here means bridges, palm-lined boulevards and a constant view of boats, which is exactly why a convertible or a low-slung coupe makes sense.",
      "A typical day might start with coffee downtown near the Riverwalk, continue with a slow cruise up A1A past Fort Lauderdale Beach, and end with dinner on Las Olas Boulevard. Weekend traffic on the beach road moves at a pace that suits being seen, and the drive north toward Lauderdale-by-the-Sea opens up once you pass Sunrise Boulevard.",
      "Golden Exotics serves Fort Lauderdale from our Miami location at 1551 NW 79th Ave. Pick the car up there, or ask us to arrange delivery to your address or hotel. Prices are shown per day when you book online.",
    ],
    highlights: [
      {
        title: "Fort Lauderdale Beach and A1A",
        text: "The stretch of A1A along the sand is the city's signature drive, with the ocean on one side and hotels and cafes on the other.",
      },
      {
        title: "Las Olas Boulevard",
        text: "Shops, galleries and restaurants line the boulevard that connects downtown to the beach across the Intracoastal.",
      },
      {
        title: "Riverwalk and the New River",
        text: "A landscaped path along the river through downtown, close to restaurants and the arts district.",
      },
      {
        title: "Bonnet House Museum & Gardens",
        text: "A historic estate on the barrier island between the Intracoastal and the ocean, a calm stop just off A1A.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver an exotic car to my hotel in Fort Lauderdale?",
        answer: "Yes. Delivery to hotels and private addresses in Fort Lauderdale can be arranged on request when you book, or you can pick the car up at our Miami location.",
      },
      {
        question: "What is the best drive in Fort Lauderdale?",
        answer: "Most drivers head for A1A along Fort Lauderdale Beach and continue north toward Lauderdale-by-the-Sea, then loop back across the Intracoastal to Las Olas Boulevard.",
      },
    ],
    nearby: ["las-olas", "fort-lauderdale-airport", "lauderdale-by-the-sea", "plantation", "dania-beach"],
    status: "draft",
  },
  {
    slug: "las-olas",
    name: "Las Olas",
    areaSlug: "fort-lauderdale-area",
    kind: "neighborhood",
    intro: [
      "Las Olas is the stretch of Fort Lauderdale that people dress up for. The boulevard begins near downtown, passes a long run of boutiques, galleries and sidewalk restaurants, then crosses the Intracoastal and ends at the beach. Pulling up to dinner here in a supercar is part of the scene rather than an exception to it.",
      "South of the boulevard sit the Las Olas Isles, narrow residential fingers of land surrounded by canals, with yachts docked behind the houses. A slow drive through those streets, followed by a turn east over the bridge toward the ocean, is one of the best short loops in South Florida.",
      "Golden Exotics can arrange delivery to your home or hotel near Las Olas, or you can pick the car up at our Miami location at 1551 NW 79th Ave. Choose a convertible for the evening, a luxury SUV for a group, or something louder for the weekend.",
    ],
    highlights: [
      {
        title: "Las Olas Boulevard",
        text: "The main strip for shopping, galleries and outdoor dining, busiest on weekend evenings.",
      },
      {
        title: "The Las Olas Isles",
        text: "Canal-side residential streets just off the boulevard, lined with waterfront homes and private docks.",
      },
      {
        title: "Stranahan House",
        text: "One of the oldest surviving buildings in Fort Lauderdale, set on the New River near the western end of Las Olas.",
      },
    ],
    faqs: [
      {
        question: "Is parking easy on Las Olas Boulevard?",
        answer: "Street parking fills quickly on weekend nights, so many visitors use the nearby public garages or restaurant valet. With a high-value car, a staffed valet or garage is usually the safer choice.",
      },
      {
        question: "Can I have the car brought to a residence on the Las Olas Isles?",
        answer: "Yes. Delivery to a private address can be arranged on request when you book online.",
      },
    ],
    nearby: ["fort-lauderdale", "fort-lauderdale-airport", "dania-beach", "plantation"],
    status: "draft",
  },
  {
    slug: "fort-lauderdale-airport",
    name: "Fort Lauderdale-Hollywood International Airport",
    areaSlug: "fort-lauderdale-area",
    kind: "airport",
    intro: [
      "Fort Lauderdale-Hollywood International Airport (FLL) sits between Fort Lauderdale and Dania Beach, with I-595 along its northern edge and I-95 and US-1 close by. It is the arrival point for many visitors heading to Broward beaches, and its location next to Port Everglades makes it a common stop before and after a cruise.",
      "If you would rather leave the terminal in something better than a standard rental, Golden Exotics can arrange to have your car brought to FLL on request. Tell us your flight details when you book and we will coordinate the handover. Returning works the same way, so you can drop the car before your departure.",
      "You can also collect the car at our Miami location at 1551 NW 79th Ave, west of Miami International Airport. Every price on the site is a real daily rate, and availability is checked live while you book.",
    ],
    highlights: [
      {
        title: "I-595 and I-95",
        text: "The airport's main road links, heading west toward the suburbs and north or south along the coast.",
      },
      {
        title: "Port Everglades",
        text: "The cruise and cargo port right next to the airport, handy if you are driving before or after a sailing.",
      },
      {
        title: "US-1 (Federal Highway)",
        text: "The direct route from the airport north into Fort Lauderdale or south toward Dania Beach and Hollywood.",
      },
    ],
    faqs: [
      {
        question: "Can I pick up my exotic rental at Fort Lauderdale airport?",
        answer: "Delivery to FLL can be arranged on request. Share your flight details when you book so the handover can be coordinated.",
      },
      {
        question: "Can I return the car at FLL before my flight?",
        answer: "Yes, an airport return can be arranged on request. Otherwise you can return the car to our Miami location at 1551 NW 79th Ave.",
      },
      {
        question: "Do you serve cruise passengers at Port Everglades?",
        answer: "The port is next to FLL, so you can ask us to arrange delivery to your hotel or the airport before or after your cruise.",
      },
    ],
    nearby: ["fort-lauderdale", "dania-beach", "hollywood", "las-olas"],
    status: "draft",
  },
  {
    slug: "hollywood",
    name: "Hollywood",
    areaSlug: "fort-lauderdale-area",
    kind: "city",
    intro: [
      "Hollywood has two personalities, and a good car lets you enjoy both in one day. On the east side, the Broadwalk runs along the sand with cafes and families, and A1A stays relaxed and close to the water. Inland, Hollywood Boulevard leads to Young Circle and a downtown of restaurants and live music.",
      "Further west on State Road 7, the guitar-shaped tower of the Seminole Hard Rock Hotel & Casino is visible from far off and draws a crowd for concerts, dining and nights out. Arriving there in a supercar or a luxury SUV feels right at home.",
      "Golden Exotics serves Hollywood from our Miami location at 1551 NW 79th Ave, a short drive south of the city. Collect your car there or ask for delivery to your address or hotel when you book online at real daily prices.",
    ],
    highlights: [
      {
        title: "Hollywood Beach Broadwalk",
        text: "A long oceanfront promenade lined with cafes, shops and small hotels, right off A1A.",
      },
      {
        title: "Young Circle and ArtsPark",
        text: "The roundabout at the heart of downtown, with a park, events and Hollywood Boulevard's restaurants nearby.",
      },
      {
        title: "Seminole Hard Rock Hotel & Casino",
        text: "The resort with the guitar-shaped hotel on State Road 7, known for concerts, dining and nightlife.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver to a hotel on Hollywood Beach?",
        answer: "Yes. Delivery to Hollywood hotels and homes can be arranged on request when you book, or you can collect the car at our Miami location.",
      },
      {
        question: "Is there valet at the Seminole Hard Rock?",
        answer: "The resort offers valet as well as self-parking garages. For an exotic car, valet is the simpler option on busy event nights.",
      },
    ],
    nearby: ["hallandale-beach", "dania-beach", "fort-lauderdale-airport", "pembroke-pines", "miramar"],
    status: "draft",
  },
  {
    slug: "hallandale-beach",
    name: "Hallandale Beach",
    areaSlug: "fort-lauderdale-area",
    kind: "city",
    intro: [
      "Hallandale Beach is the first city you reach in Broward after crossing the line from Miami-Dade, and it shares a lot with its neighbors to the south: oceanfront high-rises along A1A, seasonal residents, and an easy reach to Aventura and Sunny Isles Beach.",
      "The center of social life here is Gulfstream Park, where horse racing, a casino, restaurants and shops sit side by side on US-1. On race days and weekend nights, the valet lanes fill with the kind of cars Golden Exotics rents, so a supercar blends in rather than standing out. For a quieter drive, head east on Hallandale Beach Boulevard and turn north on A1A toward Hollywood.",
      "Our pick-up location at 1551 NW 79th Ave in Miami is close by, or you can ask us to arrange delivery to your condo or hotel. Book online with real daily prices.",
    ],
    highlights: [
      {
        title: "Gulfstream Park",
        text: "A racetrack, casino and open-air shopping and dining district on US-1.",
      },
      {
        title: "Hallandale Beach Boulevard",
        text: "The main east-west road, leading from I-95 straight to the ocean.",
      },
      {
        title: "A1A and the beachfront",
        text: "A coastal road lined with residential towers, with public beach access and a calm drive north into Hollywood.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver a car to my condo in Hallandale Beach?",
        answer: "Yes. Delivery to condos and private addresses can be arranged on request when you book online.",
      },
      {
        question: "How do I get from your Miami location to Hallandale Beach?",
        answer: "From 1551 NW 79th Ave, most drivers head east and then north on I-95, exiting at Hallandale Beach Boulevard.",
      },
    ],
    nearby: ["hollywood", "aventura", "sunny-isles-beach", "miramar"],
    status: "draft",
  },
  {
    slug: "dania-beach",
    name: "Dania Beach",
    areaSlug: "fort-lauderdale-area",
    kind: "city",
    intro: [
      "Dania Beach is small, older than most of its neighbors, and easy to overlook, which is part of its appeal. It sits just south of Fort Lauderdale-Hollywood International Airport and Port Everglades, so plenty of people pass through without stopping. Those who do stop find a fishing pier, a quiet beach and one of the best-kept state parks on the coast.",
      "An exotic car here is about the in-between moments: a sunrise run out to the pier, an afternoon at the state park, or a stop at Dania Pointe on the way to dinner in Fort Lauderdale or Hollywood. With I-95 and US-1 both running through town, it is also a practical base if you are flying in or catching a cruise.",
      "Golden Exotics can arrange delivery to your address or hotel in Dania Beach, or you can pick the car up at our Miami location at 1551 NW 79th Ave.",
    ],
    highlights: [
      {
        title: "Dania Beach Pier",
        text: "A fishing pier with a restaurant at its base and wide views of the ocean.",
      },
      {
        title: "Dr. Von D. Mizell-Eula Johnson State Park",
        text: "A barrier-island state park with beaches and mangroves, facing Port Everglades across the inlet.",
      },
      {
        title: "Dania Pointe",
        text: "A shopping and dining development off I-95 at Stirling Road.",
      },
    ],
    faqs: [
      {
        question: "Is Dania Beach a good base if I am flying into FLL?",
        answer: "Yes. The town sits just south of the airport, and delivery to your hotel or to FLL can be arranged on request.",
      },
      {
        question: "Where can I take a car for a scenic drive near Dania Beach?",
        answer: "Head east to the beach, then follow A1A south through Hollywood, or north across the airport area to Fort Lauderdale Beach.",
      },
    ],
    nearby: ["fort-lauderdale-airport", "hollywood", "fort-lauderdale", "davie"],
    status: "draft",
  },
  {
    slug: "weston",
    name: "Weston",
    areaSlug: "fort-lauderdale-area",
    kind: "city",
    intro: [
      "Weston is a planned city on the western edge of Broward, where neatly kept neighborhoods meet the Everglades. Roads are wide, landscaping is careful, and the lakes and gated communities give it a calm, polished feel. It is the kind of place where people rent an exotic car for a family event, a birthday or a weekend away rather than for nightlife.",
      "Location is Weston's other strength. I-75 and I-595 meet at its northern edge, so the coast is within reach in one direction, and Alligator Alley heads straight across the Everglades toward Naples in the other. That open stretch of highway is one of the few long, uninterrupted drives in South Florida.",
      "Golden Exotics can arrange delivery to your home in Weston on request, or you can collect the car at our Miami location at 1551 NW 79th Ave. Book online with real daily prices and live availability.",
    ],
    highlights: [
      {
        title: "Weston Town Center",
        text: "The city's walkable center of restaurants and shops, a natural meeting point.",
      },
      {
        title: "Alligator Alley (I-75 west)",
        text: "The highway across the Everglades toward Florida's Gulf Coast, starting just outside Weston.",
      },
      {
        title: "Weston Road and Royal Palm Boulevard",
        text: "Wide, landscaped main roads that connect the city's neighborhoods.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver an exotic car to a gated community in Weston?",
        answer: "Yes. Delivery to private addresses, including gated communities, can be arranged on request. Let us know about any gate access details when you book.",
      },
      {
        question: "How do I get to Weston from your Miami location?",
        answer: "From 1551 NW 79th Ave, drivers usually head north on the Palmetto Expressway and continue onto I-75 toward Weston.",
      },
    ],
    nearby: ["davie", "sunrise", "pembroke-pines", "plantation"],
    status: "draft",
  },
  {
    slug: "plantation",
    name: "Plantation",
    areaSlug: "fort-lauderdale-area",
    kind: "city",
    intro: [
      "Plantation sits just west of Fort Lauderdale, close enough to reach the beach quickly but with a greener, more settled feel. Mature trees shade its residential streets, golf courses and parks fill the gaps between neighborhoods, and Broward Boulevard and Sunrise Boulevard carry most of the traffic through town.",
      "People here tend to rent an exotic car with a purpose: a weekend getaway, a business meeting, a wedding or a special dinner downtown. From Plantation, I-595 and Florida's Turnpike make it easy to head east to Las Olas, south toward Miami, or west to Sawgrass Mills and the Everglades.",
      "Golden Exotics can arrange delivery to your home or office in Plantation, or you can collect the car at our Miami location at 1551 NW 79th Ave. Choose from supercars, luxury SUVs and convertibles online, with real daily prices and live availability.",
    ],
    highlights: [
      {
        title: "Westfield Broward",
        text: "The city's main shopping mall at Broward Boulevard and University Drive.",
      },
      {
        title: "Plantation Heritage Park",
        text: "A large park with lakes and walking paths, a quiet place to stop.",
      },
      {
        title: "Plantation Preserve Golf Course & Club",
        text: "A public golf course with a clubhouse, popular for a round followed by lunch.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver a car to an office in Plantation?",
        answer: "Yes. Delivery to offices and homes in Plantation can be arranged on request when you book online.",
      },
      {
        question: "What is a good drive from Plantation?",
        answer: "Head east on Broward Boulevard into downtown Fort Lauderdale and continue to Las Olas and A1A for an easy loop that ends on the beach.",
      },
    ],
    nearby: ["fort-lauderdale", "sunrise", "davie", "weston"],
    status: "draft",
  },
  {
    slug: "davie",
    name: "Davie",
    areaSlug: "fort-lauderdale-area",
    kind: "city",
    intro: [
      "Davie surprises people. Minutes from the high-rises of the coast, it keeps a Western, horse-country character, with riding trails, ranches, a rodeo arena and large lots on its quieter streets. It is also a college town, home to Nova Southeastern University and other campuses.",
      "That mix makes Davie a good place to show off a car that looks out of place in the best way. Picture a supercar pulling up beside open pasture, or a luxury SUV carrying a family to a graduation at Nova. The town's position between I-595, Florida's Turnpike and I-75 also makes it easy to reach the beach in one direction and Weston or the Everglades in the other.",
      "Golden Exotics can arrange delivery to your home or campus-area address in Davie, or you can pick the car up at our Miami location at 1551 NW 79th Ave. Book online and see real daily prices before you confirm.",
    ],
    highlights: [
      {
        title: "Flamingo Gardens",
        text: "A botanical garden and wildlife sanctuary with native Florida animals and old-growth trees.",
      },
      {
        title: "Bergeron Rodeo Grounds",
        text: "The arena behind Davie's Western identity, host to rodeos and community events.",
      },
      {
        title: "Nova Southeastern University",
        text: "A large university campus in the heart of Davie, a frequent destination for graduations and visits.",
      },
      {
        title: "Tree Tops Park",
        text: "A wooded park with trails, an observation tower and equestrian paths.",
      },
    ],
    faqs: [
      {
        question: "Can I rent an exotic car for a graduation in Davie?",
        answer: "Yes. Book online for the dates you need, and delivery to your address can be arranged on request.",
      },
      {
        question: "Which highways connect Davie to the beach?",
        answer: "I-595 runs east from Davie toward Fort Lauderdale and the airport, where you can connect to US-1 and A1A.",
      },
    ],
    nearby: ["plantation", "weston", "pembroke-pines", "hollywood", "dania-beach"],
    status: "draft",
  },
  {
    slug: "pembroke-pines",
    name: "Pembroke Pines",
    areaSlug: "fort-lauderdale-area",
    kind: "city",
    intro: [
      "Pembroke Pines is one of Broward's largest cities, stretching from near the Turnpike all the way west to the Everglades. It is mainly residential, organized around big master-planned neighborhoods, and its main roads, Pines Boulevard and Sheridan Street, run long and straight between shopping centers and parks.",
      "Most rentals here mark an occasion: a quinceañera, an anniversary, a weekend trip to Key West or Naples, or simply a chance to drive something special for a few days. With I-75 on the west side and the Turnpike to the east, getting out of town is easy, and Miami is close enough for a dinner in Brickell or Coral Gables.",
      "Golden Exotics serves Pembroke Pines from our Miami location at 1551 NW 79th Ave. Pick the car up there or ask us to arrange delivery to your home. Booking is online with real daily prices.",
    ],
    highlights: [
      {
        title: "C.B. Smith Park",
        text: "A large county park with a lake and open green space on Flamingo Road.",
      },
      {
        title: "Pembroke Lakes Mall",
        text: "The city's long-standing indoor mall, near the intersection of Pines Boulevard and I-75.",
      },
      {
        title: "Pines Boulevard",
        text: "The main east-west road through the city, connecting the Turnpike to I-75.",
      },
    ],
    faqs: [
      {
        question: "Can you bring the car to my house in Pembroke Pines?",
        answer: "Yes. Home delivery can be arranged on request when you book online.",
      },
      {
        question: "Is Pembroke Pines a good starting point for a road trip?",
        answer: "Yes. I-75 on the west side leads to Alligator Alley and the Gulf Coast, and the Turnpike connects south toward the Keys.",
      },
    ],
    nearby: ["miramar", "weston", "davie", "hollywood"],
    status: "draft",
  },
  {
    slug: "miramar",
    name: "Miramar",
    areaSlug: "fort-lauderdale-area",
    kind: "city",
    intro: [
      "Miramar sits on the southern edge of Broward, right against the Miami-Dade line, and it has grown from a quiet bedroom community into a busy city with corporate offices, new neighborhoods and a strong cultural calendar. Miramar Parkway and the Turnpike tie it all together.",
      "Its location is the real advantage. Hard Rock Stadium is just across the county line in Miami Gardens, so a game, a concert or a big event weekend is close by, and arriving in an exotic car is part of the experience. The city's own cultural center and regional park are worth a stop too.",
      "Our pick-up location at 1551 NW 79th Ave in Miami is a short drive south, or you can ask us to arrange delivery to your home or office in Miramar. Every booking is made online at real daily prices, with availability checked live.",
    ],
    highlights: [
      {
        title: "Miramar Cultural Center",
        text: "A performing arts venue and the city's civic hub, hosting concerts and shows.",
      },
      {
        title: "Miramar Regional Park",
        text: "A large park with sports fields, an amphitheater and open lawns.",
      },
      {
        title: "Hard Rock Stadium",
        text: "The home of the Miami Dolphins, just south of Miramar in Miami Gardens, and a venue for major concerts and events.",
      },
    ],
    faqs: [
      {
        question: "Can I rent an exotic car for a game at Hard Rock Stadium?",
        answer: "Yes. Book the car online for the event dates and either collect it in Miami or ask for delivery to your Miramar address.",
      },
      {
        question: "How close is Miramar to your pick-up location?",
        answer: "Our location at 1551 NW 79th Ave is in Miami, south of Miramar, reachable via the Palmetto Expressway and Florida's Turnpike.",
      },
    ],
    nearby: ["pembroke-pines", "hollywood", "hallandale-beach", "miami-gardens", "miami-lakes"],
    status: "draft",
  },
  {
    slug: "sunrise",
    name: "Sunrise",
    areaSlug: "fort-lauderdale-area",
    kind: "city",
    intro: [
      "Sunrise is where much of western Broward goes to shop and to watch hockey. Sawgrass Mills, one of the largest outlet malls in the country, draws visitors from around the world, and the arena next door is home to the Florida Panthers and hosts major concerts throughout the year.",
      "That makes Sunrise a practical place to pair an exotic car with an outing: a day of shopping followed by dinner, or a playoff night with a car worth parking. The Sawgrass Expressway, I-595 and I-75 all meet nearby, so it is equally easy to head north to Coral Springs, east to Fort Lauderdale or west to the Everglades.",
      "Golden Exotics can arrange delivery to your home or hotel in Sunrise on request, or you can pick the car up at our Miami location at 1551 NW 79th Ave. See real daily prices and live availability when you book online.",
    ],
    highlights: [
      {
        title: "Sawgrass Mills",
        text: "A huge outlet mall with luxury and designer stores, restaurants and an entertainment area.",
      },
      {
        title: "Florida Panthers arena",
        text: "The home of the NHL's Florida Panthers, next to Sawgrass Mills, and a major concert venue.",
      },
      {
        title: "Sawgrass Expressway",
        text: "The toll road along the western edge of the city, linking I-595 and I-75 to Coral Springs and Deerfield Beach.",
      },
    ],
    faqs: [
      {
        question: "Can I rent an exotic car for a Panthers game in Sunrise?",
        answer: "Yes. Book online for the game dates and pick the car up in Miami, or ask us to arrange delivery to your address.",
      },
      {
        question: "Where should I park an exotic car at Sawgrass Mills?",
        answer: "The mall has large surface lots and valet at some entrances. Parking away from busy entrances or using valet helps avoid door dings.",
      },
    ],
    nearby: ["plantation", "weston", "davie", "coral-springs"],
    status: "draft",
  },
]
