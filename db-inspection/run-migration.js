const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_Gn7xCrtb0YgH@ep-withered-heart-aqw3dy7m-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

async function run() {
  await client.connect();
  console.log('Connected to DB.');

  const sql = fs.readFileSync(path.join(__dirname, '..', 'missing_tables.sql'), 'utf8');
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    try {
      await client.query(stmt);
      console.log('OK:', stmt.substring(0, 80));
    } catch (err) {
      console.error('ERROR:', err.message, '\nStatement:', stmt.substring(0, 80));
    }
  }

  await client.end();
  console.log('Done.');
}

run().catch(console.error);
