import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding started...')

  // 1. Seed Secure Admin Account
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
