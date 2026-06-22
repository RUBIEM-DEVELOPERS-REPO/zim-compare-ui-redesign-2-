const fs = require('fs');
const sql = fs.readFileSync('full_schema.sql', 'utf8');
const tables = ['SchoolManualData', 'UniversityManualData', 'InsuranceManualData', 'BankingManualFee'];

let output = '';

for (const t of tables) {
    const regex = new RegExp('CREATE TABLE "' + t + '"[\\s\\S]*?\\);', 'g');
    const matches = sql.match(regex);
    if (matches) output += matches.join('\n\n') + '\n\n';
}

const idxRegex = new RegExp('CREATE INDEX.*?(?:' + tables.join('|') + ').*?;', 'g');
const idxMatches = sql.match(idxRegex);
if (idxMatches) output += idxMatches.join('\n') + '\n';

fs.writeFileSync('missing_tables.sql', output);
console.log('Done!');
