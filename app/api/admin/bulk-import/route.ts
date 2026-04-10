import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Helper: fuzzy column lookup — finds a value by trying multiple possible header names
function getCol(row: Record<string, any>, ...keys: string[]): any {
    for (const key of keys) {
        // Exact match
        if (row[key] !== undefined && row[key] !== null && row[key] !== "") return row[key]
        // Case-insensitive match
        const lkey = key.toLowerCase().trim()
        const matched = Object.keys(row).find(k => k.toLowerCase().trim() === lkey)
        if (matched && row[matched] !== undefined && row[matched] !== null && row[matched] !== "") return row[matched]
    }
    return null
}

function parseFloat2(val: any): number | null {
    if (val === null || val === undefined || val === "") return null
    const n = parseFloat(String(val).replace(/[^0-9.]/g, ""))
    return isNaN(n) ? null : n
}

export async function POST(request: Request) {
    try {
        const { category, data } = await request.json()
        console.log(`[bulk-import] category=${category} rows=${data?.length}`)

        if (!category || !data || !Array.isArray(data)) {
            return NextResponse.json({ error: "Invalid data payload" }, { status: 400 })
        }

        if (data.length > 0) {
            console.log("[bulk-import] First row keys:", Object.keys(data[0]))
            console.log("[bulk-import] First row sample:", JSON.stringify(data[0]).slice(0, 200))
        }

        if (category === 'universities') {
            let insertedCount = 0
            let failedCount = 0
            const errors: string[] = []

            for (const row of data) {
                try {
                    const uniName = getCol(row, "University", "university", "name", "Institution", "institution")
                    if (!uniName) {
                        throw new Error(`Missing University name column! Your Excel file has these columns: ${Object.keys(row).join(", ")}. Please rename the name column to "University".`)
                    }

                    const id = "uni-" + String(uniName).toLowerCase().replace(/[^a-z0-9]+/g, "-")

                    const feeMin = parseFloat2(getCol(row, "Fee Min (USD/Sem)", "Fee Min", "feeMinUSD", "Min Fee", "fee_min"))
                    const feeMax = parseFloat2(getCol(row, "Fee Max (USD/Sem)", "Fee Max", "feeMaxUSD", "Max Fee", "fee_max"))

                    const payload = {
                        university: uniName,
                        type: String(getCol(row, "Type", "type", "institution_type") || "university"),
                        provinceArea: String(getCol(row, "Province/Area", "Province", "Area", "provinceArea", "province") || "Unknown"),
                        location: String(getCol(row, "Location", "location", "City", "city") || "Unknown"),
                        programmeSummary: getCol(row, "Programme Summary", "programmeSummary", "Programs", "Programmes", "Summary") || null,
                        feeMinUSD: feeMin,
                        feeMaxUSD: feeMax,
                        feeNote: getCol(row, "Fee Note", "feeNote", "Note", "notes") || null,
                        feeConfidence: getCol(row, "Fee Confidence", "feeConfidence", "Confidence") || null,
                        programmeSourceUrl: getCol(row, "Programme Source URL", "programmeSourceUrl", "Source URL", "URL", "url") || null,
                    }

                    await prisma.university.upsert({
                        where: { id },
                        update: payload,
                        create: { id, ...payload }
                    })
                    insertedCount++
                } catch (rowErr: any) {
                    failedCount++
                    const errMsg = rowErr?.message || String(rowErr)
                    errors.push(errMsg)
                    console.error(`[bulk-import] Row failed:`, errMsg)
                }
            }

            console.log(`[bulk-import] universities done: inserted=${insertedCount} failed=${failedCount}`)
            return NextResponse.json({
                success: true,
                recordCount: insertedCount,
                failed: failedCount,
                errors: errors.slice(0, 5)
            })
        }
        else if (category === 'telecom') {
            let insertedCount = 0
            let failedCount = 0
            const errors: string[] = []
            const telecomCache = new Map<string, boolean>()

            for (const row of data) {
                try {
                    const providerName = String(getCol(row, "Operator", "Provider", "providerName") || "Unknown")
                    const providerId = "tel-" + providerName.toLowerCase().replace(/[^a-z0-9]+/g, "-")

                    if (!telecomCache.has(providerId)) {
                        await prisma.telecomProvider.upsert({
                            where: { id: providerId },
                            update: {},
                            create: {
                                id: providerId,
                                name: providerName,
                                type: "mno",
                                transparencyScore: 70,
                                coverageScore: 80,
                                networkType: JSON.stringify(["3G", "4G"]),
                                coverageCities: JSON.stringify(["Harare", "Bulawayo"]),
                            }
                        })
                        telecomCache.set(providerId, true)
                    }

                    const bundleName = String(getCol(row, "Bundle Name", "Bundle / Package Name", "Package Name", "Bundle", "name") || "Unknown Bundle")
                    const id = `bundle-${providerId}-${bundleName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

                    const currency = String(getCol(row, "Currency", "currency") || "USD")
                    const bundleGroup = String(getCol(row, "Bundle Group", "bundle_group", "Group", "Category", "category") || "general")
                    const price = parseFloat2(getCol(row, "Price", "price")) || 0
                    const validityType = String(getCol(row, "Validity Type", "validity_type") || "rolling")
                    const validityValue = parseInt(String(getCol(row, "Validity Value", "validity_value", "Validity") || "30").match(/\d+/)?.[0] || "30")
                    const validityUnit = String(getCol(row, "Validity Unit", "validity_unit") || "days")
                    const totalDataMb = parseFloat2(getCol(row, "Total Data (MB)", "Total Data MB", "total_data_mb", "Data MB")) ??
                        ((parseFloat2(getCol(row, "Total Data (GB)", "Data GB", "Data_GB")) ?? 0) * 1024)

                    const bundleData = {
                        operator: providerId,
                        currency,
                        bundle_group: bundleGroup,
                        bundle_name: bundleName,
                        price,
                        validity_type: validityType,
                        validity_value: validityValue,
                        validity_unit: validityUnit,
                        total_data_mb: totalDataMb,
                        peak_data_mb: parseFloat2(getCol(row, "Peak Data (MB)", "peak_data_mb")),
                        offpeak_data_mb: parseFloat2(getCol(row, "Off-Peak Data (MB)", "Off Peak Data MB", "offpeak_data_mb")),
                        onnet_minutes: parseFloat2(getCol(row, "On-Net Minutes", "Onnet Minutes", "onnet_minutes")),
                        other_minutes: parseFloat2(getCol(row, "Other Minutes", "other_minutes")),
                        cug_minutes: parseFloat2(getCol(row, "CUG Minutes", "cug_minutes")),
                        international_minutes: parseFloat2(getCol(row, "International Minutes", "international_minutes")),
                        sms_count: parseFloat2(getCol(row, "SMS", "SMS Count", "sms_count")),
                        facebook_mb: parseFloat2(getCol(row, "Facebook (MB)", "Facebook MB", "facebook_mb")),
                        instagram_mb: parseFloat2(getCol(row, "Instagram (MB)", "Instagram MB", "instagram_mb")),
                        x_mb: parseFloat2(getCol(row, "X (MB)", "Twitter MB", "x_mb")),
                        extras: getCol(row, "Extras", "extras") ? String(getCol(row, "Extras", "extras")) : null,
                        ussd_code: getCol(row, "USSD Code", "ussd_code") ? String(getCol(row, "USSD Code", "ussd_code")) : null,
                        source_url: getCol(row, "Source URL", "source_url") ? String(getCol(row, "Source URL", "source_url")) : null,
                        source_name: getCol(row, "Source Name", "source_name") ? String(getCol(row, "Source Name", "source_name")) : null,
                    }

                    await prisma.dataBundle.upsert({
                        where: { id },
                        update: bundleData,
                        create: { id, ...bundleData }
                    })
                    insertedCount++
                } catch (rowErr: any) {
                    failedCount++
                    errors.push(rowErr?.message || String(rowErr))
                    console.error("[bulk-import] Telecom row failed:", rowErr?.message)
                }
            }

            console.log(`[bulk-import] telecom done: inserted=${insertedCount} failed=${failedCount}`)
            return NextResponse.json({ success: true, recordCount: insertedCount, failed: failedCount, errors: errors.slice(0, 5) })
        }
        else if (category === 'banking') {
            let insertedCount = 0
            let failedCount = 0
            const errors: string[] = []
            const bankCache = new Map<string, boolean>()

            for (const row of data) {
                try {
                    const bankName = String(getCol(row, "Bank", "bank", "Bank Name") || "Unknown Bank")
                    const bankId = "bnk-" + bankName.toLowerCase().replace(/[^a-z0-9]+/g, "-")

                    if (!bankCache.has(bankId)) {
                        await prisma.bank.upsert({
                            where: { id: bankId },
                            update: {},
                            create: {
                                id: bankId,
                                name: bankName,
                                type: "commercial",
                                transparencyScore: 70,
                                branches: 10,
                                digitalFeatures: JSON.stringify(["Mobile Banking", "USSD"]),
                                locations: JSON.stringify(["Harare"]),
                            }
                        })
                        bankCache.set(bankId, true)
                    }

                    const productName = String(getCol(row, "Account Name", "Product Name", "name") || "Unknown Product")
                    const id = `prod-${bankId}-${productName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
                    const interestRate = parseFloat2(getCol(row, "Interest Rate", "interest_rate")) || 0
                    const minBalance = parseFloat2(getCol(row, "Min Balance", "min_balance")) || 0
                    const monthlyFee = parseFloat2(getCol(row, "Monthly Fee", "monthly_fee")) || 0
                    const productCategory = String(getCol(row, "Category", "category") || "savings").toLowerCase().trim()
                    const perksRaw = getCol(row, "Perks", "perks") || ""
                    const perks = perksRaw ? String(perksRaw).split(",").map((p: string) => p.trim()) : []

                    await prisma.bankingProduct.upsert({
                        where: { id },
                        update: { bankId, bankName, category: productCategory, name: productName, interestRate, minBalance, monthlyFee, perks: JSON.stringify(perks) },
                        create: { id, bankId, bankName, category: productCategory, name: productName, interestRate, minBalance, monthlyFee, perks: JSON.stringify(perks) }
                    })
                    insertedCount++
                } catch (rowErr: any) {
                    failedCount++
                    errors.push(rowErr?.message || String(rowErr))
                    console.error("[bulk-import] Banking row failed:", rowErr?.message)
                }
            }

            console.log(`[bulk-import] banking done: inserted=${insertedCount} failed=${failedCount}`)
            return NextResponse.json({ success: true, recordCount: insertedCount, failed: failedCount, errors: errors.slice(0, 5) })
        }
        else {
            return NextResponse.json({ error: "Upload mapping not configured for this category yet" }, { status: 501 })
        }
    } catch (e: any) {
        console.error("Bulk Import Fatal Error:", e)
        return NextResponse.json({ error: e.message || "Failed to import records" }, { status: 500 })
    }
}
