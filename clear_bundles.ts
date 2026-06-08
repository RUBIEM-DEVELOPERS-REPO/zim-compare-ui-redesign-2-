import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); async function main() { await prisma.dataBundle.deleteMany(); console.log('Data bundles cleared'); } main();
