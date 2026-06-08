import { regulatedPrices } from "../mock/regulated"

/**
 * Moderation Engine
 * Logic for validating proposed price updates against regulated caps.
 */

export interface ValidationResult {
  isValid: boolean
  message?: string
  severity: "info" | "warning" | "error"
}

export function validatePriceUpdate(category: string, item: string, proposedPrice: number): ValidationResult {
  const regulation = regulatedPrices.find(r => 
    r.category.toLowerCase() === category.toLowerCase() && 
    r.item.toLowerCase().includes(item.toLowerCase())
  )

  if (!regulation) {
    return {
      isValid: true,
      severity: "info",
      message: "No specific regulation found for this item. Proceed with standard market review."
    }
  }

  // Check if proposed price exceeds regulated cap
  if (proposedPrice > regulation.regulatedPrice) {
    const variance = ((proposedPrice - regulation.regulatedPrice) / regulation.regulatedPrice) * 100
    
    return {
      isValid: false,
      severity: "error",
      message: `Refused: Proposed price ($${proposedPrice}) exceeds the regulated cap ($${regulation.regulatedPrice}) by ${variance.toFixed(1)}%. This violates statutory price markers.`
    }
  }

  // Warning for being very close to cap
  if (proposedPrice > regulation.regulatedPrice * 0.95) {
    return {
      isValid: true,
      severity: "warning",
      message: "Caution: Proposed price is within 5% of the regulated cap. Ensure strict adherence to compliance reporting."
    }
  }

  return {
    isValid: true,
    severity: "info",
    message: "Proposed price is within regulated limits."
  }
}
