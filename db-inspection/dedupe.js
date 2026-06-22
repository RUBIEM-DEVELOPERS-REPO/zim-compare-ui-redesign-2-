const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tablesToDedupe = [
  { table: 'Bank', keys: ['name'] },
  { table: 'BankingProduct', keys: ['"bankName"', 'name'] },
  { table: 'BankFee', keys: ['"bankName"', 'category', 'name'] },
  { table: 'BankLoan', keys: ['"bankName"', 'name'] },
  { table: 'TelecomProvider', keys: ['name'] },
  { table: 'DataBundle', keys: ['operator', 'bundle_name'] },
  { table: 'VoiceRate', keys: ['operator', 'offer_type', 'bundle_name'] },
  { table: 'School', keys: ['name'] },
  { table: 'universities', keys: ['university'] },
  { table: 'InsuranceProvider', keys: ['name'] },
  { table: 'Policy', keys: ['"providerName"', 'name'] },
  { table: 'insurance', keys: ['provider_name', 'product_name'] },
  { table: 'loan_products', keys: ['bank_id', 'loan_name'] },
  { table: 'medical_aid_schemes', keys: ['provider_name', 'plan_name'] },
  { table: 'Vehicle', keys: ['"dealershipName"', 'make', 'model'] },
  { table: 'CarDealership', keys: ['name'] },
  { table: 'DrivingSchool', keys: ['name'] },
  { table: 'BusRoute', keys: ['"providerName"', 'origin', 'destination'] },
  { table: 'Hotel', keys: ['name'] },
  { table: 'SolarProvider', keys: ['name'] },
  { table: 'UtilityProvider', keys: ['name'] },
];

async function main() {
  for (const { table, keys } of tablesToDedupe) {
    try {
      const keyList = keys.join(', ');
      const matchConditions = keys.map(k => `a.${k} = b.${k}`).join(' AND ');
      
      const query = `
        DELETE FROM "${table}" a USING (
          SELECT MIN(id) as id, ${keyList}
          FROM "${table}" 
          GROUP BY ${keyList} HAVING COUNT(*) > 1
        ) b
        WHERE ${matchConditions} AND a.id <> b.id;
      `;
      // We loop it just in case there are >2 duplicates per group
      let affected = 1;
      let totalDeleted = 0;
      while (affected > 0) {
        const result = await prisma.$executeRawUnsafe(query);
        affected = Number(result);
        totalDeleted += affected;
      }
      if (totalDeleted > 0) {
        console.log(`Deduplicated ${table}: removed ${totalDeleted} rows.`);
      }
    } catch(e) {
      // Just ignore if table doesn't exist or syntax error (some tables might be mapped differently, e.g. universities)
      console.error(`Failed on ${table}: ${e.message}`);
    }
  }
}
main().then(() => process.exit(0));
