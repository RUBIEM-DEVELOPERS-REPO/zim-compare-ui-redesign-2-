// ── ZimCompare Types ──

export type Role = "guest" | "registered" | "paid" | "admin" | "ai"

export interface User {
  id: string
  email: string
  name: string
  role: Role
  isPaid: boolean
}

export interface Institution {
  id: string
  name: string
  type: string
  logo?: string
  transparencyScore: number
  digitalScore?: number
  website?: string | null
  headOfficeAddress?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
}

// ── Banking ──

export interface Bank extends Institution {
  type: "commercial" | "building_society" | "microfinance"
  branches: number
  products: BankingProduct[]
  fees: BankFee[]
  digitalFeatures: string[]
  locations: string[]
}

export interface BankingProduct {
  id: string
  bankId: string
  bankName: string
  category: "savings" | "current" | "student" | "salary" | "sme"
  name: string
  interestRate: number
  minBalance: number
  monthlyFee: number
  perks: string[]
}

export interface BankFee {
  id: string
  bankId: string
  bankName: string
  category: "transaction" | "atm_card" | "fx_transfers" | "penalties" | "hidden"
  name: string
  amount: number
  unit: string
  description: string
}

export interface BankLoan {
  id: string
  bankId: string
  bankName: string
  category: "personal" | "sme" | "mortgage" | "vehicle" | "salary_based"
  name: string
  apr: number
  initiationFee: number
  earlySettlementPenalty: number
  maxTermMonths: number
  requirements: string[]
}

// ── Telecom ──

export interface TelecomProvider extends Institution {
  coverageScore: number
  networkType: string
  bundles: DataBundle[]
  voiceRates: VoiceRate[]
  coverageCities: string[]
}

export interface DataBundle {
  id: string
  providerId: string
  providerName: string
  category: "daily" | "weekly" | "monthly" | "night" | "social" | "unlimited" | "internet"
  name: string
  price: number
  dataGB: number
  validityDays: number
  costPerGB: number
  speedClass: string
  fupNote: string
}

export interface VoiceRate {
  id: string
  providerId: string
  providerName: string
  type: "on_net" | "off_net" | "landline" | "international"
  ratePerMin: number
  smsRate: number
}

export interface CoverageMetric {
  providerId: string
  region: string
  coveragePercent: number
  avgSpeed: number
}

// ── Schools ──

export interface School {
  id: string
  name: string
  type: "boarding" | "day" | "both"
  curriculum: string[]
  province: string
  city: string
  tuitionPerTerm: number
  boardingFeePerTerm?: number
  totalAnnualCost: number
  passRate: number
  studentTeacherRatio: number
  facilities: string[]
  sports: string[]
  transparencyScore: number
  academicScore: number
  safetyScore: number
}

// ── Universities ──

export interface University {
  id: string
  name: string
  type: "university" | "college" | "polytechnic" | "teacher_training" | "private"
  province: string
  city: string
  annualFees: number
  applicationFee: number
  ranking: {
    local?: number
    global?: number
  }
  accreditationStatus: string
  acceptanceRate?: number
  academicScore: number
  affordabilityScore: number
  employabilityScore: number
  faculties: string[]
  programs: string[]
  accommodationAvailable: boolean
  onlineLearningAvailable: boolean
  studentLifeRating: number
  graduateEmployabilityScore: number
  applicationRequirements: string[]
}

// ── Insurance ──

export interface InsuranceProvider extends Institution {
  claimsScore: number
  avgClaimDays: number
  serviceAreas: string[]
}

export interface Policy {
  id: string
  providerId: string
  providerName: string
  category: "motor" | "medical" | "life_funeral" | "property_business"
  name: string
  monthlyPremium: number
  annualPremium: number
  excess: number
  waitingPeriodDays: number
  coverLimit: number
  benefits: string[]
  exclusions: string[]
  type: string
}

// ── Mobility ──

export interface CarDealership {
  id: string
  name: string
  city: string
  brands: string[]
  verified: boolean
  yearsActive: number
  stockCount: number
  financingAvailable: boolean
  rating: number
  phone: string
}

export interface Vehicle {
  id: string
  dealershipId: string
  dealershipName: string
  make: string
  model: string
  year: number
  price: number
  engineCC: number
  fuelType: "petrol" | "diesel" | "hybrid" | "electric"
  mileage: number
  transmission: "manual" | "automatic"
  color: string
  financingAvailable: boolean
  condition: "new" | "used"
  bestValue?: boolean
  location: string
  range?: number // for EVs
  batterySize?: number // for EVs
  owners?: number
}

export interface DrivingSchool {
  id: string
  name: string
  city: string
  pricePerLesson: number
  packagePrice: number
  lessonsInPackage: number
  passRate: number
  yearsActive: number
  verified: boolean
  phone: string
}

export interface BusRoute {
  id: string
  providerId: string
  providerName: string
  origin: string
  destination: string
  price: number
  durationHours: number
  departureTimes: string[]
  crossBorder: boolean
  borderCrossing?: string
  amenities: string[]
  busType: string
}

// ── App State ──

export interface UserPreference {
  scenario: "student" | "family" | "sme"
  priceVsQuality: number
  convenienceVsReputation: number
  shortTermVsLongTerm: number
}

export interface SavedComparison {
  id: string
  category: "banking" | "telecom" | "schools" | "insurance" | "universities" | "utilities" | "solar" | "mobility" | "transport" | "hotels"
  itemIds: string[]
  createdAt: string
  name: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface PricingSnapshot {
  id: string
  category: string
  uploadedBy: string
  uploadedAt: string
  recordCount: number
}

export interface Alert {
  id: string
  type: "price_drop" | "new_promo" | "fee_increase" | "claims_change"
  category: "banking" | "telecom" | "schools" | "insurance" | "utilities" | "solar" | "mobility" | "transport" | "hotels"
  itemId: string
  message: string
  createdAt: string
  read: boolean
}
