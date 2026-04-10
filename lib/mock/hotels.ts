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

export const hotels: Hotel[] = [];

export const hotelDeals: HotelDeal[] = [];

export const seasonalPricing: SeasonalPrice[] = [];

export const hotelReviews: HotelReview[] = [];

