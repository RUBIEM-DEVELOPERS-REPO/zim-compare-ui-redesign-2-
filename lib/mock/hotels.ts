export interface Hotel {
    id: string
    name: string
    type: "hotel" | "lodge"
    city: string
    province: string
    stars: number
    pricePerNight: number
    amenities: string[]
    hasWifi: boolean
    hasPool: boolean
    hasBreakfast: boolean
    hasGym: boolean
    hasSpa: boolean
    hasParking: boolean
    roomTypes: string[]
    bestValue: boolean
    recommended: boolean
    rating: number
    reviewCount: number
    description: string
    imageHint: string
    imageUrl: string
}

export interface HotelDeal {
    id: string
    hotelId: string
    hotelName: string
    dealName: string
    originalPrice: number
    dealPrice: number
    validUntil: string
    includes: string[]
}

export interface SeasonalPrice {
    month: string
    avgPrice: number
    occupancy: number
}

export interface HotelReview {
    id: string
    hotelId: string
    author: string
    rating: number
    comment: string
    date: string
    verified: boolean
}

export const hotels: Hotel[] = [
    {
        id: "meikles-harare",
        name: "Meikles Hotel",
        type: "hotel",
        city: "Harare",
        province: "Harare",
        stars: 5,
        pricePerNight: 240,
        amenities: ["WiFi", "Pool", "Breakfast", "Gym", "Spa", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: true, hasSpa: true, hasParking: true,
        roomTypes: ["Luxury", "Presidential", "Executive"],
        bestValue: false, recommended: true, rating: 4.8, reviewCount: 1250,
        description: "An iconic luxury landmark in the heart of Harare with unparalleled service.",
        imageHint: "luxury hotel", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "vic-falls-hotel",
        name: "The Victoria Falls Hotel",
        type: "hotel",
        city: "Victoria Falls",
        province: "Matabeleland North",
        stars: 5,
        pricePerNight: 450,
        amenities: ["WiFi", "Pool", "Breakfast", "Gym", "Spa", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: true, hasSpa: true, hasParking: true,
        roomTypes: ["Classic", "Grand Suite", "Stable Wing"],
        bestValue: false, recommended: true, rating: 4.9, reviewCount: 2100,
        description: "Known as 'The Grand Old Lady of the Falls', a historic masterpiece of hospitality.",
        imageHint: "colonial hotel", imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "bronte-harare",
        name: "Bronte Garden Hotel",
        type: "hotel",
        city: "Harare",
        province: "Harare",
        stars: 4,
        pricePerNight: 160,
        amenities: ["WiFi", "Pool", "Breakfast", "Gym", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: true, hasSpa: false, hasParking: true,
        roomTypes: ["Standard", "Executive", "Garden Suite"],
        bestValue: true, recommended: false, rating: 4.5, reviewCount: 680,
        description: "Set in lush gardens, offering a tranquil escape in the city center.",
        imageHint: "garden hotel", imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "holiday-inn-bulawayo",
        name: "Holiday Inn Bulawayo",
        type: "hotel",
        city: "Bulawayo",
        province: "Bulawayo",
        stars: 4,
        pricePerNight: 135,
        amenities: ["WiFi", "Pool", "Breakfast", "Gym", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: true, hasSpa: false, hasParking: true,
        roomTypes: ["Standard", "King Leisure"],
        bestValue: true, recommended: false, rating: 4.2, reviewCount: 450,
        description: "Modern comfort and reliability in the City of Kings.",
        imageHint: "modern hotel", imageUrl: "https://images.unsplash.com/photo-1551882547-ff43c61f3c33?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "elephant-hills",
        name: "Elephant Hills Resort",
        type: "hotel",
        city: "Victoria Falls",
        province: "Matabeleland North",
        stars: 4,
        pricePerNight: 190,
        amenities: ["WiFi", "Pool", "Breakfast", "Gym", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: true, hasSpa: false, hasParking: true,
        roomTypes: ["Standard", "Deluxe", "Executive"],
        bestValue: false, recommended: false, rating: 4.0, reviewCount: 890,
        description: "Perched on a hill overlooking the Zambezi River with its own golf course.",
        imageHint: "resort hotel", imageUrl: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "crest-lodge-harare",
        name: "Cresta Lodge",
        type: "hotel",
        city: "Harare",
        province: "Harare",
        stars: 3,
        pricePerNight: 110,
        amenities: ["WiFi", "Pool", "Breakfast", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: false, hasSpa: false, hasParking: true,
        roomTypes: ["Standard"],
        bestValue: true, recommended: false, rating: 3.8, reviewCount: 320,
        description: "Excellent mid-range option with great conference facilities.",
        imageHint: "lodge style hotel", imageUrl: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "kingdom-hotel",
        name: "The Kingdom at Victoria Falls",
        type: "hotel",
        city: "Victoria Falls",
        province: "Matabeleland North",
        stars: 4,
        pricePerNight: 210,
        amenities: ["WiFi", "Pool", "Breakfast", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: false, hasSpa: false, hasParking: true,
        roomTypes: ["Family", "Standard", "King"],
        bestValue: false, recommended: false, rating: 4.1, reviewCount: 1500,
        description: "A fun, family-oriented hotel themed after Great Zimbabwe.",
        imageHint: "themed hotel", imageUrl: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "bulawayo-club",
        name: "The Bulawayo Club",
        type: "hotel",
        city: "Bulawayo",
        province: "Bulawayo",
        stars: 4,
        pricePerNight: 145,
        amenities: ["WiFi", "Breakfast", "Parking", "Restaurant"],
        hasWifi: true, hasPool: false, hasBreakfast: true, hasGym: false, hasSpa: false, hasParking: true,
        roomTypes: ["Standard", "Heritage Suite"],
        bestValue: false, recommended: true, rating: 4.6, reviewCount: 180,
        description: "Historic gentlemen's club turned boutique hotel with old-world charm.",
        imageHint: "historic building", imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "monomotapa-harare",
        name: "Monomotapa Harare",
        type: "hotel",
        city: "Harare",
        province: "Harare",
        stars: 4,
        pricePerNight: 175,
        amenities: ["WiFi", "Pool", "Breakfast", "Gym", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: true, hasSpa: false, hasParking: true,
        roomTypes: ["Executive", "Standard"],
        bestValue: false, recommended: false, rating: 3.9, reviewCount: 540,
        description: "Centrally located with iconic architecture and views of Harare Gardens.",
        imageHint: "tower hotel", imageUrl: "https://images.unsplash.com/photo-1541971875076-8f97a34444b2?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "troutbeck-nyanga",
        name: "Troutbeck Resort",
        type: "hotel",
        city: "Nyanga",
        province: "Manicaland",
        stars: 4,
        pricePerNight: 155,
        amenities: ["WiFi", "Pool", "Breakfast", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: false, hasSpa: false, hasParking: true,
        roomTypes: ["Standard", "Lake View"],
        bestValue: true, recommended: true, rating: 4.4, reviewCount: 420,
        description: "Cozy mountain resort famous for its log fires and trout fishing.",
        imageHint: "mountain resort", imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "nesbitt-castle",
        name: "Nesbitt Castle",
        type: "hotel",
        city: "Bulawayo",
        province: "Bulawayo",
        stars: 5,
        pricePerNight: 280,
        amenities: ["WiFi", "Pool", "Breakfast", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: false, hasSpa: false, hasParking: true,
        roomTypes: ["Medieval Suite", "Garden Suite"],
        bestValue: false, recommended: true, rating: 4.7, reviewCount: 150,
        description: "Stay in a real castle with gothic architecture and bespoke luxury.",
        imageHint: "castle hotel", imageUrl: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "leopard-rock",
        name: "Leopard Rock Hotel",
        type: "hotel",
        city: "Vumba",
        province: "Manicaland",
        stars: 5,
        pricePerNight: 260,
        amenities: ["WiFi", "Pool", "Breakfast", "Gym", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: true, hasSpa: false, hasParking: true,
        roomTypes: ["Classic", "Executive"],
        bestValue: false, recommended: false, rating: 4.3, reviewCount: 290,
        description: "Luxurious hotel set in the mist-shrouded Vumba Mountains.",
        imageHint: "forest resort", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "cresta-churchill",
        name: "Cresta Churchill",
        type: "hotel",
        city: "Bulawayo",
        province: "Bulawayo",
        stars: 3,
        pricePerNight: 120,
        amenities: ["WiFi", "Pool", "Breakfast", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: false, hasSpa: false, hasParking: true,
        roomTypes: ["Standard"],
        bestValue: true, recommended: false, rating: 3.7, reviewCount: 210,
        description: "Traditional Tudor-style hotel offering warm hospitality in Bulawayo.",
        imageHint: "tudor building", imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "rainbow-towers-harare",
        name: "Rainbow Towers",
        type: "hotel",
        city: "Harare",
        province: "Harare",
        stars: 5,
        pricePerNight: 215,
        amenities: ["WiFi", "Pool", "Breakfast", "Gym", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: true, hasSpa: false, hasParking: true,
        roomTypes: ["Diplomatic", "Standard"],
        bestValue: false, recommended: false, rating: 4.0, reviewCount: 1100,
        description: "A premier conference hotel in Harare with international standards.",
        imageHint: "modern skyscraper", imageUrl: "https://images.unsplash.com/photo-1517840901100-8179e982ad91?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "a-zambezi",
        name: "A'Zambezi River Lodge",
        type: "hotel",
        city: "Victoria Falls",
        province: "Matabeleland North",
        stars: 4,
        pricePerNight: 230,
        amenities: ["WiFi", "Pool", "Breakfast", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: false, hasSpa: false, hasParking: true,
        roomTypes: ["Standard River View", "Family"],
        bestValue: false, recommended: true, rating: 4.5, reviewCount: 950,
        description: "The only hotel in Victoria Falls with a river frontage.",
        imageHint: "riverfront hotel", imageUrl: "https://images.unsplash.com/photo-1521478413844-0bb79d80c35c?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "caribbea-bay",
        name: "Caribbea Bay Resort",
        type: "hotel",
        city: "Kariba",
        province: "Mashonaland West",
        stars: 3,
        pricePerNight: 140,
        amenities: ["WiFi", "Pool", "Breakfast", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: false, hasSpa: false, hasParking: true,
        roomTypes: ["Deluxe", "Casitas"],
        bestValue: true, recommended: false, rating: 3.6, reviewCount: 380,
        description: "Sardinian-style resort on the shores of Lake Kariba.",
        imageHint: "lakeside resort", imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "flamboyant-masvingo",
        name: "Flamboyant Hotel",
        type: "hotel",
        city: "Masvingo",
        province: "Masvingo",
        stars: 3,
        pricePerNight: 95,
        amenities: ["WiFi", "Pool", "Breakfast", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: false, hasSpa: false, hasParking: true,
        roomTypes: ["Standard"],
        bestValue: true, recommended: false, rating: 3.5, reviewCount: 160,
        description: "Ideal base for visiting Great Zimbabwe monuments.",
        imageHint: "city hotel", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "great-zimbabwe-hotel",
        name: "Great Zimbabwe Hotel",
        type: "hotel",
        city: "Masvingo",
        province: "Masvingo",
        stars: 3,
        pricePerNight: 105,
        amenities: ["WiFi", "Pool", "Breakfast", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: false, hasSpa: false, hasParking: true,
        roomTypes: ["Standard", "Family"],
        bestValue: false, recommended: true, rating: 4.0, reviewCount: 240,
        description: "Located within walking distance of the historic Great Zimbabwe ruins.",
        imageHint: "stone hotel", imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "musangano-lodge",
        name: "Musangano Lodge",
        type: "lodge",
        city: "Mutare",
        province: "Manicaland",
        stars: 4,
        pricePerNight: 130,
        amenities: ["WiFi", "Pool", "Breakfast", "Parking", "Restaurant"],
        hasWifi: true, hasPool: true, hasBreakfast: true, hasGym: false, hasSpa: false, hasParking: true,
        roomTypes: ["Chalet"],
        bestValue: true, recommended: true, rating: 4.6, reviewCount: 120,
        description: "Secluded forest lodge offering a peaceful retreat in the Eastern Highlands.",
        imageHint: "forest cabin", imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "fairway-hotel",
        name: "Fairway Hotel",
        type: "hotel",
        city: "Harare",
        province: "Harare",
        stars: 3,
        pricePerNight: 85,
        amenities: ["WiFi", "Parking", "Restaurant"],
        hasWifi: true, hasPool: false, hasBreakfast: false, hasGym: false, hasSpa: false, hasParking: true,
        roomTypes: ["Standard"],
        bestValue: true, recommended: false, rating: 3.4, reviewCount: 95,
        description: "Budget-friendly accommodation for business travelers in Harare.",
        imageHint: "budget hotel", imageUrl: "https://images.unsplash.com/photo-1506059612708-99d6c258160e?q=80&w=400&auto=format&fit=crop"
    }
];

export const hotelDeals: HotelDeal[] = [
    {
        id: "d1",
        hotelId: "meikles-harare",
        hotelName: "Meikles Hotel",
        dealName: "Business Weekend Special",
        originalPrice: 240,
        dealPrice: 180,
        validUntil: "2024-12-31",
        includes: ["Breakfast", "Airport Transfer"]
    }
];

export const seasonalPricing: SeasonalPrice[] = [
    { month: "Jan", avgPrice: 150, occupancy: 45 },
    { month: "Feb", avgPrice: 155, occupancy: 50 },
    { month: "Mar", avgPrice: 160, occupancy: 55 },
    { month: "Apr", avgPrice: 180, occupancy: 70 },
    { month: "May", avgPrice: 170, occupancy: 65 },
    { month: "Jun", avgPrice: 165, occupancy: 60 },
    { month: "Jul", avgPrice: 190, occupancy: 80 },
    { month: "Aug", avgPrice: 200, occupancy: 85 },
    { month: "Sep", avgPrice: 185, occupancy: 75 },
    { month: "Oct", avgPrice: 175, occupancy: 70 },
    { month: "Nov", avgPrice: 160, occupancy: 55 },
    { month: "Dec", avgPrice: 210, occupancy: 90 }
];

export const hotelReviews: HotelReview[] = [
    {
        id: "r1",
        hotelId: "vic-falls-hotel",
        author: "John Doe",
        rating: 5,
        comment: "Absolute perfection. The high tea is a must-do!",
        date: "2024-05-01",
        verified: true
    }
];

