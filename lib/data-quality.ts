/**
 * ZIM-COMPARE Data Quality & Verification Engine
 */

export interface VerificationResult {
  status: 'verified' | 'dirty' | 'rejected'
  reason?: string
}

// Phrases indicating invalid or auto-scraped error content
const BLOCKED_PHRASES = [
  // 404 / Page not found
  "404", "page not found", "not found", "error 404", "404 -",
  
  // Access restricted
  "access restricted", "access denied", "forbidden", "unauthorized", 
  "permission denied", "security challenge", "verify you are human",
  
  // Browser errors
  "browser error", "javascript is required", "enable javascript", 
  "cloudflare", "ddos protection", "checking your browser", "connection timed out",
  
  // Copyright/footer text
  "all rights reserved", "copyright ©", "powered by", "designed by", "theme by", "footer",
  
  // Domain sale pages
  "domain is for sale", "buy this domain", "domain sale", "this domain is parked",
  
  // Biographies
  "biography", "born in", "studied at", "career", "graduated from", 
  "executive profile", "chief executive", "managing director",
  
  // Investor pages
  "investor relations", "annual report", "financial statements", "shareholders",
  
  // News-only pages
  "breaking news", "press release", "news article", "posted on", "latest news",
  
  // Navigation text
  "navbar", "sidebar", "click here", "back to top", "privacy policy"
]

/**
 * Checks if a string contains any of the blocked phrases.
 */
function containsBlockedPhrase(text: string): string | null {
  const normalized = text.toLowerCase()
  for (const phrase of BLOCKED_PHRASES) {
    if (normalized.includes(phrase)) {
      return phrase
    }
  }
  return null
}

/**
 * Validates price value to ensure it isn't an incorrect mapping (e.g. phone numbers, years, capacity).
 */
function validatePriceValue(value: any): string | null {
  if (value === undefined || value === null) return null
  
  // If price is passed as a string, check for data capacity keywords mapped as price
  if (typeof value === "string") {
    const lower = value.toLowerCase()
    if (lower.includes("mb") || lower.includes("gb") || lower.includes("mbps")) {
      return "price column contains capacity unit (MB/GB/Mbps)"
    }
    const parsed = parseFloat(value)
    if (isNaN(parsed)) return "price is not a valid number"
    value = parsed
  }

  if (typeof value === "number") {
    if (isNaN(value)) return "price is NaN"
    if (value < 0) return "price cannot be negative"
    
    // Check if the price looks like a year (e.g. 2024, 2025, 2026)
    if (value >= 2020 && value <= 2030) {
      return `price value (${value}) looks like a calendar year`
    }
    
    // Check if the price looks like a phone number (e.g. starting with ZW country code 263... or similar long numbers)
    if (value > 100000 && String(value).startsWith("263")) {
      return `price value (${value}) looks like a telephone number`
    }
    
    // Abnormally high pricing for standard products (safety cap)
    if (value > 10000000) {
      return `price value ($${value}) is abnormally high`
    }
  }
  return null
}

/**
 * Audits a database or scraper record against validation rules
 */
export function verifyDataQuality(record: any, category: string): VerificationResult {
  if (!record) {
    return { status: 'rejected', reason: 'Record is empty' }
  }

  // 1. Audit Text Fields for Blocked Phrases
  const fieldsToScan = [
    record.name,
    record.description,
    record.notes,
    record.providerName,
    record.bankName,
    record.category,
    record.bundle_name,
    record.bundle_group
  ]

  for (const field of fieldsToScan) {
    if (typeof field === "string") {
      const match = containsBlockedPhrase(field)
      if (match) {
        return { 
          status: 'rejected', 
          reason: `Contains restricted page/navigation text: "${match}"` 
        }
      }
    }
  }

  // 2. Audit Price Fields
  const priceFields = [
    record.price,
    record.amount,
    record.monthlyPremium,
    record.annualPremium,
    record.tuitionPerTerm,
    record.boardingFeePerTerm,
    record.totalAnnualCost,
    record.pricePerLesson,
    record.packagePrice,
    record.ratePerMin,
    record.smsRate,
    record.monthlyFee,
    record.minBalance
  ]

  for (const val of priceFields) {
    const err = validatePriceValue(val)
    if (err) {
      return { status: 'rejected', reason: err }
    }
  }

  // 3. Module/Category Cross-Mapping Check
  if (category === "telecom") {
    // A telecom bundle should not have bank fields
    if (record.bankName || record.interestRate !== undefined) {
      return { status: 'rejected', reason: 'Incorrect module mapping (bank fields in telecom)' }
    }
  }

  if (category === "banking") {
    // A banking product should not have data volume in GB/MB
    if (record.total_data_mb !== undefined || record.operator !== undefined) {
      return { status: 'rejected', reason: 'Incorrect module mapping (telecom fields in banking)' }
    }
  }

  return { status: 'verified' }
}

/**
 * Helper to filter arrays of records dynamically to only return verified records.
 */
export function filterVerifiedRecords<T>(records: T[], category: string): T[] {
  return records.filter(record => verifyDataQuality(record, category).status === 'verified')
}
