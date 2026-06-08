/**
 * Universal Scrapers for ZimCompare
 * These functions simulate (or eventually implement) the scraping of data for all categories.
 */

export async function scrapeSchools() {
  // Mock scraping logic
  return [
    { name: "Peterhouse Boys", city: "Marondera", type: "boarding", academicScore: 95, safetyScore: 92, totalAnnualCost: 15000 },
    { name: "Prince Edward School", city: "Harare", type: "both", academicScore: 82, safetyScore: 75, totalAnnualCost: 3300 },
    { name: "Arundel School", city: "Harare", type: "boarding", academicScore: 94, safetyScore: 96, totalAnnualCost: 14500 },
  ];
}

export async function scrapeInsurance() {
  return [
    { name: "Old Mutual Zimbabwe", type: "full_service", claimsScore: 88, transparencyScore: 90, avgClaimDays: 5 },
    { name: "CIMAS", type: "medical", claimsScore: 85, transparencyScore: 82, avgClaimDays: 3 },
    { name: "Cell Insurance", type: "full_service", claimsScore: 78, transparencyScore: 85, avgClaimDays: 7 },
  ];
}

export async function scrapeMobility() {
    return {
        vehicles: [
            { make: "Toyota", model: "Hilux GD-6", year: 2023, price: 45000, condition: "new", fuelType: "diesel", location: "Harare" },
            { make: "Nissan", model: "NP200", year: 2021, price: 12000, condition: "used", fuelType: "petrol", location: "Bulawayo" },
        ],
        dealerships: [
            { name: "Toyota Zimbabwe", location: "Harare", type: "official_dealer" },
            { name: "Nissan Clover Leaf Motors", location: "Harare", type: "official_dealer" },
        ],
        busRoutes: [
            { operator: "Intercape", origin: "Harare", destination: "Bulawayo", price: 25, duration: "6h" },
        ],
        drivingSchools: [
            { name: "Chigubhu Driving School", location: "Harare", pricePerLesson: 10 },
        ]
    };
}

export async function scrapeHotels() {
  return [
    { name: "Meikles Hotel", location: "Harare", city: "Harare", stars: 5, pricePerNight: 180, rating: 4.8, reviewCount: 412, type: "hotel", recommended: true, bestValue: false, amenities: ["WiFi","Pool","Breakfast","Gym","Spa","Restaurant"], description: "Harare's most iconic luxury hotel, steps from Africa Unity Square." },
    { name: "Elephant Hills Resort", location: "Victoria Falls", city: "Victoria Falls", stars: 4, pricePerNight: 220, rating: 4.7, reviewCount: 894, type: "hotel", recommended: true, bestValue: false, amenities: ["WiFi","Pool","Breakfast","Gym","Parking"], description: "Set against the backdrop of the Victoria Falls World Heritage Site." },
    { name: "Rainbow Towers Hotel", location: "Harare", city: "Harare", stars: 4, pricePerNight: 135, rating: 4.5, reviewCount: 612, type: "hotel", recommended: false, bestValue: true, amenities: ["WiFi","Parking","Breakfast","Pool"], description: "Premier conference and leisure hotel in the heart of Harare." },
    { name: "Holiday Inn Bulawayo", location: "Bulawayo", city: "Bulawayo", stars: 4, pricePerNight: 110, rating: 4.3, reviewCount: 287, type: "hotel", recommended: false, bestValue: true, amenities: ["WiFi","Parking","Gym"], description: "Modern hotel in the city of kings, close to the National Museum." },
    { name: "The Boma Hotel", location: "Victoria Falls", city: "Victoria Falls", stars: 4, pricePerNight: 195, rating: 4.6, reviewCount: 503, type: "hotel", recommended: true, bestValue: false, amenities: ["WiFi","Pool","Breakfast","Restaurant"], description: "Award-winning dining and vibrant African entertainment nightly." },
    { name: "Imba Matombo Lodge", location: "Harare", city: "Harare", stars: 3, pricePerNight: 75, rating: 4.2, reviewCount: 198, type: "lodge", recommended: false, bestValue: true, amenities: ["WiFi","Parking","Breakfast"], description: "Tranquil stone lodge in Harare's leafy northern suburbs." },
    { name: "Matobo Hills Lodge", location: "Bulawayo", city: "Bulawayo", stars: 4, pricePerNight: 165, rating: 4.7, reviewCount: 341, type: "lodge", recommended: true, bestValue: false, amenities: ["WiFi","Pool","Breakfast","Spa"], description: "Luxury eco-lodge inside the UNESCO-listed Matobo National Park." },
    { name: "Imbabala Safari Camp", location: "Victoria Falls", city: "Victoria Falls", stars: 4, pricePerNight: 280, rating: 4.9, reviewCount: 275, type: "lodge", recommended: true, bestValue: false, amenities: ["WiFi","Pool","Breakfast","Restaurant"], description: "Exclusive riverfront camp on the Zambezi with game drives included." },
  ];
}

export async function scrapeSolar() {
  return [
    { name: "Distributed Power Africa", type: "commercial", installationCount: 500, warrantyYears: 25 },
    { name: "Zonful Energy", type: "residential", installationCount: 12000, warrantyYears: 2 },
  ];
}

export async function scrapeUtilities() {
  return [
    { name: "ZETDC", type: "electricity", coverage: "national" },
    { name: "City of Harare", type: "water", coverage: "Harare" },
  ];
}
