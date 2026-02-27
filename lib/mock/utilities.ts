// Mock data for Utilities comparison module

export interface ElectricityProvider {
    id: string
    name: string
    type: "ZESA" | "Solar Hybrid" | "Independent"
    planType: "Prepaid" | "Postpaid"
    customerType: "Residential" | "Commercial"
    tariffPerKwh: number // USD
    fixedMonthlyCharge: number // USD
    availableCities: string[]
    reliabilityScore: number // 0-100
    badge?: string
    features: string[]
}

export interface WaterProvider {
    id: string
    name: string
    type: "Municipal" | "Borehole Delivery" | "Subscription"
    city: string
    costPerCubicMeter: number // USD
    monthlyFixedCharge: number // USD
    deliveryCost?: number // USD per delivery
    reliabilityScore: number // 0-100
    badge?: string
    features: string[]
}

export interface InternetProvider {
    id: string
    name: string
    planName: string
    type: "Fibre" | "LTE/5G" | "Satellite"
    speedMbps: number
    monthlyPrice: number // USD
    installationFee: number // USD
    fairUsageGB?: number // null = unlimited
    contractMonths: number // 0 = no contract
    availableCities: string[]
    badge?: string
    features: string[]
}

export interface SubscriptionService {
    id: string
    name: string
    category: "Streaming" | "Security" | "Maintenance" | "Software"
    monthlyPrice: number // USD
    annualPrice: number // USD (total for year)
    familySharing: boolean
    maxUsers?: number
    contractMonths: number
    badge?: string
    features: string[]
}

// ─── Electricity ───────────────────────────────────────────────────────────────

export const electricityProviders: ElectricityProvider[] = [
    {
        id: "zesa-res-prepaid",
        name: "ZESA Holdings",
        type: "ZESA",
        planType: "Prepaid",
        customerType: "Residential",
        tariffPerKwh: 0.098,
        fixedMonthlyCharge: 0,
        availableCities: ["Harare", "Bulawayo", "Mutare", "Gweru", "Masvingo", "Kwekwe"],
        reliabilityScore: 52,
        badge: "Most Common",
        features: ["Token-based", "No monthly fee", "Smart meter compatible", "Load shedding schedules"],
    },
    {
        id: "zesa-res-postpaid",
        name: "ZESA Holdings",
        type: "ZESA",
        planType: "Postpaid",
        customerType: "Residential",
        tariffPerKwh: 0.098,
        fixedMonthlyCharge: 3.5,
        availableCities: ["Harare", "Bulawayo", "Mutare", "Gweru", "Masvingo", "Kwekwe"],
        reliabilityScore: 52,
        features: ["Monthly billing", "Account management", "Direct debit option"],
    },
    {
        id: "zesa-com-prepaid",
        name: "ZESA Holdings",
        type: "ZESA",
        planType: "Prepaid",
        customerType: "Commercial",
        tariffPerKwh: 0.135,
        fixedMonthlyCharge: 0,
        availableCities: ["Harare", "Bulawayo", "Mutare", "Gweru"],
        reliabilityScore: 52,
        features: ["Commercial metering", "Demand charge applicable", "Three-phase supply"],
    },
    {
        id: "zesa-com-postpaid",
        name: "ZESA Holdings",
        type: "ZESA",
        planType: "Postpaid",
        customerType: "Commercial",
        tariffPerKwh: 0.135,
        fixedMonthlyCharge: 12.0,
        availableCities: ["Harare", "Bulawayo", "Mutare", "Gweru"],
        reliabilityScore: 52,
        features: ["Monthly billing", "Dedicated account manager", "Priority fault response"],
    },
    {
        id: "solar-hybrid-econet",
        name: "Econet Solar",
        type: "Solar Hybrid",
        planType: "Postpaid",
        customerType: "Residential",
        tariffPerKwh: 0.065,
        fixedMonthlyCharge: 25.0,
        availableCities: ["Harare", "Bulawayo"],
        reliabilityScore: 88,
        badge: "Best Value",
        features: ["Solar + grid backup", "24/7 power", "App monitoring", "Battery storage included"],
    },
    {
        id: "solar-hybrid-sona",
        name: "Sona Solar",
        type: "Solar Hybrid",
        planType: "Postpaid",
        customerType: "Residential",
        tariffPerKwh: 0.072,
        fixedMonthlyCharge: 20.0,
        availableCities: ["Harare", "Mutare", "Masvingo"],
        reliabilityScore: 82,
        badge: "Best for Families",
        features: ["Hybrid inverter", "Grid tie-in", "5-year warranty", "Free installation"],
    },
    {
        id: "solar-hybrid-biz",
        name: "ZimSolar Business",
        type: "Solar Hybrid",
        planType: "Postpaid",
        customerType: "Commercial",
        tariffPerKwh: 0.055,
        fixedMonthlyCharge: 80.0,
        availableCities: ["Harare", "Bulawayo"],
        reliabilityScore: 91,
        badge: "Best for Business",
        features: ["Industrial capacity", "Dedicated support", "SLA guarantee", "Remote monitoring"],
    },
]

// ─── Water ─────────────────────────────────────────────────────────────────────

export const waterProviders: WaterProvider[] = [
    {
        id: "harare-water",
        name: "City of Harare Water",
        type: "Municipal",
        city: "Harare",
        costPerCubicMeter: 1.20,
        monthlyFixedCharge: 4.50,
        reliabilityScore: 45,
        features: ["Metered supply", "Monthly billing", "Sewer included"],
    },
    {
        id: "bulawayo-water",
        name: "Bulawayo City Council Water",
        type: "Municipal",
        city: "Bulawayo",
        costPerCubicMeter: 1.10,
        monthlyFixedCharge: 3.80,
        reliabilityScore: 55,
        badge: "Most Reliable Municipal",
        features: ["Metered supply", "Monthly billing", "Sewer included"],
    },
    {
        id: "mutare-water",
        name: "Mutare City Water",
        type: "Municipal",
        city: "Mutare",
        costPerCubicMeter: 0.95,
        monthlyFixedCharge: 3.20,
        reliabilityScore: 60,
        features: ["Metered supply", "Monthly billing"],
    },
    {
        id: "gweru-water",
        name: "Gweru City Water",
        type: "Municipal",
        city: "Gweru",
        costPerCubicMeter: 0.90,
        monthlyFixedCharge: 3.00,
        reliabilityScore: 58,
        features: ["Metered supply", "Monthly billing"],
    },
    {
        id: "borehole-aqua",
        name: "AquaZim Borehole Delivery",
        type: "Borehole Delivery",
        city: "Harare",
        costPerCubicMeter: 3.50,
        monthlyFixedCharge: 0,
        deliveryCost: 8.00,
        reliabilityScore: 85,
        badge: "Best for Shortages",
        features: ["Same-day delivery", "Tested water quality", "Flexible volumes", "WhatsApp ordering"],
    },
    {
        id: "borehole-pure",
        name: "PureWater Zimbabwe",
        type: "Borehole Delivery",
        city: "Bulawayo",
        costPerCubicMeter: 3.20,
        monthlyFixedCharge: 0,
        deliveryCost: 6.50,
        reliabilityScore: 80,
        features: ["Certified quality", "Bulk discounts", "Scheduled delivery"],
    },
    {
        id: "sub-waterwise",
        name: "WaterWise Subscription",
        type: "Subscription",
        city: "Harare",
        costPerCubicMeter: 2.80,
        monthlyFixedCharge: 15.00,
        reliabilityScore: 88,
        badge: "Best Value",
        features: ["Monthly subscription", "Priority delivery", "Quality guarantee", "Free tank cleaning"],
    },
]

// ─── Internet ──────────────────────────────────────────────────────────────────

export const internetProviders: InternetProvider[] = [
    {
        id: "liquid-fibre-10",
        name: "Liquid Home",
        planName: "Fibre 10Mbps",
        type: "Fibre",
        speedMbps: 10,
        monthlyPrice: 35,
        installationFee: 0,
        fairUsageGB: undefined,
        contractMonths: 12,
        availableCities: ["Harare", "Bulawayo"],
        features: ["Unlimited data", "Static IP available", "24/7 support", "Router included"],
    },
    {
        id: "liquid-fibre-50",
        name: "Liquid Home",
        planName: "Fibre 50Mbps",
        type: "Fibre",
        speedMbps: 50,
        monthlyPrice: 75,
        installationFee: 0,
        fairUsageGB: undefined,
        contractMonths: 12,
        availableCities: ["Harare", "Bulawayo"],
        badge: "Best Value Fibre",
        features: ["Unlimited data", "Static IP available", "Priority support", "Router included"],
    },
    {
        id: "liquid-fibre-100",
        name: "Liquid Home",
        planName: "Fibre 100Mbps",
        type: "Fibre",
        speedMbps: 100,
        monthlyPrice: 130,
        installationFee: 0,
        fairUsageGB: undefined,
        contractMonths: 12,
        availableCities: ["Harare"],
        badge: "Fastest Fibre",
        features: ["Unlimited data", "Dedicated IP", "SLA guarantee", "Premium router"],
    },
    {
        id: "econet-lte-20",
        name: "Econet Wireless",
        planName: "LTE Home 20Mbps",
        type: "LTE/5G",
        speedMbps: 20,
        monthlyPrice: 45,
        installationFee: 25,
        fairUsageGB: 200,
        contractMonths: 0,
        availableCities: ["Harare", "Bulawayo", "Mutare", "Gweru", "Masvingo"],
        badge: "Widest Coverage",
        features: ["No contract", "200GB FUP", "Nationwide coverage", "4G/LTE"],
    },
    {
        id: "netone-5g-50",
        name: "NetOne",
        planName: "5G Home 50Mbps",
        type: "LTE/5G",
        speedMbps: 50,
        monthlyPrice: 60,
        installationFee: 30,
        fairUsageGB: 500,
        contractMonths: 6,
        availableCities: ["Harare", "Bulawayo"],
        badge: "Best 5G",
        features: ["5G capable", "500GB FUP", "6-month contract", "Free router"],
    },
    {
        id: "telecel-lte-10",
        name: "Telecel",
        planName: "LTE Home 10Mbps",
        type: "LTE/5G",
        speedMbps: 10,
        monthlyPrice: 28,
        installationFee: 20,
        fairUsageGB: 100,
        contractMonths: 0,
        availableCities: ["Harare", "Bulawayo", "Mutare"],
        badge: "Most Affordable",
        features: ["No contract", "100GB FUP", "Easy setup", "Budget friendly"],
    },
    {
        id: "starlink-sat",
        name: "Starlink",
        planName: "Residential Satellite",
        type: "Satellite",
        speedMbps: 150,
        monthlyPrice: 120,
        installationFee: 499,
        fairUsageGB: undefined,
        contractMonths: 0,
        availableCities: ["All Locations"],
        badge: "Best for Rural",
        features: ["Nationwide coverage", "Unlimited data", "Low latency", "No contract"],
    },
]

// ─── Subscriptions ─────────────────────────────────────────────────────────────

export const subscriptionServices: SubscriptionService[] = [
    {
        id: "netflix-std",
        name: "Netflix",
        category: "Streaming",
        monthlyPrice: 15.99,
        annualPrice: 167.88,
        familySharing: true,
        maxUsers: 4,
        contractMonths: 0,
        badge: "Most Popular",
        features: ["4K Ultra HD", "4 screens", "Downloads", "All devices"],
    },
    {
        id: "showmax-std",
        name: "Showmax",
        category: "Streaming",
        monthlyPrice: 7.99,
        annualPrice: 79.90,
        familySharing: true,
        maxUsers: 2,
        contractMonths: 0,
        badge: "Best for Local Content",
        features: ["African content", "2 screens", "Downloads", "Sports add-on available"],
    },
    {
        id: "dstv-compact",
        name: "DStv Compact",
        category: "Streaming",
        monthlyPrice: 22.00,
        annualPrice: 240.00,
        familySharing: false,
        contractMonths: 1,
        features: ["100+ channels", "Sports", "News", "Decoder required"],
    },
    {
        id: "dstv-premium",
        name: "DStv Premium",
        category: "Streaming",
        monthlyPrice: 38.00,
        annualPrice: 420.00,
        familySharing: false,
        contractMonths: 1,
        badge: "Best for Sports",
        features: ["200+ channels", "All sports", "4K channels", "Catch-up TV"],
    },
    {
        id: "cimas-security",
        name: "Cimas Home Security",
        category: "Security",
        monthlyPrice: 18.00,
        annualPrice: 192.00,
        familySharing: false,
        contractMonths: 12,
        badge: "Most Trusted",
        features: ["24/7 monitoring", "Armed response", "Panic button", "CCTV integration"],
    },
    {
        id: "securico-basic",
        name: "Securico Basic",
        category: "Security",
        monthlyPrice: 12.00,
        annualPrice: 120.00,
        familySharing: false,
        contractMonths: 6,
        badge: "Best Value Security",
        features: ["24/7 monitoring", "Armed response", "Alarm system"],
    },
    {
        id: "ms365-personal",
        name: "Microsoft 365 Personal",
        category: "Software",
        monthlyPrice: 6.99,
        annualPrice: 69.99,
        familySharing: false,
        maxUsers: 1,
        contractMonths: 0,
        features: ["Word, Excel, PowerPoint", "1TB OneDrive", "1 device", "Regular updates"],
    },
    {
        id: "ms365-family",
        name: "Microsoft 365 Family",
        category: "Software",
        monthlyPrice: 9.99,
        annualPrice: 99.99,
        familySharing: true,
        maxUsers: 6,
        contractMonths: 0,
        badge: "Best for Families",
        features: ["Word, Excel, PowerPoint", "6TB OneDrive", "6 users", "All devices"],
    },
    {
        id: "maintenance-zimplumb",
        name: "ZimPlumb Home Care",
        category: "Maintenance",
        monthlyPrice: 25.00,
        annualPrice: 270.00,
        familySharing: false,
        contractMonths: 12,
        badge: "Best for Homeowners",
        features: ["Plumbing cover", "Electrical cover", "2 call-outs/month", "24/7 emergency line"],
    },
    {
        id: "maintenance-homefix",
        name: "HomeFix Zimbabwe",
        category: "Maintenance",
        monthlyPrice: 15.00,
        annualPrice: 162.00,
        familySharing: false,
        contractMonths: 6,
        features: ["General repairs", "1 call-out/month", "Discounted parts"],
    },
]

// ─── Usage tiers for electricity calculator ────────────────────────────────────
export const usageTiers = [
    { label: "Low", kwh: 100, description: "Small apartment, minimal appliances" },
    { label: "Medium", kwh: 350, description: "Family home, standard appliances" },
    { label: "High", kwh: 700, description: "Large home, AC, water heater" },
]
