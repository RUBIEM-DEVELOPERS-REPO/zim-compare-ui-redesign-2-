import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")

    const where = location ? { location } : {}

    const rawHotels = await prisma.hotel.findMany({
      where,
      orderBy: { rating: 'desc' },
    })

    const verifiedHotels = filterVerifiedRecords(rawHotels, "hospitality")
    const hotels = verifiedHotels.map(h => {
      let parsedAmenities: string[] = []
      if (typeof h.amenities === 'string') {
        try {
          parsedAmenities = JSON.parse(h.amenities)
        } catch (e) {
          console.error("Failed to parse amenities for hotel:", h.id, e)
        }
      } else if (Array.isArray(h.amenities)) {
        parsedAmenities = h.amenities
      }
      return {
        ...h,
        amenities: parsedAmenities
      }
    })

    return NextResponse.json({ hotels })
  } catch (error: any) {
    console.error("Hotels Error:", error)
    return NextResponse.json({ error: "Failed to load hospitality data" }, { status: 500 })
  }
}
