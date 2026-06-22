const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Add normalised column to existing models
schema = schema.replace(/model InsuranceProvider \{([\s\S]*?)claimsScore       Int\n/, 'model InsuranceProvider {$1claimsScore       Int\n  normalised        Float?\n');
schema = schema.replace(/model Policy \{([\s\S]*?)benefits          String(.*)\n/, 'model Policy {$1benefits          String$2\n  normalised        Float?\n');
schema = schema.replace(/model Vehicle \{([\s\S]*?)location           String\n/, 'model Vehicle {$1location           String\n  normalised         Float?\n');

// 2. Append new models
const newModels = `
model insurance {
  id                     Int       @id @default(autoincrement())
  provider_name          String?
  provider_type          String?
  provider_website       String?
  product_category       String?
  product_name           String?
  product_type           String?
  coverage_description   String?
  coverage_limit         Decimal?  @db.Decimal
  coverage_currency      String?   @db.VarChar(10)
  premium_amount         Decimal?  @db.Decimal
  premium_currency       String?   @db.VarChar(10)
  premium_frequency      String?
  price_string           String?
  excess_deductible      Decimal?  @db.Decimal
  waiting_period_days    Int?
  age_minimum            Int?
  age_maximum            Int?
  third_party_covered    Boolean?
  own_damage_covered     Boolean?
  comprehensive_coverage Boolean?
  accidental_damage      Boolean?
  theft_coverage         Boolean?
  personal_belongings    Boolean?
  legal_liability        Boolean?
  roadside_assistance    Boolean?
  confidence_score       Decimal?  @db.Decimal(5, 4)
  source_url             String?
  scraped_date           DateTime? @db.Timestamp(6)
  data_status            String?
  normalised             Float?
}

model loan_products {
  id                              BigInt    @id @default(autoincrement())
  bank_id                         BigInt
  loan_name                       String    @db.VarChar(255)
  loan_type                       String    @db.VarChar(50)
  currency                        String?   @db.VarChar(20)
  minimum_loan_amount             Decimal?  @db.Decimal(18, 2)
  maximum_loan_amount             Decimal?  @db.Decimal(18, 2)
  interest_rate                   Decimal?  @db.Decimal(10, 4)
  interest_rate_type              String?   @db.VarChar(20)
  apr                             Decimal?  @db.Decimal(10, 4)
  minimum_repayment_period_months Int?
  maximum_repayment_period_months Int?
  application_fee                 Decimal?  @db.Decimal(18, 2)
  processing_fee                  Decimal?  @db.Decimal(18, 2)
  administration_fee              Decimal?  @db.Decimal(18, 2)
  facility_fee                    Decimal?  @db.Decimal(18, 2)
  insurance_required              Boolean?  @default(false)
  insurance_fee                   Decimal?  @db.Decimal(18, 2)
  minimum_age                     Int?
  maximum_age                     Int?
  minimum_salary                  Decimal?  @db.Decimal(18, 2)
  collateral_required             Boolean?  @default(false)
  collateral_type                 String?   @db.VarChar(255)
  guarantor_required              Boolean?  @default(false)
  approval_time                   String?   @db.VarChar(100)
  disbursement_time               String?   @db.VarChar(100)
  repayment_frequency             String?   @db.VarChar(20)
  grace_period_days               Int?
  top_up_available                Boolean?  @default(false)
  early_settlement_allowed        Boolean?  @default(false)
  early_settlement_fee            Decimal?  @db.Decimal(18, 2)
  late_payment_penalty            Decimal?  @db.Decimal(18, 2)
  online_application              Boolean?  @default(false)
  mobile_application              Boolean?  @default(false)
  credit_score_required           Boolean?  @default(false)
  business_registration_required  Boolean?  @default(false)
  tax_clearance_required          Boolean?  @default(false)
  financial_statements_required   Boolean?  @default(false)
  relationship_manager_available  Boolean?  @default(false)
  required_documents              String?
  eligibility_requirements        String?
  special_features                String?
  effective_date                  DateTime? @db.Date
  status                          String?   @default("Active") @db.VarChar(20)
  created_at                      DateTime? @default(now()) @db.Timestamp(6)
  updated_at                      DateTime? @default(now()) @db.Timestamp(6)
  normalised                      Float?
}

model medical_aid_schemes {
  id                     Int       @id @default(autoincrement())
  provider_name          String?
  provider_type          String?
  provider_website       String?
  scheme_category        String?
  plan_name              String?
  plan_tier              String?
  monthly_premium        Decimal?  @db.Decimal
  annual_premium         Decimal?  @db.Decimal
  price_currency         String?   @db.VarChar(10)
  price_string           String?
  billing_period         String?
  coverage_type          String?
  dependents_allowed     Boolean?
  max_dependents         Int?
  outpatient_coverage    Boolean?
  inpatient_coverage     Boolean?
  maternity_coverage     Boolean?
  dental_coverage        Boolean?
  optical_coverage       Boolean?
  mental_health_coverage Boolean?
  emergency_coverage     Boolean?
  benefits_description   String?
  waiting_period_days    Int?
  co_pay_percentage      Decimal?  @db.Decimal
  excess_amount          Decimal?  @db.Decimal
  annual_limit           Decimal?  @db.Decimal
  lifetime_limit         Decimal?  @db.Decimal
  confidence_score       Decimal?  @db.Decimal(5, 4)
  source_url             String?
  scraped_date           DateTime? @db.Timestamp(6)
  data_status            String?
  normalised             Float?
}
`;

if (!schema.includes('model insurance {')) {
  schema += newModels;
}

fs.writeFileSync(schemaPath, schema, 'utf8');
console.log('Schema updated.');
