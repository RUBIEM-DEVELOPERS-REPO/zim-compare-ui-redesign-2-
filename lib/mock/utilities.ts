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

export const electricityProviders: ElectricityProvider[] = [];

// ─── Water ─────────────────────────────────────────────────────────────────────

export const waterProviders: WaterProvider[] = [];

// ─── Internet ──────────────────────────────────────────────────────────────────

export const internetProviders: InternetProvider[] = [];

// ─── Subscriptions ─────────────────────────────────────────────────────────────

export const subscriptionServices: SubscriptionService[] = [];

// ─── Usage tiers for electricity calculator ────────────────────────────────────
export const usageTiers: {label: string, kwh: number, description: string}[] = [];
