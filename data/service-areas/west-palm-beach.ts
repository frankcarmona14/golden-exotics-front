import type { ServiceArea, ServiceCity } from "./types"

export const westPalmBeachArea: ServiceArea = {
  slug: "west-palm-beach-area",
  name: "West Palm Beach Area",
  shortName: "West Palm Beach",
  county: "Palm Beach County",
  intro: [
    "Palm Beach County runs from Boca Raton in the south to Jupiter in the north, and it rewards a good car more than almost anywhere in South Florida. A1A hugs the ocean for long stretches, Worth Avenue and Atlantic Avenue are made for slow evening drives, and the polo grounds and golf clubs inland give you a reason to arrive in something special.",
    "Golden Exotics serves the whole county from our pick-up location at 1551 NW 79th Ave in Miami, just west of Miami International Airport. You can collect the car there and head north on I-95 or Florida's Turnpike, or ask us to arrange delivery to your home, hotel or Palm Beach International Airport. Booking is online with real daily prices, and availability is checked live, so the supercar, luxury SUV or convertible you see is the one you can reserve.",
  ],
  status: "published",
}

export const westPalmBeachCities: ServiceCity[] = [
  {
    slug: "west-palm-beach",
    name: "West Palm Beach",
    areaSlug: "west-palm-beach-area",
    kind: "city",
    intro: [
      "West Palm Beach is the working downtown of Palm Beach County, and it has grown into a place people actually want to spend an evening. Restaurants and bars line Clematis Street, The Square fills up on weekends, and Flagler Drive follows the Intracoastal with the mansions of Palm Beach across the water.",
      "That waterfront road is the drive to start with. Take Flagler Drive north at sunset with the top down, cross one of the bridges to the island, and you have seen the best of both sides of Lake Worth Lagoon in one easy loop. For longer days, I-95 puts Jupiter, Boca Raton and the Turnpike within reach.",
      "Golden Exotics can arrange delivery to your West Palm Beach condo, hotel or office, or you can pick up at our Miami location and make the drive north part of the trip. Every car is booked online with live availability and real daily prices.",
    ],
    highlights: [
      {
        title: "Flagler Drive",
        text: "A palm-lined waterfront road along the Intracoastal, with clear views across to Palm Beach and plenty of places to pull over.",
      },
      {
        title: "Clematis Street",
        text: "Downtown's main dining and nightlife strip, running from the waterfront west through the historic core.",
      },
      {
        title: "The Square",
        text: "The open-air shopping and dining district formerly known as CityPlace, a short drive from the waterfront.",
      },
      {
        title: "Norton Museum of Art",
        text: "One of Florida's best-known art museums, on South Dixie Highway with its own visitor parking.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver a car to downtown West Palm Beach?",
        answer: "Yes. Delivery to your downtown hotel, condo or office can be arranged on request when you book. You can also pick the car up at our Miami location instead.",
      },
      {
        question: "Where should I park an exotic car downtown?",
        answer: "Public garages near Clematis Street and the valet at most hotels and larger restaurants are the easiest choices. We recommend covered parking over street spots whenever possible.",
      },
      {
        question: "How do I get to West Palm Beach from your Miami pick-up?",
        answer: "From 1551 NW 79th Ave, most drivers take Florida's Turnpike or I-95 north. Both lead straight into West Palm Beach.",
      },
    ],
    nearby: ["palm-beach", "palm-beach-airport", "lake-worth-beach", "palm-beach-gardens", "wellington"],
    status: "published",
  },
  {
    slug: "palm-beach",
    name: "Palm Beach",
    areaSlug: "west-palm-beach-area",
    kind: "city",
    intro: [
      "The island of Palm Beach has a quiet, old-money rhythm that a loud car can easily get wrong, and a beautiful one gets exactly right. Hedges hide most of the estates, the streets are spotless, and the best moments come from driving slowly: down Worth Avenue for lunch, along South Ocean Boulevard past the oceanfront houses, or up to The Breakers for drinks.",
      "Many visitors to Palm Beach are here for the winter season, for a gala, or for a long weekend with family, and they want a convertible or a refined grand tourer rather than something built for a racetrack. Others use a luxury SUV for the practical side of island life, from beach bags to valet stands.",
      "Golden Exotics can arrange delivery to your Palm Beach residence or hotel on request. Reserve online with real daily prices, and we will confirm the hand-off details with you directly.",
    ],
    highlights: [
      {
        title: "Worth Avenue",
        text: "The island's famous shopping street, with designer boutiques, courtyards called vias and some of the best people-watching in Florida.",
      },
      {
        title: "South Ocean Boulevard (A1A)",
        text: "A scenic coastal road past grand oceanfront estates, ideal for an unhurried drive with the top down.",
      },
      {
        title: "The Breakers",
        text: "The landmark oceanfront resort at the north end of the island's commercial district, with valet at the main entrance.",
      },
      {
        title: "Royal Poinciana Way",
        text: "A palm-lined street with cafes and shops near the bridge from West Palm Beach.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver to a private residence in Palm Beach?",
        answer: "Yes. Delivery to homes and hotels on the island can be arranged on request. Let us know any gate or access instructions when you book.",
      },
      {
        question: "Which car suits Palm Beach best?",
        answer: "Most guests here choose a convertible or an elegant grand tourer for the coast roads, or a luxury SUV for everyday errands. You can see what is available for your dates when you search online.",
      },
    ],
    nearby: ["west-palm-beach", "lake-worth-beach", "palm-beach-gardens", "palm-beach-airport"],
    status: "published",
  },
  {
    slug: "palm-beach-airport",
    name: "Palm Beach International Airport",
    areaSlug: "west-palm-beach-area",
    kind: "airport",
    intro: [
      "Palm Beach International Airport (PBI) is one of the easiest airports in Florida to fly into. It sits just west of downtown West Palm Beach, close to I-95, so the island of Palm Beach, Wellington and Lake Worth Beach are all a short drive from the terminal.",
      "If you are flying in for the season, a polo match or a weekend on the coast, there is no reason to start the trip in a standard rental. Golden Exotics can arrange to have your car brought to PBI on request, so you can head straight from arrivals to your hotel or home.",
      "Prefer to collect the car yourself? Our pick-up location is at 1551 NW 79th Ave in Miami, near Miami International Airport, which suits travelers landing there and driving north. Either way, you book online with real daily prices and live availability, and returning the car at the airport can be arranged the same way.",
    ],
    highlights: [
      {
        title: "Southern Boulevard",
        text: "The main road between the airport and the bridge to Palm Beach island, passing the edge of downtown West Palm Beach.",
      },
      {
        title: "I-95",
        text: "The interstate runs right beside the airport, connecting it to Boca Raton in the south and Jupiter in the north.",
      },
      {
        title: "Downtown West Palm Beach",
        text: "Clematis Street and the Flagler Drive waterfront are a quick drive east of the terminal.",
      },
    ],
    faqs: [
      {
        question: "Can you meet me with the car at PBI?",
        answer: "Delivery to Palm Beach International Airport can be arranged on request when you book. We will confirm the hand-off details with you before your flight.",
      },
      {
        question: "Can I return the car at the airport before my flight?",
        answer: "Yes, an airport return can be arranged on request. Tell us your departure time when you book so we can plan the collection.",
      },
    ],
    nearby: ["west-palm-beach", "palm-beach", "lake-worth-beach", "wellington"],
    status: "published",
  },
  {
    slug: "boca-raton",
    name: "Boca Raton",
    areaSlug: "west-palm-beach-area",
    kind: "city",
    intro: [
      "Boca Raton mixes polished suburbs with one of the prettiest stretches of beach road in the county. Mediterranean-style architecture, the pink towers of The Boca Raton resort and the shops and restaurants of Mizner Park give the city a look of its own, and plenty of residents keep a garage full of interesting cars.",
      "For visitors, Boca is a natural base for a few days with something fast. Spend the morning on A1A between Spanish River Park and Red Reef Park, have lunch at Mizner Park, then take Palmetto Park Road back toward the water for the evening. Business travelers often pair a luxury SUV with meetings along the I-95 corridor and a weekend upgrade to a convertible.",
      "Boca Raton sits at the southern edge of Palm Beach County, so it is one of the shorter trips north from our pick-up location at 1551 NW 79th Ave in Miami. Delivery to your home, hotel or office can also be arranged on request.",
    ],
    highlights: [
      {
        title: "Mizner Park",
        text: "An open-air plaza of restaurants, shops and an amphitheater along Federal Highway in the heart of the city.",
      },
      {
        title: "A1A through Boca Raton",
        text: "A beach road lined with sea grape and parks, with the ocean on one side and the Intracoastal close on the other.",
      },
      {
        title: "Red Reef Park",
        text: "An oceanfront park on A1A known for snorkeling and the Gumbo Limbo Nature Center next door.",
      },
      {
        title: "Town Center at Boca Raton",
        text: "The city's large indoor mall west of I-95, with luxury brands and plenty of parking.",
      },
    ],
    faqs: [
      {
        question: "Is Boca Raton close to your Miami pick-up location?",
        answer: "Boca Raton is at the southern end of Palm Beach County, reached by I-95 or Florida's Turnpike from 1551 NW 79th Ave. If you prefer, we can arrange delivery to you instead.",
      },
      {
        question: "Can you deliver to a gated community in Boca Raton?",
        answer: "Yes, delivery can be arranged on request. Share your community's gate procedure when you book so the hand-off goes smoothly.",
      },
    ],
    nearby: ["delray-beach", "boynton-beach", "deerfield-beach", "parkland", "coconut-creek"],
    status: "published",
  },
  {
    slug: "delray-beach",
    name: "Delray Beach",
    areaSlug: "west-palm-beach-area",
    kind: "city",
    intro: [
      "Delray Beach is built around one street. Atlantic Avenue runs from the edge of I-95 all the way to the ocean, and along the way it collects galleries, patios, live music and some of the busiest restaurants in the county. At night it is the place to be seen, and a well-chosen car parked out front is part of the scene.",
      "The beach end is just as appealing in daylight. Turn onto A1A at the foot of Atlantic Avenue and you get a long, low-rise stretch of ocean views heading north toward Gulf Stream and Ocean Ridge, one of the calmer coastal drives in South Florida. The Pineapple Grove arts district, just north of the avenue, is worth a slow loop as well.",
      "Golden Exotics can arrange delivery to your Delray Beach rental, hotel or home, or you can start at our Miami pick-up location and drive up. Book online with real daily prices and live availability.",
    ],
    highlights: [
      {
        title: "Atlantic Avenue",
        text: "Delray's main street, packed with restaurants and shops from downtown to the beach.",
      },
      {
        title: "Delray Municipal Beach",
        text: "A wide public beach at the east end of Atlantic Avenue, right on A1A.",
      },
      {
        title: "Pineapple Grove Arts District",
        text: "A smaller, walkable district of galleries and cafes just north of Atlantic Avenue.",
      },
      {
        title: "Morikami Museum and Japanese Gardens",
        text: "Large Japanese gardens and a museum in western Delray Beach, a peaceful contrast to the downtown strip.",
      },
    ],
    faqs: [
      {
        question: "Where can I park on Atlantic Avenue?",
        answer: "Downtown Delray has public garages and lots just off Atlantic Avenue, and many restaurants offer valet. For a high-value car, a garage or valet is the safer choice than a street spot.",
      },
      {
        question: "What is the best drive from Delray Beach?",
        answer: "Head east on Atlantic Avenue to A1A and turn north toward Gulf Stream and Ocean Ridge. It is a quiet, scenic ocean road with little traffic outside rush hour.",
      },
    ],
    nearby: ["boca-raton", "boynton-beach", "lake-worth-beach", "wellington"],
    status: "published",
  },
  {
    slug: "boynton-beach",
    name: "Boynton Beach",
    areaSlug: "west-palm-beach-area",
    kind: "city",
    intro: [
      "Boynton Beach is where many people who live in Palm Beach County actually spend their weekends: by the harbor, on a boat, or at a waterfront restaurant near the inlet. It is less polished than its neighbors, which is part of the charm, and a convertible fits right in on a sunny Saturday.",
      "The Boynton Harbor Marina is the heart of the waterfront, with fishing charters and dive boats heading out through Boynton Inlet. From there, cross the bridge on Ocean Avenue and take A1A south through Ocean Ridge and Gulf Stream toward Delray Beach, a short coastal run with the ocean close at hand. West of I-95, the city spreads into residential communities where a luxury SUV makes more sense for family visits.",
      "Golden Exotics can arrange delivery to your Boynton Beach address on request, or you can pick up at 1551 NW 79th Ave in Miami. Reservations are made online with live availability.",
    ],
    highlights: [
      {
        title: "Boynton Harbor Marina",
        text: "A busy marina with charter boats, dive operators and waterfront dining near the inlet.",
      },
      {
        title: "Boynton Inlet",
        text: "The inlet connecting the Intracoastal to the ocean, popular with anglers and for watching boats come and go.",
      },
      {
        title: "Ocean Avenue",
        text: "The road from downtown Boynton over the Intracoastal to the beach and A1A.",
      },
    ],
    faqs: [
      {
        question: "Can I get a car delivered to a Boynton Beach community west of I-95?",
        answer: "Yes. Delivery can be arranged on request to homes, gated communities and hotels across Boynton Beach. Add any gate details when you book.",
      },
      {
        question: "Is there a good coastal drive near Boynton Beach?",
        answer: "Take Ocean Avenue to A1A, then head south through Ocean Ridge and Gulf Stream toward Delray Beach. It is short, quiet and right along the water.",
      },
    ],
    nearby: ["delray-beach", "lake-worth-beach", "boca-raton", "wellington"],
    status: "published",
  },
  {
    slug: "lake-worth-beach",
    name: "Lake Worth Beach",
    areaSlug: "west-palm-beach-area",
    kind: "city",
    intro: [
      "Lake Worth Beach has an independent, artsy streak that sets it apart from the rest of the county. Its small downtown along Lake Avenue and Lucerne Avenue is full of local restaurants, galleries and live music, and the city's own beach, with its long fishing pier, sits across the bridge on the barrier island.",
      "That bridge is the reason to bring a great car here. Cross from downtown to the beach, then turn north on A1A into the southern end of Palm Beach, or south toward Lantana and Manalapan. Either way you are on a quiet coastal road close to a laid-back downtown, which makes Lake Worth Beach an easy half-day loop for anyone staying in the area.",
      "Golden Exotics can arrange delivery to your Lake Worth Beach home or hotel on request, or you can collect the car at our Miami location. You will see real daily prices and live availability when you book online.",
    ],
    highlights: [
      {
        title: "Lake Worth Beach Pier",
        text: "A long public fishing pier next to the city's beach, a classic spot for sunrise.",
      },
      {
        title: "Lake Avenue",
        text: "The main street of the downtown, lined with independent shops, cafes and bars.",
      },
      {
        title: "Bryant Park",
        text: "A waterfront park on the Intracoastal by the bridge to the beach, with views of the lagoon.",
      },
    ],
    faqs: [
      {
        question: "Is Lake Worth Beach the same as Lake Worth?",
        answer: "Yes. The city changed its name to Lake Worth Beach in 2019, but many people still call it Lake Worth.",
      },
      {
        question: "Where should I park near the beach?",
        answer: "The city beach has a paid public lot right by the pier. Choose a space away from the busiest rows if you can, and avoid leaving valuables in the car.",
      },
    ],
    nearby: ["west-palm-beach", "palm-beach", "boynton-beach", "palm-beach-airport", "wellington"],
    status: "published",
  },
  {
    slug: "wellington",
    name: "Wellington",
    areaSlug: "west-palm-beach-area",
    kind: "city",
    intro: [
      "Wellington is horse country. Every winter, riders, trainers and owners from around the world arrive for the show jumping and dressage season, and the polo fields fill on Sunday afternoons. Away from the arenas, the village is wide, green and quiet, with long boulevards that suit a relaxed drive.",
      "The season brings a very particular kind of visitor: someone who spends weeks here, splits time between the barns and the social calendar, and wants a car that looks right at a polo match but is practical enough for daily life. A luxury SUV handles the barn roads and the luggage, while a convertible or grand tourer is the choice for brunch at the polo club or dinner on the island of Palm Beach.",
      "Golden Exotics can arrange delivery to your Wellington home, farm or hotel on request, and you book online with real daily prices and live availability.",
    ],
    highlights: [
      {
        title: "Wellington International",
        text: "The equestrian showgrounds, formerly the Palm Beach International Equestrian Center, home of the winter show jumping season.",
      },
      {
        title: "International Polo Club Palm Beach",
        text: "Wellington's well-known polo venue, with Sunday matches during the winter season.",
      },
      {
        title: "Forest Hill Boulevard",
        text: "One of the main roads linking Wellington east toward West Palm Beach and the airport.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver a car to a farm or barn in Wellington?",
        answer: "Yes, delivery to homes, farms and rentals in Wellington can be arranged on request. Send us the property details and any gate codes when you book.",
      },
      {
        question: "Is Wellington close to Palm Beach International Airport?",
        answer: "Yes. Wellington is west of the airport, and Southern Boulevard and Forest Hill Boulevard both connect the two.",
      },
      {
        question: "Can I rent a car for the whole winter season?",
        answer: "You can search any dates online and see live availability and real daily prices for the length of your stay.",
      },
    ],
    nearby: ["west-palm-beach", "palm-beach-airport", "lake-worth-beach", "boynton-beach"],
    status: "published",
  },
  {
    slug: "palm-beach-gardens",
    name: "Palm Beach Gardens",
    areaSlug: "west-palm-beach-area",
    kind: "city",
    intro: [
      "Palm Beach Gardens is golf first and everything else second. PGA National Resort hosts a professional tournament each spring, private clubs dot the city, and many residents plan their week around tee times. The rest of the time, life centers on PGA Boulevard, with The Gardens Mall, Downtown at the Gardens and a long list of restaurants.",
      "That mix shapes what people rent. A grand tourer with room for a golf bag suits a round for two, and a luxury SUV makes sense for a foursome. On free afternoons, PGA Boulevard runs east to the water at the Intracoastal, and from there it is a short hop to the beaches of Juno and Jupiter or south along A1A toward Singer Island.",
      "Golden Exotics can arrange delivery to your home, club or hotel in Palm Beach Gardens on request, or you can drive up from our pick-up location at 1551 NW 79th Ave in Miami. Book online with live availability.",
    ],
    highlights: [
      {
        title: "PGA National Resort",
        text: "A large golf resort that hosts a PGA Tour event each year, with several championship courses.",
      },
      {
        title: "The Gardens Mall",
        text: "An upscale indoor mall on PGA Boulevard with luxury brands and valet parking.",
      },
      {
        title: "Downtown at the Gardens",
        text: "An open-air dining and entertainment center just across from The Gardens Mall.",
      },
      {
        title: "PGA Boulevard",
        text: "The city's main corridor, running from Florida's Turnpike and I-95 east toward the Intracoastal.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver a car to a golf club in Palm Beach Gardens?",
        answer: "Delivery to homes, hotels and clubs can be arranged on request. Some private clubs have their own rules for vehicle access, so let us know the details when you book.",
      },
      {
        question: "How do I reach Palm Beach Gardens from your Miami location?",
        answer: "Florida's Turnpike and I-95 both run north from Miami to exits on PGA Boulevard. You can also ask us to arrange delivery instead.",
      },
    ],
    nearby: ["jupiter", "west-palm-beach", "palm-beach", "wellington"],
    status: "published",
  },
  {
    slug: "jupiter",
    name: "Jupiter",
    areaSlug: "west-palm-beach-area",
    kind: "city",
    intro: [
      "Jupiter sits at the northern end of Palm Beach County, and it feels more relaxed than the cities to the south. The red Jupiter Inlet Lighthouse marks the entrance to the Loxahatchee River, boats fill the waterways on weekends, and the beaches are wide and uncrowded by South Florida standards.",
      "The drive is the draw. A1A runs along the ocean through Juno Beach into Jupiter, then continues north past the inlet to Jupiter Island, a quiet, tree-covered road with the water on both sides. Pair it with dinner at Harbourside Place on the Intracoastal and you have a full day out with a convertible or supercar. In spring, baseball fans head to Roger Dean Chevrolet Stadium in Abacoa for spring training.",
      "Golden Exotics can arrange delivery to your Jupiter home or hotel on request, or you can pick up at our Miami location and take Florida's Turnpike or I-95 north. Prices and availability are shown live when you book online.",
    ],
    highlights: [
      {
        title: "Jupiter Inlet Lighthouse",
        text: "A historic red-brick lighthouse overlooking the inlet, with a museum and views across the river.",
      },
      {
        title: "Harbourside Place",
        text: "A waterfront dining and shopping area on the Intracoastal with a boardwalk and marina.",
      },
      {
        title: "A1A to Jupiter Island",
        text: "A quiet coastal road north of the inlet, shaded by trees and close to the ocean.",
      },
      {
        title: "Roger Dean Chevrolet Stadium",
        text: "The spring training ballpark in Abacoa, home to two Major League teams each spring.",
      },
    ],
    faqs: [
      {
        question: "What is the best drive in Jupiter?",
        answer: "Take A1A north from Juno Beach, past the Jupiter Inlet, and onto Jupiter Island. It is one of the most scenic and least crowded coastal drives in the county.",
      },
      {
        question: "Can you deliver to Jupiter even though it is far north of Miami?",
        answer: "Yes, delivery to Jupiter can be arranged on request. Ask for it when you book and we will confirm the details with you.",
      },
    ],
    nearby: ["palm-beach-gardens", "west-palm-beach", "palm-beach"],
    status: "published",
  },
]
