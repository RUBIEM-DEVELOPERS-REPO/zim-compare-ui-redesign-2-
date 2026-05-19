import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- DATABASE AUDIT START ---')

  // User Count
  const users = await prisma.user.count()
  console.log(`Users: ${users}`)

  // Banks
  const banksCount = await prisma.bank.count()
  const bankProducts = await prisma.bankingProduct.groupBy({
    by: ['category'],
    _count: true,
  })
  console.log(`Banks: ${banksCount}`)
  console.log('Banking Products by Category:')
  console.log(bankProducts)

  // Telecoms
  const telecomProvidersCount = await prisma.telecomProvider.count()
  const dataBundlesCount = await prisma.dataBundle.count()
  const voiceRatesCount = await prisma.voiceRate.count()
  console.log(`Telecom Providers: ${telecomProvidersCount}`)
  console.log(`Data Bundles: ${dataBundlesCount}`)
  console.log(`Voice Rates: ${voiceRatesCount}`)

  // Schools
  const schoolsCount = await prisma.school.count()
  console.log(`Schools: ${schoolsCount}`)

  // Universities
  const universitiesCount = await prisma.university.count()
  console.log(`Universities: ${universitiesCount}`)

  // Insurance
  const insuranceCount = await prisma.insuranceProvider.count()
  const policiesCount = await prisma.policy.groupBy({
    by: ['category'],
    _count: true,
  })
  console.log(`Insurance Providers: ${insuranceCount}`)
  console.log('Policies by Category:')
  console.log(policiesCount)

  // Mobility
  const dealershipsCount = await prisma.carDealership.count()
  const vehiclesCount = await prisma.vehicle.count()
  const drivingSchoolsCount = await prisma.drivingSchool.count()
  const busRoutesCount = await prisma.busRoute.count()
  console.log(`Car Dealerships: ${dealershipsCount}`)
  console.log(`Vehicles: ${vehiclesCount}`)
  console.log(`Driving Schools: ${drivingSchoolsCount}`)
  console.log(`Bus Routes: ${busRoutesCount}`)

  // Hotels
  const hotelsCount = await prisma.hotel.count()
  console.log(`Hotels: ${hotelsCount}`)

  // Solar
  const solarCount = await prisma.solarProvider.count()
  console.log(`Solar Providers: ${solarCount}`)

  // Utilities
  const utilitiesCount = await prisma.utilityProvider.count()
  console.log(`Utility Providers: ${utilitiesCount}`)

  console.log('--- DATABASE AUDIT END ---')
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
