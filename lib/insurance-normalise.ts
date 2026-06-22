/**
 * Insurance Normalisation Layer
 * ─────────────────────────────
 * Runs on every manual-entry POST before the record is written to
 * the `Policy` table. Ensures data is clean, complete, and ready
 * for the consumer-facing comparison interface.
 */

export interface RawInsuranceInput {
  providerName: string
  category: string        // motor | medical | life_funeral | property_business | business | agriculture | travel
  type: string            // plan sub-type e.g. "Comprehensive"
  name: string
  monthlyPremium?: number | string
  annualPremium?: number | string
  excess?: number | string
  waitingPeriodDays?: number | string
  coverLimit?: number | string
  benefits?: string       // comma-separated or JSON string
  exclusions?: string     // comma-separated or JSON string
  currency?: string
  // Category-specific extras (stored inside benefits or as standalone)
  copayPercent?: number | string
  annualLimit?: number | string
  funeralPayoutLimit?: number | string
  cashbackOption?: boolean | string
  propertyValue?: number | string
  seasonalCover?: boolean | string
  tripDurationDays?: number | string
  destinationRegion?: string
}

export interface NormalisedPolicy {
  providerName: string
  category: string
  type: string
  name: string
  monthlyPremium: number
  annualPremium: number
  excess: number
  waitingPeriodDays: number
  coverLimit: number
  benefits: string        // JSON stringified array
  exclusions: string      // JSON stringified array
  currency: string
  isManual: true
  normalisedScore: number  // coverLimit / annualPremium
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toFloat(val: any, fallback = 0): number {
  if (val === undefined || val === null || val === "") return fallback
  const n = typeof val === "string" ? parseFloat(val.replace(/[,$]/g, "")) : Number(val)
  return isNaN(n) ? fallback : n
}

function toInt(val: any, fallback = 0): number {
  if (val === undefined || val === null || val === "") return fallback
  const n = parseInt(String(val), 10)
  return isNaN(n) ? fallback : n
}

function toBoolean(val: any): boolean {
  if (typeof val === "boolean") return val
  if (typeof val === "string") return val.toLowerCase() === "true" || val === "1"
  return Boolean(val)
}

/**
 * Parses benefits / exclusions input:
 * - If already a JSON array string → parse, deduplicate, re-stringify
 * - If a comma-separated string → split, trim, deduplicate, stringify
 * - Empty / invalid → "[]"
 */
function parseListField(raw?: string): string {
  if (!raw || raw.trim() === "") return "[]"

  // Try JSON parse first
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      const cleaned = [...new Set(parsed.map((s: any) => String(s).trim()).filter(Boolean))]
      return JSON.stringify(cleaned)
    }
  } catch {
    // Not JSON — treat as comma-separated
  }

  const items = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
  const unique = [...new Set(items)]
  return JSON.stringify(unique)
}

/**
 * Title-cases a string: "old mutual" → "Old Mutual"
 */
function titleCase(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Validates that the category is one of the 7 allowed values.
 */
const VALID_CATEGORIES = [
  "motor",
  "medical",
  "life_funeral",
  "property_business",
  "business",
  "agriculture",
  "travel",
]

// ── Main normalisation function ───────────────────────────────────────────────

export function normalisePolicy(raw: RawInsuranceInput): NormalisedPolicy {
  // --- Provider name ---
  const providerName = titleCase(raw.providerName || "Unknown Provider")

  // --- Category ---
  const category = VALID_CATEGORIES.includes(raw.category) ? raw.category : "motor"

  // --- Type (plan sub-type) ---
  const type = (raw.type || "").trim()

  // --- Name ---
  const name = (raw.name || "").trim() || `${providerName} ${type || category} Policy`

  // --- Currency ---
  const currency = (raw.currency || "USD").toUpperCase().trim()

  // --- Premiums ---
  let monthlyPremium = toFloat(raw.monthlyPremium)
  let annualPremium = toFloat(raw.annualPremium)

  // Auto-derive whichever is missing
  if (monthlyPremium > 0 && annualPremium === 0) {
    annualPremium = parseFloat((monthlyPremium * 12).toFixed(2))
  } else if (annualPremium > 0 && monthlyPremium === 0) {
    monthlyPremium = parseFloat((annualPremium / 12).toFixed(2))
  }

  // --- Excess ---
  const excess = toFloat(raw.excess, 0)

  // --- Waiting period ---
  const waitingPeriodDays = toInt(raw.waitingPeriodDays, 0)

  // --- Cover limit ---
  // Use explicit coverLimit, fall back to annualLimit or funeralPayoutLimit or propertyValue
  let coverLimit = toFloat(raw.coverLimit)
  if (coverLimit === 0) {
    coverLimit =
      toFloat(raw.annualLimit) ||
      toFloat(raw.funeralPayoutLimit) ||
      toFloat(raw.propertyValue) ||
      0
  }

  // --- Benefits ---
  // Merge category-specific extras into the benefits list
  let benefitsList: string[] = []
  try {
    const parsed = JSON.parse(parseListField(raw.benefits))
    if (Array.isArray(parsed)) benefitsList = parsed
  } catch {
    benefitsList = []
  }

  // Append category-specific extras as human-readable benefit tags
  if (raw.copayPercent !== undefined && toFloat(raw.copayPercent) > 0) {
    benefitsList.push(`${toFloat(raw.copayPercent)}% Co-pay`)
  }
  if (raw.annualLimit !== undefined && toFloat(raw.annualLimit) > 0 && !raw.coverLimit) {
    benefitsList.push(`Annual Limit: ${currency} ${toFloat(raw.annualLimit).toLocaleString()}`)
  }
  if (raw.funeralPayoutLimit !== undefined && toFloat(raw.funeralPayoutLimit) > 0) {
    benefitsList.push(`Funeral Payout: ${currency} ${toFloat(raw.funeralPayoutLimit).toLocaleString()}`)
  }
  if (raw.cashbackOption !== undefined && toBoolean(raw.cashbackOption)) {
    benefitsList.push("Cashback Option")
  }
  if (raw.propertyValue !== undefined && toFloat(raw.propertyValue) > 0) {
    benefitsList.push(`Property Value: ${currency} ${toFloat(raw.propertyValue).toLocaleString()}`)
  }
  if (raw.seasonalCover !== undefined && toBoolean(raw.seasonalCover)) {
    benefitsList.push("Seasonal Cover")
  }
  if (raw.tripDurationDays !== undefined && toInt(raw.tripDurationDays) > 0) {
    benefitsList.push(`Trip Duration: ${toInt(raw.tripDurationDays)} days`)
  }
  if (raw.destinationRegion) {
    benefitsList.push(`Destination: ${raw.destinationRegion.trim()}`)
  }

  const benefits = JSON.stringify([...new Set(benefitsList.filter(Boolean))])

  // --- Exclusions ---
  const exclusions = parseListField(raw.exclusions)

  // --- Normalised score ---
  // coverLimit / annualPremium — higher = more coverage per dollar paid
  const normalisedScore =
    annualPremium > 0 ? parseFloat((coverLimit / annualPremium).toFixed(4)) : 0

  return {
    providerName,
    category,
    type,
    name,
    monthlyPremium,
    annualPremium,
    excess,
    waitingPeriodDays,
    coverLimit,
    benefits,
    exclusions,
    currency,
    isManual: true,
    normalisedScore,
  }
}
