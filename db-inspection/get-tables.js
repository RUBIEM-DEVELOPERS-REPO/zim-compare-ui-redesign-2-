const { Client } = require('pg');

const client = new Client({ 
  connectionString: 'postgresql://neondb_owner:npg_Gn7xCrtb0YgH@ep-withered-heart-aqw3dy7m-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require' 
});

async function run() {
  await client.connect();
  const tables = ['insurance', 'InsuranceProvider', 'loan_products', 'medical_aid_schemes', 'Policy', 'Vehicle'];
  for (const table of tables) {
    const res = await client.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1`, [table]);
    console.log(`Table: ${table}`);
    console.log(res.rows);
  }
  await client.end();
}

run().catch(console.error);
