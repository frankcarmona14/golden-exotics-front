import type { ServiceArea, ServiceCity } from "./types"

export const miamiArea: ServiceArea = {
  slug: "miami-area",
  name: "Miami Area",
  shortName: "Miami",
  county: "Miami-Dade County",
  intro: [
    "Golden Exotics rents exotic and luxury cars across Miami-Dade County, from the high-rises of Brickell and the hotels of South Beach to the quiet streets of Coral Gables and the open roads around Doral. Our pick-up location sits at 1551 NW 79th Ave, just west of Miami International Airport, which puts most of the county within easy reach by the Dolphin Expressway, I-95 or Florida's Turnpike.",
    "You can collect the car from us or ask for delivery to your home, hotel or the airport, and we'll arrange it on request. Prices are shown per day when you book online, and availability is checked live, so what you see is what you can reserve. Choose a city below to see where to drive, where to park and how to get the car there.",
  ],
  deliveryZoneCode: "miami",
  status: "draft",
}

export const miamiCoreCities: ServiceCity[] = [
  {
    slug: "miami",
    name: "Miami",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "The City of Miami covers far more ground than most visitors expect: the towers of Brickell and downtown, the murals of Wynwood, the cafes along Calle Ocho in Little Havana and the shaded bayfront of Coconut Grove. Getting between them is half the fun when the car is something special, and the city's mix of wide boulevards and waterfront drives suits a convertible or a grand tourer well.",
      "A good first loop runs down Biscayne Boulevard past Bayfront Park, over to Brickell Avenue and out across the Rickenbacker Causeway for skyline views on the way back. In the evening, the same streets turn into a slow cruise past restaurants and rooftop bars.",
      "Our pick-up location is on NW 79th Ave, west of Miami International Airport, so you can collect the car and be downtown via the Dolphin Expressway. If you'd rather not make the trip, ask for delivery to your address or hotel when you book online.",
    ],
    highlights: [
      {
        title: "Biscayne Boulevard",
        text: "The main bayfront artery through downtown, lined with parks, museums and the arena, and a classic stretch to drive at night.",
      },
      {
        title: "Calle Ocho, Little Havana",
        text: "SW 8th Street is the heart of Little Havana, known for Cuban coffee windows, cigar shops and Domino Park.",
      },
      {
        title: "Vizcaya Museum and Gardens",
        text: "The early 20th-century bayfront estate between Brickell and Coconut Grove makes a striking backdrop for a stop.",
      },
      {
        title: "Rickenbacker Causeway",
        text: "The causeway to Virginia Key and Key Biscayne gives one of the best views back toward the Miami skyline.",
      },
    ],
    faqs: [
      {
        question: "Can I pick up the car near Miami International Airport?",
        answer:
          "Yes. Our location at 1551 NW 79th Ave is just west of the airport, near Doral. You can also request delivery to the airport when you book.",
      },
      {
        question: "Do you deliver to hotels in the City of Miami?",
        answer:
          "Delivery to your hotel or home can be arranged on request. Add your address when you book online and we'll confirm the details with you.",
      },
    ],
    nearby: ["brickell", "downtown-miami", "miami-beach", "coral-gables", "miami-international-airport"],
    status: "draft",
  },
  {
    slug: "miami-international-airport",
    name: "Miami International Airport",
    areaSlug: "miami-area",
    kind: "airport",
    intro: [
      "If you're flying into Miami, our location is about as convenient as it gets. Golden Exotics picks up and returns from 1551 NW 79th Ave, just west of Miami International Airport near Doral, so the trip between the terminal and the car is short. Land, collect your keys and be on the Dolphin Expressway toward downtown or the beaches.",
      "Prefer to skip the extra stop? Ask for the car to be delivered to the airport when you book online and we'll arrange the handoff with you. It works well for business travelers with tight schedules and for anyone arriving late with luggage.",
      "From MIA, the Dolphin Expressway runs east to downtown and the MacArthur Causeway to South Beach, LeJeune Road heads south into Coral Gables, and the Palmetto Expressway and Florida's Turnpike connect to the rest of South Florida, including Fort Lauderdale and the Palm Beaches.",
    ],
    highlights: [
      {
        title: "Dolphin Expressway (SR 836)",
        text: "The main east-west route from the airport to downtown Miami and the causeways to Miami Beach.",
      },
      {
        title: "LeJeune Road",
        text: "Runs along the east side of the airport and south into Coral Gables.",
      },
      {
        title: "Doral",
        text: "The city directly west of the airport, home to golf resorts, restaurants and our pick-up location's neighborhood.",
      },
    ],
    faqs: [
      {
        question: "How far is your location from Miami International Airport?",
        answer:
          "We're at 1551 NW 79th Ave, a short drive west of the airport near Doral.",
      },
      {
        question: "Can you deliver the car to me at MIA?",
        answer:
          "Yes, airport delivery can be arranged on request. Add your flight details when you book so we can coordinate the handoff.",
      },
      {
        question: "Can I return the car before my flight out?",
        answer:
          "Yes. Returning at our location keeps you close to the terminals, and an airport return can be requested when you book.",
      },
    ],
    nearby: ["doral", "miami", "coral-gables", "hialeah"],
    status: "draft",
  },
  {
    slug: "miami-beach",
    name: "Miami Beach",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Miami Beach is a barrier island city of about seven miles, and each part has its own pace. South Beach brings the Art Deco hotels and nightlife, Mid-Beach is home to the grand resorts along Collins Avenue, and North Beach is quieter, with more locals than tourists. A luxury car fits in everywhere, from hotel valet lines to a morning drive along Indian Creek.",
      "Collins Avenue runs the length of the island, so a single drive north takes you from the busy south end past the Fontainebleau and up toward Surfside and Bal Harbour. Coming back, cross to the mainland over the Julia Tuttle or the Venetian Causeway for views across Biscayne Bay.",
      "Most guests here prefer delivery straight to their hotel or rental, which we arrange on request. You can also pick up at our location west of Miami International Airport and reach the beach over the Dolphin Expressway and the MacArthur Causeway.",
    ],
    highlights: [
      {
        title: "Collins Avenue",
        text: "The island's spine, running past many of Miami Beach's best-known hotels and resorts from South Beach to the north end.",
      },
      {
        title: "Lincoln Road",
        text: "A pedestrian mall of shops and restaurants in South Beach, with garages nearby for parking the car while you walk.",
      },
      {
        title: "Venetian Causeway",
        text: "A slower, lower route across a chain of small islands between Miami Beach and the mainland, with open water on both sides.",
      },
      {
        title: "Indian Creek Drive",
        text: "A waterfront road through Mid-Beach that follows the creek past docked boats and residential towers.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver the car to my Miami Beach hotel?",
        answer:
          "Yes, delivery to hotels and private addresses in Miami Beach can be arranged on request. Add the hotel when you book and we'll confirm the handoff with you.",
      },
      {
        question: "Where should I park a rental supercar in Miami Beach?",
        answer:
          "Hotel valet and the city's public garages are usually a better choice than street parking in the busiest blocks, especially at night.",
      },
      {
        question: "How do I get from your location to Miami Beach?",
        answer:
          "From our pick-up point on NW 79th Ave, the usual route is east on the Dolphin Expressway, then across the MacArthur Causeway into South Beach.",
      },
    ],
    nearby: ["south-beach", "surfside", "fisher-island", "downtown-miami"],
    status: "draft",
  },
  {
    slug: "south-beach",
    name: "South Beach",
    areaSlug: "miami-area",
    kind: "neighborhood",
    intro: [
      "South Beach is the southern tip of Miami Beach and one of the most recognizable neighborhoods in the country. Pastel Art Deco hotels line Ocean Drive, Lummus Park runs along the sand, and the side streets fill with restaurants and clubs after dark. Rolling down Ocean Drive with the top down at sunset is the reason many people rent an exotic car in Miami at all.",
      "The neighborhood is compact and busy, so the car is best used for getting in and out in style rather than circling for parking. Arrive at dinner on Collins Avenue, take a slow pass along Ocean Drive, then hand the keys to the valet.",
      "We can deliver to your South Beach hotel or apartment on request, which saves crossing the causeway yourself. If you prefer to collect it, our location west of Miami International Airport is a straight run east on the Dolphin Expressway and over the MacArthur Causeway.",
    ],
    highlights: [
      {
        title: "Ocean Drive",
        text: "The famous strip of Art Deco hotels and sidewalk cafes facing Lummus Park and the beach.",
      },
      {
        title: "South Pointe Park",
        text: "The park at the island's southern tip, with a pier and views of cruise ships heading out of Government Cut.",
      },
      {
        title: "Española Way",
        text: "A short, Mediterranean-style street of restaurants between Washington and Collins Avenues.",
      },
      {
        title: "Art Deco Historic District",
        text: "Blocks of restored 1930s architecture best seen on a slow drive or an evening walk.",
      },
    ],
    faqs: [
      {
        question: "Is it easy to drive an exotic car in South Beach?",
        answer:
          "Traffic is slow on Ocean Drive and Collins Avenue, especially on weekend nights, so plan for valet or a garage rather than street parking.",
      },
      {
        question: "Can the car be delivered to my South Beach hotel?",
        answer:
          "Yes, hotel delivery can be arranged on request. Include the hotel name when you book online and we'll confirm the details.",
      },
    ],
    nearby: ["miami-beach", "fisher-island", "downtown-miami", "brickell"],
    status: "draft",
  },
  {
    slug: "brickell",
    name: "Brickell",
    areaSlug: "miami-area",
    kind: "neighborhood",
    intro: [
      "Brickell is Miami's financial district and one of its densest residential neighborhoods, a forest of glass towers between the Miami River and Coconut Grove. Banks and law firms share the blocks with rooftop restaurants, Brickell City Centre and the bars around Mary Brickell Village, so the area is as lively on a Friday night as it is during the workday.",
      "Brickell Avenue itself is a handsome drive, lined with palms and residential high-rises facing the bay. Head south and it becomes South Miami Avenue toward Vizcaya, or turn onto the Rickenbacker Causeway for an easy escape to Key Biscayne. Many residents rent a luxury car for a client dinner, a weekend away or simply to enjoy the drive.",
      "Most Brickell buildings have valet or a garage, which makes delivery to your building convenient; just request it when you book. Our pick-up location is west of Miami International Airport, reached from Brickell via I-95 and the Dolphin Expressway.",
    ],
    highlights: [
      {
        title: "Brickell Avenue",
        text: "A palm-lined avenue of bayfront towers running from the Miami River south toward Coconut Grove.",
      },
      {
        title: "Brickell City Centre",
        text: "A large shopping and dining complex in the middle of the neighborhood, with its own parking garage.",
      },
      {
        title: "Brickell Key",
        text: "A small residential island connected by a short bridge, with a quiet waterfront loop.",
      },
      {
        title: "Rickenbacker Causeway",
        text: "Starts at the south end of Brickell and leads out over the bay to Virginia Key and Key Biscayne.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver to my building in Brickell?",
        answer:
          "Yes, delivery to your residence or office can be arranged on request. Let us know about any building garage or valet instructions when you book.",
      },
      {
        question: "What's a good drive from Brickell?",
        answer:
          "Take the Rickenbacker Causeway out to Key Biscayne for open water views, then come back toward the skyline in the late afternoon.",
      },
    ],
    nearby: ["downtown-miami", "coconut-grove", "key-biscayne", "miami"],
    status: "draft",
  },
  {
    slug: "downtown-miami",
    name: "Downtown Miami",
    areaSlug: "miami-area",
    kind: "neighborhood",
    intro: [
      "Downtown Miami is where the city does its big nights out. Concerts and games at the Kaseya Center, performances at the Adrienne Arsht Center and exhibitions at the Pérez Art Museum Miami all sit within a few blocks of Biscayne Boulevard. Pulling up to one of them in an exotic car is part of the occasion.",
      "Beyond the events, downtown is a crossroads. I-95 and the Dolphin Expressway meet here, the MacArthur Causeway leads straight to South Beach, and PortMiami is just across the water, so it's a natural starting point for a day that takes in the beach, Wynwood and Brickell.",
      "If you're staying downtown, we can arrange delivery to your hotel or apartment on request. Picking up yourself is also simple: our location on NW 79th Ave, west of Miami International Airport, connects to downtown directly by the Dolphin Expressway.",
    ],
    highlights: [
      {
        title: "Bayfront Park",
        text: "A large waterfront park on Biscayne Boulevard that hosts concerts and festivals through the year.",
      },
      {
        title: "Pérez Art Museum Miami",
        text: "The contemporary art museum in Museum Park, with hanging gardens and a terrace overlooking the bay.",
      },
      {
        title: "Adrienne Arsht Center",
        text: "Miami's main performing arts center, home to opera, ballet and touring Broadway shows.",
      },
      {
        title: "Bayside Marketplace",
        text: "A waterfront shopping and dining center next to the marina, with a parking garage on site.",
      },
    ],
    faqs: [
      {
        question: "Where can I park near downtown venues?",
        answer:
          "Event venues and Bayside Marketplace have nearby garages, and many downtown hotels offer valet, which is the easier option on event nights.",
      },
      {
        question: "Can I return the car downtown instead of at your location?",
        answer:
          "Pick-up and return arrangements other than our NW 79th Ave location can be requested when you book, and we'll confirm what's possible.",
      },
    ],
    nearby: ["brickell", "wynwood", "south-beach", "miami-beach"],
    status: "draft",
  },
  {
    slug: "wynwood",
    name: "Wynwood",
    areaSlug: "miami-area",
    kind: "neighborhood",
    intro: [
      "Wynwood went from warehouse district to one of Miami's best-known creative neighborhoods, and the walls are the proof. Almost every building is covered in large-scale murals, with the Wynwood Walls at the center, and the streets between them are packed with galleries, breweries, restaurants and boutiques.",
      "That backdrop is why so many photo and video shoots happen here, and why a supercar or a bright convertible gets noticed the moment it turns onto NW 2nd Avenue. Plan a slow drive past the murals in daylight, then come back in the evening when the restaurants and bars open up. The Miami Design District and Midtown are just to the north if you want to keep going.",
      "Parking in Wynwood fills up fast on weekends, so a paid lot or garage is worth it. We can arrange delivery nearby on request, or you can collect the car at our location west of Miami International Airport and drive over via the Dolphin Expressway and I-95.",
    ],
    highlights: [
      {
        title: "Wynwood Walls",
        text: "The outdoor mural park that started the neighborhood's transformation, featuring work by artists from around the world.",
      },
      {
        title: "NW 2nd Avenue",
        text: "Wynwood's main street, lined with murals, shops and restaurants and busy well into the night.",
      },
      {
        title: "Miami Design District",
        text: "Just north of Wynwood, a district of luxury fashion boutiques, design showrooms and public art.",
      },
    ],
    faqs: [
      {
        question: "Can I use the car for a photo shoot in Wynwood?",
        answer:
          "Many renters do. Tell us about your plans when you book, and keep in mind that busy streets and private murals may have their own rules.",
      },
      {
        question: "Is parking hard in Wynwood?",
        answer:
          "Street spaces go quickly on weekends and event nights, so a paid lot or garage is the safer choice for an exotic car.",
      },
    ],
    nearby: ["downtown-miami", "miami-beach", "brickell", "miami"],
    status: "draft",
  },
  {
    slug: "coconut-grove",
    name: "Coconut Grove",
    areaSlug: "miami-area",
    kind: "neighborhood",
    intro: [
      "Coconut Grove is one of Miami's oldest neighborhoods and still feels like a village under a canopy of banyans and oaks. Sailboats crowd Dinner Key, Peacock Park opens onto the bay, and the center around CocoWalk is full of sidewalk cafes and shops. It's a place for an unhurried lunch, not a race.",
      "That makes it a lovely place to drive something special. South Bayshore Drive follows the water toward Brickell, while Main Highway winds south under the trees toward Coral Gables and Old Cutler Road. Weekend mornings are especially calm, before the cafes fill up.",
      "Many Grove residents live on leafy side streets with private driveways, and we can arrange delivery to your home on request. To collect it yourself, our location on NW 79th Ave sits west of Miami International Airport, a straightforward drive via LeJeune Road or the Palmetto Expressway and US-1.",
    ],
    highlights: [
      {
        title: "Dinner Key Marina",
        text: "A large bayfront marina next to Miami City Hall, with restaurants and views of the moored sailboats.",
      },
      {
        title: "CocoWalk",
        text: "The open-air shopping and dining center at the heart of the Grove, with a parking garage.",
      },
      {
        title: "The Barnacle Historic State Park",
        text: "The preserved bayfront home of one of the Grove's early settlers, set in a patch of tropical hardwood forest.",
      },
      {
        title: "Main Highway",
        text: "A narrow, tree-covered road that links the Grove's village center to the residential streets toward Coral Gables.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver to a private home in Coconut Grove?",
        answer:
          "Yes, home delivery can be arranged on request. Add your address when you book and we'll confirm the timing with you.",
      },
      {
        question: "What's a nice drive starting in Coconut Grove?",
        answer:
          "Head south along Main Highway into Coral Gables and continue on Old Cutler Road, one of the most scenic tree-lined drives in Miami-Dade.",
      },
    ],
    nearby: ["coral-gables", "brickell", "key-biscayne", "pinecrest"],
    status: "draft",
  },
  {
    slug: "coral-gables",
    name: "Coral Gables",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Coral Gables was planned in the 1920s as a Mediterranean-style city, and it still looks the part. Coral rock entrances, banyan-lined boulevards, the tower of the Biltmore Hotel and the shops of Miracle Mile give it a polish that matches a luxury car better than almost anywhere in Miami-Dade.",
      "The best way to see it is behind the wheel. Loop past the Biltmore and the Granada golf course, stop at the Venetian Pool, then follow Old Cutler Road south through a tunnel of trees toward Fairchild Tropical Botanic Garden. In the evening, Miracle Mile and Giralda Plaza are the places for dinner.",
      "Coral Gables is one of the closest cities to our pick-up location at 1551 NW 79th Ave, just west of Miami International Airport, so collecting the car yourself is easy. If you'd rather stay put, delivery to your home or office can be arranged on request.",
    ],
    highlights: [
      {
        title: "The Biltmore Hotel",
        text: "The landmark 1926 hotel and golf course, whose tower is visible across much of Coral Gables.",
      },
      {
        title: "Miracle Mile",
        text: "The city's main shopping and dining street, with Giralda Plaza's restaurants just off it.",
      },
      {
        title: "Venetian Pool",
        text: "A historic public pool carved from a coral rock quarry, with grottos and waterfalls.",
      },
      {
        title: "Old Cutler Road",
        text: "A winding road under a dense canopy of trees, leading south past Fairchild Tropical Botanic Garden.",
      },
    ],
    faqs: [
      {
        question: "How close is your location to Coral Gables?",
        answer:
          "Our pick-up point on NW 79th Ave is west of Miami International Airport, which borders the north side of Coral Gables, so it's a short drive.",
      },
      {
        question: "Can I have the car delivered to the Biltmore or my home?",
        answer:
          "Delivery to hotels and private addresses in Coral Gables can be arranged on request when you book online.",
      },
    ],
    nearby: ["coconut-grove", "miami-international-airport", "pinecrest", "kendall", "miami"],
    status: "draft",
  },
  {
    slug: "key-biscayne",
    name: "Key Biscayne",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Key Biscayne feels a world away from the city it faces. The island village sits across Biscayne Bay from Brickell, with quiet residential streets, wide beaches and two large parks that take up much of its land. Life here moves at bicycle speed, and many residents keep it that way on purpose.",
      "Getting there is the highlight. The Rickenbacker Causeway climbs over the bay with the downtown skyline behind you, crosses Virginia Key and drops onto Crandon Boulevard, the island's main road. A morning drive out for breakfast and a walk to the Cape Florida Lighthouse, then back across the causeway in the late afternoon light, is hard to beat in a convertible.",
      "There's one road on and off the island, so plan around weekend beach traffic. We can arrange delivery to your Key Biscayne home or hotel on request, or you can pick up at our location west of Miami International Airport.",
    ],
    highlights: [
      {
        title: "Rickenbacker Causeway",
        text: "The bridge and causeway linking Brickell to Virginia Key and Key Biscayne, with wide views of the bay and skyline.",
      },
      {
        title: "Bill Baggs Cape Florida State Park",
        text: "The park at the island's southern tip, home to the historic Cape Florida Lighthouse and a long beach.",
      },
      {
        title: "Crandon Park",
        text: "A large county park on the north half of the island with a beach, marina and golf course.",
      },
    ],
    faqs: [
      {
        question: "How do I drive to Key Biscayne?",
        answer:
          "From the mainland, take the Rickenbacker Causeway from the south end of Brickell; it's the only road onto the island.",
      },
      {
        question: "Can the car be delivered on Key Biscayne?",
        answer:
          "Yes, delivery to homes and hotels on the island can be arranged on request. Add your address when you book online.",
      },
    ],
    nearby: ["brickell", "coconut-grove", "downtown-miami"],
    status: "draft",
  },
  {
    slug: "fisher-island",
    name: "Fisher Island",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Fisher Island is one of the most private addresses in South Florida. The small island sits just south of South Beach across Government Cut, has no bridge to the mainland and is reached by ferry, with access limited to residents, members and their guests. Inside, golf carts outnumber cars on the island's short roads.",
      "That's exactly why residents and guests rent a luxury car for time off the island. A grand tourer or a luxury SUV waiting on the mainland side means a night out in South Beach, dinner in Brickell or a weekend drive up the coast without bringing a car across on the ferry.",
      "Because access to the island is controlled, mention Fisher Island when you request delivery and we'll coordinate the details with you. You can also pick up at our location on NW 79th Ave, west of Miami International Airport, and reach the ferry area via the Dolphin Expressway and the MacArthur Causeway.",
    ],
    highlights: [
      {
        title: "Government Cut",
        text: "The shipping channel between Fisher Island and South Beach, where cruise ships pass on their way to and from PortMiami.",
      },
      {
        title: "MacArthur Causeway",
        text: "The causeway between downtown Miami and South Beach, close to where trips to the island begin.",
      },
      {
        title: "South Pointe Park",
        text: "Directly across the channel in South Beach, with views back toward the island.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver a car to Fisher Island?",
        answer:
          "Access to the island is restricted, so let us know when you book and we'll work out the handoff with you, whether on the island or on the mainland side.",
      },
      {
        question: "Where is the nearest place to drive from Fisher Island?",
        answer:
          "South Beach and downtown Miami are both close by once you're on the mainland, connected by the MacArthur Causeway.",
      },
    ],
    nearby: ["south-beach", "miami-beach", "downtown-miami"],
    status: "draft",
  },
  {
    slug: "doral",
    name: "Doral",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Doral is our home turf. Our pick-up location on NW 79th Ave sits right by the city, west of Miami International Airport, so for Doral residents and visitors the keys are close at hand. The city has grown from golf resorts and warehouses into a busy business hub with its own downtown, shopping and a well-known Venezuelan restaurant scene.",
      "Doral's wide, modern roads and easy highway access make it a practical base. The Palmetto Expressway borders the east side, Florida's Turnpike runs along the west, and the Dolphin Expressway sits just south, so the beaches, Brickell and Fort Lauderdale are all within reach without crossing the city first.",
      "Plenty of renters here are in town for business or golf at the resort courses, or simply want a weekend car for a drive to the Keys or up the coast. Pick up at our location, or ask for delivery to your Doral home, office or hotel when you book.",
    ],
    highlights: [
      {
        title: "Downtown Doral",
        text: "A newer walkable district of apartments, restaurants and offices around NW 87th Avenue.",
      },
      {
        title: "Doral golf resorts",
        text: "The city is known for its championship golf courses, which have hosted professional tournaments for decades.",
      },
      {
        title: "CityPlace Doral",
        text: "An open-air center of restaurants, shops and entertainment in the heart of the city.",
      },
      {
        title: "Dolphin Mall",
        text: "A large outlet and entertainment mall just south of Doral, at the junction of the Dolphin Expressway and the Turnpike.",
      },
    ],
    faqs: [
      {
        question: "Is your pick-up location in Doral?",
        answer:
          "We're at 1551 NW 79th Ave, Miami, FL 33126, right by Doral and just west of Miami International Airport.",
      },
      {
        question: "Can I get the car delivered to my office in Doral?",
        answer:
          "Yes, delivery to offices, homes and hotels can be arranged on request when you book online.",
      },
    ],
    nearby: ["miami-international-airport", "miami-lakes", "hialeah", "kendall", "miami"],
    status: "draft",
  },
]
