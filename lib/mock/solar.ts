export interface SolarProvider {
    id: string
    name: string
    type: "solar" | "borehole" | "both"
    cities: string[]
    verified: boolean
    certifications: string[]
    yearsActive: number
    projectsCompleted: number
    transparencyScore: number
    qualityScore: number
    phone: string
    email: string
    website: string
    reviews: { author: string; rating: number; comment: string }[]
}

export interface SolarPackage {
    id: string
    providerId: string
    providerName: string
    name: string
    category: "solar"
    systemKW: number
    price: number
    installDays: number
    warrantyYears: number
    monthlySavings: number
    paybackMonths: number
    batteryIncluded: boolean
    inverterBrand: string
    panelBrand: string
    bestValue?: boolean
    recommended?: boolean
}

export interface BoreholePackage {
    id: string
    providerId: string
    providerName: string
    name: string
    category: "borehole"
    depthMeters: number
    price: number
    warrantyYears: number
    pumpIncluded: boolean
    pumpType: string
    yieldLitersPerHour: number
    paybackMonths: number
    bestValue?: boolean
    recommended?: boolean
}

export const solarProviders: SolarProvider[] = [];

export const solarPackages: SolarPackage[] = [];

export const boreholePackages: BoreholePackage[] = [];

