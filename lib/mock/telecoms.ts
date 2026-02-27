import type { TelecomProvider, DataBundle, VoiceRate } from "@/lib/types"

export const telecomProviders: TelecomProvider[] = [
  { id: "econet", name: "Econet Wireless", type: "MNO", transparencyScore: 75, digitalScore: 90, coverageScore: 92, networkType: "4G/LTE", bundles: [], voiceRates: [], coverageCities: ["Harare", "Bulawayo", "Gweru", "Mutare", "Masvingo", "Chinhoyi", "Marondera", "Kwekwe", "Kadoma", "Victoria Falls"] },
  { id: "netone", name: "NetOne", type: "MNO", transparencyScore: 70, digitalScore: 75, coverageScore: 80, networkType: "4G/LTE", bundles: [], voiceRates: [], coverageCities: ["Harare", "Bulawayo", "Gweru", "Mutare", "Masvingo", "Chinhoyi"] },
  { id: "telecel", name: "Telecel", type: "MNO", transparencyScore: 65, digitalScore: 65, coverageScore: 70, networkType: "3G/4G", bundles: [], voiceRates: [], coverageCities: ["Harare", "Bulawayo", "Gweru", "Mutare"] },
  { id: "telone", name: "TelOne", type: "ISP", transparencyScore: 72, digitalScore: 70, coverageScore: 60, networkType: "Fibre/ADSL", bundles: [], voiceRates: [], coverageCities: ["Harare", "Bulawayo", "Gweru", "Mutare", "Masvingo", "Chinhoyi", "Marondera"] },
  { id: "liquid", name: "Liquid Telecom", type: "ISP", transparencyScore: 78, digitalScore: 82, coverageScore: 55, networkType: "Fibre", bundles: [], voiceRates: [], coverageCities: ["Harare", "Bulawayo", "Mutare", "Victoria Falls"] },
]

export const dataBundles: DataBundle[] = [
  // Econet
  { id: "eco-d1", providerId: "econet", providerName: "Econet Wireless", category: "daily", name: "Daily Data 100MB", price: 0.50, dataGB: 0.1, validityDays: 1, costPerGB: 5.0, speedClass: "4G", fupNote: "" },
  { id: "eco-d2", providerId: "econet", providerName: "Econet Wireless", category: "weekly", name: "Weekly 1GB", price: 3.00, dataGB: 1, validityDays: 7, costPerGB: 3.0, speedClass: "4G", fupNote: "" },
  { id: "eco-d3", providerId: "econet", providerName: "Econet Wireless", category: "monthly", name: "Monthly 5GB", price: 10.00, dataGB: 5, validityDays: 30, costPerGB: 2.0, speedClass: "4G LTE", fupNote: "Speed throttled after 5GB" },
  { id: "eco-d4", providerId: "econet", providerName: "Econet Wireless", category: "monthly", name: "Monthly 10GB", price: 18.00, dataGB: 10, validityDays: 30, costPerGB: 1.8, speedClass: "4G LTE", fupNote: "Speed throttled after 10GB" },
  { id: "eco-d5", providerId: "econet", providerName: "Econet Wireless", category: "night", name: "Night Owl 5GB", price: 2.50, dataGB: 5, validityDays: 1, costPerGB: 0.5, speedClass: "4G", fupNote: "Valid 11PM-5AM only" },
  { id: "eco-d6", providerId: "econet", providerName: "Econet Wireless", category: "social", name: "WhatsApp Bundle 500MB", price: 1.00, dataGB: 0.5, validityDays: 7, costPerGB: 2.0, speedClass: "4G", fupNote: "WhatsApp only" },
  { id: "eco-d7", providerId: "econet", providerName: "Econet Wireless", category: "unlimited", name: "Unlimited Monthly", price: 35.00, dataGB: 50, validityDays: 30, costPerGB: 0.7, speedClass: "4G LTE", fupNote: "FUP: Throttled to 1Mbps after 50GB" },
  // NetOne
  { id: "net-d1", providerId: "netone", providerName: "NetOne", category: "daily", name: "OneFusion Daily", price: 0.40, dataGB: 0.15, validityDays: 1, costPerGB: 2.67, speedClass: "4G", fupNote: "" },
  { id: "net-d2", providerId: "netone", providerName: "NetOne", category: "weekly", name: "OneFusion Weekly", price: 2.50, dataGB: 1.2, validityDays: 7, costPerGB: 2.08, speedClass: "4G", fupNote: "" },
  { id: "net-d3", providerId: "netone", providerName: "NetOne", category: "monthly", name: "OneFusion 5GB", price: 8.00, dataGB: 5, validityDays: 30, costPerGB: 1.6, speedClass: "4G", fupNote: "" },
  { id: "net-d4", providerId: "netone", providerName: "NetOne", category: "monthly", name: "OneFusion 10GB", price: 15.00, dataGB: 10, validityDays: 30, costPerGB: 1.5, speedClass: "4G", fupNote: "" },
  { id: "net-d5", providerId: "netone", providerName: "NetOne", category: "night", name: "Night Data 3GB", price: 1.50, dataGB: 3, validityDays: 1, costPerGB: 0.5, speedClass: "4G", fupNote: "Valid 10PM-6AM" },
  { id: "net-d6", providerId: "netone", providerName: "NetOne", category: "social", name: "Social Media 300MB", price: 0.80, dataGB: 0.3, validityDays: 7, costPerGB: 2.67, speedClass: "4G", fupNote: "Social apps only" },
  // Telecel
  { id: "tel-d1", providerId: "telecel", providerName: "Telecel", category: "daily", name: "Telecel Daily 150MB", price: 0.35, dataGB: 0.15, validityDays: 1, costPerGB: 2.33, speedClass: "3G", fupNote: "" },
  { id: "tel-d2", providerId: "telecel", providerName: "Telecel", category: "weekly", name: "Telecel Weekly 1GB", price: 2.00, dataGB: 1, validityDays: 7, costPerGB: 2.0, speedClass: "3G/4G", fupNote: "" },
  { id: "tel-d3", providerId: "telecel", providerName: "Telecel", category: "monthly", name: "Telecel 5GB", price: 7.50, dataGB: 5, validityDays: 30, costPerGB: 1.5, speedClass: "3G/4G", fupNote: "" },
  { id: "tel-d4", providerId: "telecel", providerName: "Telecel", category: "monthly", name: "Telecel 15GB", price: 20.00, dataGB: 15, validityDays: 30, costPerGB: 1.33, speedClass: "4G", fupNote: "Best value bundle" },
  // TelOne
  { id: "to-d1", providerId: "telone", providerName: "TelOne", category: "monthly", name: "TelOne Fibre 20GB", price: 15.00, dataGB: 20, validityDays: 30, costPerGB: 0.75, speedClass: "Fibre 10Mbps", fupNote: "" },
  { id: "to-d2", providerId: "telone", providerName: "TelOne", category: "unlimited", name: "TelOne Unlimited Fibre", price: 45.00, dataGB: 100, validityDays: 30, costPerGB: 0.45, speedClass: "Fibre 20Mbps", fupNote: "FUP: Throttled after 100GB" },
  // Liquid
  { id: "liq-d1", providerId: "liquid", providerName: "Liquid Telecom", category: "monthly", name: "Liquid Fibre 50GB", price: 25.00, dataGB: 50, validityDays: 30, costPerGB: 0.5, speedClass: "Fibre 25Mbps", fupNote: "" },
  { id: "liq-d2", providerId: "liquid", providerName: "Liquid Telecom", category: "unlimited", name: "Liquid Unlimited", price: 60.00, dataGB: 200, validityDays: 30, costPerGB: 0.3, speedClass: "Fibre 50Mbps", fupNote: "FUP: 200GB then throttled" },
]

export const voiceRates: VoiceRate[] = [
  { id: "eco-v1", providerId: "econet", providerName: "Econet Wireless", type: "on_net", ratePerMin: 0.05, smsRate: 0.02 },
  { id: "eco-v2", providerId: "econet", providerName: "Econet Wireless", type: "off_net", ratePerMin: 0.10, smsRate: 0.05 },
  { id: "net-v1", providerId: "netone", providerName: "NetOne", type: "on_net", ratePerMin: 0.03, smsRate: 0.01 },
  { id: "net-v2", providerId: "netone", providerName: "NetOne", type: "off_net", ratePerMin: 0.08, smsRate: 0.04 },
  { id: "tel-v1", providerId: "telecel", providerName: "Telecel", type: "on_net", ratePerMin: 0.04, smsRate: 0.02 },
  { id: "tel-v2", providerId: "telecel", providerName: "Telecel", type: "off_net", ratePerMin: 0.09, smsRate: 0.04 },
]
