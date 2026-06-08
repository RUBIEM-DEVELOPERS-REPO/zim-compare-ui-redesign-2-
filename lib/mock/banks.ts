import type { Bank, BankingProduct, BankLoan, BankFee } from "@/lib/types"

export const banks: Bank[] = [
  {
    id: "cbz",
    name: "CBZ Bank",
    type: "commercial",
    branches: 45,
    transparencyScore: 88,
    digitalScore: 92,
    recommendationScore: 90,
    locations: ["Harare", "Bulawayo", "Gweru", "Mutare", "Masvingo"],
    digitalFeatures: ["Mobile App", "USSD *225#", "Internet Banking", "WhatsApp Banking"],
    internalTransferFee: 0.50,
    externalTransferFee: 1.50,
    products: [],
    fees: []
  },
  {
    id: "steward",
    name: "Steward Bank",
    type: "commercial",
    branches: 20,
    transparencyScore: 85,
    digitalScore: 98,
    recommendationScore: 92,
    locations: ["Harare", "Bulawayo", "Gweru", "Mutare"],
    digitalFeatures: ["Square App", "WhatsApp Banking", "Digital Account Opening", "EcoCash Integration"],
    internalTransferFee: 0.20,
    externalTransferFee: 1.00,
    products: [],
    fees: []
  },
  {
    id: "stanbic",
    name: "Stanbic Bank Zimbabwe",
    type: "commercial",
    branches: 18,
    transparencyScore: 92,
    digitalScore: 94,
    recommendationScore: 95,
    locations: ["Harare", "Bulawayo", "Mutare"],
    digitalFeatures: ["Stanbic App", "Online Banking", "Enterprise Suite"],
    internalTransferFee: 0.50,
    externalTransferFee: 2.00,
    products: [],
    fees: []
  },
  {
    id: "stanchart",
    name: "Standard Chartered Zimbabwe",
    type: "commercial",
    branches: 12,
    transparencyScore: 94,
    digitalScore: 96,
    recommendationScore: 91,
    locations: ["Harare", "Bulawayo"],
    digitalFeatures: ["SC Mobile App", "Cardless Withdrawal", "Online Payments"],
    internalTransferFee: 1.00,
    externalTransferFee: 3.00,
    products: [],
    fees: []
  },
  {
    id: "fbc",
    name: "FBC Bank",
    type: "commercial",
    branches: 25,
    transparencyScore: 87,
    digitalScore: 89,
    recommendationScore: 88,
    locations: ["Harare", "Bulawayo", "Kwekwe", "Zvishavane"],
    digitalFeatures: ["FBC App", "USSD *220#", "Internet Banking"],
    internalTransferFee: 0.40,
    externalTransferFee: 1.80,
    products: [],
    fees: []
  },
  {
    id: "nmb",
    name: "NMB Bank",
    type: "commercial",
    branches: 15,
    transparencyScore: 90,
    digitalScore: 95,
    recommendationScore: 86,
    locations: ["Harare", "Bulawayo", "Gweru"],
    digitalFeatures: ["NMBConnect", "Tap-to-Pay", "Digital Loans"],
    internalTransferFee: 0.30,
    externalTransferFee: 1.50,
    products: [],
    fees: []
  },
  {
    id: "zb",
    name: "ZB Bank",
    type: "commercial",
    branches: 35,
    transparencyScore: 82,
    digitalScore: 85,
    recommendationScore: 84,
    locations: ["Harare", "Bulawayo", "Chinhoyi", "Bindura"],
    digitalFeatures: ["ZB App", "Pauri", "Internet Banking"],
    internalTransferFee: 0.50,
    externalTransferFee: 2.00,
    products: [],
    fees: []
  },
  {
    id: "first-capital",
    name: "First Capital Bank",
    type: "commercial",
    branches: 22,
    transparencyScore: 89,
    digitalScore: 90,
    recommendationScore: 87,
    locations: ["Harare", "Bulawayo", "Victoria Falls"],
    digitalFeatures: ["First Capital App", "Corporate Suite", "Internet Banking"],
    internalTransferFee: 0.60,
    externalTransferFee: 2.20,
    products: [],
    fees: []
  },
  {
    id: "nedbank",
    name: "Nedbank Zimbabwe",
    type: "commercial",
    branches: 10,
    transparencyScore: 91,
    digitalScore: 92,
    recommendationScore: 90,
    locations: ["Harare", "Bulawayo"],
    digitalFeatures: ["Nedbank App", "Online Banking", "Private Banking"],
    internalTransferFee: 0.70,
    externalTransferFee: 2.50,
    products: [],
    fees: []
  },
  {
    id: "posb",
    name: "POSB Zimbabwe",
    type: "commercial",
    branches: 55,
    transparencyScore: 80,
    digitalScore: 82,
    recommendationScore: 82,
    locations: ["Harare", "Bulawayo", "Gweru", "Mutare", "Masvingo", "Beitbridge"],
    digitalFeatures: ["POSB App", "USSD *223#", "Cardless Access"],
    internalTransferFee: 0.10,
    externalTransferFee: 0.80,
    products: [],
    fees: []
  },
  {
    id: "cabs",
    name: "CABS",
    type: "building_society",
    branches: 40,
    transparencyScore: 90,
    digitalScore: 88,
    recommendationScore: 91,
    locations: ["Harare", "Bulawayo", "Mutare", "Gweru"],
    digitalFeatures: ["CABS App", "Internet Banking", "Textacash"],
    internalTransferFee: 0.25,
    externalTransferFee: 1.20,
    products: [],
    fees: []
  },
  {
    id: "bancabc",
    name: "BancABC Zimbabwe",
    type: "commercial",
    branches: 22,
    transparencyScore: 88,
    digitalScore: 92,
    recommendationScore: 89,
    locations: ["Harare", "Bulawayo", "Zvishavane"],
    digitalFeatures: ["BancABC App", "Ally AI Chatbot", "Digital Account"],
    internalTransferFee: 0.35,
    externalTransferFee: 1.40,
    products: [],
    fees: []
  },
  {
    id: "ecobank",
    name: "Ecobank Zimbabwe",
    type: "commercial",
    branches: 15,
    transparencyScore: 86,
    digitalScore: 90,
    recommendationScore: 85,
    locations: ["Harare", "Bulawayo", "Mutare"],
    digitalFeatures: ["Ecobank Mobile", "Omni Lite", "RapidTransfer"],
    internalTransferFee: 0.45,
    externalTransferFee: 1.60,
    products: [],
    fees: []
  }
]

export const bankingProducts: BankingProduct[] = [
  // Savings
  { id: "cbz-smart-sav", bankId: "cbz", bankName: "CBZ Bank", category: "savings", name: "Smart Savings", interestRate: 4.5, minBalance: 20, monthlyFee: 2, aiScore: 94, perks: ["Free Internal Transfers", "Mobile Access", "Tiered Interest", "Neural Verified"] },
  { id: "steward-isave", bankId: "steward", bankName: "Steward Bank", category: "savings", name: "iSave", interestRate: 3.8, minBalance: 0, monthlyFee: 1, aiScore: 89, perks: ["EcoCash Link", "Zero Minimum Balance", "Instant Setup", "Low Entry Barrier"] },
  { id: "stanbic-puresave", bankId: "stanbic", bankName: "Stanbic Bank", category: "savings", name: "PureSave", interestRate: 5.0, minBalance: 50, monthlyFee: 3, aiScore: 91, perks: ["Annual Bonus", "Secure Savings", "Global Access", "Priority Support"] },
  { id: "fbc-sav-plus", bankId: "fbc", bankName: "FBC Bank", category: "savings", name: "Savings Plus", interestRate: 4.2, minBalance: 10, monthlyFee: 2, aiScore: 87, perks: ["High Yield", "Low Minimum Balance", "Digital Support", "Easy Transfers"] },

  // Current
  { id: "stanchart-digi", bankId: "stanchart", bankName: "Standard Chartered", category: "current", name: "Digital Current", interestRate: 0, minBalance: 0, monthlyFee: 5, aiScore: 91, perks: ["International Card", "Online Payments", "Global Access", "Zero POS Fees"] },
  { id: "fbc-corp", bankId: "fbc", bankName: "FBC Bank", category: "current", name: "Corporate Current", interestRate: 0, minBalance: 100, monthlyFee: 8, aiScore: 88, perks: ["Overdraft Facility", "Business Support", "Dedicated Advisor", "Corporate Suite"] },
  { id: "cbz-everyday", bankId: "cbz", bankName: "CBZ Bank", category: "current", name: "Everyday Current", interestRate: 0, minBalance: 20, monthlyFee: 4, aiScore: 86, perks: ["WhatsApp Banking", "Free USSD", "Cash Back", "Local Reach"] },
  { id: "nmb-flexi-cur", bankId: "nmb", bankName: "NMB Bank", category: "current", name: "Flexi Current", interestRate: 0, minBalance: 10, monthlyFee: 6, aiScore: 84, perks: ["Digital Loans", "Tap-to-Pay", "NMBConnect", "Quick Setup"] },

  // Student
  { id: "steward-stu-lite", bankId: "steward", bankName: "Steward Bank", category: "student", name: "Student Lite", interestRate: 1.5, minBalance: 0, monthlyFee: 0, aiScore: 93, perks: ["Zero Monthly Fee", "Free Data Bundles", "EcoCash Link", "Digital ID Support"] },
  { id: "cbz-campus", bankId: "cbz", bankName: "CBZ Bank", category: "student", name: "Campus Account", interestRate: 1.2, minBalance: 5, monthlyFee: 0, aiScore: 90, perks: ["Low Transaction Fees", "Mobile App", "Student Loans", "USSD Access"] },
  { id: "stanbic-stu", bankId: "stanbic", bankName: "Stanbic Bank", category: "student", name: "Student Banking", interestRate: 1.0, minBalance: 10, monthlyFee: 1, aiScore: 85, perks: ["International Debit Card", "Online Payments", "Goal Savings", "STEM Support"] },
  { id: "nmb-youth", bankId: "nmb", bankName: "NMB Bank", category: "student", name: "Youth Account", interestRate: 1.3, minBalance: 5, monthlyFee: 0, aiScore: 88, perks: ["Tap-to-Pay", "Zero POS Fees", "App Access", "Educational Perks"] },

  // SME
  { id: "nmb-sme-growth", bankId: "nmb", bankName: "NMB Bank", category: "sme", name: "SME Growth", interestRate: 1.8, minBalance: 50, monthlyFee: 7, aiScore: 91, perks: ["Trade Finance", "Merchant Services", "Low Transaction Tax", "Dedicated Manager"] },
  { id: "cbz-business", bankId: "cbz", bankName: "CBZ Bank", category: "sme", name: "Business Builder", interestRate: 2.0, minBalance: 100, monthlyFee: 10, aiScore: 88, perks: ["Corporate Suite", "SME Loans", "Free USSD", "Business Support"] },
  { id: "fbc-sme-cur", bankId: "fbc", bankName: "FBC Bank", category: "sme", name: "SME Current", interestRate: 1.5, minBalance: 50, monthlyFee: 8, aiScore: 86, perks: ["Overdraft Facility", "Tax Advisory", "Digital Payroll", "Growth Capital"] },
  { id: "stanbic-biz", bankId: "stanbic", bankName: "Stanbic Bank", category: "sme", name: "Business Account", interestRate: 1.7, minBalance: 75, monthlyFee: 9, aiScore: 84, perks: ["Global Trade", "Enterprise App", "Insurance Cover", "POS Discount"] }
]

export const bankLoans: BankLoan[] = [
  { id: "cbz-personal", bankId: "cbz", bankName: "CBZ Bank", category: "personal", name: "Personal Loan", apr: 22, initiationFee: 50, earlySettlementPenalty: 0, maxTermMonths: 36, requirements: ["ID", "Payslip", "Proof of Residence"] },
  { id: "steward-business", bankId: "steward", bankName: "Steward Bank", category: "sme", name: "SME Power Loan", apr: 18, initiationFee: 100, earlySettlementPenalty: 2, maxTermMonths: 24, requirements: ["Business Reg", "6mo Bank Statement", "Collateral"] },
  { id: "stanbic-mortgage", bankId: "stanbic", bankName: "Stanbic Bank", category: "mortgage", name: "Home Loan", apr: 12, initiationFee: 500, earlySettlementPenalty: 0, maxTermMonths: 240, requirements: ["Title Deeds", "Proof of Income", "25% Deposit"] },
  { id: "fbc-school", bankId: "fbc", bankName: "FBC Bank", category: "personal", name: "Education Loan", apr: 15, initiationFee: 20, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["School Invoice", "ID", "Payslip"] },
  { id: "nmb-vehicle", bankId: "nmb", bankName: "NMB Bank", category: "vehicle", name: "Auto Loan", apr: 14, initiationFee: 150, earlySettlementPenalty: 0, maxTermMonths: 60, requirements: ["Proforma Invoice", "Insurance", "Payslip"] },
  { id: "zb-business", bankId: "zb", bankName: "ZB Bank", category: "sme", name: "Working Capital", apr: 20, initiationFee: 80, earlySettlementPenalty: 1, maxTermMonths: 36, requirements: ["Tax Clearance", "Company Profile", "Projections"] },
  { id: "posb-personal", bankId: "posb", bankName: "POSB Zimbabwe", category: "personal", name: "Civil Servant Loan", apr: 16, initiationFee: 10, earlySettlementPenalty: 0, maxTermMonths: 48, requirements: ["SSB Payslip", "ID", "Bank Card"] }
]

export const bankFees: BankFee[] = [
  { id: "cbz-atm", bankId: "cbz", bankName: "CBZ Bank", category: "transaction", name: "ATM Withdrawal", amount: 1, unit: "Fixed", description: "Flat fee for on-net ATM withdrawals" },
  { id: "posb-zipit", bankId: "posb", bankName: "POSB Zimbabwe", category: "transaction", name: "ZIPIT", amount: 0.50, unit: "Fixed", description: "Cheapest ZIPIT transfers in market" }
]
