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

export const solarProviders: SolarProvider[] = [
    {
        id: "solartech-zw",
        name: "SolarTech Zimbabwe",
        type: "solar",
        cities: ["Harare", "Bulawayo", "Mutare", "Gweru"],
        verified: true,
        certifications: ["ZERA Licensed", "ISO 9001", "IEC Certified"],
        yearsActive: 8,
        projectsCompleted: 420,
        transparencyScore: 88,
        qualityScore: 90,
        phone: "+263 77 123 4567",
        email: "info@solartech.co.zw",
        website: "www.solartech.co.zw",
        reviews: [
            { author: "Tendai M.", rating: 5, comment: "Excellent installation, very professional team." },
            { author: "Grace N.", rating: 4, comment: "Good quality panels, took a bit longer than expected." },
        ],
    },
    {
        id: "sunpower-zw",
        name: "SunPower Zimbabwe",
        type: "both",
        cities: ["Harare", "Chinhoyi", "Marondera", "Kwekwe"],
        verified: true,
        certifications: ["ZERA Licensed", "Solar Energy Association ZW"],
        yearsActive: 5,
        projectsCompleted: 280,
        transparencyScore: 82,
        qualityScore: 85,
        phone: "+263 71 234 5678",
        email: "hello@sunpower.co.zw",
        website: "www.sunpower.co.zw",
        reviews: [
            { author: "Farai K.", rating: 5, comment: "Best ROI in Harare. System paid off in 3 years!" },
            { author: "Rudo C.", rating: 4, comment: "Great service, competitive pricing." },
        ],
    },
    {
        id: "greenergy-zw",
        name: "Greenergy Solutions",
        type: "solar",
        cities: ["Bulawayo", "Gweru", "Masvingo", "Kadoma"],
        verified: false,
        certifications: ["ZERA Licensed"],
        yearsActive: 3,
        projectsCompleted: 95,
        transparencyScore: 70,
        qualityScore: 75,
        phone: "+263 73 345 6789",
        email: "info@greenergy.co.zw",
        website: "www.greenergy.co.zw",
        reviews: [
            { author: "Blessing T.", rating: 3, comment: "Decent installation but customer support could be better." },
        ],
    },
    {
        id: "aquawell-zw",
        name: "AquaWell Drilling",
        type: "borehole",
        cities: ["Harare", "Bulawayo", "Masvingo", "Victoria Falls", "Mutare"],
        verified: true,
        certifications: ["EMA Registered", "ZINWA Certified", "ISO 14001"],
        yearsActive: 12,
        projectsCompleted: 650,
        transparencyScore: 91,
        qualityScore: 93,
        phone: "+263 77 456 7890",
        email: "drill@aquawell.co.zw",
        website: "www.aquawell.co.zw",
        reviews: [
            { author: "Simba P.", rating: 5, comment: "Drilled 60m, excellent yield. Very professional." },
            { author: "Chipo M.", rating: 5, comment: "Best borehole company in Harare, no doubt." },
        ],
    },
    {
        id: "waterwise-zw",
        name: "WaterWise Zimbabwe",
        type: "borehole",
        cities: ["Harare", "Chinhoyi", "Gweru", "Kwekwe"],
        verified: true,
        certifications: ["EMA Registered", "ZINWA Certified"],
        yearsActive: 7,
        projectsCompleted: 310,
        transparencyScore: 84,
        qualityScore: 86,
        phone: "+263 71 567 8901",
        email: "info@waterwise.co.zw",
        website: "www.waterwise.co.zw",
        reviews: [
            { author: "Nyasha R.", rating: 4, comment: "Good service, fair pricing. Pump works great." },
        ],
    },
]

export const solarPackages: SolarPackage[] = [
    {
        id: "sol-1kw",
        providerId: "solartech-zw",
        providerName: "SolarTech Zimbabwe",
        name: "Starter 1kW Home System",
        category: "solar",
        systemKW: 1,
        price: 1200,
        installDays: 2,
        warrantyYears: 5,
        monthlySavings: 35,
        paybackMonths: 34,
        batteryIncluded: true,
        inverterBrand: "Growatt",
        panelBrand: "Jinko Solar",
    },
    {
        id: "sol-3kw",
        providerId: "solartech-zw",
        providerName: "SolarTech Zimbabwe",
        name: "Family 3kW System",
        category: "solar",
        systemKW: 3,
        price: 3200,
        installDays: 3,
        warrantyYears: 10,
        monthlySavings: 95,
        paybackMonths: 34,
        batteryIncluded: true,
        inverterBrand: "Growatt",
        panelBrand: "Jinko Solar",
        recommended: true,
    },
    {
        id: "sol-5kw",
        providerId: "sunpower-zw",
        providerName: "SunPower Zimbabwe",
        name: "Premium 5kW System",
        category: "solar",
        systemKW: 5,
        price: 5800,
        installDays: 4,
        warrantyYears: 15,
        monthlySavings: 160,
        paybackMonths: 36,
        batteryIncluded: true,
        inverterBrand: "SMA",
        panelBrand: "Canadian Solar",
        bestValue: true,
    },
    {
        id: "sol-10kw",
        providerId: "sunpower-zw",
        providerName: "SunPower Zimbabwe",
        name: "Business 10kW System",
        category: "solar",
        systemKW: 10,
        price: 10500,
        installDays: 7,
        warrantyYears: 20,
        monthlySavings: 320,
        paybackMonths: 33,
        batteryIncluded: true,
        inverterBrand: "SMA",
        panelBrand: "Canadian Solar",
    },
    {
        id: "sol-2kw-budget",
        providerId: "greenergy-zw",
        providerName: "Greenergy Solutions",
        name: "Budget 2kW System",
        category: "solar",
        systemKW: 2,
        price: 1800,
        installDays: 2,
        warrantyYears: 5,
        monthlySavings: 60,
        paybackMonths: 30,
        batteryIncluded: false,
        inverterBrand: "Voltronic",
        panelBrand: "Risen Energy",
    },
]

export const boreholePackages: BoreholePackage[] = [
    {
        id: "bh-30m",
        providerId: "aquawell-zw",
        providerName: "AquaWell Drilling",
        name: "Shallow Borehole 30m",
        category: "borehole",
        depthMeters: 30,
        price: 2500,
        warrantyYears: 2,
        pumpIncluded: true,
        pumpType: "Submersible 0.5HP",
        yieldLitersPerHour: 800,
        paybackMonths: 18,
        bestValue: true,
    },
    {
        id: "bh-60m",
        providerId: "aquawell-zw",
        providerName: "AquaWell Drilling",
        name: "Standard Borehole 60m",
        category: "borehole",
        depthMeters: 60,
        price: 4200,
        warrantyYears: 3,
        pumpIncluded: true,
        pumpType: "Submersible 1HP",
        yieldLitersPerHour: 1500,
        paybackMonths: 24,
        recommended: true,
    },
    {
        id: "bh-100m",
        providerId: "aquawell-zw",
        providerName: "AquaWell Drilling",
        name: "Deep Borehole 100m",
        category: "borehole",
        depthMeters: 100,
        price: 7000,
        warrantyYears: 5,
        pumpIncluded: true,
        pumpType: "Submersible 2HP",
        yieldLitersPerHour: 2500,
        paybackMonths: 30,
    },
    {
        id: "bh-50m-ww",
        providerId: "waterwise-zw",
        providerName: "WaterWise Zimbabwe",
        name: "WaterWise 50m Package",
        category: "borehole",
        depthMeters: 50,
        price: 3600,
        warrantyYears: 2,
        pumpIncluded: true,
        pumpType: "Submersible 0.75HP",
        yieldLitersPerHour: 1200,
        paybackMonths: 22,
    },
]
