import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- PURGING SALARY PRODUCTS START ---')

  const deleteCount = await prisma.bankingProduct.deleteMany({
    where: {
      category: {
        in: ['salary', 'salary_account']
      }
    }
  })

  console.log(`Deleted ${deleteCount.count} banking product records with salary category.`)
  console.log('--- PURGING SALARY PRODUCTS END ---')
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
