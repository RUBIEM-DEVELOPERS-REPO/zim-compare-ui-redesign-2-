import { bankingProducts } from "./mock/banks";
import type { BankingProduct } from "./types";

export interface Recommendation {
  product: BankingProduct;
  score: number;
  insight: string;
}

/**
 * Scoring model for banking products.
 * Higher score is better.
 */
export function calculateScore(product: BankingProduct): number {
  const interestWeight = 10;
  const feeWeight = 5;
  const minBalanceWeight = 0.1;

  // Score = (Interest * Weight) - (Fee * Weight) - (MinBalance * Weight)
  return (
    product.interestRate * interestWeight -
    product.monthlyFee * feeWeight -
    product.minBalance * minBalanceWeight
  );
}

/**
 * Get recommendations based on a selected banking product.
 */
export function getBankingRecommendations(
  selectedProductId: string,
  excludeIds: string[] = []
): Recommendation[] {
  const selectedProduct = bankingProducts.find((p) => p.id === selectedProductId);
  if (!selectedProduct) return [];

  const category = selectedProduct.category;

  // Filter products in the same category, excluding the selected one and already compared ones
  const candidates = bankingProducts.filter(
    (p) => 
      p.category === category && 
      p.id !== selectedProductId && 
      !excludeIds.includes(p.id)
  );

  // Calculate scores for all candidates
  const scoredCandidates = candidates.map((p) => ({
    product: p,
    score: calculateScore(p),
  }));

  // Sort by score descending
  scoredCandidates.sort((a, b) => b.score - a.score);

  // Take top 3
  const topRecommendations = scoredCandidates.slice(0, 3);

  // Generate insights for each recommendation
  return topRecommendations.map((rec) => {
    let insight = "";
    const p = rec.product;

    if (p.interestRate > selectedProduct.interestRate) {
      const diff = (p.interestRate - selectedProduct.interestRate).toFixed(1);
      insight = `${diff}% higher interest rate. `;
    }

    if (p.monthlyFee < selectedProduct.monthlyFee) {
      insight += `Lower monthly fees. `;
    } else if (p.monthlyFee === 0 && selectedProduct.monthlyFee > 0) {
      insight = `Zero monthly fees. `;
    }

    if (insight === "") {
      insight = "Better overall value based on rates and fees.";
    }

    return {
      product: p,
      score: rec.score,
      insight: insight.trim(),
    };
  });
}
