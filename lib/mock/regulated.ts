import { RegulatedPrice } from "../types"

export const regulatedPrices: RegulatedPrice[] = [
  { id: "reg-fuel-p", category: "fuel", item: "Petrol (E20)", regulatedPrice: 1.62, unit: "per litre", lastUpdated: "2026-04-01T00:00:00Z" },
  { id: "reg-fuel-d", category: "fuel", item: "Diesel 50", regulatedPrice: 1.67, unit: "per litre", lastUpdated: "2026-04-01T00:00:00Z" },
  { id: "reg-bank-zipit", category: "banking", item: "ZIPIT Transaction Cap", regulatedPrice: 2.50, unit: "max fee", lastUpdated: "2026-01-01T00:00:00Z" },
  { id: "reg-bank-atm", category: "banking", item: "ATM Withdrawal Cap", regulatedPrice: 2, unit: "%", lastUpdated: "2026-01-01T00:00:00Z" },
  { id: "reg-util-elec", category: "utilities", item: "Electricity (Lifeline)", regulatedPrice: 0.12, unit: "per kWh", lastUpdated: "2026-03-01T00:00:00Z" },
]
