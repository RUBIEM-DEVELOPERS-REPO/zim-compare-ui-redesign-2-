import type { InsuranceProvider, Policy } from "@/lib/types"

export const insuranceProviders: InsuranceProvider[] = [
  { id: "old-mutual", name: "Old Mutual Zimbabwe", type: "Insurance", transparencyScore: 85, digitalScore: 88, claimsScore: 90, avgClaimDays: 14, serviceAreas: ["Nationwide", "International"], website: "https://www.oldmutual.co.zw" },
  { id: "zimnat", name: "Zimnat Insurance", type: "Insurance", transparencyScore: 82, digitalScore: 85, claimsScore: 88, avgClaimDays: 10, serviceAreas: ["Nationwide"], website: "https://www.zimnat.co.zw" },
  { id: "nicoz-diamond", name: "Nicoz Diamond", type: "Insurance", transparencyScore: 80, digitalScore: 80, claimsScore: 85, avgClaimDays: 12, serviceAreas: ["Nationwide"], website: "https://www.nicozdiamond.co.zw" },
  { id: "cimas", name: "CIMAS Medical Aid", type: "Health Insurance", transparencyScore: 88, digitalScore: 92, claimsScore: 94, avgClaimDays: 5, serviceAreas: ["Nationwide", "Region"], website: "https://www.cimas.co.zw" },
  { id: "psmas", name: "PSMAS", type: "Health Insurance", transparencyScore: 65, digitalScore: 60, claimsScore: 70, avgClaimDays: 20, serviceAreas: ["Nationwide"], website: "https://www.psmas.co.zw" },
  { id: "first-mutual", name: "First Mutual Health", type: "Insurance", transparencyScore: 84, digitalScore: 82, claimsScore: 86, avgClaimDays: 11, serviceAreas: ["Nationwide"], website: "https://www.firstmutual.co.zw" },
  { id: "alliance", name: "Alliance Health", type: "Insurance", transparencyScore: 81, digitalScore: 79, claimsScore: 83, avgClaimDays: 13, serviceAreas: ["Nationwide"], website: "https://www.alliance.co.zw" },
  { id: "eagle", name: "Eagle Insurance", type: "Insurance", transparencyScore: 78, digitalScore: 75, claimsScore: 80, avgClaimDays: 15, serviceAreas: ["Nationwide"], website: "https://www.eagle.co.zw" },
  { id: "cellmed", name: "CellMed Health", type: "Health Insurance", transparencyScore: 86, digitalScore: 88, claimsScore: 89, avgClaimDays: 9, serviceAreas: ["Nationwide"], website: "https://www.cellmed.co.zw" },
  { id: "doves", name: "Doves Funeral Services", type: "Insurance", transparencyScore: 90, digitalScore: 85, claimsScore: 92, avgClaimDays: 2, serviceAreas: ["Nationwide"], website: "https://www.doves.co.zw" },
  { id: "nyaradzo", name: "Nyaradzo Group", type: "Insurance", transparencyScore: 92, digitalScore: 90, claimsScore: 95, avgClaimDays: 1, serviceAreas: ["Nationwide"], website: "https://www.nyaradzo.co.zw" },
]

export const policies: Policy[] = [
  // 1) Car Insurance — 6 mock companies
  { 
    id: "om-motor-protect", providerId: "old-mutual", providerName: "Old Mutual", category: "motor", 
    name: "Old Mutual Motor Protect", monthlyPremium: 32, annualPremium: 350, excess: 150, 
    coPay: 0, outOfPocketLimit: 500,
    waitingPeriodDays: 0, coverLimit: 25000, 
    benefits: ["Comprehensive cover", "Third-party liability", "Accident assistance"], 
    exclusions: ["Unlicensed driver", "Drunk driving", "Racing"], 
    type: "Full Cover", matchScore: 94, currency: "USD", isManual: false 
},
  { 
    id: "zimnat-auto-secure", providerId: "zimnat", providerName: "Zimnat", category: "motor", 
    name: "Zimnat Auto Secure", monthlyPremium: 28, annualPremium: 310, excess: 180, 
    coPay: 5, outOfPocketLimit: 600,
    waitingPeriodDays: 0, coverLimit: 20000, 
    benefits: ["Theft cover", "Third-party cover", "Roadside support"], 
    exclusions: ["Wear and tear", "Drunk driving"], 
    type: "Full Cover", matchScore: 91, currency: "USD", isManual: false 
},
  { 
    id: "fm-drive-cover", providerId: "first-mutual", providerName: "First Mutual", category: "motor", 
    name: "First Mutual Drive Cover", monthlyPremium: 35, annualPremium: 385, excess: 200, 
    waitingPeriodDays: 0, coverLimit: 30000, 
    benefits: ["Comprehensive cover", "Windscreen cover", "Emergency towing"], 
    exclusions: ["Commercial misuse", "Illegal use"], 
    type: "Full Cover", matchScore: 92, currency: "USD", isManual: false 
  },
  { 
    id: "nicoz-motor-plus", providerId: "nicoz-diamond", providerName: "Nicoz Diamond", category: "motor", 
    name: "NicozDiamond Motor Plus", monthlyPremium: 30, annualPremium: 330, excess: 170, 
    waitingPeriodDays: 0, coverLimit: 22000, 
    benefits: ["Own damage", "Theft", "Fire cover"], 
    exclusions: ["Driver negligence", "Unauthorized use"], 
    type: "Full Cover", matchScore: 90, currency: "USD", isManual: false 
  },
  { 
    id: "alliance-motor-guard", providerId: "alliance", providerName: "Alliance", category: "motor", 
    name: "Alliance Motor Guard", monthlyPremium: 26, annualPremium: 285, excess: 160, 
    waitingPeriodDays: 0, coverLimit: 18000, 
    benefits: ["Third-party", "Fire & theft", "Accident response"], 
    exclusions: ["Mechanical breakdown", "Reckless driving"], 
    type: "Third Party Fire and Theft", matchScore: 88, currency: "USD", isManual: false 
  },
  { 
    id: "eagle-auto-plan", providerId: "eagle", providerName: "Eagle Insurance", category: "motor", 
    name: "Eagle Insurance Auto Plan", monthlyPremium: 29, annualPremium: 320, excess: 175, 
    waitingPeriodDays: 0, coverLimit: 21500, 
    benefits: ["Comprehensive option", "Passenger liability", "Towing"], 
    exclusions: ["Intentional damage", "No valid license"], 
    type: "Full Cover", matchScore: 89, currency: "USD", isManual: false 
  },

  // 2) Medical Insurance — 6 mock companies
  { 
    id: "cimas-health-plus", providerId: "cimas", providerName: "Cimas", category: "medical", 
    name: "Cimas Health Plus", monthlyPremium: 55, annualPremium: 605, excess: 10, 
    coPay: 5, outOfPocketLimit: 2000,
    waitingPeriodDays: 30, coverLimit: 15000, 
    benefits: ["GP visits", "Hospitalization", "Specialist network"], 
    exclusions: ["Cosmetic treatment", "Non-approved procedures"], 
    type: "Individual Cover", matchScore: 95, currency: "USD", isManual: false 
},
  { 
    id: "psmas-care-secure", providerId: "psmas", providerName: "PSMAS", category: "medical", 
    name: "PSMAS Care Secure", monthlyPremium: 48, annualPremium: 528, excess: 12, 
    coPay: 10, outOfPocketLimit: 2500,
    waitingPeriodDays: 30, coverLimit: 12000, 
    benefits: ["In-patient care", "Outpatient care", "Chronic medication"], 
    exclusions: ["Cosmetic surgery", "Elective overseas treatment"], 
    type: "Individual Cover", matchScore: 93, currency: "USD", isManual: false 
},
  { 
    id: "fm-health-cover", providerId: "first-mutual", providerName: "First Mutual", category: "medical", 
    name: "First Mutual Health Cover", monthlyPremium: 50, annualPremium: 550, excess: 15, 
    waitingPeriodDays: 30, coverLimit: 14000, 
    benefits: ["Hospital cover", "Lab tests", "Maternity support"], 
    exclusions: ["Experimental treatment"], 
    type: "User Cover", matchScore: 91, currency: "USD", isManual: false 
  },
  { 
    id: "alliance-health-protect", providerId: "alliance", providerName: "Alliance", category: "medical", 
    name: "Alliance Health Protect", monthlyPremium: 45, annualPremium: 495, excess: 10, 
    waitingPeriodDays: 30, coverLimit: 10500, 
    benefits: ["GP network", "Hospitalization", "Diagnostics"], 
    exclusions: ["Dental cosmetics", "Unapproved specialists"], 
    type: "Individual Cover", matchScore: 89, currency: "USD", isManual: false 
  },
  { 
    id: "zimnat-medisure", providerId: "zimnat", providerName: "Zimnat", category: "medical", 
    name: "Zimnat Medisure", monthlyPremium: 52, annualPremium: 572, excess: 14, 
    waitingPeriodDays: 30, coverLimit: 13500, 
    benefits: ["User cover", "Emergency care", "Pharmacy support"], 
    exclusions: ["Cosmetic care", "Non-network providers"], 
    type: "User Cover", matchScore: 90, currency: "USD", isManual: false 
  },
  { 
    id: "cellmed-prime-care", providerId: "cellmed", providerName: "CellMed", category: "medical", 
    name: "CellMed Prime Care", monthlyPremium: 58, annualPremium: 638, excess: 8, 
    waitingPeriodDays: 30, coverLimit: 16000, 
    benefits: ["Specialist access", "Inpatient cover", "Chronic care"], 
    exclusions: ["Elective procedures not approved"], 
    type: "In-Patient Cover", matchScore: 94, currency: "USD", isManual: false 
  },

  // 3) Funeral Cover — 6 mock companies
  { 
    id: "doves-funeral-plan", providerId: "doves", providerName: "Doves", category: "life_funeral", 
    name: "Doves Funeral Plan", monthlyPremium: 12, annualPremium: 144, excess: 0, 
    coPay: 0, outOfPocketLimit: 0,
    waitingPeriodDays: 180, coverLimit: 2500, 
    benefits: ["Funeral service", "Coffin", "Transport"], 
    exclusions: ["Waiting period", "Misrepresentation"], 
    type: "Service Plan", matchScore: 96, currency: "USD", isManual: false 
},
  { 
    id: "nyaradzo-user-cover", providerId: "nyaradzo", providerName: "Nyaradzo", category: "life_funeral", 
    name: "Nyaradzo User Cover", monthlyPremium: 10, annualPremium: 120, excess: 0, 
    coPay: 0, outOfPocketLimit: 0,
    waitingPeriodDays: 180, coverLimit: 2000, 
    benefits: ["Full funeral package", "User extension", "Repatriation"], 
    exclusions: ["Early claims within waiting period"], 
    type: "User Plan", matchScore: 95, currency: "USD", isManual: false 
},
  { 
    id: "fm-final-rest", providerId: "first-mutual", providerName: "First Mutual", category: "life_funeral", 
    name: "First Mutual Final Rest Plan", monthlyPremium: 11, annualPremium: 132, excess: 0, 
    waitingPeriodDays: 180, coverLimit: 2200, 
    benefits: ["Funeral support", "User cover", "Transport"], 
    exclusions: ["Fraudulent claims"], 
    type: "User Plan", matchScore: 90, currency: "USD", isManual: false 
  },
  { 
    id: "om-funeral-assist", providerId: "old-mutual", providerName: "Old Mutual", category: "life_funeral", 
    name: "Old Mutual Funeral Assist", monthlyPremium: 13, annualPremium: 156, excess: 0, 
    waitingPeriodDays: 180, coverLimit: 2700, 
    benefits: ["Funeral assistance", "Grocery support", "User coverage"], 
    exclusions: ["Waiting period restrictions"], 
    type: "Cash Plan", matchScore: 91, currency: "USD", isManual: false 
  },
  { 
    id: "zimnat-comfort-cover", providerId: "zimnat", providerName: "Zimnat", category: "life_funeral", 
    name: "Zimnat Comfort Cover", monthlyPremium: 9, annualPremium: 108, excess: 0, 
    waitingPeriodDays: 180, coverLimit: 1800, 
    benefits: ["Basic funeral package", "Transport", "Cover extension"], 
    exclusions: ["Late premium payments"], 
    type: "Individual Plan", matchScore: 88, currency: "USD", isManual: false 
  },
  { 
    id: "alliance-memorial-plan", providerId: "alliance", providerName: "Alliance", category: "life_funeral", 
    name: "Alliance Memorial Plan", monthlyPremium: 10.5, annualPremium: 126, excess: 0, 
    waitingPeriodDays: 180, coverLimit: 2100, 
    benefits: ["Funeral payout", "User package", "Mortuary support"], 
    exclusions: ["Pre-existing claim fraud"], 
    type: "Service Plan", matchScore: 89, currency: "USD", isManual: false 
  },

  // 4) Home Insurance — 6 mock companies
  { 
    id: "om-home-protect-v2", providerId: "old-mutual", providerName: "Old Mutual", category: "property_business", 
    name: "Old Mutual Home Protect", monthlyPremium: 35, annualPremium: 385, excess: 500, 
    coPay: 0, outOfPocketLimit: 1500,
    waitingPeriodDays: 0, coverLimit: 100000, 
    benefits: ["Building cover", "Contents cover", "Liability"], 
    exclusions: ["Wear and tear", "Poor maintenance"], 
    type: "Building Cover", matchScore: 97, currency: "USD", isManual: false 
},
  { 
    id: "zimnat-home-shield", providerId: "zimnat", providerName: "Zimnat", category: "property_business", 
    name: "Zimnat Home Shield", monthlyPremium: 30, annualPremium: 330, excess: 450, 
    coPay: 2, outOfPocketLimit: 1200,
    waitingPeriodDays: 0, coverLimit: 85000, 
    benefits: ["Fire", "Theft", "Storm damage"], 
    exclusions: ["Gradual deterioration"], 
    type: "Combined Home Cover", matchScore: 93, currency: "USD", isManual: false 
},
  { 
    id: "fm-house-secure", providerId: "first-mutual", providerName: "First Mutual", category: "property_business", 
    name: "First Mutual House Secure", monthlyPremium: 33, annualPremium: 363, excess: 480, 
    waitingPeriodDays: 0, coverLimit: 95000, 
    benefits: ["Structure cover", "Personal goods", "Burglary cover"], 
    exclusions: ["Negligence", "Intentional damage"], 
    type: "Building Cover", matchScore: 92, currency: "USD", isManual: false 
  },
  { 
    id: "alliance-home-guard", providerId: "alliance", providerName: "Alliance", category: "property_business", 
    name: "Alliance Home Guard", monthlyPremium: 28, annualPremium: 308, excess: 400, 
    waitingPeriodDays: 0, coverLimit: 80000, 
    benefits: ["Building cover", "Fire cover", "Limited contents cover"], 
    exclusions: ["Flooding in excluded zones"], 
    type: "Contents Cover", matchScore: 88, currency: "USD", isManual: false 
  },
  { 
    id: "nicoz-property-cover", providerId: "nicoz-diamond", providerName: "Nicoz Diamond", category: "property_business", 
    name: "NicozDiamond Property Cover", monthlyPremium: 36, annualPremium: 396, excess: 520, 
    waitingPeriodDays: 0, coverLimit: 105000, 
    benefits: ["Full building cover", "Contents", "Liability"], 
    exclusions: ["Unoccupied property risks"], 
    type: "Building Cover", matchScore: 94, currency: "USD", isManual: false 
  },
  { 
    id: "eagle-home-secure", providerId: "eagle", providerName: "Eagle Insurance", category: "property_business", 
    name: "Eagle Home Secure", monthlyPremium: 29, annualPremium: 319, excess: 420, 
    waitingPeriodDays: 0, coverLimit: 82000, 
    benefits: ["Theft", "Fire", "Storm protection"], 
    exclusions: ["Poor upkeep", "Intentional damage"], 
    type: "Combined Home Cover", matchScore: 89, currency: "USD", isManual: false 
  },

  // 5) Business Insurance — 6 mock companies
  { 
    id: "om-sme-protect", providerId: "old-mutual", providerName: "Old Mutual", category: "business", 
    name: "Old Mutual SME Protect", monthlyPremium: 60, annualPremium: 660, excess: 300, 
    waitingPeriodDays: 0, coverLimit: 150000, 
    benefits: ["Stock cover", "Equipment cover", "Liability"], 
    exclusions: ["Fraud", "Illegal trading"], 
    type: "Asset All Risks", matchScore: 95, currency: "USD", isManual: false 
  },
  { 
    id: "zimnat-business-shield-v2", providerId: "zimnat", providerName: "Zimnat", category: "business", 
    name: "Zimnat Business Shield", monthlyPremium: 55, annualPremium: 605, excess: 280, 
    waitingPeriodDays: 0, coverLimit: 120000, 
    benefits: ["Property cover", "Theft", "Business interruption"], 
    exclusions: ["Cyber-only incidents unless added"], 
    type: "Business All Risks", matchScore: 91, currency: "USD", isManual: false 
  },
  { 
    id: "fm-commercial-cover", providerId: "first-mutual", providerName: "First Mutual", category: "business", 
    name: "First Mutual Commercial Cover", monthlyPremium: 65, annualPremium: 715, excess: 320, 
    waitingPeriodDays: 0, coverLimit: 170000, 
    benefits: ["Fire", "Stock", "Machinery", "Public liability"], 
    exclusions: ["Misuse", "Unlawful acts"], 
    type: "Business All Risks", matchScore: 94, currency: "USD", isManual: false 
  },
  { 
    id: "alliance-sme-guard", providerId: "alliance", providerName: "Alliance", category: "business", 
    name: "Alliance SME Guard", monthlyPremium: 50, annualPremium: 550, excess: 250, 
    waitingPeriodDays: 0, coverLimit: 110000, 
    benefits: ["Equipment cover", "Theft", "Employer liability"], 
    exclusions: ["Undisclosed risk factors"], 
    type: "Public Liability", matchScore: 89, currency: "USD", isManual: false 
  },
  { 
    id: "nicoz-enterprise-cover", providerId: "nicoz-diamond", providerName: "Nicoz Diamond", category: "business", 
    name: "NicozDiamond Enterprise Cover", monthlyPremium: 68, annualPremium: 748, excess: 330, 
    waitingPeriodDays: 0, coverLimit: 180000, 
    benefits: ["Business interruption", "Fire", "Liability", "Stock"], 
    exclusions: ["Poor compliance", "Fraud"], 
    type: "Asset All Risks", matchScore: 93, currency: "USD", isManual: false 
  },
  { 
    id: "eagle-commercial-protect", providerId: "eagle", providerName: "Eagle Insurance", category: "business", 
    name: "Eagle Commercial Protect", monthlyPremium: 58, annualPremium: 638, excess: 275, 
    waitingPeriodDays: 0, coverLimit: 130000, 
    benefits: ["SME property cover", "Business assets", "Liability"], 
    exclusions: ["High-risk activities without declaration"], 
    type: "Business All Risks", matchScore: 90, currency: "USD", isManual: false 
  },

  // 6) Agriculture Insurance — 6 mock companies
  { 
    id: "om-agro-cover", providerId: "old-mutual", providerName: "Old Mutual", category: "agriculture", 
    name: "Old Mutual Agro Cover", monthlyPremium: 42, annualPremium: 462, excess: 250, 
    waitingPeriodDays: 0, coverLimit: 90000, 
    benefits: ["Crop protection", "Livestock cover", "Farm equipment"], 
    exclusions: ["Neglect", "Undeclared disease outbreak"], 
    type: "Crop Cover", matchScore: 94, currency: "USD", isManual: false 
  },
  { 
    id: "zimnat-farm-shield", providerId: "zimnat", providerName: "Zimnat", category: "agriculture", 
    name: "Zimnat Farm Shield", monthlyPremium: 39, annualPremium: 429, excess: 220, 
    waitingPeriodDays: 0, coverLimit: 80000, 
    benefits: ["Crop cover", "Weather risk", "Irrigation equipment"], 
    exclusions: ["Preventable losses"], 
    type: "Crop Cover", matchScore: 91, currency: "USD", isManual: false 
  },
  { 
    id: "fm-agri-secure", providerId: "first-mutual", providerName: "First Mutual", category: "agriculture", 
    name: "First Mutual AgriSecure", monthlyPremium: 45, annualPremium: 495, excess: 260, 
    waitingPeriodDays: 0, coverLimit: 100000, 
    benefits: ["Livestock", "Machinery", "Drought support"], 
    exclusions: ["Lack of veterinary compliance"], 
    type: "Livestock Cover", matchScore: 93, currency: "USD", isManual: false 
  },
  { 
    id: "alliance-crop-guard", providerId: "alliance", providerName: "Alliance", category: "agriculture", 
    name: "Alliance Crop Guard", monthlyPremium: 36, annualPremium: 396, excess: 210, 
    waitingPeriodDays: 0, coverLimit: 75000, 
    benefits: ["Crop failure cover", "Storm damage", "Input loss"], 
    exclusions: ["Unreported farm incidents"], 
    type: "Crop Cover", matchScore: 88, currency: "USD", isManual: false 
  },
  { 
    id: "nicoz-farm-protect", providerId: "nicoz-diamond", providerName: "Nicoz Diamond", category: "agriculture", 
    name: "NicozDiamond Farm Protect", monthlyPremium: 44, annualPremium: 484, excess: 255, 
    waitingPeriodDays: 0, coverLimit: 95000, 
    benefits: ["Farm buildings", "Equipment", "Livestock"], 
    exclusions: ["Illegal land use", "Negligence"], 
    type: "Equipment Cover", matchScore: 90, currency: "USD", isManual: false 
  },
  { 
    id: "eagle-agri-plus", providerId: "eagle", providerName: "Eagle Insurance", category: "agriculture", 
    name: "Eagle AgriPlus", monthlyPremium: 38, annualPremium: 418, excess: 230, 
    waitingPeriodDays: 0, coverLimit: 78000, 
    benefits: ["Livestock cover", "Crop loss", "Weather risk"], 
    exclusions: ["Poor farm management"], 
    type: "Livestock Cover", matchScore: 87, currency: "USD", isManual: false 
  },

  // 7) Travel Insurance — 6 mock companies
  { 
    id: "om-travel-safe", providerId: "old-mutual", providerName: "Old Mutual", category: "travel", 
    name: "Old Mutual Travel Safe", monthlyPremium: 18, annualPremium: 216, excess: 50, 
    waitingPeriodDays: 0, coverLimit: 25000, 
    benefits: ["Medical emergencies", "Baggage loss", "Trip delays"], 
    exclusions: ["High-risk sports", "Non-disclosed conditions"], 
    type: "International", matchScore: 95, currency: "USD", isManual: false 
  },
  { 
    id: "zimnat-travel-guard-v2", providerId: "zimnat", providerName: "Zimnat", category: "travel", 
    name: "Zimnat Travel Guard", monthlyPremium: 16, annualPremium: 192, excess: 45, 
    waitingPeriodDays: 0, coverLimit: 20000, 
    benefits: ["Emergency medical", "Cancellations", "Lost baggage"], 
    exclusions: ["Pre-existing conditions"], 
    type: "International", matchScore: 91, currency: "USD", isManual: false 
  },
  { 
    id: "fm-global-travel", providerId: "first-mutual", providerName: "First Mutual", category: "travel", 
    name: "First Mutual Global Travel", monthlyPremium: 19, annualPremium: 228, excess: 55, 
    waitingPeriodDays: 0, coverLimit: 28000, 
    benefits: ["International medical support", "Cancellation cover"], 
    exclusions: ["Adventure travel without extension"], 
    type: "International", matchScore: 93, currency: "USD", isManual: false 
  },
  { 
    id: "alliance-trip-cover", providerId: "alliance", providerName: "Alliance", category: "travel", 
    name: "Alliance Trip Cover", monthlyPremium: 15, annualPremium: 180, excess: 40, 
    waitingPeriodDays: 0, coverLimit: 18000, 
    benefits: ["Delays", "Baggage", "Emergency care"], 
    exclusions: ["Unapproved destinations"], 
    type: "Regional", matchScore: 88, currency: "USD", isManual: false 
  },
  { 
    id: "nicoz-travel-protect", providerId: "nicoz-diamond", providerName: "Nicoz Diamond", category: "travel", 
    name: "NicozDiamond Travel Protect", monthlyPremium: 17, annualPremium: 204, excess: 50, 
    waitingPeriodDays: 0, coverLimit: 22000, 
    benefits: ["Medical cover", "Document loss", "Cancellations"], 
    exclusions: ["Extreme sports", "Pre-existing conditions"], 
    type: "International", matchScore: 90, currency: "USD", isManual: false 
  },
  { 
    id: "eagle-voyager-cover", providerId: "eagle", providerName: "Eagle Insurance", category: "travel", 
    name: "Eagle Voyager Cover", monthlyPremium: 14, annualPremium: 168, excess: 35, 
    waitingPeriodDays: 0, coverLimit: 16000, 
    benefits: ["Travel delay", "Baggage loss", "Emergency assistance"], 
    exclusions: ["High-risk travel activities"], 
    type: "Regional", matchScore: 87, currency: "USD", isManual: false 
  },
];
