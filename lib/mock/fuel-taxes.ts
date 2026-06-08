export const fuelTaxBreakdown = [
  {
    type: "Petrol (E20)",
    basePrice: 1.05,
    taxes: [
      { name: "Excise Duty", amount: 0.35, category: "Government" },
      { name: "ZERA Levy", amount: 0.02, category: "Regulatory" },
      { name: "Carbon Tax", amount: 0.04, category: "Environmental" },
      { name: "Road Levy", amount: 0.06, category: "Infrastructure" },
      { name: "NOCZIM Debt Levy", amount: 0.07, category: "Debt Service" },
      { name: "Strategic Reserve Levy", amount: 0.03, category: "Reserve" }
    ],
    serviceCharges: 0.12,
    historicalPrice: 1.58
  },
  {
    type: "Diesel 50",
    basePrice: 1.10,
    taxes: [
      { name: "Excise Duty", amount: 0.30, category: "Government" },
      { name: "ZERA Levy", amount: 0.02, category: "Regulatory" },
      { name: "Carbon Tax", amount: 0.04, category: "Environmental" },
      { name: "Road Levy", amount: 0.06, category: "Infrastructure" },
      { name: "NOCZIM Debt Levy", amount: 0.07, category: "Debt Service" },
      { name: "Strategic Reserve Levy", amount: 0.03, category: "Reserve" }
    ],
    serviceCharges: 0.15,
    historicalPrice: 1.62
  },
  {
    type: "Paraffin",
    basePrice: 0.95,
    taxes: [
      { name: "Excise Duty", amount: 0.10, category: "Government" },
      { name: "ZERA Levy", amount: 0.01, category: "Regulatory" },
      { name: "Administrative Fee", amount: 0.05, category: "Service" }
    ],
    serviceCharges: 0.08,
    historicalPrice: 1.25
  }
];
