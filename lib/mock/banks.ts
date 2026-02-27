import type { Bank, BankingProduct, BankLoan, BankFee } from "@/lib/types"

export const banks: Bank[] = [
  // Commercial Banks
  {
    id: "cbz", name: "CBZ Bank", type: "commercial", branches: 62, transparencyScore: 78, digitalScore: 85, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Internet Banking", "USSD", "WhatsApp Banking", "QR Payments"],
    locations: ["Harare", "Bulawayo", "Gweru", "Mutare", "Masvingo", "Chinhoyi", "Marondera", "Kwekwe", "Kadoma", "Victoria Falls"],
    logo: "/placeholder-logo.svg",
    website: "https://www.cbz.co.zw",
    headOfficeAddress: "60 Kwame Nkrumah Avenue, Harare",
    contactPhone: "+263 242 705001",
    contactEmail: "contact@cbz.co.zw"
  },
  {
    id: "stanbic", name: "Stanbic Bank", type: "commercial", branches: 20, transparencyScore: 88, digitalScore: 92, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Internet Banking", "USSD", "Stanbic Card App"],
    locations: ["Harare", "Bulawayo", "Mutare", "Gweru", "Victoria Falls", "Kwekwe"],
    logo: "/placeholder-logo.svg",
    website: "https://www.stanbicbank.co.zw",
    headOfficeAddress: "Stanbic Centre, 59 Samora Machel Avenue, Harare",
    contactPhone: "+263 242 791000",
    contactEmail: "customercarezimbabwe@stanbic.com"
  },
  {
    id: "stanchart", name: "Standard Chartered", type: "commercial", branches: 15, transparencyScore: 85, digitalScore: 90, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Internet Banking", "USSD"],
    locations: ["Harare", "Bulawayo", "Mutare"],
    logo: "/placeholder-logo.svg",
    website: "https://www.sc.com/zw",
    headOfficeAddress: "John Boyne House, 38 Speke Avenue, Harare",
    contactPhone: "+263 242 758000",
    contactEmail: "customer.care@sc.com"
  },
  {
    id: "fbc", name: "FBC Bank", type: "commercial", branches: 18, transparencyScore: 82, digitalScore: 88, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Internet Banking", "USSD", "WhatsApp Banking"],
    locations: ["Harare", "Bulawayo", "Mutare", "Gweru", "Zvishavane"],
    logo: "/placeholder-logo.svg",
    website: "https://www.fbc.co.zw",
    headOfficeAddress: "FBC Centre, 45 Nelson Mandela Avenue, Harare",
    contactPhone: "+263 242 783200",
    contactEmail: "help@fbc.co.zw"
  },
  {
    id: "steward", name: "Steward Bank", type: "commercial", branches: 25, transparencyScore: 80, digitalScore: 95, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Internet Banking", "USSD", "WhatsApp Banking", "Kashagi Loans"],
    locations: ["Harare", "Bulawayo", "Gweru", "Mutare", "Masvingo"],
    logo: "/placeholder-logo.svg",
    website: "https://www.stewardbank.co.zw",
    headOfficeAddress: "101 Union Avenue Building, Harare",
    contactPhone: "+263 242 253000",
    contactEmail: "customerservice@stewardbank.co.zw"
  },
  {
    id: "nmb", name: "NMB Bank", type: "commercial", branches: 12, transparencyScore: 84, digitalScore: 89, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Internet Banking", "USSD"],
    locations: ["Harare", "Bulawayo", "Mutare", "Gweru"],
    logo: "/placeholder-logo.svg",
    website: "https://nmbz.co.zw",
    headOfficeAddress: "First Floor, Unity Court, 1st Street/Kwame Nkrumah, Harare",
    contactPhone: "+263 242 759651",
    contactEmail: "enquiries@nmbz.co.zw"
  },
  {
    id: "zb", name: "ZB Bank", type: "commercial", branches: 45, transparencyScore: 75, digitalScore: 82, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Internet Banking", "USSD"],
    locations: ["Harare", "Bulawayo", "Gweru", "Mutare", "Masvingo", "Kwekwe"],
    logo: "/placeholder-logo.svg",
    website: "https://www.zb.co.zw",
    headOfficeAddress: "21 Natal Road, Avondale, Harare",
    contactPhone: "+263 242 301000",
    contactEmail: "info@zb.co.zw"
  },
  {
    id: "fcb", name: "First Capital Bank", type: "commercial", branches: 32, transparencyScore: 81, digitalScore: 86, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Internet Banking", "USSD"],
    locations: ["Harare", "Bulawayo", "Mutare", "Gweru", "Masvingo"],
    logo: "/placeholder-logo.svg",
    website: "https://firstcapitalbank.co.zw",
    headOfficeAddress: "Barclay House, Cnr First St/Jason Moyo Ave, Harare",
    contactPhone: "+263 242 758000",
    contactEmail: "customerquery@firstcapitalbank.co.zw"
  },
  {
    id: "bancabc", name: "BancABC", type: "commercial", branches: 22, transparencyScore: 79, digitalScore: 87, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Internet Banking", "USSD"],
    locations: ["Harare", "Bulawayo", "Mutare", "Gweru"],
    logo: "/placeholder-logo.svg",
    website: "https://www.bancabc.co.zw",
    headOfficeAddress: "1 Endeavour Crescent, Mt Pleasant, Harare",
    contactPhone: "+263 242 369000",
    contactEmail: "helpdesk@bancabc.com"
  },
  {
    id: "ecobank", name: "Ecobank Zimbabwe", type: "commercial", branches: 14, transparencyScore: 83, digitalScore: 91, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Internet Banking", "USSD", "Omni Lite"],
    locations: ["Harare", "Bulawayo", "Mutare"],
    logo: "/placeholder-logo.svg",
    website: "https://www.ecobank.com/zimbabwe",
    headOfficeAddress: "Block A, Sam Levy's Office Park, Borrowdale, Harare",
    contactPhone: "+263 242 851644",
    contactEmail: "infozw@ecobank.com"
  },
  {
    id: "posb", name: "POSB", type: "commercial", branches: 55, transparencyScore: 76, digitalScore: 78, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Internet Banking", "USSD"],
    locations: ["Harare", "Bulawayo", "Gweru", "Mutare", "Masvingo"],
    logo: "/placeholder-logo.svg",
    website: "https://www.posb.co.zw",
    headOfficeAddress: "Causeway Post Office Building, Harare",
    contactPhone: "+263 242 252595",
    contactEmail: "info@posb.co.zw"
  },
  {
    id: "metbank", name: "MetBank", type: "commercial", branches: 8, transparencyScore: 70, digitalScore: 75, products: [], fees: [],
    digitalFeatures: ["Internet Banking", "USSD"],
    locations: ["Harare", "Bulawayo"],
    logo: "/placeholder-logo.svg",
    website: "https://www.metbank.co.zw",
    headOfficeAddress: "Metropolitan House, 3 Central Avenue, Harare",
    contactPhone: "+263 242 706001",
    contactEmail: "info@metbank.co.zw"
  },
  {
    id: "afc", name: "AFC Commercial Bank", type: "commercial", branches: 40, transparencyScore: 74, digitalScore: 80, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Internet Banking", "USSD"],
    locations: ["Harare", "Bulawayo", "Gweru", "Mutare", "Masvingo"],
    logo: "/placeholder-logo.svg",
    website: "https://www.afc.co.zw/commercial-bank",
    headOfficeAddress: "Hurudza House, 14-16 Nelson Mandela Avenue, Harare",
    contactPhone: "+263 242 758000",
    contactEmail: "info@afc.co.zw"
  },
  {
    id: "nedbank", name: "Nedbank Zimbabwe", type: "commercial", branches: 10, transparencyScore: 86, digitalScore: 88, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Internet Banking", "USSD"],
    locations: ["Harare", "Bulawayo", "Mutare"],
    logo: "/placeholder-logo.svg",
    website: "https://www.nedbank.co.zw",
    headOfficeAddress: "Nedbank Centre, Jason Moyo/14th Ave, Bulawayo",
    contactPhone: "+263 242 791000",
    contactEmail: "customercare@nedbank.co.zw"
  },
  // Building Societies
  {
    id: "cabs", name: "CABS", type: "building_society", branches: 50, transparencyScore: 87, digitalScore: 90, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Internet Banking", "USSD", "WhatsApp Banking"],
    locations: ["Harare", "Bulawayo", "Mutare", "Gweru", "Masvingo"],
    logo: "/placeholder-logo.svg",
    website: "https://www.cabs.co.zw",
    headOfficeAddress: "Northridge Park, Northend Road, Highlands, Harare",
    contactPhone: "+263 242 883823",
    contactEmail: "info@cabs.co.zw"
  },
  {
    id: "nbs", name: "National Building Society", type: "building_society", branches: 10, transparencyScore: 78, digitalScore: 84, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Internet Banking", "USSD"],
    locations: ["Harare", "Bulawayo", "Mutare", "Gweru"],
    logo: "/placeholder-logo.svg",
    website: "https://www.nbs.co.zw",
    headOfficeAddress: "14th Floor, SSC Building, Sam Nujoma St, Harare",
    contactPhone: "+263 242 791000",
    contactEmail: "info@nbs.co.zw"
  },
  // Microfinance Banks
  {
    id: "empower", name: "EmpowerBank", type: "microfinance", branches: 5, transparencyScore: 73, digitalScore: 70, products: [], fees: [],
    digitalFeatures: ["Mobile App", "USSD"],
    locations: ["Harare", "Bulawayo", "Mutare"],
    logo: "/placeholder-logo.svg",
    website: "https://www.empowerbank.co.zw",
    headOfficeAddress: "60 West Road, Avondale, Harare",
    contactPhone: "+263 242 301000",
    contactEmail: "info@empowerbank.co.zw"
  },
  {
    id: "getbucks", name: "GetBucks Microfinance Bank", type: "microfinance", branches: 10, transparencyScore: 77, digitalScore: 82, products: [], fees: [],
    digitalFeatures: ["Mobile App", "Web Portal", "USSD"],
    locations: ["Harare", "Bulawayo", "Mutare", "Gweru"],
    logo: "/placeholder-logo.svg",
    website: "https://www.getbucks.com/zw",
    headOfficeAddress: "GetBucks Building, 15 Phillips Avenue, Belgravia, Harare",
    contactPhone: "+263 242 791000",
    contactEmail: "info.zim@getbucks.com"
  },
  {
    id: "success", name: "Success Microfinance Bank", type: "microfinance", branches: 3, transparencyScore: 71, digitalScore: 68, products: [], fees: [],
    digitalFeatures: ["USSD", "Mobile App"],
    locations: ["Harare"],
    logo: "/placeholder-logo.svg",
    website: "https://www.successmfb.co.zw",
    headOfficeAddress: "1282 Waterfall Avenue, Waterfall, Harare",
    contactPhone: "+263 242 706001",
    contactEmail: "info@successmfb.co.zw"
  },
  {
    id: "lion", name: "Lion Microfinance Bank", type: "microfinance", branches: 2, transparencyScore: 69, digitalScore: 65, products: [], fees: [],
    digitalFeatures: ["USSD", "Mobile App"],
    locations: ["Harare"],
    logo: "/placeholder-logo.svg",
    website: "https://lionmicrofinance.co.zw",
    headOfficeAddress: "13 Jason Moyo Avenue, Harare",
    contactPhone: "+263 242 758000",
    contactEmail: "info@lionmicrofinance.co.zw"
  },
  {
    id: "tetrad", name: "Tetrad Investment Bank", type: "commercial", branches: 1, transparencyScore: 65, digitalScore: 60, products: [], fees: [],
    digitalFeatures: ["Internet Banking"],
    locations: ["Harare"],
    logo: "/placeholder-logo.svg",
    website: "http://www.tetrad.co.zw",
    headOfficeAddress: "Tetrad House, 30 Josiah Chinamano Avenue, Harare",
    contactPhone: "+263 242 706001",
    contactEmail: "info@tetrad.co.zw"
  }
]


export const bankingProducts: BankingProduct[] = [
  // CBZ
  { id: "cbz-sav", bankId: "cbz", bankName: "CBZ Bank", category: "savings", name: "CBZ Savings Plus", interestRate: 3.5, minBalance: 5, monthlyFee: 2, perks: ["Free statements", "Debit card", "Mobile Banking"] },
  { id: "cbz-cur", bankId: "cbz", bankName: "CBZ Bank", category: "current", name: "CBZ Current Account", interestRate: 0, minBalance: 20, monthlyFee: 5, perks: ["Cheque book", "Overdraft facility", "Internet Banking"] },
  { id: "cbz-stu", bankId: "cbz", bankName: "CBZ Bank", category: "student", name: "CBZ Student Account", interestRate: 1.0, minBalance: 0, monthlyFee: 0, perks: ["Free card", "Zero monthly fee", "Digital alerts"] },
  { id: "cbz-sal", bankId: "cbz", bankName: "CBZ Bank", category: "salary", name: "CBZ Salary Account", interestRate: 0.5, minBalance: 0, monthlyFee: 3, perks: ["Salary advance", "Reduced loan rates", "Life cover"] },
  { id: "cbz-sme", bankId: "cbz", bankName: "CBZ Bank", category: "sme", name: "CBZ SME Business", interestRate: 0.8, minBalance: 50, monthlyFee: 8, perks: ["POS terminal", "Business advisory", "Trade finance"] },
  // Stanbic
  { id: "stan-sav", bankId: "stanbic", bankName: "Stanbic Bank", category: "savings", name: "Stanbic PureSave", interestRate: 4.0, minBalance: 10, monthlyFee: 1.5, perks: ["Goal savings", "Auto-save", "High visibility"] },
  { id: "stan-cur", bankId: "stanbic", bankName: "Stanbic Bank", category: "current", name: "Stanbic Transact", interestRate: 0, minBalance: 25, monthlyFee: 4.5, perks: ["Unlimited transfers", "Priority service", "Cardless ATM"] },
  { id: "stan-stu", bankId: "stanbic", bankName: "Stanbic Bank", category: "student", name: "Stanbic Student Account", interestRate: 2.0, minBalance: 0, monthlyFee: 0, perks: ["Free Blue Card", "App access", "Lifestyle discounts"] },
  { id: "stan-sal", bankId: "stanbic", bankName: "Stanbic Bank", category: "salary", name: "Stanbic Salary Connect", interestRate: 1.0, minBalance: 0, monthlyFee: 3, perks: ["Personal loan access", "Funeral cover", "Mobile App"] },
  { id: "stan-sme", bankId: "stanbic", bankName: "Stanbic Bank", category: "sme", name: "Stanbic Business Account", interestRate: 0.5, minBalance: 50, monthlyFee: 8, perks: ["POS terminal", "Business advisory", "FX services"] },
  // Standard Chartered
  { id: "sc-sav", bankId: "stanchart", bankName: "Standard Chartered", category: "savings", name: "SC Savings Account", interestRate: 2.5, minBalance: 100, monthlyFee: 5, perks: ["Priority Banking", "Global access", "Secure online"] },
  { id: "sc-cur", bankId: "stanchart", bankName: "Standard Chartered", category: "current", name: "SC Current Account", interestRate: 0, minBalance: 500, monthlyFee: 10, perks: ["Cheque book", "Priority service", "Lounge access"] },
  { id: "sc-sal", bankId: "stanchart", bankName: "Standard Chartered", category: "salary", name: "SC Salary Plus", interestRate: 0.5, minBalance: 0, monthlyFee: 7, perks: ["Global rewards", "Salary advance", "Real-time alerts"] },
  { id: "sc-sme", bankId: "stanchart", bankName: "Standard Chartered", category: "sme", name: "SC Business Pro", interestRate: 0.2, minBalance: 200, monthlyFee: 15, perks: ["Business toolkit", "FX consulting", "Swift transfers"] },
  // FBC
  { id: "fbc-sav", bankId: "fbc", bankName: "FBC Bank", category: "savings", name: "FBC Save Smart", interestRate: 3.0, minBalance: 5, monthlyFee: 2, perks: ["Mobile alerts", "Easy withdrawals", "Secure"] },
  { id: "fbc-cur", bankId: "fbc", bankName: "FBC Bank", category: "current", name: "FBC Current Account", interestRate: 0, minBalance: 20, monthlyFee: 5, perks: ["Overdraft", "Cheque book", "POS access"] },
  { id: "fbc-stu", bankId: "fbc", bankName: "FBC Bank", category: "student", name: "FBC Student Saver", interestRate: 1.5, minBalance: 0, monthlyFee: 0, perks: ["Free card", "App access", "Zero fee"] },
  { id: "fbc-sal", bankId: "fbc", bankName: "FBC Bank", category: "salary", name: "FBC Salary Plus", interestRate: 0.5, minBalance: 0, monthlyFee: 3.5, perks: ["Loan access", "Insurance discount", "Bonus rewards"] },
  { id: "fbc-sme", bankId: "fbc", bankName: "FBC Bank", category: "sme", name: "FBC Business Plus", interestRate: 0.5, minBalance: 50, monthlyFee: 7, perks: ["SME Loans", "POS terminal", "Business networking"] },
  // Steward
  { id: "stew-sav", bankId: "steward", bankName: "Steward Bank", category: "savings", name: "Steward EcoSave", interestRate: 2.5, minBalance: 1, monthlyFee: 1, perks: ["EcoCash integration", "Low minimums", "ZimSwitch"] },
  { id: "stew-cur", bankId: "steward", bankName: "Steward Bank", category: "current", name: "Steward Current", interestRate: 0, minBalance: 10, monthlyFee: 4, perks: ["Quick access", "EcoCash Link", "App access"] },
  { id: "stew-stu", bankId: "steward", bankName: "Steward Bank", category: "student", name: "Steward Student", interestRate: 1.5, minBalance: 0, monthlyFee: 0, perks: ["Free card", "App access", "Social media data"] },
  { id: "stew-sal", bankId: "steward", bankName: "Steward Bank", category: "salary", name: "Steward Salary Account", interestRate: 0.5, minBalance: 0, monthlyFee: 2, perks: ["EcoCash Sweep", "Salary advance", "Medical cover"] },
  { id: "stew-sme", bankId: "steward", bankName: "Steward Bank", category: "sme", name: "Steward SME Business", interestRate: 0.3, minBalance: 30, monthlyFee: 6, perks: ["POS services", "Merchant dashboard", "Micro-loans"] },
  // NMB
  { id: "nmb-sav", bankId: "nmb", bankName: "NMB Bank", category: "savings", name: "NMB Smart Save", interestRate: 3.2, minBalance: 5, monthlyFee: 2, perks: ["Free ATM withdrawals x2", "Digital tokens", "E-statements"] },
  { id: "nmb-cur", bankId: "nmb", bankName: "NMB Bank", category: "current", name: "NMB NMBLite", interestRate: 0, minBalance: 25, monthlyFee: 5.5, perks: ["Debit card", "Online portals", "ZimSwitch"] },
  { id: "nmb-stu", bankId: "nmb", bankName: "NMB Bank", category: "student", name: "NMB Student Pro", interestRate: 2.0, minBalance: 0, monthlyFee: 0, perks: ["No monthly fee", "Free App", "Instant alerts"] },
  { id: "nmb-sal", bankId: "nmb", bankName: "NMB Bank", category: "salary", name: "NMB Salary Save", interestRate: 0.8, minBalance: 0, monthlyFee: 2.75, perks: ["Mortgage priority", "Loan access", "App access"] },
  { id: "nmb-sme", bankId: "nmb", bankName: "NMB Bank", category: "sme", name: "NMB Business Account", interestRate: 0.3, minBalance: 30, monthlyFee: 6, perks: ["Trade finance", "FX services", "Business advisor"] },
  // ZB
  { id: "zb-sav", bankId: "zb", bankName: "ZB Bank", category: "savings", name: "ZB Savings Plan", interestRate: 3.0, minBalance: 5, monthlyFee: 1.5, perks: ["Market rates", "Secure", "ZimSwitch"] },
  { id: "zb-cur", bankId: "zb", bankName: "ZB Bank", category: "current", name: "ZB Premium Current", interestRate: 0, minBalance: 50, monthlyFee: 7, perks: ["Priority banking", "Airport lounge", "Concierge"] },
  { id: "zb-stu", bankId: "zb", bankName: "ZB Bank", category: "student", name: "ZB Stash", interestRate: 2.5, minBalance: 2, monthlyFee: 1, perks: ["App access", "Student discounts", "Low fees"] },
  { id: "zb-sal", bankId: "zb", bankName: "ZB Bank", category: "salary", name: "ZB Salary Account", interestRate: 0.5, minBalance: 0, monthlyFee: 3, perks: ["Affordable loans", "Funeral life", "App support"] },
  { id: "zb-sme", bankId: "zb", bankName: "ZB Bank", category: "sme", name: "ZB SME Business", interestRate: 0.4, minBalance: 100, monthlyFee: 8, perks: ["Agro-finance", "POS terminal", "Trade support"] },
  // First Capital Bank
  { id: "fcb-sav", bankId: "fcb", bankName: "First Capital Bank", category: "savings", name: "FCB Savings Saver", interestRate: 2.8, minBalance: 20, monthlyFee: 3, perks: ["Tiered interest", "App access", "ZimSwitch"] },
  { id: "fcb-cur", bankId: "fcb", bankName: "First Capital Bank", category: "current", name: "FCB Personal Current", interestRate: 0, minBalance: 50, monthlyFee: 6, perks: ["Cheque book", "Online banking", "Alerts"] },
  { id: "fcb-stu", bankId: "fcb", bankName: "First Capital Bank", category: "student", name: "FCB Student Pro", interestRate: 1.2, minBalance: 0, monthlyFee: 0, perks: ["Zero fee", "Digital card", "App features"] },
  { id: "fcb-sal", bankId: "fcb", bankName: "First Capital Bank", category: "salary", name: "FCB Salary Secure", interestRate: 0.5, minBalance: 0, monthlyFee: 4, perks: ["Insurance link", "Swift transfers", "Alerts"] },
  { id: "fcb-sme", bankId: "fcb", bankName: "First Capital Bank", category: "sme", name: "FCB Business Advantage", interestRate: 0.3, minBalance: 100, monthlyFee: 10, perks: ["Overdraft", "POS terminal", "FX management"] },
  // BancABC
  { id: "babc-sav", bankId: "bancabc", bankName: "BancABC", category: "savings", name: "BancABC Super Saver", interestRate: 3.1, minBalance: 10, monthlyFee: 0, perks: ["Bonus interest", "No maintenance", "ZimSwitch"] },
  { id: "babc-cur", bankId: "bancabc", bankName: "BancABC", category: "current", name: "BancABC Transact", interestRate: 0, minBalance: 20, monthlyFee: 5, perks: ["A-Life access", "Global card", "Online banking"] },
  { id: "babc-stu", bankId: "bancabc", bankName: "BancABC", category: "student", name: "BancABC Student Life", interestRate: 1.5, minBalance: 0, monthlyFee: 0, perks: ["Free card", "App usage", "Data deals"] },
  { id: "babc-sal", bankId: "bancabc", bankName: "BancABC", category: "salary", name: "BancABC Payroll", interestRate: 0.6, minBalance: 0, monthlyFee: 3, perks: ["Salary loan", "Asset finance", "Rewards"] },
  { id: "babc-sme", bankId: "bancabc", bankName: "BancABC", category: "sme", name: "BancABC Enterprise", interestRate: 0.4, minBalance: 50, monthlyFee: 7, perks: ["Capital loans", "POS terminal", "E-commerce"] },
  // Ecobank
  { id: "eco-sav", bankId: "ecobank", bankName: "Ecobank Zimbabwe", category: "savings", name: "Ecobank Save", interestRate: 2.5, minBalance: 50, monthlyFee: 2, perks: ["Pan-African access", "App access", "Secure"] },
  { id: "eco-cur", bankId: "ecobank", bankName: "Ecobank Zimbabwe", category: "current", name: "Ecobank Current", interestRate: 0, minBalance: 100, monthlyFee: 8, perks: ["Rapid transfer", "Cheque book", "Internet banking"] },
  { id: "eco-sal", bankId: "ecobank", bankName: "Ecobank Zimbabwe", category: "salary", name: "Ecobank Workplace", interestRate: 0.5, minBalance: 0, monthlyFee: 5, perks: ["Regional banking", "Loan priority", "App usage"] },
  { id: "eco-sme", bankId: "ecobank", bankName: "Ecobank Zimbabwe", category: "sme", name: "Ecobank SME Connect", interestRate: 0.3, minBalance: 200, monthlyFee: 12, perks: ["Merchant tools", "Trade support", "FX services"] },
  // POSB
  { id: "posb-sav", bankId: "posb", bankName: "POSB", category: "savings", name: "POSB Basic Savings", interestRate: 2.0, minBalance: 1, monthlyFee: 0.5, perks: ["Lowest fees", "Nationwide access", "ZimSwitch"] },
  { id: "posb-cur", bankId: "posb", bankName: "POSB", category: "current", name: "POSB Smart Current", interestRate: 0, minBalance: 5, monthlyFee: 2, perks: ["Debit card", "Bills payment", "Low fee"] },
  { id: "posb-stu", bankId: "posb", bankName: "POSB", category: "student", name: "POSB Student Saver", interestRate: 1.0, minBalance: 0, monthlyFee: 0, perks: ["Free card", "USSD access", "Zero maintenance"] },
  { id: "posb-sal", bankId: "posb", bankName: "POSB", category: "salary", name: "POSB Salary Plus", interestRate: 0.3, minBalance: 0, monthlyFee: 1.5, perks: ["Instant salary", "Loan access", "Simple banking"] },
  // MetBank
  { id: "met-sav", bankId: "metbank", bankName: "MetBank", category: "savings", name: "MetBank Wealth Save", interestRate: 2.5, minBalance: 10, monthlyFee: 1.5, perks: ["Tiered rates", "In-branch priority", "App tokens"] },
  { id: "met-cur", bankId: "metbank", bankName: "MetBank", category: "current", name: "MetBank Current", interestRate: 0, minBalance: 10, monthlyFee: 3, perks: ["Debit card", "ZimSwitch", "Cheque book"] },
  { id: "met-sme", bankId: "metbank", bankName: "MetBank", category: "sme", name: "MetBank Business", interestRate: 0.2, minBalance: 50, monthlyFee: 5, perks: ["SME support", "POS access", "Agro-focus"] },
  // AFC
  { id: "afc-sav", bankId: "afc", bankName: "AFC Commercial Bank", category: "savings", name: "AFC Save Smart", interestRate: 3.0, minBalance: 5, monthlyFee: 2, perks: ["Agro-link", "Easy save", "Mobile Banking"] },
  { id: "afc-cur", bankId: "afc", bankName: "AFC Commercial Bank", category: "current", name: "AFC Transactional", interestRate: 0, minBalance: 15, monthlyFee: 4, perks: ["Debit card", "ZimSwitch", "Bills payment"] },
  { id: "afc-sal", bankId: "afc", bankName: "AFC Commercial Bank", category: "salary", name: "AFC Salary Account", interestRate: 0.6, minBalance: 0, monthlyFee: 3, perks: ["Farmer loans", "Salary advance", "App tokens"] },
  { id: "afc-sme", bankId: "afc", bankName: "AFC Commercial Bank", category: "sme", name: "AFC Business Growth", interestRate: 0.5, minBalance: 50, monthlyFee: 6, perks: ["Agro-business support", "POS terminal", "Trade finance"] },
  // Nedbank
  { id: "ned-sav", bankId: "nedbank", bankName: "Nedbank Zimbabwe", category: "savings", name: "Nedbank GreenSave", interestRate: 3.5, minBalance: 10, monthlyFee: 2, perks: ["Green rewards", "App tokens", "Digital access"] },
  { id: "ned-cur", bankId: "nedbank", bankName: "Nedbank Zimbabwe", category: "current", name: "Nedbank Green Current", interestRate: 0, minBalance: 50, monthlyFee: 6, perks: ["Cheque book", "Cardless withdrawal", "Internet banking"] },
  { id: "ned-stu", bankId: "nedbank", bankName: "Nedbank Zimbabwe", category: "student", name: "Nedbank UniLife", interestRate: 1.8, minBalance: 0, monthlyFee: 0, perks: ["Free card", "App features", "Lifestyle deals"] },
  { id: "ned-sal", bankId: "nedbank", bankName: "Nedbank Zimbabwe", category: "salary", name: "Nedbank Payroll Plus", interestRate: 0.7, minBalance: 0, monthlyFee: 4, perks: ["Regional banking", "Loan priority", "Rewards"] },
  { id: "ned-sme", bankId: "nedbank", bankName: "Nedbank Zimbabwe", category: "sme", name: "Nedbank SME Pro", interestRate: 0.4, minBalance: 150, monthlyFee: 10, perks: ["Business advisor", "POS services", "Trade finance"] },
  // CABS
  { id: "cabs-sav", bankId: "cabs", bankName: "CABS", category: "savings", name: "CABS TeleSave", interestRate: 3.8, minBalance: 5, monthlyFee: 1.5, perks: ["Textacash access", "Mobile banking", "ZimSwitch"] },
  { id: "cabs-cur", bankId: "cabs", bankName: "CABS", category: "current", name: "CABS Transactional", interestRate: 0, minBalance: 15, monthlyFee: 3.5, perks: ["Overdraft", "Cheque book", "POS access"] },
  { id: "cabs-stu", bankId: "cabs", bankName: "CABS", category: "student", name: "CABS Student Saver", interestRate: 2.0, minBalance: 0, monthlyFee: 0, perks: ["Free card", "SMS alerts", "App access"] },
  { id: "cabs-sal", bankId: "cabs", bankName: "CABS", category: "salary", name: "CABS Salary Account", interestRate: 0.8, minBalance: 0, monthlyFee: 2, perks: ["Loan priority", "Funeral cover", "ZimSwitch"] },
  { id: "cabs-sme", bankId: "cabs", bankName: "CABS", category: "sme", name: "CABS Business Start", interestRate: 0.6, minBalance: 100, monthlyFee: 8, perks: ["SME Credit", "POS terminal", "Business tools"] },
  // Tetrad
  { id: "tet-sav", bankId: "tetrad", bankName: "Tetrad Investment Bank", category: "savings", name: "Tetrad Fixed Yield", interestRate: 4.5, minBalance: 500, monthlyFee: 10, perks: ["Investment focus", "High yield", "Wealth management"] },
  { id: "tet-sme", bankId: "tetrad", bankName: "Tetrad Investment Bank", category: "sme", name: "Tetrad Business Pro", interestRate: 0, minBalance: 1000, monthlyFee: 20, perks: ["Corporate advisory", "Trade finance", "Asset management"] },
]

export const bankLoans: BankLoan[] = [
  // CBZ
  { id: "cbz-pl", bankId: "cbz", bankName: "CBZ Bank", category: "personal", name: "CBZ Personal Loan", apr: 12, initiationFee: 50, earlySettlementPenalty: 3, maxTermMonths: 36, requirements: ["Payslip", "3 months bank statements", "Valid ID"] },
  { id: "cbz-sme", bankId: "cbz", bankName: "CBZ Bank", category: "sme", name: "CBZ SME Facility", apr: 11, initiationFee: 100, earlySettlementPenalty: 4, maxTermMonths: 60, requirements: ["Business registration", "Financial statements"] },
  { id: "cbz-ml", bankId: "cbz", bankName: "CBZ Bank", category: "mortgage", name: "CBZ Home Loan", apr: 8.5, initiationFee: 200, earlySettlementPenalty: 5, maxTermMonths: 240, requirements: ["Proof of income", "Title deed"] },
  { id: "cbz-vl", bankId: "cbz", bankName: "CBZ Bank", category: "vehicle", name: "CBZ Vehicle Finance", apr: 9.5, initiationFee: 75, earlySettlementPenalty: 3, maxTermMonths: 60, requirements: ["Payslip", "Vehicle quotation"] },
  { id: "cbz-sl", bankId: "cbz", bankName: "CBZ Bank", category: "salary_based", name: "CBZ Salary Advance", apr: 14, initiationFee: 20, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },

  // Stanbic
  { id: "stan-pl", bankId: "stanbic", bankName: "Stanbic Bank", category: "personal", name: "Stanbic Personal Loan", apr: 11, initiationFee: 45, earlySettlementPenalty: 2.5, maxTermMonths: 48, requirements: ["Payslip", "6 months bank statements"] },
  { id: "stan-sme", bankId: "stanbic", bankName: "Stanbic Bank", category: "sme", name: "Stanbic SME Facility", apr: 10, initiationFee: 100, earlySettlementPenalty: 4, maxTermMonths: 60, requirements: ["Business registration", "Business plan"] },
  { id: "stan-ml", bankId: "stanbic", bankName: "Stanbic Bank", category: "mortgage", name: "Stanbic Home Loan", apr: 9.0, initiationFee: 150, earlySettlementPenalty: 4, maxTermMonths: 240, requirements: ["Proof of income", "Title deed"] },
  { id: "stan-vl", bankId: "stanbic", bankName: "Stanbic Bank", category: "vehicle", name: "Stanbic Vehicle Loan", apr: 9.8, initiationFee: 80, earlySettlementPenalty: 3, maxTermMonths: 60, requirements: ["Payslip", "Pro-forma invoice"] },
  { id: "stan-sl", bankId: "stanbic", bankName: "Stanbic Bank", category: "salary_based", name: "Stanbic Salary Advance", apr: 13, initiationFee: 25, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },

  // Standard Chartered
  { id: "sc-pl", bankId: "stanchart", bankName: "Standard Chartered", category: "personal", name: "SC Express Loan", apr: 10.5, initiationFee: 60, earlySettlementPenalty: 2, maxTermMonths: 48, requirements: ["High income proof", "Employment contract"] },
  { id: "sc-sme", bankId: "stanchart", bankName: "Standard Chartered", category: "sme", name: "SC SME Advantage", apr: 9.5, initiationFee: 120, earlySettlementPenalty: 3, maxTermMonths: 60, requirements: ["Business financials", "Director IDs"] },
  { id: "sc-ml", bankId: "stanchart", bankName: "Standard Chartered", category: "mortgage", name: "SC Priority Mortgage", apr: 8.0, initiationFee: 250, earlySettlementPenalty: 5, maxTermMonths: 300, requirements: ["Proof of income", "Bond registration"] },
  { id: "sc-sl", bankId: "stanchart", bankName: "Standard Chartered", category: "salary_based", name: "SC Salary Advance", apr: 12, initiationFee: 30, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },

  // FBC
  { id: "fbc-pl", bankId: "fbc", bankName: "FBC Bank", category: "personal", name: "FBC Personal Loan", apr: 12.5, initiationFee: 55, earlySettlementPenalty: 3, maxTermMonths: 36, requirements: ["Payslip", "Proof of residence"] },
  { id: "fbc-sme", bankId: "fbc", bankName: "FBC Bank", category: "sme", name: "FBC SME Support", apr: 10.8, initiationFee: 90, earlySettlementPenalty: 4, maxTermMonths: 48, requirements: ["Company profile", "Cash flow projections"] },
  { id: "fbc-ml", bankId: "fbc", bankName: "FBC Bank", category: "mortgage", name: "FBC Home Loan", apr: 9.2, initiationFee: 180, earlySettlementPenalty: 5, maxTermMonths: 200, requirements: ["Payslip", "Title deed"] },
  { id: "fbc-vl", bankId: "fbc", bankName: "FBC Bank", category: "vehicle", name: "FBC Vehicle Finance", apr: 9.5, initiationFee: 75, earlySettlementPenalty: 3, maxTermMonths: 60, requirements: ["Vehicle quotation", "Valuation"] },
  { id: "fbc-sl", bankId: "fbc", bankName: "FBC Bank", category: "salary_based", name: "FBC Salary Advance", apr: 15, initiationFee: 15, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },

  // Steward
  { id: "stew-pl", bankId: "steward", bankName: "Steward Bank", category: "personal", name: "Steward Personal Loan", apr: 13, initiationFee: 40, earlySettlementPenalty: 2, maxTermMonths: 24, requirements: ["National ID", "Payslip"] },
  { id: "stew-sme", bankId: "steward", bankName: "Steward Bank", category: "sme", name: "Steward SME Micro", apr: 12, initiationFee: 50, earlySettlementPenalty: 2, maxTermMonths: 36, requirements: ["Business details", "Bank statements"] },
  { id: "stew-sl", bankId: "steward", bankName: "Steward Bank", category: "salary_based", name: "Steward Salary Loan", apr: 13, initiationFee: 30, earlySettlementPenalty: 2, maxTermMonths: 24, requirements: ["Employment confirmation"] },
  { id: "stew-vl", bankId: "steward", bankName: "Steward Bank", category: "vehicle", name: "Steward Wheels", apr: 11, initiationFee: 60, earlySettlementPenalty: 3, maxTermMonths: 48, requirements: ["Invoice", "Insurance"] },

  // NMB
  { id: "nmb-pl", bankId: "nmb", bankName: "NMB Bank", category: "personal", name: "NMB Quick Loan", apr: 14, initiationFee: 25, earlySettlementPenalty: 2, maxTermMonths: 24, requirements: ["Valid ID", "3 months payslips"] },
  { id: "nmb-sme", bankId: "nmb", bankName: "NMB Bank", category: "sme", name: "NMB SME Grow", apr: 11, initiationFee: 100, earlySettlementPenalty: 3, maxTermMonths: 60, requirements: ["Business registration", "Asset pledge"] },
  { id: "nmb-ml", bankId: "nmb", bankName: "NMB Bank", category: "mortgage", name: "NMB Home Loan", apr: 9.5, initiationFee: 150, earlySettlementPenalty: 4, maxTermMonths: 240, requirements: ["Proof of income", "Property details"] },
  { id: "nmb-vl", bankId: "nmb", bankName: "NMB Bank", category: "vehicle", name: "NMB Car Loan", apr: 10, initiationFee: 80, earlySettlementPenalty: 3, maxTermMonths: 60, requirements: ["Pro-forma invoice"] },
  { id: "nmb-sl", bankId: "nmb", bankName: "NMB Bank", category: "salary_based", name: "NMB Salary Advance", apr: 16, initiationFee: 10, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },

  // ZB
  { id: "zb-pl", bankId: "zb", bankName: "ZB Bank", category: "personal", name: "ZB Personal Loan", apr: 12, initiationFee: 50, earlySettlementPenalty: 3.5, maxTermMonths: 36, requirements: ["Payslip", "Bank statements"] },
  { id: "zb-sme", bankId: "zb", bankName: "ZB Bank", category: "sme", name: "ZB Business Loan", apr: 11, initiationFee: 80, earlySettlementPenalty: 3.5, maxTermMonths: 48, requirements: ["Business registration", "Financials"] },
  { id: "zb-ml", bankId: "zb", bankName: "ZB Bank", category: "mortgage", name: "ZB Mortgage", apr: 9.8, initiationFee: 120, earlySettlementPenalty: 5, maxTermMonths: 180, requirements: ["Income proof", "Title deed"] },
  { id: "zb-vl", bankId: "zb", bankName: "ZB Bank", category: "vehicle", name: "ZB Vehicle Finance", apr: 10.5, initiationFee: 70, earlySettlementPenalty: 3, maxTermMonths: 60, requirements: ["Quotation"] },
  { id: "zb-sl", bankId: "zb", bankName: "ZB Bank", category: "salary_based", name: "ZB Salary Advance", apr: 14, initiationFee: 20, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },

  // First Capital Bank
  { id: "fcb-pl", bankId: "fcb", bankName: "First Capital Bank", category: "personal", name: "FCB Personal Loan", apr: 12.5, initiationFee: 40, earlySettlementPenalty: 2.5, maxTermMonths: 36, requirements: ["Payslip", "3 months statements"] },
  { id: "fcb-sme", bankId: "fcb", bankName: "First Capital Bank", category: "sme", name: "FCB Business Loan", apr: 11.5, initiationFee: 100, earlySettlementPenalty: 4, maxTermMonths: 48, requirements: ["Business financials"] },
  { id: "fcb-ml", bankId: "fcb", bankName: "First Capital Bank", category: "mortgage", name: "FCB Home Loan", apr: 9.2, initiationFee: 150, earlySettlementPenalty: 4, maxTermMonths: 240, requirements: ["Property valuation"] },
  { id: "fcb-vl", bankId: "fcb", bankName: "First Capital Bank", category: "vehicle", name: "FCB Auto Loan", apr: 10, initiationFee: 80, earlySettlementPenalty: 3, maxTermMonths: 60, requirements: ["Vehicle invoice"] },
  { id: "fcb-sl", bankId: "fcb", bankName: "First Capital Bank", category: "salary_based", name: "FCB Salary Advance", apr: 15, initiationFee: 20, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },

  // BancABC
  { id: "babc-pl", bankId: "bancabc", bankName: "BancABC", category: "personal", name: "BancABC Personal Loan", apr: 13, initiationFee: 35, earlySettlementPenalty: 2, maxTermMonths: 36, requirements: ["Payslip", "National ID"] },
  { id: "babc-sme", bankId: "bancabc", bankName: "BancABC", category: "sme", name: "BancABC SME Grow", apr: 11.8, initiationFee: 90, earlySettlementPenalty: 3, maxTermMonths: 60, requirements: ["Business plan"] },
  { id: "babc-ml", bankId: "bancabc", bankName: "BancABC", category: "mortgage", name: "BancABC Home Loan", apr: 9.5, initiationFee: 140, earlySettlementPenalty: 4, maxTermMonths: 240, requirements: ["Title deed"] },
  { id: "babc-vl", bankId: "bancabc", bankName: "BancABC", category: "vehicle", name: "BancABC Vehicle Finance", apr: 10.2, initiationFee: 75, earlySettlementPenalty: 3, maxTermMonths: 60, requirements: ["Vehicle quotation"] },
  { id: "babc-sl", bankId: "bancabc", bankName: "BancABC", category: "salary_based", name: "BancABC Salary Advance", apr: 15, initiationFee: 20, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },

  // Ecobank
  { id: "eco-pl", bankId: "ecobank", bankName: "Ecobank Zimbabwe", category: "personal", name: "Ecobank Personal Loan", apr: 11.5, initiationFee: 50, earlySettlementPenalty: 3, maxTermMonths: 48, requirements: ["Payslip", "Bank statements"] },
  { id: "eco-sme", bankId: "ecobank", bankName: "Ecobank Zimbabwe", category: "sme", name: "Ecobank SME Loan", apr: 10.8, initiationFee: 90, earlySettlementPenalty: 3, maxTermMonths: 48, requirements: ["Business registration"] },
  { id: "eco-ml", bankId: "ecobank", bankName: "Ecobank Zimbabwe", category: "mortgage", name: "Ecobank Mortgage", apr: 8.8, initiationFee: 200, earlySettlementPenalty: 5, maxTermMonths: 240, requirements: ["Property details"] },
  { id: "eco-sl", bankId: "ecobank", bankName: "Ecobank Zimbabwe", category: "salary_based", name: "Ecobank Regional Salary", apr: 13, initiationFee: 40, earlySettlementPenalty: 0, maxTermMonths: 24, requirements: ["Employment certificate"] },

  // POSB
  { id: "posb-pl", bankId: "posb", bankName: "POSB", category: "personal", name: "POSB Personal Loan", apr: 14.5, initiationFee: 20, earlySettlementPenalty: 2, maxTermMonths: 24, requirements: ["Payslip", "ID"] },
  { id: "posb-sme", bankId: "posb", bankName: "POSB", category: "sme", name: "POSB Business Loan", apr: 12, initiationFee: 50, earlySettlementPenalty: 3, maxTermMonths: 36, requirements: ["Business details"] },
  { id: "posb-sl", bankId: "posb", bankName: "POSB", category: "salary_based", name: "POSB Salary Advance", apr: 16, initiationFee: 10, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },
  { id: "posb-ml", bankId: "posb", bankName: "POSB", category: "mortgage", name: "POSB Home Scheme", apr: 10.5, initiationFee: 100, earlySettlementPenalty: 4, maxTermMonths: 180, requirements: ["Proof of income"] },

  // MetBank
  { id: "met-pl", bankId: "metbank", bankName: "MetBank", category: "personal", name: "MetBank Personal", apr: 15, initiationFee: 30, earlySettlementPenalty: 2, maxTermMonths: 24, requirements: ["Payslip"] },
  { id: "met-sme", bankId: "metbank", bankName: "MetBank", category: "sme", name: "MetBank SME Growth", apr: 12.5, initiationFee: 60, earlySettlementPenalty: 3, maxTermMonths: 36, requirements: ["Business registration"] },
  { id: "met-vl", bankId: "metbank", bankName: "MetBank", category: "vehicle", name: "MetBank Auto Finance", apr: 11.5, initiationFee: 50, earlySettlementPenalty: 3, maxTermMonths: 48, requirements: ["Vehicle invoice"] },

  // AFC
  { id: "afc-pl", bankId: "afc", bankName: "AFC Commercial Bank", category: "personal", name: "AFC Personal Loan", apr: 12, initiationFee: 40, earlySettlementPenalty: 2, maxTermMonths: 36, requirements: ["Payslip"] },
  { id: "afc-sme", bankId: "afc", bankName: "AFC Commercial Bank", category: "sme", name: "AFC Agro-Finance", apr: 9, initiationFee: 50, earlySettlementPenalty: 2, maxTermMonths: 60, requirements: ["Offer letter", "Farm plan"] },
  { id: "afc-ml", bankId: "afc", bankName: "AFC Commercial Bank", category: "mortgage", name: "AFC Home Loan", apr: 9.8, initiationFee: 120, earlySettlementPenalty: 4, maxTermMonths: 180, requirements: ["Property details"] },
  { id: "afc-vl", bankId: "afc", bankName: "AFC Commercial Bank", category: "vehicle", name: "AFC Vehicle Finance", apr: 10.5, initiationFee: 60, earlySettlementPenalty: 3, maxTermMonths: 48, requirements: ["Vehicle details"] },
  { id: "afc-sl", bankId: "afc", bankName: "AFC Commercial Bank", category: "salary_based", name: "AFC Salary Advance", apr: 14, initiationFee: 15, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },

  // Nedbank
  { id: "ned-pl", bankId: "nedbank", bankName: "Nedbank Zimbabwe", category: "personal", name: "Nedbank Green Loan", apr: 11.5, initiationFee: 55, earlySettlementPenalty: 2.5, maxTermMonths: 48, requirements: ["Payslip", "6 months statements"] },
  { id: "ned-sme", bankId: "nedbank", bankName: "Nedbank Zimbabwe", category: "sme", name: "Nedbank SME Pro", apr: 10.5, initiationFee: 110, earlySettlementPenalty: 4, maxTermMonths: 60, requirements: ["Business financials"] },
  { id: "ned-ml", bankId: "nedbank", bankName: "Nedbank Zimbabwe", category: "mortgage", name: "Nedbank Mortgage", apr: 8.5, initiationFee: 220, earlySettlementPenalty: 5, maxTermMonths: 240, requirements: ["Valuation report"] },
  { id: "ned-vl", bankId: "nedbank", bankName: "Nedbank Zimbabwe", category: "vehicle", name: "Nedbank Vehicle Finance", apr: 9.2, initiationFee: 90, earlySettlementPenalty: 3, maxTermMonths: 60, requirements: ["Vehicle quotation"] },
  { id: "ned-sl", bankId: "nedbank", bankName: "Nedbank Zimbabwe", category: "salary_based", name: "Nedbank Salary Connect", apr: 13, initiationFee: 30, earlySettlementPenalty: 0, maxTermMonths: 24, requirements: ["Payslip"] },

  // CABS
  { id: "cabs-pl", bankId: "cabs", bankName: "CABS", category: "personal", name: "CABS Personal Loan", apr: 11, initiationFee: 40, earlySettlementPenalty: 2, maxTermMonths: 48, requirements: ["Payslip", "ZimSwitch card"] },
  { id: "cabs-sme", bankId: "cabs", bankName: "CABS", category: "sme", name: "CABS SME Credit", apr: 10, initiationFee: 100, earlySettlementPenalty: 4, maxTermMonths: 60, requirements: ["Business plan"] },
  { id: "cabs-ml", bankId: "cabs", bankName: "CABS", category: "mortgage", name: "CABS Home Loan", apr: 9, initiationFee: 150, earlySettlementPenalty: 4, maxTermMonths: 300, requirements: ["Proof of income", "Title deed"] },
  { id: "cabs-vl", bankId: "cabs", bankName: "CABS", category: "vehicle", name: "CABS Car Loan", apr: 9.8, initiationFee: 70, earlySettlementPenalty: 3, maxTermMonths: 60, requirements: ["Vehicle valuation"] },
  { id: "cabs-sl", bankId: "cabs", bankName: "CABS", category: "salary_based", name: "CABS Salary Advance", apr: 13, initiationFee: 20, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },

  // NBS
  { id: "nbs-pl", bankId: "nbs", bankName: "National Building Society", category: "personal", name: "NBS Personal Loan", apr: 12, initiationFee: 45, earlySettlementPenalty: 2.5, maxTermMonths: 36, requirements: ["Payslip"] },
  { id: "nbs-sme", bankId: "nbs", bankName: "National Building Society", category: "sme", name: "NBS SME Housing Loans", apr: 11, initiationFee: 90, earlySettlementPenalty: 3.5, maxTermMonths: 48, requirements: ["Business details"] },
  { id: "nbs-ml", bankId: "nbs", bankName: "National Building Society", category: "mortgage", name: "NBS Home Loan", apr: 8.8, initiationFee: 150, earlySettlementPenalty: 5, maxTermMonths: 300, requirements: ["Title deed", "Income proof"] },
  { id: "nbs-vl", bankId: "nbs", bankName: "National Building Society", category: "vehicle", name: "NBS Auto Finance", apr: 10.5, initiationFee: 65, earlySettlementPenalty: 3, maxTermMonths: 48, requirements: ["Quotation"] },
  { id: "nbs-sl", bankId: "nbs", bankName: "National Building Society", category: "salary_based", name: "NBS Salary Advance", apr: 15, initiationFee: 20, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },

  // EmpowerBank
  { id: "emp-pl", bankId: "empower", bankName: "EmpowerBank", category: "personal", name: "Empower Youth Loan", apr: 12, initiationFee: 20, earlySettlementPenalty: 1, maxTermMonths: 24, requirements: ["National ID", "Business idea"] },
  { id: "emp-sme", bankId: "empower", bankName: "EmpowerBank", category: "sme", name: "Empower SME Grow", apr: 11, initiationFee: 50, earlySettlementPenalty: 2, maxTermMonths: 36, requirements: ["SME registration"] },
  { id: "emp-sl", bankId: "empower", bankName: "EmpowerBank", category: "salary_based", name: "Empower Salary Loan", apr: 13, initiationFee: 15, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },

  // GetBucks
  { id: "gb-pl", bankId: "getbucks", bankName: "GetBucks Microfinance Bank", category: "personal", name: "GetBucks Quick Loan", apr: 16, initiationFee: 15, earlySettlementPenalty: 0, maxTermMonths: 24, requirements: ["National ID", "Mobile proof"] },
  { id: "gb-sme", bankId: "getbucks", bankName: "GetBucks Microfinance Bank", category: "sme", name: "GetBucks SME Credit", apr: 14, initiationFee: 40, earlySettlementPenalty: 2, maxTermMonths: 36, requirements: ["Business financials"] },
  { id: "gb-sl", bankId: "getbucks", bankName: "GetBucks Microfinance Bank", category: "salary_based", name: "GetBucks Salary Loan", apr: 16, initiationFee: 10, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },

  // Success
  { id: "suc-pl", bankId: "success", bankName: "Success Microfinance Bank", category: "personal", name: "Success Personal", apr: 15, initiationFee: 25, earlySettlementPenalty: 2, maxTermMonths: 24, requirements: ["National ID"] },
  { id: "suc-sme", bankId: "success", bankName: "Success Microfinance Bank", category: "sme", name: "Success SME Finance", apr: 13, initiationFee: 45, earlySettlementPenalty: 3, maxTermMonths: 36, requirements: ["Business details"] },
  { id: "suc-sl", bankId: "success", bankName: "Success Microfinance Bank", category: "salary_based", name: "Success Salary Loan", apr: 15, initiationFee: 15, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },

  // Lion
  { id: "lion-pl", bankId: "lion", bankName: "Lion Microfinance Bank", category: "personal", name: "Lion Personal Loan", apr: 15, initiationFee: 20, earlySettlementPenalty: 2, maxTermMonths: 24, requirements: ["National ID"] },
  { id: "lion-sme", bankId: "lion", bankName: "Lion Microfinance Bank", category: "sme", name: "Lion SME Credit", apr: 13.5, initiationFee: 50, earlySettlementPenalty: 3, maxTermMonths: 36, requirements: ["Business registration"] },
  { id: "lion-sl", bankId: "lion", bankName: "Lion Microfinance Bank", category: "salary_based", name: "Lion Salary Loan", apr: 15, initiationFee: 15, earlySettlementPenalty: 0, maxTermMonths: 12, requirements: ["Payslip"] },

  // Tetrad
  { id: "tet-sme", bankId: "tetrad", bankName: "Tetrad Investment Bank", category: "sme", name: "Tetrad Trade Finance", apr: 9.5, initiationFee: 200, earlySettlementPenalty: 5, maxTermMonths: 60, requirements: ["Financial statements", "Trading history"] },
  { id: "tet-ml", bankId: "tetrad", bankName: "Tetrad Investment Bank", category: "mortgage", name: "Tetrad Asset Finance", apr: 8.5, initiationFee: 300, earlySettlementPenalty: 5, maxTermMonths: 120, requirements: ["Asset valuation"] },
]


export const bankFees: BankFee[] = [
  // CBZ fees
  { id: "cbz-f1", bankId: "cbz", bankName: "CBZ Bank", category: "transaction", name: "ZIPIT Transfer", amount: 1.50, unit: "per txn", description: "Interbank ZIPIT transfer" },
  { id: "cbz-f2", bankId: "cbz", bankName: "CBZ Bank", category: "transaction", name: "RTGS Transfer", amount: 3.00, unit: "per txn", description: "Real-time gross settlement" },
  { id: "stan-f1", bankId: "stanbic", bankName: "Stanbic Bank", category: "transaction", name: "ZIPIT Transfer", amount: 1.20, unit: "per txn", description: "Interbank ZIPIT transfer" },
  { id: "sc-f1", bankId: "stanchart", bankName: "Standard Chartered", category: "fx_transfers", name: "Swift Transfer", amount: 25.00, unit: "per txn", description: "International transfer fee" },
  { id: "fbc-f1", bankId: "fbc", bankName: "FBC Bank", category: "transaction", name: "ZIPIT Transfer", amount: 1.80, unit: "per txn", description: "Interbank ZIPIT transfer" },
  { id: "stew-f1", bankId: "steward", bankName: "Steward Bank", category: "transaction", name: "ZIPIT Transfer", amount: 1.00, unit: "per txn", description: "Interbank ZIPIT transfer" },
  { id: "nmb-f1", bankId: "nmb", bankName: "NMB Bank", category: "transaction", name: "ZIPIT Transfer", amount: 1.60, unit: "per txn", description: "Interbank ZIPIT transfer" },
  { id: "zb-f1", bankId: "zb", bankName: "ZB Bank", category: "transaction", name: "ZIPIT Transfer", amount: 1.40, unit: "per txn", description: "Interbank ZIPIT transfer" },
  { id: "fcb-f1", bankId: "fcb", bankName: "First Capital Bank", category: "transaction", name: "ZIPIT Transfer", amount: 1.55, unit: "per txn", description: "Interbank ZIPIT transfer" },
  { id: "babc-f1", bankId: "bancabc", bankName: "BancABC", category: "transaction", name: "ZIPIT Transfer", amount: 1.35, unit: "per txn", description: "Interbank ZIPIT transfer" },
  { id: "eco-f1", bankId: "ecobank", bankName: "Ecobank Zimbabwe", category: "fx_transfers", name: "Rapid Transfer", amount: 5.00, unit: "per txn", description: "Regional Pan-African transfer" },
  { id: "posb-f1", bankId: "posb", bankName: "POSB", category: "transaction", name: "ZIPIT Transfer", amount: 0.80, unit: "per txn", description: "Interbank ZIPIT transfer - lowest" },
  { id: "met-f1", bankId: "metbank", bankName: "MetBank", category: "transaction", name: "ZIPIT Transfer", amount: 1.70, unit: "per txn", description: "Interbank ZIPIT transfer" },
  { id: "afc-f1", bankId: "afc", bankName: "AFC Commercial Bank", category: "transaction", name: "ZIPIT Transfer", amount: 1.45, unit: "per txn", description: "Interbank ZIPIT transfer" },
  { id: "ned-f1", bankId: "nedbank", bankName: "Nedbank Zimbabwe", category: "transaction", name: "ZIPIT Transfer", amount: 1.50, unit: "per txn", description: "Interbank ZIPIT transfer" },
  { id: "cabs-f1", bankId: "cabs", bankName: "CABS", category: "transaction", name: "ZIPIT Transfer", amount: 1.30, unit: "per txn", description: "Interbank ZIPIT transfer" },
]

