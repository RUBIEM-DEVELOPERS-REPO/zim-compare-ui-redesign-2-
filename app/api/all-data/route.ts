import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"

export async function GET() {
  try {
    // 1. Fetch & Filter Telecom Data
    const rawTelecomProviders = await prisma.telecomProvider.findMany({ 
      include: { 
        bundles: true, 
        voiceRates: true 
      } 
    })
    
    // Filter provider records and sub-relations
    const filteredTelecom = filterVerifiedRecords(rawTelecomProviders, "telecom").map(p => ({
      ...p,
      bundles: filterVerifiedRecords(p.bundles || [], "telecom"),
      voiceRates: filterVerifiedRecords(p.voiceRates || [], "telecom")
    }))

    // 2. Fetch & Filter Banking Data
    const rawBanks = await prisma.bank.findMany({ 
      include: { 
        products: true, 
        fees: true, 
        loans: true 
      } 
    })
    
    const filteredBanks = filterVerifiedRecords(rawBanks, "banking").map(b => ({
      ...b,
      products: filterVerifiedRecords(b.products || [], "banking"),
      fees: filterVerifiedRecords(b.fees || [], "banking"),
      loans: filterVerifiedRecords(b.loans || [], "banking")
    }))

    // 3. Fetch & Filter Education Data
    const rawSchools = await prisma.school.findMany()
    const dbSchools = filterVerifiedRecords(rawSchools, "education")

    const rawUniversities = await prisma.university.findMany()
    const dbUniversities = filterVerifiedRecords(rawUniversities, "education")

    // 4. Fetch & Filter Insurance Data
    const rawInsurance = await prisma.insuranceProvider.findMany({ 
      include: { policies: true } 
    })
    
    const filteredInsurance = filterVerifiedRecords(rawInsurance, "insurance").map(p => ({
      ...p,
      policies: filterVerifiedRecords(p.policies || [], "insurance")
    }))

    // 5. Fetch & Filter Other Sectors
    const rawVehicles = await prisma.vehicle.findMany()
    const dbVehicles = filterVerifiedRecords(rawVehicles, "mobility")

    const rawHotels = await prisma.hotel.findMany()
    const dbHotelsRaw = filterVerifiedRecords(rawHotels, "hospitality")
    const dbHotels = dbHotelsRaw.map(h => {
      let parsedAmenities: string[] = []
      if (typeof h.amenities === 'string') {
        try {
          parsedAmenities = JSON.parse(h.amenities)
        } catch (e) {
          console.error("Failed to parse amenities for hotel in all-data:", h.id, e)
        }
      } else if (Array.isArray(h.amenities)) {
        parsedAmenities = h.amenities
      }
      return {
        ...h,
        amenities: parsedAmenities
      }
    })

    const rawSolar = await prisma.solarProvider.findMany()
    const dbSolar = filterVerifiedRecords(rawSolar, "energy")

    const rawUtilities = await prisma.utilityProvider.findMany()
    const dbUtilities = filterVerifiedRecords(rawUtilities, "energy")

    const rawBusRoutes = await prisma.busRoute.findMany()
    const dbBusRoutes = filterVerifiedRecords(rawBusRoutes, "mobility")

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      version: "1.0",
      data: {
        telecoms: filteredTelecom,
        banking: filteredBanks,
        education: {
          schools: dbSchools,
          universities: dbUniversities
        },
        insurance: filteredInsurance,
        mobility: {
          vehicles: dbVehicles,
          busRoutes: dbBusRoutes
        },
        hospitality: {
          hotels: dbHotels
        },
        energy: {
          solar: dbSolar,
          utilities: dbUtilities
        }
      }
    })
  } catch (error: any) {
    console.error("All Data API Error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch aggregated data",
      details: error.message 
    }, { status: 500 })
  }
}
