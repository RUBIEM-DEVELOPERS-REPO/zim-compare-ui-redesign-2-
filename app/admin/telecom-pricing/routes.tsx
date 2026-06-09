import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: Fetch all telecom providers with their bundles and voice rates
export async function GET() {
  try {
    const providers = await prisma.telecomProvider.findMany({
      orderBy: { name: "asc" },
      include: {
        bundles: { orderBy: { price: "asc" } },
        voiceRates: { orderBy: { price: "asc" } },
      },
    })
    return NextResponse.json({ providers })
  } catch (error: any) {
    console.error("Telecom Pricing GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch telecom pricing data" }, { status: 500 })
  }
}

// PUT: Update a telecom product price
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { type, id, updates } = body as {
      type: "bundle" | "voice" | "provider"
      id: string
      updates: Record<string, any>
    }

    if (!type || !id || !updates) {
      return NextResponse.json({ error: "Missing required fields: type, id, updates" }, { status: 400 })
    }

    let updated: any = null

    if (type === "bundle") {
      updated = await prisma.dataBundle.update({
        where: { id },
        data: {
          price: updates.price !== undefined ? Number(updates.price) : undefined,
          bundle_name: updates.bundle_name || undefined,
          total_data_mb: updates.total_data_mb !== undefined ? Number(updates.total_data_mb) : undefined,
          validity_value: updates.validity_value !== undefined ? Number(updates.validity_value) : undefined,
          validity_unit: updates.validity_unit || undefined,
          bundle_group: updates.bundle_group || undefined,
          extras: updates.extras || undefined,
          ussd_code: updates.ussd_code || undefined,
          currency: updates.currency || undefined,
        },
      })
    } else if (type === "voice") {
      updated = await prisma.voiceRate.update({
        where: { id },
        data: {
          price: updates.price !== undefined ? Number(updates.price) : undefined,
          bundle_name: updates.bundle_name || undefined,
          onnet_min_count: updates.onnet_min_count !== undefined ? Number(updates.onnet_min_count) : undefined,
          offnet_min_count: updates.offnet_min_count !== undefined ? Number(updates.offnet_min_count) : undefined,
          sms_count: updates.sms_count !== undefined ? Number(updates.sms_count) : undefined,
          validity_value: updates.validity_value !== undefined ? Number(updates.validity_value) : undefined,
          validity_unit: updates.validity_unit || undefined,
          extras: updates.extras || undefined,
          ussd_code: updates.ussd_code || undefined,
        },
      })
    } else {
      return NextResponse.json({ error: "Invalid type. Must be 'bundle' or 'voice'" }, { status: 400 })
    }

    return NextResponse.json({ success: true, updated })
  } catch (error: any) {
    console.error("Telecom Pricing PUT Error:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Failed to update pricing" }, { status: 500 })
  }
}

// POST: Create a new bundle or voice rate for a provider
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body as { type: "bundle" | "voice"; data: Record<string, any> }

    if (!type || !data) {
      return NextResponse.json({ error: "Missing required fields: type, data" }, { status: 400 })
    }

    let created: any = null

    if (type === "bundle") {
      created = await prisma.dataBundle.create({
        data: {
          operator: data.operator,
          currency: data.currency || "USD",
          bundle_group: data.bundle_group || "monthly",
          bundle_name: data.bundle_name,
          price: Number(data.price),
          validity_type: data.validity_type || "fixed",
          validity_value: Number(data.validity_value) || 30,
          validity_unit: data.validity_unit || "days",
          total_data_mb: Number(data.total_data_mb) || 0,
          peak_data_mb: data.peak_data_mb ? Number(data.peak_data_mb) : null,
          offpeak_data_mb: data.offpeak_data_mb ? Number(data.offpeak_data_mb) : null,
          extras: data.extras || null,
          ussd_code: data.ussd_code || null,
        },
      })
    } else if (type === "voice") {
      created = await prisma.voiceRate.create({
        data: {
          operator: data.operator,
          offer_type: data.offer_type || "voice",
          bundle_group: data.bundle_group || "voice",
          bundle_name: data.bundle_name,
          price: Number(data.price),
          validity_type: data.validity_type || "fixed",
          validity_value: Number(data.validity_value) || 30,
          validity_unit: data.validity_unit || "days",
          onnet_min_count: data.onnet_min_count ? Number(data.onnet_min_count) : null,
          offnet_min_count: data.offnet_min_count ? Number(data.offnet_min_count) : null,
          sms_count: data.sms_count ? Number(data.sms_count) : null,
          extras: data.extras || null,
          ussd_code: data.ussd_code || null,
        },
      })
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    return NextResponse.json({ success: true, created }, { status: 201 })
  } catch (error: any) {
    console.error("Telecom Pricing POST Error:", error)
    return NextResponse.json({ error: "Failed to create pricing record" }, { status: 500 })
  }
}

// DELETE: Remove a bundle or voice rate
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as "bundle" | "voice"
    const id = searchParams.get("id")

    if (!type || !id) {
      return NextResponse.json({ error: "Missing required params: type, id" }, { status: 400 })
    }

    if (type === "bundle") {
      await prisma.dataBundle.delete({ where: { id } })
    } else if (type === "voice") {
      await prisma.voiceRate.delete({ where: { id } })
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Telecom Pricing DELETE Error:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 })
  }
}
