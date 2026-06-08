
export interface Source {
  title: string
  url: string
}

export const routeSources: Record<string, Source[]> = {
  "/dashboard": [
    { title: "ZimStat Quarterly Digest of Statistics", url: "https://www.zimstat.co.zw/" },
    { title: "RBZ Monetary Policy Statement 2024", url: "https://www.rbz.co.zw/" },
    { title: "Ministry of Finance Economic Review", url: "http://www.zimtreasury.gov.zw/" }
  ],
  "/banking": [
    { title: "RBZ Bank Supervision Annual Report", url: "https://www.rbz.co.zw/index.php/bank-supervision" },
    { title: "Bankers Association of Zimbabwe (BAZ)", url: "https://www.baz.org.zw/" },
    { title: "Consumer Protection Commission Zimbabwe", url: "https://cpc.org.zw/" }
  ],
  "/telecom": [
    { title: "POTRAZ Sector Performance Report Q4 2023", url: "https://www.potraz.gov.zw/" },
    { title: "Econet Wireless Annual Report 2023", url: "https://www.econet.co.zw/" },
    { title: "NetOne Zimbabwe Service Charter", url: "https://www.netone.co.zw/" }
  ],
  "/insurance": [
    { title: "IPEC Quarterly Insurance Report", url: "https://ipec.co.zw/" },
    { title: "Insurance Council of Zimbabwe (ICZ)", url: "https://www.icz.co.zw/" },
    { title: "Old Mutual Zimbabwe Financials", url: "https://www.oldmutual.co.zw/" }
  ],
  "/schools": [
    { title: "Ministry of Primary and Secondary Education", url: "http://mopse.co.zw/" },
    { title: "Association of Trust Schools (ATS)", url: "https://www.atschls.org/" },
    { title: "ZIMSEC Examination Statistics", url: "https://www.zimsec.co.zw/" }
  ],
  "/universities": [
    { title: "ZIMCHE - Zimbabwe Council for Higher Education", url: "https://www.zimche.ac.zw/" },
    { title: "Ministry of Higher and Tertiary Education", url: "http://www.mhtestd.gov.zw/" },
    { title: "University of Zimbabwe Admissions", url: "https://www.uz.ac.zw/" }
  ],
  "/mobility": [
    { title: "Ministry of Transport and Infrastructural Development", url: "http://www.transport.gov.zw/" },
    { title: "ZINARA - Zimbabwe National Road Administration", url: "https://www.zinara.co.zw/" },
    { title: "CAMA - Central African Mutual Association", url: "https://www.cama.co.zw/" }
  ],
  "/transport": [
    { title: "ZUPCO Service Routes & Tariffs", url: "https://www.zupco.co.zw/" },
    { title: "NRZ - National Railways of Zimbabwe", url: "https://www.nrz.co.zw/" },
    { title: "Vehicle Inspection Department (VID)", url: "https://www.vid.co.zw/" }
  ],
  "/utilities": [
    { title: "ZETDC - Zimbabwe Electricity Transmission and Distribution", url: "https://www.zetdc.co.zw/" },
    { title: "ZERA - Zimbabwe Energy Regulatory Authority", url: "https://www.zera.co.zw/" },
    { title: "ZINWA - Zimbabwe National Water Authority", url: "https://www.zinwa.co.zw/" }
  ],
  "/solar": [
    { title: "ZERA Licensed Solar Installers List", url: "https://www.zera.co.zw/" },
    { title: "Zimbabwe Renewable Energy Policy", url: "http://www.energy.gov.zw/" },
    { title: "Distributed Power Africa (DPA) Case Studies", url: "https://dpaafrica.com/" }
  ],
  "/regulated-prices": [
    { title: "ZERA Fuel Pricing Templates", url: "https://www.zera.co.zw/" },
    { title: "Consumer Council of Zimbabwe (CCZ)", url: "https://ccz.org.zw/" },
    { title: "Statutory Instrument 127 of 2021", url: "https://www.veritaszim.net/" }
  ],
  "/taxes": [
    { title: "ZIMRA - Zimbabwe Revenue Authority", url: "https://www.zimra.co.zw/" },
    { title: "Income Tax Act [Chapter 23:06]", url: "https://www.veritaszim.net/" },
    { title: "Finance Act 2024", url: "https://www.zimra.co.zw/" }
  ],
  "/stayscape": [
    { title: "Zimbabwe Tourism Authority (ZTA)", url: "https://www.zimbabwetourism.net/" },
    { title: "Hospitality Association of Zimbabwe", url: "https://www.haz.co.zw/" },
    { title: "Parks and Wildlife Management Authority", url: "https://www.zimparks.org.zw/" }
  ],
  "/admin": [
    { title: "System Administration Guidelines", url: "#" },
    { title: "Data Governance Framework", url: "#" }
  ],
  "/alerts": [
    { title: "ZIMRA Public Notices", url: "https://www.zimra.co.zw/news/public-notices" },
    { title: "RBZ Press Statements", url: "https://www.rbz.co.zw/index.php/publications-notices/press-statements" }
  ],
  "/applications": [
    { title: "e-Government Portal Zimbabwe", url: "https://www.zim.gov.zw/" },
    { title: "Investment Guidelines - ZIDA", url: "https://www.zidainvest.com/" }
  ],
  "/chat": [
    { title: "AI Ethics & Data Privacy Policy", url: "#" },
    { title: "Financial Intelligence Unit (FIU)", url: "https://www.rbz.co.zw/index.php/fiu" }
  ],
  "/saved": [
    { title: "User Data Retention Policy", url: "#" },
    { title: "Research Methodology Overview", url: "#" }
  ],
  "/summaries": [
    { title: "Intelligence Synthesis Process", url: "#" },
    { title: "Quarterly Economic Bulletin", url: "https://www.rbz.co.zw/index.php/publications-notices/reports/quarterly-economic-bulletins" }
  ],
  "/social-insights": [
    { title: "Social Media Monitoring Policy", url: "#" },
    { title: "Public Sentiment Analysis Report", url: "#" }
  ],
  "/gen-z": [
    { title: "Global Subscription Trends 2024", url: "https://www.statista.com/" },
    { title: "Zimbabwe Digital Report 2024", url: "https://datareportal.com/" },
    { title: "Spotify for Artists - Africa Insights", url: "https://artists.spotify.com/" }
  ]
}

export function getSourcesForPath(path: string): Source[] {
  // Try exact match
  if (routeSources[path]) return routeSources[path]
  
  // Try prefix match (for subpages)
  const baseRoute = "/" + path.split("/")[1]
  if (routeSources[baseRoute]) return routeSources[baseRoute]
  
  // Default sources
  return [
    { title: "Official Government Gazette", url: "https://www.printflow.co.zw/" },
    { title: "Zimbabwe Open Data Portal", url: "https://data.gov.zw/" }
  ]
}
