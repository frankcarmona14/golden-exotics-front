import type { ServiceCity } from "./types"

export const miamiOuterCities: ServiceCity[] = [
  {
    slug: "aventura",
    name: "Aventura",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Aventura packs a lot into a small footprint: high-rise condos along the Intracoastal, a marina scene, and one of the busiest shopping destinations in the country, all strung along Biscayne Boulevard in the northeast corner of Miami-Dade.",
      "Life here moves between the valet stand and the open road. A weekend might mean lunch and shopping at Aventura Mall, a sunset drive across to Collins Avenue, and dinner in Sunny Isles or Hallandale Beach just over the county line. A convertible or a grand tourer suits that rhythm well, and a luxury SUV makes sense for family visits and airport runs.",
      "Golden Exotics is based at 1551 NW 79th Ave in Miami, by Doral. You can collect your car there, or ask us to deliver it to your Aventura building, hotel or the airport. Book online with real daily prices and live availability.",
    ],
    highlights: [
      {
        title: "Aventura Mall",
        text: "A major shopping destination with designer boutiques, restaurants and an art collection on display. Expect a busy valet line on weekends.",
      },
      {
        title: "Don Soffer Aventura Fitness Circuit",
        text: "The landscaped loop around Country Club Drive that circles the Turnberry golf course, popular with walkers and runners and a calm, scenic stretch to cruise.",
      },
      {
        title: "Biscayne Boulevard",
        text: "The city's main spine, lined with restaurants and shopping plazas, and the route north toward Hallandale Beach or south toward North Miami.",
      },
      {
        title: "Collins Avenue via the causeways",
        text: "A short hop east across the Intracoastal puts you on A1A with the ocean beside you, heading toward Sunny Isles Beach and Bal Harbour.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver a car to my condo in Aventura?",
        answer: "Yes. Delivery to your address, hotel or the airport is arranged on request when you book. If you prefer, you can pick the car up at our location at 1551 NW 79th Ave in Miami.",
      },
      {
        question: "Is it easy to park an exotic car at Aventura Mall?",
        answer: "The mall has valet and garage parking. Many drivers of low cars prefer valet to avoid tight ramps and crowded garage aisles on weekends.",
      },
    ],
    nearby: ["sunny-isles-beach", "north-miami-beach", "hallandale-beach", "bal-harbour"],
    status: "published",
  },
  {
    slug: "sunny-isles-beach",
    name: "Sunny Isles Beach",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Sunny Isles Beach is a narrow barrier-island city where glass towers line both sides of Collins Avenue and the Atlantic is never more than a block away. Many visitors stay in oceanfront condos for weeks at a time, and residents split their days between the beach, the pool deck and the drive to dinner.",
      "That makes it a natural place for a car that matches the view. Take a convertible south on A1A past Haulover toward Bal Harbour, or head west over the causeway to Aventura for shopping. Building valets here are used to handling high-end cars, so a supercar or a large luxury SUV fits right in.",
      "Our pick-up location is at 1551 NW 79th Ave in Miami, near Doral. You can collect the car there or ask for delivery to your Sunny Isles building, hotel or the airport. Prices are shown per day online, and availability is checked live when you book.",
    ],
    highlights: [
      {
        title: "Newport Fishing Pier",
        text: "A long public pier stretching into the ocean from the middle of the city, good for a morning walk and a look back at the skyline.",
      },
      {
        title: "Collins Avenue (A1A)",
        text: "The city's main road, framed by towers on both sides. The drive south toward Haulover and Bal Harbour is a classic open-top cruise.",
      },
      {
        title: "Haulover Park",
        text: "Just south of the city, with beachfront, a marina and the Haulover Inlet bridge, a favorite spot for boats heading out to sea.",
      },
      {
        title: "Samson Oceanfront Park",
        text: "A small beachfront park with public access to the sand between the residential towers.",
      },
    ],
    faqs: [
      {
        question: "Will my building's valet handle an exotic car?",
        answer: "Most Sunny Isles towers have valet service used to luxury vehicles. If you prefer to self-park, check the garage clearance before choosing a low supercar.",
      },
      {
        question: "Can the car be delivered to my condo in Sunny Isles?",
        answer: "Yes, delivery to your address or hotel is arranged on request. You can also pick it up at our location at 1551 NW 79th Ave in Miami.",
      },
    ],
    nearby: ["aventura", "bal-harbour", "north-miami-beach", "hallandale-beach"],
    status: "published",
  },
  {
    slug: "bal-harbour",
    name: "Bal Harbour",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Bal Harbour is a small, quiet village at the north end of the barrier island, known for one thing above all: Bal Harbour Shops, the open-air luxury mall where the parking lot often looks like a car show. Beyond the shops, it is a residential enclave of oceanfront towers and gated homes facing the bay.",
      "People who come here tend to plan their days around a few addresses: a long lunch at the Shops, a walk on the beach path, dinner nearby in Surfside. An exotic car fits that pace. Pull up to valet, then take the scenic route home along Collins Avenue or across the Broad Causeway toward the mainland.",
      "Golden Exotics works from 1551 NW 79th Ave in Miami, west of the airport. Pick up your car there, or have it delivered to your Bal Harbour residence, hotel or the airport on request. Booking is online with real daily rates.",
    ],
    highlights: [
      {
        title: "Bal Harbour Shops",
        text: "An open-air luxury shopping center with designer flagships and garden courtyards, and a valet stand that sees some of the best cars in Miami.",
      },
      {
        title: "Bal Harbour beach path",
        text: "A paved oceanfront path running behind the beachfront towers, popular for early-morning walks and runs.",
      },
      {
        title: "Broad Causeway",
        text: "The bridge across Biscayne Bay from 96th Street to North Miami, with wide water views on both sides.",
      },
      {
        title: "Haulover Inlet",
        text: "Directly north of the village, where Collins Avenue crosses the inlet and boats pass between the bay and the ocean.",
      },
    ],
    faqs: [
      {
        question: "Where do I park at Bal Harbour Shops?",
        answer: "The Shops offer valet and self-parking. Valet is the easy choice with a low exotic car.",
      },
      {
        question: "How do I get the car to Bal Harbour from your location?",
        answer: "You can pick it up at 1551 NW 79th Ave in Miami and drive over, or ask us to arrange delivery to your address or hotel in Bal Harbour.",
      },
    ],
    nearby: ["surfside", "sunny-isles-beach", "miami-beach", "north-miami"],
    status: "published",
  },
  {
    slug: "surfside",
    name: "Surfside",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Surfside is a compact beach town between Miami Beach and Bal Harbour, with a small-town feel that is rare this close to the city. Low-rise blocks of homes sit west of Collins Avenue, the beach runs along the east side, and Harding Avenue holds the cafés, bakeries and shops that locals walk to.",
      "Because the town is so walkable, a rental here is mostly about getting out of it in style. Drive south on Collins toward North Beach and Miami Beach, cross the Broad Causeway for dinner on the mainland, or head just north to Bal Harbour Shops. A convertible makes the most of the ocean breeze, and a luxury SUV handles beach gear and family trips easily.",
      "Golden Exotics is at 1551 NW 79th Ave in Miami, by Doral. Pick up there or ask for delivery to your Surfside home, rental or hotel. Book online with real daily prices and live availability.",
    ],
    highlights: [
      {
        title: "Harding Avenue",
        text: "The town's main shopping street, with cafés, kosher bakeries and local shops in a few easy blocks.",
      },
      {
        title: "Surfside beach",
        text: "A quieter stretch of sand than South Beach, with access points along Collins Avenue and a walking path by the dunes.",
      },
      {
        title: "96th Street",
        text: "The border with Bal Harbour and the start of the Broad Causeway, linking Surfside to the mainland.",
      },
    ],
    faqs: [
      {
        question: "Is there parking for an exotic car in Surfside?",
        answer: "Street parking is metered and can be tight near the beach. Most hotels and many residential buildings offer valet or private garages.",
      },
      {
        question: "Can you bring the car to my vacation rental in Surfside?",
        answer: "Yes, delivery to an address, hotel or the airport is arranged on request. You can also collect it at 1551 NW 79th Ave in Miami.",
      },
    ],
    nearby: ["bal-harbour", "miami-beach", "north-miami", "sunny-isles-beach"],
    status: "published",
  },
  {
    slug: "north-miami",
    name: "North Miami",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "North Miami sits on the mainland between Biscayne Bay and I-95, a diverse city with a strong Haitian community, a respected contemporary art museum and a long stretch of bayfront. It is less about showing off and more about real neighborhood life, which is part of its appeal for people who live here.",
      "For drivers, its location is the selling point. The Broad Causeway leads straight to Bal Harbour and Surfside, Biscayne Boulevard runs north to Aventura and south toward the Design District, and I-95 is close by for longer trips. A luxury sedan or SUV is a comfortable daily choice, while a sports car turns the causeway into the best part of the commute.",
      "Golden Exotics is based at 1551 NW 79th Ave in Miami, west of the airport. Collect the car there or ask for delivery to your North Miami home, office or hotel. Real daily prices and live availability are shown online.",
    ],
    highlights: [
      {
        title: "Museum of Contemporary Art (MOCA) North Miami",
        text: "A contemporary art museum in the city's civic center, with rotating exhibitions and a focus on emerging artists.",
      },
      {
        title: "FIU Biscayne Bay Campus",
        text: "Florida International University's bayfront campus on Biscayne Boulevard, surrounded by water and mangroves.",
      },
      {
        title: "Arch Creek Park",
        text: "A small park around a natural limestone bridge over Arch Creek, a historic site with a small nature center.",
      },
      {
        title: "Broad Causeway",
        text: "The direct link from North Miami to Bal Harbour and the beaches, with open bay views along the way.",
      },
    ],
    faqs: [
      {
        question: "What's the best drive from North Miami?",
        answer: "Cross the Broad Causeway to Bal Harbour, then follow Collins Avenue south along the ocean. It is a short drive with water views almost the whole way.",
      },
      {
        question: "Do you deliver to North Miami?",
        answer: "Delivery to your address, hotel or the airport is arranged on request. You can also pick up at our location at 1551 NW 79th Ave in Miami.",
      },
    ],
    nearby: ["north-miami-beach", "bal-harbour", "surfside", "miami-gardens", "miami"],
    status: "published",
  },
  {
    slug: "north-miami-beach",
    name: "North Miami Beach",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Despite the name, North Miami Beach is mostly on the mainland, wrapped around the Oleta River and the busy 163rd Street corridor. It mixes older residential streets, waterfront homes in Eastern Shores and a surprising amount of history, including a medieval Spanish monastery reassembled stone by stone in the 1950s.",
      "A rental here can serve two lives. During the week, a luxury SUV handles errands along 163rd Street and quick trips to Aventura. On the weekend, swap to a convertible, cross the causeway to Sunny Isles Beach and drive Collins Avenue with the top down. Oleta River State Park is right on the doorstep for anyone who wants to trade the car for a kayak for a few hours.",
      "Golden Exotics is at 1551 NW 79th Ave in Miami, by Doral. Pick up there, or ask for delivery to your North Miami Beach address or hotel. Book online with real daily prices.",
    ],
    highlights: [
      {
        title: "Ancient Spanish Monastery",
        text: "A 12th-century Spanish monastery shipped to the United States and reassembled on West Dixie Highway, with quiet gardens open to visitors.",
      },
      {
        title: "Oleta River State Park",
        text: "Florida's largest urban park, with mangrove trails, mountain bike paths and kayaking on the Oleta River.",
      },
      {
        title: "163rd Street",
        text: "The city's main commercial road, running east toward the causeway to Sunny Isles Beach.",
      },
    ],
    faqs: [
      {
        question: "How do I get from North Miami Beach to the beach by car?",
        answer: "Take 163rd Street east over the causeway and you reach Collins Avenue in Sunny Isles Beach. From there, A1A runs along the ocean in both directions.",
      },
      {
        question: "Can I pick up the car near North Miami Beach?",
        answer: "Our pick-up location is at 1551 NW 79th Ave in Miami. If that is out of your way, delivery to your address or hotel can be arranged on request.",
      },
    ],
    nearby: ["aventura", "north-miami", "sunny-isles-beach", "miami-gardens"],
    status: "published",
  },
  {
    slug: "miami-gardens",
    name: "Miami Gardens",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Miami Gardens is where South Florida's biggest events happen. Hard Rock Stadium is home to the Miami Dolphins and the Hurricanes, hosts the Miami Open tennis tournament and is the site of the Formula 1 Miami Grand Prix, which turns the area into a car-lover's weekend every spring.",
      "Most visitors come for a game, a concert or race weekend, and arriving in an exotic car is part of the experience. The city sits where Florida's Turnpike, I-95 and the Palmetto Expressway meet, so it is easy to reach from Miami, Fort Lauderdale or the beaches. A luxury SUV is the practical pick for a group heading to a tailgate, while a supercar fits Grand Prix week perfectly.",
      "Golden Exotics operates from 1551 NW 79th Ave in Miami, west of the airport. Pick up there or request delivery to your Miami Gardens address or hotel. Event weekends book up fast, so check live availability online.",
    ],
    highlights: [
      {
        title: "Hard Rock Stadium",
        text: "Home of the Miami Dolphins and Hurricanes football, plus major concerts, the Miami Open and other big events throughout the year.",
      },
      {
        title: "Formula 1 Miami Grand Prix",
        text: "Held on a circuit built around Hard Rock Stadium, it brings one of the biggest car weekends of the year to South Florida.",
      },
      {
        title: "Florida's Turnpike and I-95",
        text: "Both run through the city, making Miami Gardens a quick base for trips north into Broward and Palm Beach counties.",
      },
    ],
    faqs: [
      {
        question: "Can I rent an exotic car for an event at Hard Rock Stadium?",
        answer: "Yes. Book online for your dates and pick the car up at 1551 NW 79th Ave in Miami, or ask for delivery to your hotel or address. Big event weekends fill quickly, so book early.",
      },
      {
        question: "Where should I park a rental at Hard Rock Stadium?",
        answer: "The stadium sells official parking for each event. Buying a pass in advance saves time on game or race day.",
      },
    ],
    nearby: ["miami-lakes", "hialeah", "north-miami", "north-miami-beach", "miramar"],
    status: "published",
  },
  {
    slug: "hialeah",
    name: "Hialeah",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Hialeah is one of the largest cities in Florida and the heart of Cuban-American life in South Florida. Spanish is spoken everywhere, ventanitas serve cafecito on every corner, and car culture runs deep, from weekend meets to proud owners washing their cars in the driveway.",
      "It is also one of the closest cities to our location. Golden Exotics is at 1551 NW 79th Ave in Miami, by Doral, a short drive south of Hialeah via the Palmetto Expressway or Okeechobee Road. That makes picking up a car simple, whether you want a supercar for a birthday, a convertible for a weekend at the beach, or a luxury SUV for a wedding or quinceañera.",
      "From Hialeah, the Palmetto connects you to Miami International Airport, Doral and Miami Lakes, and I-95 is a short hop east. Book online with real daily prices and live availability, or ask for delivery to your Hialeah address on request.",
    ],
    highlights: [
      {
        title: "Hialeah Park",
        text: "The historic racetrack with its famous flock of pink flamingos, Mediterranean-style grandstand and casino.",
      },
      {
        title: "Amelia Earhart Park",
        text: "A large park with lakes, trails and open lawns on the east side of the city, popular for weekend picnics.",
      },
      {
        title: "Westland Mall",
        text: "The city's main mall, on the west side of Hialeah near the Palmetto Expressway.",
      },
      {
        title: "Palmetto Expressway (SR 826)",
        text: "The main north-south highway through the area, linking Hialeah with Doral, the airport and Miami Gardens.",
      },
    ],
    faqs: [
      {
        question: "Is your location close to Hialeah?",
        answer: "Yes. We are at 1551 NW 79th Ave in Miami, by Doral, a short drive south of Hialeah. Delivery to your address can also be arranged on request.",
      },
      {
        question: "Can I rent an exotic car for a quinceañera or wedding in Hialeah?",
        answer: "Yes. Book the dates online and either pick the car up at our location or ask us to deliver it to your home or venue.",
      },
    ],
    nearby: ["miami-lakes", "doral", "miami-gardens", "miami-international-airport", "miami"],
    status: "published",
  },
  {
    slug: "miami-lakes",
    name: "Miami Lakes",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Miami Lakes was built as a planned community, and it still feels that way: winding streets around man-made lakes, mature trees, and a walkable town center on Main Street. It is a quiet, family-oriented place that many people choose precisely because it is calm compared with the rest of Miami-Dade.",
      "The town's position on the Palmetto Expressway and close to I-75 makes it a smart starting point for longer drives. Head west on I-75 toward Alligator Alley and Florida's Gulf Coast, or south on the Palmetto to the airport and Doral. A grand tourer or luxury SUV is ideal for a road trip, and a convertible is perfect for an evening on Main Street.",
      "Golden Exotics is at 1551 NW 79th Ave in Miami, south of Miami Lakes via the Palmetto Expressway. Pick the car up there or request delivery to your home. Book online with real daily prices and live availability.",
    ],
    highlights: [
      {
        title: "Main Street Miami Lakes",
        text: "The town center, with restaurants and shops set along a walkable street close to the lake.",
      },
      {
        title: "The lakes",
        text: "The chain of lakes that gives the town its name, lined with homes and quiet residential streets that are pleasant to drive.",
      },
      {
        title: "I-75 toward Alligator Alley",
        text: "The highway heading west across the Everglades to Naples, a classic long drive starting near Miami Lakes.",
      },
    ],
    faqs: [
      {
        question: "Can I take the rental on a road trip from Miami Lakes?",
        answer: "Many customers use Miami Lakes as a starting point for drives west on I-75 or north on Florida's Turnpike. Check the trip details when you book online.",
      },
      {
        question: "How do I get the car to Miami Lakes?",
        answer: "Pick it up at 1551 NW 79th Ave in Miami and take the Palmetto Expressway north, or ask us to arrange delivery to your address.",
      },
    ],
    nearby: ["hialeah", "miami-gardens", "doral", "miramar"],
    status: "published",
  },
  {
    slug: "kendall",
    name: "Kendall",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Kendall is a large, suburban stretch of southwest Miami-Dade, built around shopping centers, golf courses and quiet residential streets. It is home to many families who work in the city and spend weekends closer to home, and it covers a wide area between US-1 and Florida's Turnpike.",
      "A rental here usually serves a specific occasion: an anniversary dinner, a graduation, a weekend trip to the Keys, or simply the chance to try a car you have always wanted. Kendall Drive and the Don Shula Expressway get you to Dadeland and the rest of Miami quickly, while US-1 and the Turnpike point south toward Homestead and the Overseas Highway.",
      "Golden Exotics is at 1551 NW 79th Ave in Miami, by Doral, north of Kendall via the Palmetto Expressway or Florida's Turnpike. Pick up there or request delivery to your Kendall home on request. Real daily prices and live availability are online.",
    ],
    highlights: [
      {
        title: "Dadeland Mall",
        text: "A major shopping center at US-1 and Kendall Drive, with department stores and plenty of restaurants nearby.",
      },
      {
        title: "The Falls",
        text: "An open-air shopping center on US-1 built around waterfalls and tropical landscaping.",
      },
      {
        title: "Zoo Miami",
        text: "The large open-air zoo in southwest Miami-Dade, an easy drive from most of Kendall.",
      },
      {
        title: "Kendall Drive (SW 88th Street)",
        text: "The main east-west road through the area, connecting Dadeland with the western suburbs.",
      },
    ],
    faqs: [
      {
        question: "Can I drive the rental from Kendall to the Florida Keys?",
        answer: "Yes, Kendall is well placed for a Keys trip via US-1 or Florida's Turnpike. A grand tourer or convertible is a comfortable choice for the drive.",
      },
      {
        question: "Do you deliver in Kendall?",
        answer: "Delivery to your address, hotel or the airport is arranged on request. You can also pick the car up at 1551 NW 79th Ave in Miami.",
      },
    ],
    nearby: ["pinecrest", "coral-gables", "doral", "homestead"],
    status: "published",
  },
  {
    slug: "pinecrest",
    name: "Pinecrest",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Pinecrest is one of Miami-Dade's most sought-after residential villages, known for large lush lots and streets shaded by oaks and royal palms. There are no high-rises here, just private homes, many hidden behind hedges and gates.",
      "Residents tend to know cars, and a rental here is often about trying something special for a weekend or arriving properly at a family celebration. The best drive starts right in the village: Old Cutler Road, with its canopy of banyan trees, winds toward Coral Gables and Coconut Grove. Pinecrest also sits next to US-1 and Dadeland, so getting downtown or to Brickell is straightforward.",
      "Golden Exotics is at 1551 NW 79th Ave in Miami, by Doral. You can collect your car there, or ask us to deliver it to your Pinecrest home on request. Book online with real daily prices and live availability.",
    ],
    highlights: [
      {
        title: "Pinecrest Gardens",
        text: "A botanical garden and cultural venue on the former Parrot Jungle site, with tropical plants, a lake and outdoor concerts.",
      },
      {
        title: "Old Cutler Road",
        text: "A two-lane road under a canopy of trees, one of the most scenic drives in South Florida.",
      },
      {
        title: "US-1 (South Dixie Highway)",
        text: "The village's eastern edge, with shopping and quick access to Dadeland and the Metrorail.",
      },
    ],
    faqs: [
      {
        question: "What's the best drive near Pinecrest?",
        answer: "Old Cutler Road, heading north toward Coral Gables and Coconut Grove, is a short and very scenic drive under a canopy of trees.",
      },
      {
        question: "Can the car be delivered to my home in Pinecrest?",
        answer: "Yes, delivery to your address is arranged on request. You can also pick it up at 1551 NW 79th Ave in Miami.",
      },
    ],
    nearby: ["kendall", "coral-gables", "coconut-grove"],
    status: "published",
  },
  {
    slug: "homestead",
    name: "Homestead",
    areaSlug: "miami-area",
    kind: "city",
    intro: [
      "Homestead is the last real stop before the Everglades and the Florida Keys. Surrounded by farms, nurseries and the open fields of the Redland, it feels a world away from Miami Beach, and the roads around it are some of the most open in Miami-Dade.",
      "It is also a city with motorsport in its blood. Homestead-Miami Speedway hosts major racing events, drawing drivers and fans from across the state. Beyond the track, the area is the gateway to two national parks and the start of the drive down US-1 to Key Largo. A grand tourer or convertible makes the most of those long, flat roads, and a luxury SUV handles a family day trip with ease.",
      "Golden Exotics is at 1551 NW 79th Ave in Miami, by Doral, a straight run north on Florida's Turnpike. Pick up there or request delivery to Homestead. Book online with real daily prices and live availability.",
    ],
    highlights: [
      {
        title: "Homestead-Miami Speedway",
        text: "A major motorsport venue hosting racing events throughout the year.",
      },
      {
        title: "Everglades National Park",
        text: "The main park entrance is just west of Homestead, with scenic roads and boardwalks through the sawgrass.",
      },
      {
        title: "Biscayne National Park",
        text: "A mostly underwater park east of the city, with a visitor center at Convoy Point on the bay.",
      },
      {
        title: "Robert Is Here",
        text: "The well-known fruit stand on the way to the Everglades, famous for tropical fruit milkshakes.",
      },
    ],
    faqs: [
      {
        question: "How do I get from your location to Homestead?",
        answer: "From 1551 NW 79th Ave in Miami, Florida's Turnpike runs south all the way to Homestead. Delivery to Homestead can also be arranged on request.",
      },
      {
        question: "Is Homestead a good starting point for the Florida Keys?",
        answer: "Yes. US-1 continues south from Homestead and Florida City to Key Largo and the rest of the Keys.",
      },
    ],
    nearby: ["kendall", "pinecrest", "coral-gables"],
    status: "published",
  },
]
