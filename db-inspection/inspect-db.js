const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_zPTo7bk8ujif@ep-misty-silence-aqnh6z88-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public';
  `);
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}
run().catch(console.error);
