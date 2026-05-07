export interface HealthcareProvider {
  id: string
  name: string
  type: "hospital" | "private_clinic" | "pharmacy"
  location: string
  consultationFee: number
  waitingTimeMinutes: number
  rating: number
  insuranceAccepted: string[]
  services: string[]
  tags: string[]
}

export const healthcareProviders: HealthcareProvider[] = [
  // HOSPITALS
  {
    id: "parirenyatwa",
    name: "Parirenyatwa Group of Hospitals",
    type: "hospital",
    location: "Harare",
    consultationFee: 10,
    waitingTimeMinutes: 30,
    rating: 4.2,
    insuranceAccepted: ["CIMAS", "PSMAS", "Alliance", "Old Mutual"],
    services: ["Laboratory", "Surgery", "Dialysis", "Maternity"],
    tags: ["24/7 Emergency", "Specialist Care", "Public Hospital"]
  },
  {
    id: "sally-mugabe",
    name: "Sally Mugabe Central Hospital",
    type: "hospital",
    location: "Harare",
    consultationFee: 8,
    waitingTimeMinutes: 35,
    rating: 4.0,
    insuranceAccepted: ["CIMAS", "PSMAS", "Alliance"],
    services: ["General Medicine", "Surgery", "Maternity"],
    tags: ["Affordable Fees", "Central Location", "Family Care"]
  },
  {
    id: "mpilo",
    name: "Mpilo Central Hospital",
    type: "hospital",
    location: "Bulawayo",
    consultationFee: 9,
    waitingTimeMinutes: 40,
    rating: 3.9,
    insuranceAccepted: ["PSMAS", "CIMAS"],
    services: ["Laboratory", "Surgery", "X-Ray"],
    tags: ["24/7 Emergency", "Public Hospital", "Specialist Care"]
  },
  {
    id: "ubh",
    name: "United Bulawayo Hospitals",
    type: "hospital",
    location: "Bulawayo",
    consultationFee: 9,
    waitingTimeMinutes: 32,
    rating: 4.1,
    insuranceAccepted: ["CIMAS", "PSMAS", "Alliance", "Old Mutual"],
    services: ["Emergency", "General Medicine", "Surgery"],
    tags: ["Short Wait Time", "Specialist Care", "24/7 Emergency"]
  },
  {
    id: "chitungwiza-central",
    name: "Chitungwiza Central Hospital",
    type: "hospital",
    location: "Chitungwiza",
    consultationFee: 7,
    waitingTimeMinutes: 38,
    rating: 3.8,
    insuranceAccepted: ["PSMAS", "CIMAS"],
    services: ["General Medicine", "Maternity", "Pediatrics"],
    tags: ["Affordable Fees", "Family Care", "Public Hospital"]
  },
  {
    id: "mutare-provincial",
    name: "Mutare Provincial Hospital",
    type: "hospital",
    location: "Mutare",
    consultationFee: 8,
    waitingTimeMinutes: 28,
    rating: 4.0,
    insuranceAccepted: ["CIMAS", "PSMAS", "Alliance", "Old Mutual"],
    services: ["Emergency", "Laboratory", "Surgery"],
    tags: ["24/7 Emergency", "Central Location", "Specialist Care"]
  },
  {
    id: "gweru-provincial",
    name: "Gweru Provincial Hospital",
    type: "hospital",
    location: "Gweru",
    consultationFee: 8,
    waitingTimeMinutes: 34,
    rating: 3.9,
    insuranceAccepted: ["PSMAS", "CIMAS"],
    services: ["General Medicine", "X-Ray", "Maternity"],
    tags: ["Affordable Fees", "Public Hospital", "Family Care"]
  },
  {
    id: "masvingo-provincial",
    name: "Masvingo Provincial Hospital",
    type: "hospital",
    location: "Masvingo",
    consultationFee: 8,
    waitingTimeMinutes: 36,
    rating: 3.8,
    insuranceAccepted: ["PSMAS", "CIMAS"],
    services: ["General Medicine", "Surgery", "Pharmacy"],
    tags: ["Public Hospital", "Family Care", "Central Location"]
  },
  {
    id: "vic-falls-hospital",
    name: "Victoria Falls Hospital",
    type: "hospital",
    location: "Victoria Falls",
    consultationFee: 12,
    waitingTimeMinutes: 25,
    rating: 4.2,
    insuranceAccepted: ["CIMAS", "PSMAS", "Alliance", "Old Mutual"],
    services: ["Emergency", "Tourist Clinic", "General Medicine"],
    tags: ["24/7 Emergency", "Short Wait Time", "Specialist Care"]
  },
  {
    id: "bindura-provincial",
    name: "Bindura Provincial Hospital",
    type: "hospital",
    location: "Bindura",
    consultationFee: 7,
    waitingTimeMinutes: 33,
    rating: 3.9,
    insuranceAccepted: ["PSMAS", "CIMAS"],
    services: ["General Medicine", "Maternity", "Laboratory"],
    tags: ["Affordable Fees", "Public Hospital", "Family Care"]
  },

  // PRIVATE CLINICS
  {
    id: "avenues-clinic",
    name: "The Avenues Clinic",
    type: "private_clinic",
    location: "Harare",
    consultationFee: 35,
    waitingTimeMinutes: 15,
    rating: 4.8,
    insuranceAccepted: ["CIMAS", "PSMAS", "Alliance", "Old Mutual", "Generation Health"],
    services: ["Executive Checkups", "Luxury Suites", "Specialist Consultation"],
    tags: ["Specialist Care", "Short Wait Time", "Medical Aid Accepted"]
  },
  {
    id: "health-point-hosp",
    name: "Health Point Hospital",
    type: "private_clinic",
    location: "Harare",
    consultationFee: 30,
    waitingTimeMinutes: 18,
    rating: 4.6,
    insuranceAccepted: ["CIMAS", "PSMAS", "Alliance", "Old Mutual"],
    services: ["Diagnostics", "General Medicine", "Pediatrics"],
    tags: ["Modern Facilities", "Medical Aid Accepted", "Family Care"]
  },
  {
    id: "borrowdale-trauma",
    name: "Borrowdale Trauma Centre",
    type: "private_clinic",
    location: "Harare",
    consultationFee: 40,
    waitingTimeMinutes: 12,
    rating: 4.7,
    insuranceAccepted: ["CIMAS", "PSMAS", "Alliance", "Old Mutual", "BUPA"],
    services: ["Emergency Trauma", "Surgery", "ICU"],
    tags: ["24/7 Emergency", "Short Wait Time", "Specialist Care"]
  },
  {
    id: "baines-avenue",
    name: "Baines Avenue Clinic",
    type: "private_clinic",
    location: "Harare",
    consultationFee: 28,
    waitingTimeMinutes: 20,
    rating: 4.4,
    insuranceAccepted: ["PSMAS", "CIMAS", "Alliance"],
    services: ["Maternity", "General Medicine", "X-Ray"],
    tags: ["Family Care", "Medical Aid Accepted", "Central Location"]
  },
  {
    id: "mater-dei",
    name: "Mater Dei Hospital",
    type: "private_clinic",
    location: "Bulawayo",
    consultationFee: 32,
    waitingTimeMinutes: 17,
    rating: 4.5,
    insuranceAccepted: ["CIMAS", "PSMAS", "Alliance", "Old Mutual"],
    services: ["Surgery", "Internal Medicine", "Laboratory"],
    tags: ["Specialist Care", "Short Wait Time", "Medical Aid Accepted"]
  },
  {
    id: "corporate-24",
    name: "Corporate 24 Medical Centre",
    type: "private_clinic",
    location: "Harare",
    consultationFee: 25,
    waitingTimeMinutes: 22,
    rating: 4.3,
    insuranceAccepted: ["CIMAS", "PSMAS", "Alliance", "Old Mutual"],
    services: ["Emergency", "General Practitioner", "Dentistry"],
    tags: ["24/7 Emergency", "Medical Aid Accepted", "Family Care"]
  },
  {
    id: "west-end",
    name: "West End Clinic",
    type: "private_clinic",
    location: "Harare",
    consultationFee: 27,
    waitingTimeMinutes: 19,
    rating: 4.2,
    insuranceAccepted: ["PSMAS", "CIMAS", "Alliance"],
    services: ["General Medicine", "Surgery", "Pharmacy"],
    tags: ["Central Location", "Medical Aid Accepted", "Affordable Fees"]
  },
  {
    id: "trauma-centre-borrowdale",
    name: "Trauma Centre Borrowdale",
    type: "private_clinic",
    location: "Harare",
    consultationFee: 38,
    waitingTimeMinutes: 14,
    rating: 4.6,
    insuranceAccepted: ["CIMAS", "PSMAS", "Alliance", "Old Mutual"],
    services: ["Trauma Unit", "Air Ambulance", "Surgical Care"],
    tags: ["Short Wait Time", "24/7 Emergency", "Specialist Care"]
  },
  {
    id: "premier-medical",
    name: "Premier Medical Centre",
    type: "private_clinic",
    location: "Mutare",
    consultationFee: 24,
    waitingTimeMinutes: 21,
    rating: 4.1,
    insuranceAccepted: ["PSMAS", "CIMAS", "Alliance"],
    services: ["General Medicine", "Diagnostics", "Maternity"],
    tags: ["Medical Aid Accepted", "Family Care", "Affordable Fees"]
  },
  {
    id: "riverside-clinic",
    name: "Riverside Clinic",
    type: "private_clinic",
    location: "Gweru",
    consultationFee: 22,
    waitingTimeMinutes: 24,
    rating: 4.0,
    insuranceAccepted: ["PSMAS", "CIMAS", "Alliance"],
    services: ["General Practitioner", "Pharmacy", "Laboratory"],
    tags: ["Family Care", "Medical Aid Accepted", "Short Wait Time"]
  },

  // PHARMACIES
  {
    id: "greenwood",
    name: "Greenwood Pharmacy",
    type: "pharmacy",
    location: "Harare",
    consultationFee: 2,
    waitingTimeMinutes: 5,
    rating: 4.6,
    insuranceAccepted: ["All Major Medical Aids", "Cash"],
    services: ["Prescription Dispensing", "Over the Counter", "BP Checks"],
    tags: ["Prescription Refills", "Central Location", "Short Wait Time"]
  },
  {
    id: "booties",
    name: "Booties Pharmacy",
    type: "pharmacy",
    location: "Harare",
    consultationFee: 2,
    waitingTimeMinutes: 6,
    rating: 4.5,
    insuranceAccepted: ["All Major Medical Aids", "Cash"],
    services: ["Drug Information", "Vaccinations", "Health Products"],
    tags: ["Prescription Refills", "Medical Aid Accepted", "Family Care"]
  },
  {
    id: "qv-pharmacy",
    name: "QV Pharmacy",
    type: "pharmacy",
    location: "Harare",
    consultationFee: 1.5,
    waitingTimeMinutes: 7,
    rating: 4.4,
    insuranceAccepted: ["Selected Medical Aids", "Cash"],
    services: ["Dispensing", "First Aid Supplies", "Consultation"],
    tags: ["Affordable Fees", "Prescription Refills", "Central Location"]
  },
  {
    id: "medorange",
    name: "MedOrange Pharmacy",
    type: "pharmacy",
    location: "Harare",
    consultationFee: 2,
    waitingTimeMinutes: 5,
    rating: 4.7,
    insuranceAccepted: ["All Major Medical Aids", "Cash"],
    services: ["Digital Prescription", "Home Delivery", "Health Screen"],
    tags: ["Short Wait Time", "Prescription Refills", "Modern Service"]
  },
  {
    id: "rock-foundation",
    name: "Rock Foundation Pharmacy",
    type: "pharmacy",
    location: "Bulawayo",
    consultationFee: 1.5,
    waitingTimeMinutes: 8,
    rating: 4.2,
    insuranceAccepted: ["Cash Only"],
    services: ["Medicine", "Vitamins", "Surgical Supplies"],
    tags: ["Affordable Fees", "Local Favorite", "Prescription Refills"]
  },
  {
    id: "link-pharmacy",
    name: "Link Pharmacy",
    type: "pharmacy",
    location: "Mutare",
    consultationFee: 1.5,
    waitingTimeMinutes: 7,
    rating: 4.1,
    insuranceAccepted: ["Selected Medical Aids", "Cash"],
    services: ["Medicine Dispensing", "Beauty Products"],
    tags: ["Central Location", "Prescription Refills", "Medical Aid Accepted"]
  },
  {
    id: "avondale-pharmacy",
    name: "Avondale Pharmacy",
    type: "pharmacy",
    location: "Harare",
    consultationFee: 2,
    waitingTimeMinutes: 6,
    rating: 4.5,
    insuranceAccepted: ["All Major Medical Aids", "Cash"],
    services: ["Baby Products", "Medicine", "Skin Care"],
    tags: ["Family Care", "Medical Aid Accepted", "Short Wait Time"]
  },
  {
    id: "city-centre-pharmacy",
    name: "City Centre Pharmacy",
    type: "pharmacy",
    location: "Gweru",
    consultationFee: 1,
    waitingTimeMinutes: 9,
    rating: 4.0,
    insuranceAccepted: ["Cash Only"],
    services: ["Medicine", "First Aid"],
    tags: ["Affordable Fees", "Central Location", "Prescription Refills"]
  },
  {
    id: "belmont-pharmacy",
    name: "Belmont Pharmacy",
    type: "pharmacy",
    location: "Bulawayo",
    consultationFee: 1.5,
    waitingTimeMinutes: 8,
    rating: 4.1,
    insuranceAccepted: ["Selected Medical Aids", "Cash"],
    services: ["Drug Counseling", "Prescription Filling"],
    tags: ["Medical Aid Accepted", "Family Care", "Prescription Refills"]
  },
  {
    id: "careplus-pharmacy",
    name: "CarePlus Pharmacy",
    type: "pharmacy",
    location: "Masvingo",
    consultationFee: 1,
    waitingTimeMinutes: 10,
    rating: 3.9,
    insuranceAccepted: ["Cash Only"],
    services: ["General Medicine", "Cosmetics"],
    tags: ["Affordable Fees", "Local Favorite", "Prescription Refills"]
  }
]
