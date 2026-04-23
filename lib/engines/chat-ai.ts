import { getTransactionAdvice } from "./transaction-advisor"
import type { ChatMessage, AIAction } from "../types"

/**
 * Chat AI Engine
 * Logic for processing user intent and generating contextual responses with action cards.
 */

interface AIResponse {
  content: string
  actions?: AIAction[]
}

export function processUserIntention(input: string, userBankId: string = "stanbic"): AIResponse {
  const lower = input.toLowerCase()

  // 1. Transaction Advisory Intent
  if (lower.includes("send") || lower.includes("transfer") || lower.includes("pay") || lower.includes("cost of")) {
    const amountMatch = lower.match(/\$?(\d+)/)
    const amount = amountMatch ? parseInt(amountMatch[1]) : 100
    const advice = getTransactionAdvice(amount, userBankId)
    const best = advice.find(a => a.isBest)

    return {
      content: `I've analyzed the costs for sending $${amount}. The cheapest method is **${best?.methodName}** via ${best?.bankName}, with a total cost of **$${best?.total.toFixed(2)}** (including $${best?.fee.toFixed(2)} fee and $${best?.tax.toFixed(2)} IMTT tax).`,
      actions: [
        { type: "transact", label: `Initiate $${amount} ${best?.methodName}`, payload: { amount, methodId: best?.methodId, bankId: userBankId } },
        { type: "compare", label: "See Full Fee Breakdown", payload: { category: "banking", subcategory: "fees" } }
      ]
    }
  }

  // 2. Comparison Intent
  if (lower.includes("compare") || lower.includes("which bank") || lower.includes("best bank") || lower.includes("cheapest bank")) {
    return {
      content: "I can help you compare banking products. Based on transparency and digital features, Stanbic and CABS are currently leading. Would you like to see a detailed side-by-side comparison?",
      actions: [
        { type: "compare", label: "Compare Top Banks", payload: { category: "banking", subcategory: "accounts" } },
        { type: "compare", label: "Compare ZIPIT Fees", payload: { category: "banking", subcategory: "fees" } }
      ]
    }
  }

  // 3. Service Application Intent
  if (lower.includes("apply") || lower.includes("medical aid") || lower.includes("insurance") || lower.includes("loan")) {
    const sector = lower.includes("medical") ? "medical" : lower.includes("insurance") ? "insurance" : "loan"
    return {
      content: `I can help you start your application for ${sector} services. I'll guide you through the process and connect you with the best provider.`,
      actions: [
        { type: "apply", label: `Apply for ${sector}`, payload: { type: sector } }
      ]
    }
  }

  // 4. Alert Intent
  if (lower.includes("alert") || lower.includes("notify") || lower.includes("price change")) {
    return {
      content: "I can set up smart alerts for you via SMS or WhatsApp. You'll be notified immediately of any price drops or fee changes in your selected categories.",
      actions: [
        { type: "alert", label: "Set Up Price Alerts", payload: { category: "all" } }
      ]
    }
  }

  // Default Response
  return {
    content: "I'm your Fintech AI advisor. I can help you find the cheapest transaction methods, compare services, set up alerts, or start applications for medical aid and insurance. What would you like to do today?",
    actions: [
      { type: "compare", label: "Compare Banks", payload: { category: "banking" } },
      { type: "transact", label: "Calculate Transaction Costs", payload: { amount: 100 } }
    ]
  }
}
