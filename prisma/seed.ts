import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Import mock data directly
import { banks, bankingProducts, bankFees, bankLoans } from '../lib/mock/banks'
import { telecomProviders, dataBundles, voiceRates } from '../lib/mock/telecoms'
import { schools } from '../lib/mock/schools'
import { universities } from '../lib/mock/universities'
import { insuranceProviders, policies } from '../lib/mock/insurance'
import { carDealerships as dealerships, vehicles, drivingSchools, busRoutes } from '../lib/mock/transport'
// omitted utilities and hotels

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding started...')

  // 1. Seed User
  const passwordHash = await bcrypt.hash('Password123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'admin@zimcompare.com' },
    update: {},
    create: {
      email: 'admin@zimcompare.com',
      password: passwordHash,
      name: 'Admin User',
      role: 'admin',
    },
  })
  console.log('Admin user created:', user.email)

  // 2. Seed Banks
  for (const bank of banks) {
    await prisma.bank.upsert({
      where: { id: bank.id },
      update: {},
      create: {
        id: bank.id,
        name: bank.name,
        type: bank.type,
        logo: bank.logo || null,
        transparencyScore: bank.transparencyScore,
        digitalScore: bank.digitalScore || null,
        website: bank.website || null,
        headOfficeAddress: bank.headOfficeAddress || null,
        contactPhone: bank.contactPhone || null,
        contactEmail: bank.contactEmail || null,
        branches: bank.branches,
        digitalFeatures: JSON.stringify(bank.digitalFeatures || []),
        locations: JSON.stringify(bank.locations || []),
      },
    })
  }
  for (const p of bankingProducts) {
    await prisma.bankingProduct.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        bankId: p.bankId,
        bankName: p.bankName,
        category: p.category,
        name: p.name,
        interestRate: p.interestRate,
        minBalance: p.minBalance,
        monthlyFee: p.monthlyFee,
        perks: JSON.stringify(p.perks || []),
      },
    })
  }
  for (const f of bankFees) {
    await prisma.bankFee.upsert({
      where: { id: f.id },
      update: {},
      create: {
        id: f.id,
        bankId: f.bankId,
        bankName: f.bankName,
        category: f.category,
        name: f.name,
        amount: f.amount,
        unit: f.unit,
        description: f.description,
      },
    })
  }
  if (bankLoans) {
    for (const l of bankLoans) {
      await prisma.bankLoan.upsert({
        where: { id: l.id },
        update: {},
        create: {
          id: l.id,
          bankId: l.bankId,
          bankName: l.bankName,
          category: l.category,
          name: l.name,
          apr: l.apr,
          initiationFee: l.initiationFee,
          earlySettlementPenalty: l.earlySettlementPenalty,
          maxTermMonths: l.maxTermMonths,
          requirements: JSON.stringify(l.requirements || []),
        },
      })
    }
  }

  // 3. Seed Telecoms
  for (const t of telecomProviders) {
    await prisma.telecomProvider.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        name: t.name,
        type: t.type,
        logo: t.logo || null,
        transparencyScore: t.transparencyScore,
        digitalScore: t.digitalScore || null,
        website: t.website || null,
        headOfficeAddress: t.headOfficeAddress || null,
        contactPhone: t.contactPhone || null,
        contactEmail: t.contactEmail || null,
        coverageScore: t.coverageScore,
        networkType: t.networkType,
        coverageCities: JSON.stringify(t.coverageCities || []),
      },
    })
  }
  for (const p of dataBundles) {
    await prisma.dataBundle.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        operator: (p as any).operator || (p as any).providerId || "tel-unknown",
        currency: (p as any).currency || "USD",
        bundle_group: (p as any).bundle_group || (p as any).category || "general",
        bundle_name: (p as any).bundle_name || (p as any).name || "Unknown Bundle",
        price: p.price,
        validity_type: (p as any).validity_type || "rolling",
        validity_value: (p as any).validity_value || (p as any).validityDays || 30,
        validity_unit: (p as any).validity_unit || "days",
        total_data_mb: (p as any).total_data_mb ?? ((p as any).dataGB ?? 0) * 1024,
      },
    })
  }
  for (const v of voiceRates) {
    await prisma.voiceRate.upsert({
      where: { id: v.id },
      update: {},
      create: {
        id: v.id,
        providerId: v.providerId,
        providerName: v.providerName,
        type: v.type,
        ratePerMin: v.ratePerMin,
        smsRate: v.smsRate,
      },
    })
  }

  // 4. Seed Schools & Universities
  for (const s of schools) {
    await prisma.school.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        name: s.name,
        type: s.type,
        transparencyScore: s.transparencyScore,
        curriculum: JSON.stringify(s.curriculum || []),
        province: s.province,
        city: s.city,
        tuitionPerTerm: s.tuitionPerTerm,
        boardingFeePerTerm: s.boardingFeePerTerm || null,
        totalAnnualCost: s.totalAnnualCost,
        passRate: s.passRate,
        studentTeacherRatio: s.studentTeacherRatio,
        facilities: JSON.stringify(s.facilities || []),
        sports: JSON.stringify(s.sports || []),
        academicScore: s.academicScore,
        safetyScore: s.safetyScore,
      },
    })
  }
  // Universities are seeded exclusively via the admin bulk CSV import.
  // See: /api/admin/bulk-import


  // 5. Seed Insurance
  for (const i of insuranceProviders) {
    await prisma.insuranceProvider.upsert({
      where: { id: i.id },
      update: {},
      create: {
        id: i.id,
        name: i.name,
        type: i.type || 'General',
        transparencyScore: i.transparencyScore,
        claimsScore: i.claimsScore,
        avgClaimDays: i.avgClaimDays,
        serviceAreas: JSON.stringify(i.serviceAreas || []),
      },
    })
  }
  for (const p of policies) {
    await prisma.policy.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        providerId: p.providerId,
        providerName: p.providerName,
        category: p.category,
        name: p.name,
        monthlyPremium: p.monthlyPremium,
        annualPremium: p.annualPremium,
        excess: p.excess,
        waitingPeriodDays: p.waitingPeriodDays,
        coverLimit: p.coverLimit,
        benefits: JSON.stringify(p.benefits || []),
        exclusions: JSON.stringify(p.exclusions || []),
      },
    })
  }

  // 6. Seed Mobility
  for (const d of dealerships) {
    await prisma.carDealership.upsert({
      where: { id: d.id },
      update: {},
      create: {
        id: d.id,
        name: d.name,
        city: d.city,
        brands: JSON.stringify(d.brands || []),
        verified: d.verified,
        yearsActive: d.yearsActive,
        stockCount: d.stockCount,
        financingAvailable: d.financingAvailable,
        rating: d.rating,
        phone: d.phone,
      },
    })
  }
  for (const v of vehicles) {
    await prisma.vehicle.upsert({
      where: { id: v.id },
      update: {},
      create: {
        id: v.id,
        dealershipId: v.dealershipId,
        dealershipName: v.dealershipName,
        make: v.make,
        model: v.model,
        year: v.year,
        price: v.price,
        engineCC: v.engineCC,
        fuelType: v.fuelType,
        mileage: v.mileage,
        transmission: v.transmission,
        color: v.color,
        financingAvailable: v.financingAvailable,
        condition: v.condition,
        bestValue: v.bestValue || false,
        location: v.location,
        range: v.range || null,
        batterySize: v.batterySize || null,
        owners: v.owners || null,
      },
    })
  }
  for (const d of drivingSchools) {
    await prisma.drivingSchool.upsert({
      where: { id: d.id },
      update: {},
      create: {
        id: d.id,
        name: d.name,
        city: d.city,
        pricePerLesson: d.pricePerLesson,
        packagePrice: d.packagePrice,
        lessonsInPackage: d.lessonsInPackage,
        passRate: d.passRate,
        yearsActive: d.yearsActive,
        verified: d.verified,
        phone: d.phone,
      },
    })
  }
  for (const b of busRoutes) {
    await prisma.busRoute.upsert({
      where: { id: b.id },
      update: {},
      create: {
        id: b.id,
        providerId: b.providerId,
        providerName: b.providerName,
        origin: b.origin,
        destination: b.destination,
        price: b.price,
        durationHours: b.durationHours,
        departureTimes: JSON.stringify(b.departureTimes || []),
        crossBorder: b.crossBorder,
        borderCrossing: b.borderCrossing || null,
        amenities: JSON.stringify(b.amenities || []),
        busType: b.busType,
      },
    })
  }

  // Omitted Seed Hotels, Solar, Utilities to resolve schema mismatches

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
