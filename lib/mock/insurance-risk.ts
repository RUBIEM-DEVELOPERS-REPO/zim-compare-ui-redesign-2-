export interface Insurer {
  id: string
  name: string
  logo: string
  rating: number
  trustScore: number
}

export interface Recommendation {
  id: string
  insurerId: string
  productName: string
  type: string
  coverage: string
  benefits: string[]
  estimatedPremiumRange: string
  matchScore: number
  riskLevel: "Low" | "Medium" | "High"
  reasons: string[]
  tags: string[]
}

export const insurers: Insurer[] = [
  { id: "old-mutual", name: "Old Mutual Zimbabwe", logo: "OM", rating: 4.8, trustScore: 98 },
  { id: "zimnat", name: "Zimnat Insurance", logo: "ZM", rating: 4.7, trustScore: 96 },
  { id: "fbc-insurance", name: "FBC Insurance", logo: "FB", rating: 4.5, trustScore: 92 },
  { id: "alliance", name: "Alliance Insurance", logo: "AL", rating: 4.6, trustScore: 94 },
  { id: "nicoz-diamond", name: "NicozDiamond", logo: "ND", rating: 4.7, trustScore: 95 }
]

export const getRecommendations = (assetType: "house" | "car", formData: any): Recommendation[] => {
  if (assetType === "house") {
    return [
      {
        id: "rec-1",
        insurerId: "old-mutual",
        productName: "HomeGuard Premium",
        type: "Comprehensive Home Building",
        coverage: "Buildings & Permanent Fixtures",
        benefits: ["Fire & Weather Damage", "Accidental Breakage", "Alternative Accommodation", "Pubic Liability ($50k)"],
        estimatedPremiumRange: "$850 - $1,200",
        matchScore: 98,
        riskLevel: "Low",
        reasons: [
          "Building materials (Brick) are low risk",
          "Occupancy status reduces theft risk",
          "Regional safety score is within premium range"
        ],
        tags: ["Best Protection", "Reliable Claims"]
      },
      {
        id: "rec-2",
        insurerId: "zimnat",
        productName: "SmartHome Standard",
        type: "Building & Contents Cover",
        coverage: "Assets & Structures",
        benefits: ["Theft & Burglary", "Impact Damage", "Electronic Equipment Add-on"],
        estimatedPremiumRange: "$720 - $950",
        matchScore: 92,
        riskLevel: "Medium",
        reasons: [
          "Good value for mixed contents",
          "High rating for apartment residents"
        ],
        tags: ["Best Value"]
      }
    ]
  } else {
    return [
      {
        id: "rec-3",
        insurerId: "nicoz-diamond",
        productName: "Elite Motor Plus",
        type: "Comprehensive Motor",
        coverage: "Full Damage & Liability",
        benefits: ["Zero Excess Option", "Free Roadside Assistance", "Medical Expenses Cover", "Towing & Recovery"],
        estimatedPremiumRange: "$450 - $680",
        matchScore: 96,
        riskLevel: "Low",
        reasons: [
          "Locked garage storage reduces theft risk",
          "Private usage implies lower wear",
          "Recent model year increases insurability"
        ],
        tags: ["Fastest Claims", "Premium Service"]
      },
      {
        id: "rec-4",
        insurerId: "fbc-insurance",
        productName: "Motor Shield",
        type: "Comprehensive Cover",
        coverage: "Standard Accidental Damage",
        benefits: ["Third Party Liability", "Windscreen Protection", "Passenger Accident"],
        estimatedPremiumRange: "$380 - $550",
        matchScore: 88,
        riskLevel: "Low",
        reasons: [
          "Competitive pricing for private hilux models",
          "Strong partner workshop network"
        ],
        tags: ["Best Value"]
      }
    ]
  }
}
