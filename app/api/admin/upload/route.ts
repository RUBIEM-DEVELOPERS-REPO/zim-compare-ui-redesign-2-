import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const { category } = await request.json()
        if (!category) return NextResponse.json({ error: "Category is required" }, { status: 400 })

        let recordCount = 0

        if (category === "banking") {
            const { banks, bankingProducts, bankFees, bankLoans } = await import("@/lib/mock/banks")
            await prisma.bank.createMany({ data: banks.map(b => ({ ...b, digitalFeatures: JSON.stringify(b.digitalFeatures), locations: JSON.stringify(b.locations) })) })
            await prisma.bankingProduct.createMany({ data: bankingProducts.map(p => ({ ...p, perks: JSON.stringify(p.perks) })) })
            await prisma.bankFee.createMany({ data: bankFees })
            await prisma.bankLoan.createMany({ data: bankLoans.map(l => ({ ...l, requirements: JSON.stringify(l.requirements) })) })
            recordCount = banks.length + bankingProducts.length + bankFees.length + bankLoans.length
        }
        else if (category === "telecom") {
            const { telecomProviders, dataBundles, voiceRates } = await import("@/lib/mock/telecoms")
            await prisma.telecomProvider.createMany({ data: telecomProviders.map(t => ({ ...t, coverageCities: JSON.stringify(t.coverageCities) })) })
            await prisma.dataBundle.createMany({ data: dataBundles })
            await prisma.voiceRate.createMany({ data: voiceRates })
            recordCount = telecomProviders.length + dataBundles.length + voiceRates.length
        }
        else if (category === "schools") {
            const { schools } = await import("@/lib/mock/schools")
            await prisma.school.createMany({ data: schools.map(s => ({ ...s, curriculum: JSON.stringify(s.curriculum), facilities: JSON.stringify(s.facilities), sports: JSON.stringify(s.sports) })) })
            recordCount = schools.length
        }
        else if (category === "insurance") {
            const { insuranceProviders, policies } = await import("@/lib/mock/insurance")
            await prisma.insuranceProvider.createMany({ data: insuranceProviders.map(i => ({ ...i, serviceAreas: JSON.stringify(i.serviceAreas) })) })
            await prisma.policy.createMany({ data: policies.map(p => ({ ...p, benefits: JSON.stringify(p.benefits), exclusions: JSON.stringify(p.exclusions) })) })
            recordCount = insuranceProviders.length + policies.length
        }
        else {
            return NextResponse.json({ error: "Unknown category" }, { status: 400 })
        }

        return NextResponse.json({ success: true, recordCount, category })

    } catch (e: any) {
        if (e.code === 'P2002') {
            return NextResponse.json({ error: "Data for this category already exists in database. Cannot upload twice." }, { status: 400 })
        }
        return NextResponse.json({ error: e.message || "Failed to upload data" }, { status: 500 })
    }
}
