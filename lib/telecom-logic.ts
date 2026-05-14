import { DataBundle, VoiceRate, TelecomProvider } from "./types";
import { telecomProviders } from "./mock/telecoms";

export type ProviderCategory = "mobile-network" | "fixed-isp" | "satellite" | "fibre" | "adsl" | "wimax" | "vsat";
export type ProductType = "general-data" | "whatsapp-data" | "social-bundle" | "voice" | "sms" | "fibre-internet" | "adsl-internet" | "satellite-internet" | "combo-bundle" | "night-data";
export type ValidityPeriod = "hourly" | "daily" | "weekly" | "monthly" | "unlimited" | "once-off";

export interface NormalizedTelecomProduct {
  id: string;
  originalId: string;
  name: string;
  providerId: string;
  providerName: string;
  providerCategory: ProviderCategory;
  productType: ProductType;
  validityPeriod: ValidityPeriod;
  currency: string;
  price: number;
  normalizedPriceUSD: number;
  dataAmountGB: number;
  minutes: number;
  smsCount: number;
  speedMbps: number;
  validityDays: number;
  cappedOrUnlimited: "capped" | "unlimited";
  fairUsagePolicy: string;
  restrictions: string[];
  
  // Scores
  coverageScore: number;
  reliabilityScore: number;
  confidenceScore: number;
  transparencyScore: number;
  
  // Calculated
  normalizedUnitCost: number; // cost per GB or cost per minute
  comparisonGroup: string;
}

const EXCHANGE_RATES: Record<string, number> = {
  "USD": 1,
  "ZWG": 0.04, // 1 ZWG = 0.04 USD (approx 1:25)
};

export function normalizeTelecomProduct(item: DataBundle | VoiceRate): NormalizedTelecomProduct {
  const provider = telecomProviders.find(p => p.id === item.providerId) || {
    id: "unknown",
    name: item.providerName || "Unknown",
    type: "MNO",
    coverageScore: 50,
    transparencyScore: 50,
    digitalScore: 50,
    networkType: "Unknown",
    coverageCities: []
  };

  const currency = (item as any).currency || "USD";
  const rate = EXCHANGE_RATES[currency] || 1;
  const normalizedPriceUSD = ((item as any).price || 0) * rate;

  let providerCategory: ProviderCategory = "mobile-network";
  if (provider.type === "ISP") {
    const netType = (provider as any).networkType?.toLowerCase() || "";
    if (netType.includes("fibre")) providerCategory = "fibre";
    else if (netType.includes("adsl")) providerCategory = "adsl";
    else if (netType.includes("wimax")) providerCategory = "wimax";
    else if (netType.includes("vsat")) providerCategory = "vsat";
    else providerCategory = "fixed-isp";
  }

  let productType: ProductType = "general-data";
  let dataAmountGB = (item as DataBundle).dataGB || 0;
  let minutes = (item as VoiceRate).onnet_minutes || (item as VoiceRate).other_minutes || 0;
  let smsCount = (item as VoiceRate).sms_count || 0;

  if ("category" in item) {
    const cat = item.category.toLowerCase();
    const nameLower = ((item as any).name || (item as any).bundle_name || "").toLowerCase();
    if (cat === "social" || nameLower.includes("whatsapp")) productType = "whatsapp-data";
    else if (cat === "night") productType = "night-data";
    else if (cat === "internet") {
        if (providerCategory === "fibre") productType = "fibre-internet";
        else if (providerCategory === "adsl") productType = "adsl-internet";
        else if (providerCategory === "vsat") productType = "satellite-internet";
        else productType = "general-data";
    }
  } else if ("ratePerMin" in item) {
    productType = "voice";
  }

  let validityPeriod: ValidityPeriod = "monthly";
  const validityDays = (item as DataBundle).validityDays || 30;
  if (validityDays === 1) validityPeriod = "daily";
  else if (validityDays > 1 && validityDays <= 7) validityPeriod = "weekly";
  else if (validityDays > 7 && validityDays <= 31) validityPeriod = "monthly";
  
  if ((item as any).category === "unlimited") validityPeriod = "unlimited";

  const nameLower = ((item as any).name || (item as any).bundle_name || "").toLowerCase();
  const cappedOrUnlimited = (item as any).category === "unlimited" || nameLower.includes("unlimited") ? "unlimited" : "capped";

  // Mock scores for coverage/reliability/confidence if not in data
  const coverageScore = provider.coverageScore || 70;
  const reliabilityScore = (provider as any).digitalScore || 75; // Using digitalScore as proxy
  const confidenceScore = provider.transparencyScore || 80;

  let normalizedUnitCost = 0;
  if (dataAmountGB > 0) {
    normalizedUnitCost = normalizedPriceUSD / dataAmountGB;
  } else if (minutes > 0) {
    normalizedUnitCost = normalizedPriceUSD / minutes;
  } else if ((item as VoiceRate).ratePerMin) {
    normalizedUnitCost = (item as VoiceRate).ratePerMin! * rate;
  }

  const comparisonGroup = `${providerCategory}-${productType}-${validityPeriod}-${cappedOrUnlimited}`;

  return {
    id: item.id,
    originalId: item.id,
    name: (item as any).name || (item as any).bundle_name || "Telecom Product",
    providerId: item.providerId || "unknown",
    providerName: item.providerName || provider.name || "Unknown",
    providerCategory,
    productType,
    validityPeriod,
    currency,
    price: (item as any).price || 0,
    normalizedPriceUSD,
    dataAmountGB,
    minutes,
    smsCount,
    speedMbps: parseInt((item as any).speedClass) || 0,
    validityDays,
    cappedOrUnlimited,
    fairUsagePolicy: (item as any).fupNote || "Standard FUP applies",
    restrictions: (item as any).extras ? [(item as any).extras] : [],
    coverageScore,
    reliabilityScore,
    confidenceScore,
    transparencyScore: provider.transparencyScore,
    normalizedUnitCost,
    comparisonGroup,
  };
}

export function getTelecomComparisonGroup(product: NormalizedTelecomProduct): string {
  return product.comparisonGroup;
}

export interface UserNeed {
  type: "data" | "voice" | "whatsapp" | "home-internet";
  usageVolume: "low" | "medium" | "high";
  budget?: number;
  location?: string;
}

export interface RecommendationResult {
  product: NormalizedTelecomProduct;
  score: number;
  rank: number;
  matchReason: string;
  tradeOffs: string[];
  confidenceLevel: "high" | "medium" | "low";
}

export function scoreTelecomProduct(product: NormalizedTelecomProduct, need: UserNeed): number {
  let score = 0;

  // 1. Need match (30%)
  let needMatchScore = 0;
  if (need.type === "data" && product.productType === "general-data") needMatchScore = 100;
  else if (need.type === "whatsapp" && product.productType === "whatsapp-data") needMatchScore = 100;
  else if (need.type === "voice" && product.productType === "voice") needMatchScore = 100;
  else if (need.type === "home-internet" && (product.productType === "fibre-internet" || product.productType === "adsl-internet" || product.productType === "satellite-internet")) needMatchScore = 100;
  else if (need.type === "data" && product.productType === "fibre-internet") needMatchScore = 60; // Fibre is data but not mobile
  
  score += needMatchScore * 0.30;

  // 2. Realistic cost (25%)
  // Lower unit cost is better. We'll normalize this.
  // Assuming a "good" cost per GB is $0.50 and "bad" is $5.00
  let costScore = 0;
  if (product.normalizedUnitCost > 0) {
    costScore = Math.max(0, 100 - (product.normalizedUnitCost * 20)); // Simplistic normalization
  }
  score += costScore * 0.25;

  // 3. Coverage (15%)
  score += product.coverageScore * 0.15;

  // 4. Reliability (15%)
  score += product.reliabilityScore * 0.15;

  // 5. Restrictions/FUP Penalty (10%)
  let restrictionPenalty = 0;
  if (product.fairUsagePolicy.toLowerCase().includes("throttle")) restrictionPenalty = 20;
  if (product.cappedOrUnlimited === "unlimited" && product.dataAmountGB < 100) restrictionPenalty += 10;
  
  score += (100 - restrictionPenalty) * 0.10;

  // 6. Data Confidence (5%)
  score += product.confidenceScore * 0.05;

  return score;
}

export function getTelecomRecommendations(
  items: (DataBundle | VoiceRate)[],
  need: UserNeed
): { 
    recommendations: RecommendationResult[], 
    excluded: { product: NormalizedTelecomProduct, reason: string }[] 
} {
  const normalized = items.map(normalizeTelecomProduct);
  
  if (normalized.length === 0) return { recommendations: [], excluded: [] };

  // Determine the primary group (based on the first item or the most common one)
  // In a real app, we might ask the user or infer from the first selected item.
  const targetGroup = normalized[0].comparisonGroup;

  const comparable = normalized.filter(p => p.comparisonGroup === targetGroup);
  const excluded = normalized
    .filter(p => p.comparisonGroup !== targetGroup)
    .map(p => ({
      product: p,
      reason: `Belongs to a different comparison group: ${p.comparisonGroup.replace(/-/g, ' ')}. Expected: ${targetGroup.replace(/-/g, ' ')}.`
    }));

  const scored = comparable.map(p => {
    const score = scoreTelecomProduct(p, need);
    
    // Generate match reason
    let matchReason = "";
    if (score > 85) matchReason = "Excellent match for your usage patterns and budget.";
    else if (score > 70) matchReason = "Solid choice with good balance of cost and reliability.";
    else matchReason = "Meets basic requirements but may have trade-offs.";

    // Trade-offs
    const tradeOffs = [];
    if (p.coverageScore < 80) tradeOffs.push("Limited coverage in some areas");
    if (p.normalizedUnitCost > 2) tradeOffs.push("Higher cost per unit compared to peers");
    if (p.cappedOrUnlimited === "capped") tradeOffs.push("Fixed data limit");

    return {
      product: p,
      score,
      rank: 0,
      matchReason,
      tradeOffs,
      confidenceLevel: p.confidenceScore > 85 ? "high" : p.confidenceScore > 70 ? "medium" : "low" as any
    };
  });

  scored.sort((a, b) => b.score - a.score);
  
  const recommendations = scored.map((s, i) => ({ ...s, rank: i + 1 }));

  return { recommendations, excluded };
}
