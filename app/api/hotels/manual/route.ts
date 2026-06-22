import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: Fetch existing manual hotel records
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const hotelName = searchParams.get("hotelName")

    const where: any = {}
    if (hotelName) where.hotelName = hotelName

    const records = await prisma.hotelManualData.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ records })
  } catch (error: any) {
    console.error("Hotel Manual Data GET Error:", error)
    return NextResponse.json({ error: "Failed to load records." }, { status: 500 })
  }
}

// POST: Create or update a hotel manual record (upsert by hotelName)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      hotelName,
      location,
      city,
      stars,
      pricePerNight,
      currency,
      type,
      amenities,
      rating,
      reviewCount,
      description,
      recommended,
      bestValue,
    } = body

    if (!hotelName || !location) {
      return NextResponse.json({ error: "hotelName and location are required." }, { status: 400 })
    }

    const data = {
      hotelName,
      location,
      city: city ?? "",
      stars: parseInt(stars) || 0,
      pricePerNight: parseFloat(pricePerNight) || 0,
      currency: currency ?? "USD",
      type: type ?? "hotel",
      amenities: amenities ?? null,
      rating: parseFloat(rating) || 0,
      reviewCount: parseInt(reviewCount) || 0,
      description: description ?? null,
      recommended: Boolean(recommended),
      bestValue: Boolean(bestValue),
      isManual: true,
      source: "manual-entry",
      lastManualUpdate: new Date(),
    }

    const record = await prisma.hotelManualData.upsert({
      where: { hotelName },
      update: {
        ...data,
      },
      create: {
        ...data,
      },
    })

    return NextResponse.json({ record })
  } catch (error: any) {
    console.error("Hotel Manual Data POST Error:", error)
    return NextResponse.json({ error: "Failed to save record." }, { status: 500 })
  }
}
