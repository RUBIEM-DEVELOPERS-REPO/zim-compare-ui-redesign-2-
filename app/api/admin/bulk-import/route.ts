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

                    const isVoice = getCol(row, "Rate Per Min", "ratePerMin", "Price Per Min", "Voice Rate") !== null || 
                                    getCol(row, "On-Net Minutes", "onnet_minutes", "onnet_min_count") !== null

                    if (isVoice) {
                        const voiceName = String(getCol(row, "Voice Plan", "Plan Name", "bundle_name", "name") || "Voice Plan")
                        const id = `voice-${providerId}-${voiceName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
                        
                        const voiceData = {
                            operator: providerId,
                            offer_type: String(getCol(row, "Type", "offer_type") || "prepaid"),
                            bundle_group: String(getCol(row, "Group", "bundle_group") || "voice"),
                            bundle_name: voiceName,
                            price: parseFloat2(getCol(row, "Price", "ratePerMin", "price")) || 0,
                            validity_type: String(getCol(row, "Validity Type", "validity_type") || "rolling"),
                            validity_value: parseInt(String(getCol(row, "Validity Value", "validity_value") || "1").match(/\d+/)?.[0] || "1"),
                            validity_unit: String(getCol(row, "Validity Unit", "validity_unit") || "min"),
                            onnet_min_count: parseFloat2(getCol(row, "On-Net Minutes", "onnet_minutes", "onnet_min_count")),
                            offnet_min_count: parseFloat2(getCol(row, "Off-Net Minutes", "offnet_minutes", "offnet_min_count")),
                            sms_count: parseFloat2(getCol(row, "SMS Count", "sms_count")),
                            ussd_code: getCol(row, "USSD Code", "ussd_code") ? String(getCol(row, "USSD Code", "ussd_code")) : null,
                        }

                        await prisma.voiceRate.upsert({
                            where: { id },
                            update: voiceData,
                            create: { id, ...voiceData }
                        })
                    } else {
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
                    }
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
                                type: String(getCol(row, "Type", "type") || "commercial"),
                                transparencyScore: parseInt(String(getCol(row, "Transparency", "transparencyScore") || "70")),
                                branches: parseInt(String(getCol(row, "Branches", "branches") || "1")),
                                digitalFeatures: JSON.stringify(String(getCol(row, "Digital Features", "digital_features") || "[]").split(",").map(s => s.trim())),
                                locations: JSON.stringify(String(getCol(row, "Locations", "locations") || "[]").split(",").map(s => s.trim())),
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
                }
            }

            return NextResponse.json({ success: true, recordCount: insertedCount, failed: failedCount, errors: errors.slice(0, 5) })
        }
        else if (category === 'schools') {
            let insertedCount = 0
            let failedCount = 0
            const errors: string[] = []

            for (const row of data) {
                try {
                    const name = String(getCol(row, "School Name", "Name", "school") || "Unknown School")
                    const id = "sch-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                    
                    const payload = {
                        name,
                        type: String(getCol(row, "Type", "type") || "day"),
                        transparencyScore: parseInt(String(getCol(row, "Transparency", "score") || "75")),
                        digitalScore: parseInt(String(getCol(row, "Digital", "digitalScore") || "60")),
                        website: getCol(row, "Website", "url"),
                        headOfficeAddress: getCol(row, "Address", "location"),
                        contactPhone: String(getCol(row, "Phone", "contact")),
                        contactEmail: getCol(row, "Email", "email"),
                        curriculum: JSON.stringify(String(getCol(row, "Curriculum", "curricula") || "[]").split(",").map(s => s.trim())),
                        province: String(getCol(row, "Province", "region") || "Unknown"),
                        city: String(getCol(row, "City", "town") || "Unknown"),
                        tuitionPerTerm: parseFloat2(getCol(row, "Tuition", "fee")) || 0,
                        boardingFeePerTerm: parseFloat2(getCol(row, "Boarding Fee")),
                        totalAnnualCost: parseFloat2(getCol(row, "Annual Cost")) || 0,
                        passRate: parseFloat2(getCol(row, "Pass Rate")) || 0,
                        studentTeacherRatio: parseFloat2(getCol(row, "Ratio")) || 20,
                        facilities: JSON.stringify(String(getCol(row, "Facilities") || "[]").split(",").map(s => s.trim())),
                        sports: JSON.stringify(String(getCol(row, "Sports") || "[]").split(",").map(s => s.trim())),
                        academicScore: parseInt(String(getCol(row, "Academic Score") || "80")),
                        safetyScore: parseInt(String(getCol(row, "Safety Score") || "80")),
                    }

                    await prisma.school.upsert({
                        where: { id },
                        update: payload,
                        create: { id, ...payload }
                    })
                    insertedCount++
                } catch (rowErr: any) {
                    failedCount++
                    errors.push(rowErr?.message || String(rowErr))
                }
            }
            return NextResponse.json({ success: true, recordCount: insertedCount, failed: failedCount, errors: errors.slice(0, 5) })
        }
        else if (category === 'insurance') {
            let insertedCount = 0
            let failedCount = 0
            const errors: string[] = []
            const insCache = new Map<string, boolean>()

            for (const row of data) {
                try {
                    const providerName = String(getCol(row, "Provider", "Insurance Company", "name") || "Unknown Insurance")
                    const providerId = "ins-" + providerName.toLowerCase().replace(/[^a-z0-9]+/g, "-")

                    if (!insCache.has(providerId)) {
                        await prisma.insuranceProvider.upsert({
                            where: { id: providerId },
                            update: {},
                            create: {
                                id: providerId,
                                name: providerName,
                                type: String(getCol(row, "Type", "type") || "general"),
                                transparencyScore: 75,
                                claimsScore: 80,
                                avgClaimDays: 14,
                                serviceAreas: JSON.stringify(["Nationwide"]),
                            }
                        })
                        insCache.set(providerId, true)
                    }

                    const policyName = String(getCol(row, "Policy Name", "Plan", "name") || "Standard Policy")
                    const id = `pol-${providerId}-${policyName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
                    
                    const wpVal = parseInt(String(getCol(row, "Waiting Period", "waiting") || "0"))
                    const waitingPeriodDays = isNaN(wpVal) ? 0 : wpVal

                    const policyData = {
                        providerName,
                        category: String(getCol(row, "Category", "type") || "motor").toLowerCase(),
                        name: policyName,
                        monthlyPremium: parseFloat2(getCol(row, "Monthly Premium", "monthly")) || 0,
                        annualPremium: parseFloat2(getCol(row, "Annual Premium", "annual")) || 0,
                        excess: parseFloat2(getCol(row, "Excess", "excess")) || 0,
                        waitingPeriodDays,
                        coverLimit: parseFloat2(getCol(row, "Cover Limit", "limit")) || 0,
                        benefits: JSON.stringify(String(getCol(row, "Benefits") || "[]").split(",").map(s => s.trim())),
                        exclusions: JSON.stringify(String(getCol(row, "Exclusions") || "[]").split(",").map(s => s.trim())),
                    }

                    await prisma.policy.upsert({
                        where: { id },
                        update: { ...policyData, provider: { connect: { id: providerId } } },
                        create: { id, ...policyData, provider: { connect: { id: providerId } } }
                    })
                    insertedCount++
                } catch (rowErr: any) {
                    failedCount++
                    errors.push(rowErr?.message || String(rowErr))
                }
            }
            return NextResponse.json({ success: true, recordCount: insertedCount, failed: failedCount, errors: errors.slice(0, 5) })
        }
        else if (category === 'mobility') {
            let insertedCount = 0
            let failedCount = 0
            const errors: string[] = []

            for (const row of data) {
                try {
                    const isBus = getCol(row, "Origin", "Destination") !== null
                    const isDealership = getCol(row, "Brands", "Stock Count") !== null
                    const isDriving = getCol(row, "Price Per Lesson") !== null
                    const isVehicle = getCol(row, "Make", "Model", "Price") !== null

                    if (isBus) {
                        const providerName = String(getCol(row, "Operator", "Bus Company", "providerName") || "Unknown Bus")
                        const origin = String(getCol(row, "Origin") || "")
                        const dest = String(getCol(row, "Destination") || "")
                        const id = `bus-${providerName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${origin.toLowerCase()}-${dest.toLowerCase()}`
                        
                        await prisma.busRoute.upsert({
                            where: { id },
                            update: {
                                providerId: providerName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                                providerName,
                                origin,
                                destination: dest,
                                price: parseFloat2(getCol(row, "Price", "fare")) || 0,
                                durationHours: parseFloat2(getCol(row, "Duration")) || 0,
                                departureTimes: JSON.stringify(String(getCol(row, "Times") || "[]").split(",").map(s => s.trim())),
                                crossBorder: getCol(row, "Cross Border") === "true" || getCol(row, "Cross Border") === true,
                                amenities: JSON.stringify(String(getCol(row, "Amenities") || "[]").split(",").map(s => s.trim())),
                                busType: String(getCol(row, "Bus Type", "class") || "Standard"),
                            },
                            create: {
                                id,
                                providerId: providerName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                                providerName,
                                origin,
                                destination: dest,
                                price: parseFloat2(getCol(row, "Price", "fare")) || 0,
                                durationHours: parseFloat2(getCol(row, "Duration")) || 0,
                                departureTimes: JSON.stringify(String(getCol(row, "Times") || "[]").split(",").map(s => s.trim())),
                                crossBorder: getCol(row, "Cross Border") === "true" || getCol(row, "Cross Border") === true,
                                amenities: JSON.stringify(String(getCol(row, "Amenities") || "[]").split(",").map(s => s.trim())),
                                busType: String(getCol(row, "Bus Type", "class") || "Standard"),
                            }
                        })
                    } else if (isDealership) {
                        const name = String(getCol(row, "Dealership", "name"))
                        const id = "dlr-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                        await prisma.carDealership.upsert({
                            where: { id },
                            update: {
                                name,
                                city: String(getCol(row, "City") || "Harare"),
                                brands: JSON.stringify(String(getCol(row, "Brands") || "[]").split(",").map(s => s.trim())),
                                verified: true,
                                yearsActive: parseInt(String(getCol(row, "Years Active") || "5")),
                                stockCount: parseInt(String(getCol(row, "Stock Count") || "0")),
                                financingAvailable: true,
                                rating: 4.5,
                                phone: String(getCol(row, "Phone") || ""),
                            },
                            create: {
                                id,
                                name,
                                city: String(getCol(row, "City") || "Harare"),
                                brands: JSON.stringify(String(getCol(row, "Brands") || "[]").split(",").map(s => s.trim())),
                                verified: true,
                                yearsActive: parseInt(String(getCol(row, "Years Active") || "5")),
                                stockCount: parseInt(String(getCol(row, "Stock Count") || "0")),
                                financingAvailable: true,
                                rating: 4.5,
                                phone: String(getCol(row, "Phone") || ""),
                            }
                        })
                    } else if (isDriving) {
                        const name = String(getCol(row, "Driving School", "name"))
                        const id = "drv-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                        await prisma.drivingSchool.upsert({
                            where: { id },
                            update: {
                                name,
                                city: String(getCol(row, "City") || "Harare"),
                                pricePerLesson: parseFloat2(getCol(row, "Price Per Lesson")) || 0,
                                packagePrice: parseFloat2(getCol(row, "Package Price")) || 0,
                                lessonsInPackage: parseInt(String(getCol(row, "Lessons")) || "0"),
                                passRate: parseFloat2(getCol(row, "Pass Rate")) || 0,
                                yearsActive: 5,
                                verified: true,
                                phone: String(getCol(row, "Phone") || ""),
                            },
                            create: {
                                id,
                                name,
                                city: String(getCol(row, "City") || "Harare"),
                                pricePerLesson: parseFloat2(getCol(row, "Price Per Lesson")) || 0,
                                packagePrice: parseFloat2(getCol(row, "Package Price")) || 0,
                                lessonsInPackage: parseInt(String(getCol(row, "Lessons")) || "0"),
                                passRate: parseFloat2(getCol(row, "Pass Rate")) || 0,
                                yearsActive: 5,
                                verified: true,
                                phone: String(getCol(row, "Phone") || ""),
                            }
                        })
                    } else if (isVehicle) {
                        const make = String(getCol(row, "Make") || "")
                        const model = String(getCol(row, "Model") || "")
                        const year = parseInt(String(getCol(row, "Year") || "2020"))
                        const dealer = String(getCol(row, "Dealership", "Dealer") || "Unknown")
                        const id = `veh-${make.toLowerCase()}-${model.toLowerCase()}-${year}-${dealer.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
                        
                        const vehicleData = {
                            dealershipId: dealer.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                            dealershipName: dealer,
                            make,
                            model,
                            year,
                            price: parseFloat2(getCol(row, "Price")) || 0,
                            engineCC: parseFloat2(getCol(row, "Engine CC")) || 0,
                            fuelType: String(getCol(row, "Fuel Type") || "Petrol"),
                            mileage: parseInt(String(getCol(row, "Mileage") || "0")),
                            transmission: String(getCol(row, "Transmission") || "Manual"),
                            color: String(getCol(row, "Color") || "White"),
                            financingAvailable: true,
                            condition: String(getCol(row, "Condition") || "Used"),
                            location: String(getCol(row, "Location") || "Harare"),
                        }

                        await prisma.vehicle.upsert({
                            where: { id },
                            update: vehicleData,
                            create: { id, ...vehicleData }
                        })
                    }
                    insertedCount++
                } catch (rowErr: any) {
                    failedCount++
                    errors.push(rowErr?.message || String(rowErr))
                }
            }
            return NextResponse.json({ success: true, recordCount: insertedCount, failed: failedCount, errors: errors.slice(0, 5) })
        }
        else if (category === 'hotels') {
            let insertedCount = 0
            let failedCount = 0
            const errors: string[] = []

            for (const row of data) {
                try {
                    const name = String(getCol(row, "Hotel Name", "name"))
                    const id = "htl-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                    const hotelData = {
                        name,
                        location: String(getCol(row, "Location", "location", "city") || "Unknown"),
                        city: String(getCol(row, "City", "city", "location") || "Unknown"),
                        stars: parseInt(String(getCol(row, "Stars", "stars") || "3")),
                        pricePerNight: parseFloat2(getCol(row, "Price", "pricePerNight", "rate")) || 0,
                        amenities: (() => {
                            const raw = getCol(row, "Amenities", "amenities")
                            if (Array.isArray(raw)) return JSON.stringify(raw)
                            return JSON.stringify(String(raw || "[]").split(",").map((s: string) => s.trim()))
                        })(),
                        rating: parseFloat2(getCol(row, "Rating", "rating", "score")) || 4.0,
                        reviewCount: parseInt(String(getCol(row, "Review Count", "reviewCount") || "0")),
                        type: String(getCol(row, "Type", "type") || "hotel"),
                        recommended: getCol(row, "Recommended", "recommended") === true || getCol(row, "Recommended", "recommended") === "true",
                        bestValue: getCol(row, "Best Value", "bestValue") === true || getCol(row, "Best Value", "bestValue") === "true",
                        description: String(getCol(row, "Description", "description") || ""),
                    }
                    await prisma.hotel.upsert({
                        where: { id },
                        update: hotelData,
                        create: { id, ...hotelData }
                    })
                    insertedCount++
                } catch (rowErr: any) {
                    failedCount++
                    errors.push(rowErr?.message || String(rowErr))
                }
            }
            return NextResponse.json({ success: true, recordCount: insertedCount, failed: failedCount, errors: errors.slice(0, 5) })
        }
        else if (category === 'solar') {
            let insertedCount = 0
            let failedCount = 0
            const errors: string[] = []

            for (const row of data) {
                try {
                    const name = String(getCol(row, "Provider", "name"))
                    const id = "slr-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                    const solarData = {
                        name,
                        type: String(getCol(row, "Type", "type") || "residential"),
                        rating: parseFloat2(getCol(row, "Rating", "rating")) || 4.5,
                        installationCount: parseInt(String(getCol(row, "Installations", "installationCount") || "0")),
                        warrantyYears: parseInt(String(getCol(row, "Warranty Years", "warrantyYears") || "5")),
                        packages: JSON.stringify(String(getCol(row, "Packages", "packages") || "[]").split(";").map((s: string) => s.trim())),
                    }
                    await prisma.solarProvider.upsert({
                        where: { id },
                        update: solarData,
                        create: { id, ...solarData }
                    })
                    insertedCount++
                } catch (rowErr: any) {
                    failedCount++
                    errors.push(rowErr?.message || String(rowErr))
                }
            }
            return NextResponse.json({ success: true, recordCount: insertedCount, failed: failedCount, errors: errors.slice(0, 5) })
        }
        else if (category === 'utilities') {
            let insertedCount = 0
            let failedCount = 0
            const errors: string[] = []

            for (const row of data) {
                try {
                    const name = String(getCol(row, "Provider", "name"))
                    const id = "utl-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                    const utilityData = {
                        name,
                        type: String(getCol(row, "Type", "category") || "electricity"),
                        rating: parseFloat2(getCol(row, "Rating")) || 4.0,
                    }
                    await prisma.utilityProvider.upsert({
                        where: { id },
                        update: utilityData,
                        create: { id, ...utilityData }
                    })
                    insertedCount++
                } catch (rowErr: any) {
                    failedCount++
                    errors.push(rowErr?.message || String(rowErr))
                }
            }
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
