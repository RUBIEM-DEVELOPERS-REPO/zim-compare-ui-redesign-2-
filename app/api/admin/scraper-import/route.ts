import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { category, source, records } = body

        if (!category || !records || !Array.isArray(records)) {
            return NextResponse.json({ error: "Invalid payload. category and records[] are required." }, { status: 400 })
        }

        console.log(`[Scraper Import] Received ${records.length} records for category: ${category} from source: ${source || "unknown"}`)

        let importedCount = 0
        let skippedCount = 0
        let errorCount = 0
        const errors: string[] = []

        for (const record of records) {
            try {
                if (category === "banking") {
                    if (record.account || record.category === "savings" || record.category === "current") {
                        // BankingProduct lacks an isManual column and unique bankName_name compound key

                        await prisma.bankingProduct.upsert({
                            where: { id: record.id },
                            update: {
                                bankId: record.bankId,
                                bankName: record.bankName,
                                category: record.category,
                                name: record.name,
                                interestRate: record.interestRate || 0,
                                minBalance: record.minBalance || 0,
                                monthlyFee: record.monthlyFee || 0,
                                perks: typeof record.perks === 'string' ? record.perks : JSON.stringify(record.perks || []),
                            },
                            create: {
                                id: record.id,
                                bankId: record.bankId,
                                bankName: record.bankName,
                                category: record.category,
                                name: record.name,
                                interestRate: record.interestRate || 0,
                                minBalance: record.minBalance || 0,
                                monthlyFee: record.monthlyFee || 0,
                                perks: typeof record.perks === 'string' ? record.perks : JSON.stringify(record.perks || []),
                            }
                        })
                    } else if (record.transparencyScore !== undefined) {
                        // Bank lacks an isManual column and unique name key

                        await prisma.bank.upsert({
                            where: { id: record.id },
                            update: {
                                name: record.name,
                                type: record.type,
                                logo: record.logo,
                                transparencyScore: record.transparencyScore,
                                digitalScore: record.digitalScore,
                                website: record.website,
                                headOfficeAddress: record.headOfficeAddress,
                                contactPhone: record.contactPhone,
                                contactEmail: record.contactEmail,
                                branches: record.branches || 0,
                                digitalFeatures: typeof record.digitalFeatures === 'string' ? record.digitalFeatures : JSON.stringify(record.digitalFeatures || []),
                                locations: typeof record.locations === 'string' ? record.locations : JSON.stringify(record.locations || []),
                            },
                            create: {
                                id: record.id,
                                name: record.name,
                                type: record.type,
                                logo: record.logo,
                                transparencyScore: record.transparencyScore,
                                digitalScore: record.digitalScore,
                                website: record.website,
                                headOfficeAddress: record.headOfficeAddress,
                                contactPhone: record.contactPhone,
                                contactEmail: record.contactEmail,
                                branches: record.branches || 0,
                                digitalFeatures: typeof record.digitalFeatures === 'string' ? record.digitalFeatures : JSON.stringify(record.digitalFeatures || []),
                                locations: typeof record.locations === 'string' ? record.locations : JSON.stringify(record.locations || []),
                            }
                        })
                    } else {
                        skippedCount++
                        continue
                    }
                } 
                else if (category === "telecom") {
                    if (record.total_data_mb !== undefined) {
                        // DataBundle lacks an isManual column and unique operator_bundle_name compound key

                        await prisma.dataBundle.upsert({
                            where: { id: record.id || `db-${record.operator}-${record.bundle_name}` },
                            update: {
                                operator: record.operator,
                                currency: record.currency || "USD",
                                bundle_group: record.bundle_group,
                                bundle_name: record.bundle_name,
                                price: record.price,
                                validity_type: record.validity_type,
                                validity_value: record.validity_value,
                                validity_unit: record.validity_unit,
                                total_data_mb: record.total_data_mb,
                                source_url: record.source_url,
                                source_name: record.source_name || source,
                            },
                            create: {
                                id: record.id || `db-${record.operator}-${record.bundle_name}`,
                                operator: record.operator,
                                currency: record.currency || "USD",
                                bundle_group: record.bundle_group,
                                bundle_name: record.bundle_name,
                                price: record.price,
                                validity_type: record.validity_type,
                                validity_value: record.validity_value,
                                validity_unit: record.validity_unit,
                                total_data_mb: record.total_data_mb,
                                source_url: record.source_url,
                                source_name: record.source_name || source,
                            }
                        })
                    } else if (record.coverageScore !== undefined) {
                        // TelecomProvider lacks an isManual column and unique name key

                        await prisma.telecomProvider.upsert({
                            where: { id: record.id },
                            update: {
                                name: record.name,
                                type: record.type,
                                logo: record.logo,
                                transparencyScore: record.transparencyScore || 0,
                                digitalScore: record.digitalScore,
                                website: record.website,
                                headOfficeAddress: record.headOfficeAddress,
                                contactPhone: record.contactPhone,
                                contactEmail: record.contactEmail,
                                coverageScore: record.coverageScore,
                                networkType: record.networkType || "4G",
                                coverageCities: typeof record.coverageCities === 'string' ? record.coverageCities : JSON.stringify(record.coverageCities || []),
                            },
                            create: {
                                id: record.id,
                                name: record.name,
                                type: record.type,
                                logo: record.logo,
                                transparencyScore: record.transparencyScore || 0,
                                digitalScore: record.digitalScore,
                                website: record.website,
                                headOfficeAddress: record.headOfficeAddress,
                                contactPhone: record.contactPhone,
                                contactEmail: record.contactEmail,
                                coverageScore: record.coverageScore,
                                networkType: record.networkType || "4G",
                                coverageCities: typeof record.coverageCities === 'string' ? record.coverageCities : JSON.stringify(record.coverageCities || []),
                            }
                        })
                    } else {
                        skippedCount++
                        continue
                    }
                }
                else if (category === "insurance") {
                    if (record.monthlyPremium !== undefined) {
                        // Guard: skip if manual Policy exists for this providerName+name
                        const existing = await prisma.policy.findFirst({
                            where: { providerName: record.providerName, name: record.name }
                        })
                        if (existing?.isManual) { skippedCount++; continue }

                        await prisma.policy.upsert({
                            where: { id: record.id },
                            update: {
                                providerId: record.providerId,
                                providerName: record.providerName,
                                category: record.category,
                                name: record.name,
                                monthlyPremium: record.monthlyPremium,
                                annualPremium: record.annualPremium || record.monthlyPremium * 12,
                                excess: record.excess || 0,
                                waitingPeriodDays: record.waitingPeriodDays || 0,
                                coverLimit: record.coverLimit || 0,
                                benefits: typeof record.benefits === 'string' ? record.benefits : JSON.stringify(record.benefits || []),
                                exclusions: typeof record.exclusions === 'string' ? record.exclusions : JSON.stringify(record.exclusions || []),
                            },
                            create: {
                                id: record.id,
                                providerId: record.providerId,
                                providerName: record.providerName,
                                category: record.category,
                                name: record.name,
                                monthlyPremium: record.monthlyPremium,
                                annualPremium: record.annualPremium || record.monthlyPremium * 12,
                                excess: record.excess || 0,
                                waitingPeriodDays: record.waitingPeriodDays || 0,
                                coverLimit: record.coverLimit || 0,
                                benefits: typeof record.benefits === 'string' ? record.benefits : JSON.stringify(record.benefits || []),
                                exclusions: typeof record.exclusions === 'string' ? record.exclusions : JSON.stringify(record.exclusions || []),
                            }
                        })
                    } else if (record.claimsScore !== undefined) {
                        // Guard: skip if manual InsuranceProvider exists for this name
                        const existing = await prisma.insuranceProvider.findFirst({ where: { name: record.name } })
                        if (existing?.isManual) { skippedCount++; continue }

                        await prisma.insuranceProvider.upsert({
                            where: { id: record.id },
                            update: {
                                name: record.name,
                                type: record.type,
                                logo: record.logo,
                                transparencyScore: record.transparencyScore || 0,
                                digitalScore: record.digitalScore,
                                website: record.website,
                                headOfficeAddress: record.headOfficeAddress,
                                contactPhone: record.contactPhone,
                                contactEmail: record.contactEmail,
                                claimsScore: record.claimsScore,
                                avgClaimDays: record.avgClaimDays || 30,
                                serviceAreas: typeof record.serviceAreas === 'string' ? record.serviceAreas : JSON.stringify(record.serviceAreas || []),
                            },
                            create: {
                                id: record.id,
                                name: record.name,
                                type: record.type,
                                logo: record.logo,
                                transparencyScore: record.transparencyScore || 0,
                                digitalScore: record.digitalScore,
                                website: record.website,
                                headOfficeAddress: record.headOfficeAddress,
                                contactPhone: record.contactPhone,
                                contactEmail: record.contactEmail,
                                claimsScore: record.claimsScore,
                                avgClaimDays: record.avgClaimDays || 30,
                                serviceAreas: typeof record.serviceAreas === 'string' ? record.serviceAreas : JSON.stringify(record.serviceAreas || []),
                            }
                        })
                    } else {
                        skippedCount++
                        continue
                    }
                }
                else if (category === "schools") {
                    // School lacks an isManual column and unique name key

                    await prisma.school.upsert({
                        where: { id: record.id },
                        update: {
                            name: record.name,
                            type: record.type,
                            logo: record.logo,
                            transparencyScore: record.transparencyScore || 0,
                            digitalScore: record.digitalScore,
                            website: record.website,
                            headOfficeAddress: record.headOfficeAddress,
                            contactPhone: record.contactPhone,
                            contactEmail: record.contactEmail,
                            curriculum: typeof record.curriculum === 'string' ? record.curriculum : JSON.stringify(record.curriculum || []),
                            province: record.province,
                            city: record.city,
                            tuitionPerTerm: record.tuitionPerTerm,
                            boardingFeePerTerm: record.boardingFeePerTerm,
                            totalAnnualCost: record.totalAnnualCost,
                            passRate: record.passRate,
                            studentTeacherRatio: record.studentTeacherRatio,
                            facilities: typeof record.facilities === 'string' ? record.facilities : JSON.stringify(record.facilities || []),
                            sports: typeof record.sports === 'string' ? record.sports : JSON.stringify(record.sports || []),
                            academicScore: record.academicScore || 0,
                            safetyScore: record.safetyScore || 0,
                        },
                        create: {
                            id: record.id,
                            name: record.name,
                            type: record.type,
                            logo: record.logo,
                            transparencyScore: record.transparencyScore || 0,
                            digitalScore: record.digitalScore,
                            website: record.website,
                            headOfficeAddress: record.headOfficeAddress,
                            contactPhone: record.contactPhone,
                            contactEmail: record.contactEmail,
                            curriculum: typeof record.curriculum === 'string' ? record.curriculum : JSON.stringify(record.curriculum || []),
                            province: record.province,
                            city: record.city,
                            tuitionPerTerm: record.tuitionPerTerm,
                            boardingFeePerTerm: record.boardingFeePerTerm,
                            totalAnnualCost: record.totalAnnualCost,
                            passRate: record.passRate,
                            studentTeacherRatio: record.studentTeacherRatio,
                            facilities: typeof record.facilities === 'string' ? record.facilities : JSON.stringify(record.facilities || []),
                            sports: typeof record.sports === 'string' ? record.sports : JSON.stringify(record.sports || []),
                            academicScore: record.academicScore || 0,
                            safetyScore: record.safetyScore || 0,
                        }
                    })
                }
                else {
                    skippedCount++
                    continue
                }

                importedCount++
            } catch (err: any) {
                console.error(`[Scraper Import] Error processing record:`, err)
                errorCount++
                errors.push(`${record.id || 'unknown'}: ${err.message}`)
            }
        }

        return NextResponse.json({
            success: true,
            importedCount,
            skippedCount,
            errorCount,
            errors: errors.length > 0 ? errors : undefined
        })

    } catch (e: any) {
        console.error(`[Scraper Import] Fatal error:`, e)
        return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 })
    }
}
