import { Role } from "./types"

/**
 * ZIM-COMPARE Validation Rules
 */

export interface ValidationError {
  field: string
  message: string
}

export const validateRequired = (value: any, fieldName: string): ValidationError | null => {
  if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
    return { field: fieldName, message: `${fieldName} is required.` }
  }
  return null
}

export const validatePrice = (value: number | string, fieldName: string): ValidationError | null => {
  const price = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(price)) {
    return { field: fieldName, message: `${fieldName} must be a valid number.` }
  }
  if (price < 0) {
    return { field: fieldName, message: `${fieldName} cannot be negative.` }
  }
  return null
}

export const validateDate = (value: string, fieldName: string): ValidationError | null => {
  const date = new Date(value)
  if (isNaN(date.getTime())) {
    return { field: fieldName, message: `${fieldName} is not a valid date.` }
  }
  return null
}

/**
 * Role-Based Validation Guards
 */

export const canSubmitConsumerData = (role: Role) => {
  return ["registered", "paid", "admin"].includes(role)
}

export const canManageCorporateData = (role: Role) => {
  return ["corporate", "admin"].includes(role)
}

export const canApproveGlobalData = (role: Role) => {
  return role === "admin"
}

/**
 * Anti-Fraud / Suspicious Entry Check (Mock)
 */
export const isSuspiciousEntry = (data: any): boolean => {
  // Mock check for duplicate entries or extremely high price jumps
  if (data.price > 1000000) return true
  if (data.notes && data.notes.includes("spam")) return true
  return false
}
