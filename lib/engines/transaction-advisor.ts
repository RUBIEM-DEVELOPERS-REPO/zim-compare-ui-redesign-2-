import { bankFees } from "../mock/banks"
import type { TransactionQuote, TransactionMethod } from "../types"

/**
 * Transaction Advisory Engine
 * Calculates the best method for a transaction based on cost and speed.
 */

export const TRANSACTION_METHODS: TransactionMethod[] = [
  { id: "zipit", name: "ZIPIT", speed: "instant", category: "online" },
  { id: "swipe", name: "Swipe / POS", speed: "instant", category: "physical" },
  { id: "rtgs", name: "RTGS Transfer", speed: "same_day", category: "online" },
  { id: "atm", name: "ATM Withdrawal", speed: "instant", category: "physical" },
  { id: "mobile", name: "Mobile Money", speed: "instant", category: "online" },
]

const IMTT_RATE = 0.02 // 2% for USD, 1.5% for ZiG. Defaulting to 2% for conservative estimate.
const LEVY_FIXED = 0.05 // Standard small levy if applicable

export function getTransactionAdvice(
  amount: number,
  userBankId: string,
  currency: "USD" | "ZiG" = "USD"
): TransactionQuote[] {
  const taxRate = currency === "USD" ? 0.02 : 0.015

  const quotes: TransactionQuote[] = TRANSACTION_METHODS.map((method) => {
    let fee = 0
    let tax = amount * taxRate
    let levy = LEVY_FIXED

    // Find bank-specific fee for this method if available
    const bankFee = bankFees.find(
      (f) => f.bankId === userBankId && f.name.toLowerCase().includes(method.name.toLowerCase())
    )

    if (bankFee) {
      fee = bankFee.amount
    } else {
      // Default industry caps as per RBZ 2026
      if (method.id === "atm") fee = amount * 0.02
      if (method.id === "swipe") fee = Math.min(amount * 0.015, 20)
      if (method.id === "rtgs") fee = currency === "USD" ? 1.0 : 0.8
      if (method.id === "zipit") fee = 1.25 // Common flat fee
      if (method.id === "mobile") fee = amount * 0.03 // Typical mobile money fee
    }

    // Taxes often don't apply to ATM withdrawals (cash is already taxed upon entry or at source)
    // but in ZIM, IMTT applies to electronic transfers.
    if (method.id === "atm") tax = 0 

    const total = amount + fee + tax + levy

    return {
      methodId: method.id,
      methodName: method.name,
      bankId: userBankId,
      bankName: "Your Bank", // Placeholder, would be resolved by ID
      amount,
      fee,
      tax,
      levy,
      total,
    }
  })

  // Sort by total cost (ascending)
  quotes.sort((a, b) => a.total - b.total)

  // Mark the best one
  if (quotes.length > 0) {
    quotes[0].isBest = true
  }

  return quotes
}

export function formatQuoteReasoning(quote: TransactionQuote): string {
  if (quote.methodId === "zipit") {
    return "Cheapest instant electronic method for small to medium amounts."
  }
  if (quote.methodId === "rtgs") {
    return "Best for large amounts due to flat fee structure."
  }
  if (quote.methodId === "atm") {
    return "Zero electronic tax (IMTT), but limited by daily withdrawal caps."
  }
  return "Reliable and widely accepted."
}
