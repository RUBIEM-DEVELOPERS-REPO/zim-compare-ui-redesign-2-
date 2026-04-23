// ── Fintech Types ──

export type Role = "guest" | "registered" | "paid" | "admin" | "ai" | "corporate"

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
<<<<<<< Updated upstream
  providerId: string
  providerName: string
  category: "daily" | "weekly" | "monthly" | "night" | "social" | "unlimited" | "internet"
  name: string
=======
  operator: string
  currency: string
  bundle_group: string
  bundle_name: string
>>>>>>> Stashed changes
  price: number
  validity_type: string
  validity_value: number
  validity_unit: string
  total_data_mb: number
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

export interface PricingUpdate {
  id: string
  provider: string
  item: string
  old: string
  new: string
  status: "pending" | "approved" | "rejected"
  category: string
  createdAt: string
}

export interface Alert {
  id: string
  type: "price_drop" | "new_promo" | "fee_increase" | "claims_change" | "transaction" | "application"
  category: "banking" | "telecom" | "schools" | "insurance" | "utilities" | "solar" | "mobility" | "transport" | "hotels"
  itemId?: string
  message: string
  createdAt: string
  read: boolean
  channel?: "in_app" | "sms" | "whatsapp"
  status?: "sent" | "delivered" | "failed"
  isPaid?: boolean
}

export interface AlertPreference {
  id: string
  userId: string
  category: string
  channels: ("in_app" | "sms" | "whatsapp")[]
  active: boolean
}

// ── Transactions ──

export interface TransactionMethod {
  id: string
  name: string // ATM, Swipe, ZIPIT, RTGS, Mobile Money
  speed: "instant" | "fast" | "same_day" | "next_day"
  category: "online" | "physical" | "both"
}

export interface TransactionQuote {
  methodId: string
  methodName: string
  bankId: string
  bankName: string
  amount: number
  fee: number
  tax: number // e.g. IMTT
  levy: number
  total: number
  isBest?: boolean
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

// ── Service Applications ──

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

// ── Regulated Prices & Taxes ──

export interface RegulatedPrice {
  id: string
  category: string
  item: string
  regulatedPrice: number
  unit: string
  lastUpdated: string
}

export interface TaxLevy {
  id: string
  name: string
  sector: string
  rate: number
  type: "percentage" | "fixed"
  appliesTo: string
}
// ── News & Ads ──

export interface NewsItem {
  id: string
  title: string
  source: string // Maps to Category
  time: string
  link: string
  category: string
  description?: string
  tag?: "New" | "Promo" | "Update"
  image?: string
  createdAt: string
}
