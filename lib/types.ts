// ── Fintech Types ──

export type Role = "guest" | "registered" | "paid" | "admin" | "corporate" | "regulator"

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
  logo?: string | null
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
  internalTransferFee?: number
  externalTransferFee?: number
  recommendationScore?: number
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
  aiScore?: number
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
  loanInterestRate?: number // explicit alias for apr if needed
  benefits?: string[] // alias for perks
}

// ── Telecom ──

export interface TelecomProvider extends Institution {
  coverageScore: number
  networkType: string
  bundles: DataBundle[]
  voiceRates: VoiceRate[]
  coverageCities: string[] | string
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
  bundle_name?: string
  operator?: string
  bundle_group?: string
  currency?: string
  validity_type?: string
  validity_value?: number
  validity_unit?: string
  total_data_mb?: number
  peak_data_mb?: number | null
  offpeak_data_mb?: number | null
  onnet_minutes?: number | null
  other_minutes?: number | null
  cug_minutes?: number | null
  international_minutes?: number | null
  sms_count?: number | null
  facebook_mb?: number | null
  instagram_mb?: number | null
  x_mb?: number | null
  extras?: string | null
  ussd_code?: string | null
  source_url?: string | null
  source_name?: string | null
  provider?: TelecomProvider
}

export interface VoiceRate {
  id: string
  providerId?: string
  providerName?: string
  type?: "on_net" | "off_net" | "landline" | "international"
  ratePerMin?: number
  smsRate?: number
  operator?: string
  currency?: string
  offer_type?: string
  bundle_group?: string
  bundle_name?: string
  price?: number
  validity_type?: string
  validity_value?: number
  validity_unit?: string
  onnet_minutes?: number | null
  other_minutes?: number | null
  cug_minutes?: number | null
  international_minutes?: number | null
  sms_count?: number | null
  ussd_code?: string | null
  source_url?: string | null
  source_name?: string | null
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
  recommendationScore: number
  ranking: number
}

// ── Universities ──

export interface University {
  id: string
  university: string
  location: string
  provinceArea: string
  type: string
  programmeSummary?: string | null
  feeMinUSD?: number | null
  feeMaxUSD?: number | null
  feeNote?: string | null
  feeConfidence?: string | null
  programmeSourceUrl?: string | null
  // Additional metrics
  annualFees?: number | null
  acceptanceRate?: number | null
  academicScore?: number | null
  affordabilityScore?: number | null
  employabilityScore?: number | null
  studentLifeRating?: number | null
  graduateEmployabilityScore?: number | null
  accommodationAvailable?: boolean | null
  onlineLearningAvailable?: boolean | null
  faculties?: string[] | null
  city?: string | null
  province?: string | null
  applicationFee?: number | null
  ranking?: {
    local?: number | null
    global?: number | null
  } | null
  accreditationStatus?: string | null
  programs?: string[] | null
  applicationRequirements?: string[] | null
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
  category: "motor" | "medical" | "life_funeral" | "property_business" | "business" | "agriculture" | "travel"
  name: string
  monthlyPremium: number
  annualPremium: number
  excess: number
  waitingPeriodDays: number
  coverLimit: number
  benefits: string[]
  exclusions: string[]
  type: string
  matchScore?: number
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

export interface AIAction {
  type: "compare" | "apply" | "transact" | "alert"
  payload: any
  label: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  actions?: AIAction[]
  attachments?: {
    type: "image" | "audio" | "video" | "file"
    url: string
    name: string
    size?: string
  }[]
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
  type: "price_drop" | "new_promo" | "fee_increase" | "claims_change" | "transaction" | "application"
  category: "banking" | "telecom" | "schools" | "insurance" | "utilities" | "solar" | "mobility" | "transport" | "hotels"
  itemId?: string
  message: string
  createdAt: string
  read: boolean
  channel?: "email" | "sms" | "app" | "push"
  status?: "active" | "resolved" | "dismissed"
}

export interface AlertPreference {
  id: string
  userId: string
  category: string
  channels: ("in_app" | "sms" | "whatsapp")[]
  active: boolean
}

export interface Transaction {
  id: string
  userId: string
  bankId: string
  methodId: string
  amount: number
  fee: number
  tax: number
  total: number
  status: "pending" | "completed" | "failed"
  createdAt: string
}

export interface ServiceApplication {
  id: string
  userId: string
  providerId: string
  providerName: string
  serviceType: "medical" | "insurance" | "telecom" | "utility" | "education"
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected"
  currentStep: number
  data: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface PricingUpdate {
  id: string
  provider: string
  item: string
  old: string
  new: string
  status: "pending" | "approved" | "rejected" | "submitted"
  category: string
  createdAt: string
}

// ── Transaction Advisory ──

export interface TransactionMethod {
  id: string
  name: string
  speed: "instant" | "same_day" | "next_day"
  category: "online" | "physical"
}

export interface TransactionQuote {
  methodId: string
  methodName: string
  bankId: string
  bankName: string
  amount: number
  fee: number
  tax: number
  levy: number
  total: number
  isBest?: boolean
}

// ── Regulated Prices ──

export interface RegulatedPrice {
  id: string
  category: string
  item: string
  regulatedPrice: number
  unit: string
  lastUpdated: string
}

// ── Taxes & Levies ──

export interface TaxLevy {
  id: string
  name: string
  sector: string
  rate: number
  type: "percentage" | "fixed"
  appliesTo: string
}
