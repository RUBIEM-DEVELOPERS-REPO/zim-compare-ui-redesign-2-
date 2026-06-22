const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const fieldsToAdd = `
  source           String    @default("auto")
  isManual         Boolean   @default(false)
  lastManualUpdate DateTime?
`;

const modelsToUpdate = {
  Bank: '@@unique([name])',
  BankingProduct: '@@unique([bankName, name])',
  BankFee: '@@unique([bankName, category, name])',
  BankLoan: '@@unique([bankName, name])',
  TelecomProvider: '@@unique([name])',
  DataBundle: '@@unique([operator, bundle_name])',
  VoiceRate: '@@unique([operator, offer_type, bundle_name])',
  School: '@@unique([name])',
  University: '@@unique([university])',
  InsuranceProvider: '@@unique([name])',
  Policy: '@@unique([providerName, name])',
  insurance: '@@unique([provider_name, product_name])',
  loan_products: '@@unique([bank_id, loan_name])',
  medical_aid_schemes: '@@unique([provider_name, plan_name])',
  Vehicle: '@@unique([dealershipName, make, model])',
  CarDealership: '@@unique([name])',
  DrivingSchool: '@@unique([name])',
  BusRoute: '@@unique([providerName, origin, destination])',
  Hotel: '@@unique([name])',
  SolarProvider: '@@unique([name])',
  UtilityProvider: '@@unique([name])'
};

for (const [modelName, uniqueConstraint] of Object.entries(modelsToUpdate)) {
  const regex = new RegExp(`(model\\s+${modelName}\\s+{[^}]*)`, 'g');
  schema = schema.replace(regex, (match) => {
    // Check if source already exists to prevent duplicate injection
    if (match.includes('source           String')) return match;
    
    // Add fields and constraint at the end of the model block
    // Handle cases where the model has @@map or @@index
    let modifiedMatch = match;
    
    modifiedMatch = modifiedMatch.trimRight();
    modifiedMatch += `\n${fieldsToAdd}`;
    
    if (!modifiedMatch.includes(uniqueConstraint)) {
      modifiedMatch += `  ${uniqueConstraint}\n`;
    }
    
    return modifiedMatch;
  });
}

fs.writeFileSync(schemaPath, schema, 'utf8');
console.log('schema.prisma updated successfully.');
