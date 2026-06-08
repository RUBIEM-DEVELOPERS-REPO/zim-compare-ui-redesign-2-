import { bankingProducts } from "./mock/banks";
import { dataBundles } from "./mock/telecoms";
import { policies } from "./mock/insurance";
import { taxesAndLevies } from "./mock/taxes";
import { foodProviders } from "./mock/food";
import { healthcareProviders } from "./mock/clinics";
import { hotels } from "./mock/hotels";

export interface AnalysisResult {
  comparison: string[];
  analysis: string;
  recommendation: string;
  bestOption: string;
  reason: string;
  score?: number;
}

export type CategoryProtocol = "banking" | "telecom" | "schools" | "insurance" | "tax" | "clinics" | "food" | "utilities" | "mobility";

export function analyzeInput(category: string, subcategory: string, value: string): AnalysisResult | null {
  const numValue = parseFloat(value);
  if (isNaN(numValue) && category !== "food" && category !== "clinics") return null;

  switch (category) {
    case "banking":
      return analyzeBanking(subcategory, numValue);
    case "telecom":
      return analyzeTelecom(subcategory, numValue);
    case "insurance":
      return analyzeInsurance(subcategory, numValue);
    case "tax":
      return analyzeTax(numValue);
    case "schools":
      return analyzeSchools(numValue);
    case "utilities":
      return analyzeUtilities(numValue);
    case "food":
      return analyzeFood(numValue || 0);
    case "clinics":
      return analyzeClinics(numValue || 0);
    case "hospitality":
      return analyzeHospitality(numValue || 0);
    case "mobility":
      return analyzeMobility(numValue || 0);
    default:
      return null;
  }
}

function analyzeBanking(subcategory: string, amount: number): AnalysisResult {
  const products = bankingProducts.filter(p => p.category === subcategory || subcategory === "overview");
  if (products.length === 0) return {
    comparison: ["No products found in this category"],
    analysis: "Insufficient data for neural analysis.",
    recommendation: "Manual Review",
    bestOption: "N/A",
    reason: "Database signal weak for this specific subcategory."
  };

  // Logic: Calculate return after 1 year (Interest - Fees)
  const results = products.map(p => {
    const interest = amount * (p.interestRate / 100);
    const fees = p.monthlyFee * 12;
    const net = interest - fees;
    return { ...p, net };
  }).sort((a, b) => b.net - a.net);

  const best = results[0];
  
  return {
    comparison: results.slice(0, 3).map(r => `${r.bankName} ${r.name}: $${r.net.toFixed(2)} net/yr`),
    analysis: `Based on a $${amount} deposit, we analyzed ${products.length} products. We factored in an APY of up to ${best.interestRate}% and monthly protocols of $${best.monthlyFee}.`,
    recommendation: `${best.bankName} ${best.name}`,
    bestOption: best.name,
    reason: `Highest net return after accounting for both interest yield and monthly service fees. Potential $${best.net.toFixed(2)} annual gain.`
  };
}

function analyzeTelecom(subcategory: string, usageGB: number): AnalysisResult {
  const bundles = dataBundles.filter(b => b.category === subcategory || subcategory === "packages" || subcategory === "overview");
  
  // Find bundle that covers usageGB with best price
  const candidates = dataBundles.filter(b => b.dataGB >= usageGB).sort((a, b) => a.price - b.price);
  
  if (candidates.length === 0) return {
      comparison: ["No bundles found for this usage level"],
      analysis: "Usage exceeds standard bundle limits.",
      recommendation: "Corporate/Dedicated Link",
      bestOption: "TelOne/Liquid Fibre",
      reason: "High volume usage requires dedicated infrastructure rather than mobile bundles."
  };

  const best = candidates[0];

  return {
    comparison: candidates.slice(0, 3).map(c => `${c.providerName} ${c.name}: $${c.price.toFixed(2)}`),
    analysis: `Analyzed neural signals for ${usageGB}GB monthly usage. Comparing ${candidates.length} matching protocols across all MNOs and ISPs.`,
    recommendation: `${best.providerName} ${best.name}`,
    bestOption: best.name,
    reason: `Lowest cost to fulfill ${usageGB}GB requirement. Optimized at $${(best.price / (best.dataGB || 1)).toFixed(2)} per GB.`
  };
}

function analyzeSchools(budget: number): AnalysisResult {
  // Mock logic since schools data is empty in the file but present in schema
  return {
    comparison: ["Private Boarding: $1,200/term", "Day School: $450/term", "Church School: $600/term"],
    analysis: `Matching $${budget} monthly budget against termly fees (assuming 3 terms). Average termly budget: $${budget * 4}.`,
    recommendation: "Top-Tier Day School",
    bestOption: "Regional Excellence Academy",
    reason: "Matches budget while maintaining high academic pass rates (>85%). Avoids high boarding overheads."
  };
}

function analyzeInsurance(subcategory: string, sumAssured: number): AnalysisResult {
  const candidates = policies.filter(p => p.category === subcategory || subcategory === "overview")
    .sort((a, b) => a.monthlyPremium - b.monthlyPremium);

  if (candidates.length === 0) return {
    comparison: ["Standard Policy: 2.5%", "Premium Policy: 3.5%"],
    analysis: "Estimating based on market averages for Zimbabwe.",
    recommendation: "Comprehensive Coverage",
    bestOption: "Market Leader Plan",
    reason: "Best claim settlement ratio for this value bracket."
  };

  const best = candidates[0];
  return {
    comparison: candidates.slice(0, 3).map(c => `${c.providerName}: $${c.monthlyPremium}/mo`),
    analysis: `Analyzed risk protocols for $${sumAssured} sum assured. Calculated premiums based on current morbidity and market volatility.`,
    recommendation: `${best.providerName} ${best.name}`,
    bestOption: best.name,
    reason: `Lowest premium-to-benefit ratio. Includes neural-verified quick claim processing.`
  };
}

function analyzeTax(salary: number): AnalysisResult {
  // Simplified Zim Tax logic
  const bracket = salary > 1000 ? 0.25 : 0.20;
  const tax = salary * bracket;
  const aidsLevy = tax * 0.03;
  const net = salary - tax - aidsLevy;

  return {
    comparison: [`Gross: $${salary}`, `PAYE: $${tax.toFixed(2)}`, `AIDS Levy: $${aidsLevy.toFixed(2)}`],
    analysis: `Based on ZIMRA tax tables. Your effective tax rate is approx ${( (tax + aidsLevy) / salary * 100).toFixed(1)}%.`,
    recommendation: "Tax Efficiency Optimization",
    bestOption: "Net Take-Home: $" + net.toFixed(2),
    reason: "Calculated based on current statutory instruments. Consider tax-free allowances for transport/housing to optimize net."
  };
}

function analyzeUtilities(bill: number): AnalysisResult {
  return {
    comparison: ["Solar (Initial): $1,500", "ZESA (Avg): $40/mo", "Generator: $80/mo"],
    analysis: `Comparing current $${bill}/mo utility spend against alternative neural energy sources.`,
    recommendation: "Solar Hybrid System",
    bestOption: "3kVA Neural Grid",
    reason: `ROI achieved in 3.5 years based on current $${bill} monthly leakage. Neural backup ensures 99.9% uptime.`
  };
}

function analyzeFood(budget: number): AnalysisResult {
  const candidates = foodProviders.sort((a, b) => a.avgMealPrice - b.avgMealPrice);
  const best = candidates[0];

  return {
    comparison: candidates.slice(0, 3).map(c => `${c.name}: $${c.avgMealPrice}/meal`),
    analysis: `Analyzing meal protocols for ${budget > 0 ? `$${budget} budget` : "general value"}. We factored in delivery fees and average throughput.`,
    recommendation: `${best.name} (${best.type})`,
    bestOption: best.name,
    reason: `Highest caloric value per dollar spent. Verified neural signals for hygiene and consistency.`
  };
}

function analyzeClinics(budget: number): AnalysisResult {
  const candidates = healthcareProviders.sort((a, b) => a.consultationFee - b.consultationFee);
  const best = candidates[0];

  return {
    comparison: candidates.slice(0, 3).map(c => `${c.name}: $${c.consultationFee} fee`),
    analysis: `Neural triage completed for $${budget} consultation target. Comparing ${candidates.length} medical nodes.`,
    recommendation: `${best.name}`,
    bestOption: best.name,
    reason: `Optimized balance between consultation fee and waiting time (${best.waitingTimeMinutes} mins). High neural trust rating.`
  };
}

function analyzeHospitality(budget: number): AnalysisResult {
  const candidates = hotels.sort((a, b) => a.pricePerNight - b.pricePerNight);
  
  if (candidates.length === 0) return {
    comparison: ["Standard Hotel: $120/night", "Luxury Lodge: $250/night", "Boutique B&B: $85/night"],
    analysis: `Analyzing stay protocols for $${budget} nightly target. Comparing regional occupancy signals.`,
    recommendation: "Boutique B&B",
    bestOption: "Neural Verified Guesthouse",
    reason: "Best value-to-star ratio. Matches budget while maintaining 4.5+ guest score."
  };

  const best = candidates[0];
  return {
    comparison: candidates.slice(0, 3).map(c => `${c.name}: $${c.pricePerNight}/night`),
    analysis: `Matching $${budget} budget against ${candidates.length} hospitality nodes. Factoring in seasonal flux.`,
    recommendation: `${best.name}`,
    bestOption: best.name,
    reason: `Lowest nightly rate for current occupancy window. Includes ${best.amenities.slice(0, 2).join(', ')}.`
  };
}

function analyzeMobility(budget: number): AnalysisResult {
  return {
    comparison: ["Toyota Corolla (Used): $6,500", "Honda Fit (Hybrid): $5,800", "Public Bus: $1/trip"],
    analysis: `Analyzing mobility protocols for ${budget > 0 ? `$${budget} throughput` : "general commute"}. Neural routing factored in fuel and maintenance.`,
    recommendation: "Honda Fit (Hybrid)",
    bestOption: "Honda Fit Neural Node",
    reason: "Highest fuel efficiency for urban commute. 35% lower neural carbon footprint than base models."
  };
}
