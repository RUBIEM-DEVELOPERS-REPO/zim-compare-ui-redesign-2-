-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'guest',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "logo" TEXT,
    "transparencyScore" INTEGER NOT NULL,
    "digitalScore" INTEGER,
    "website" TEXT,
    "headOfficeAddress" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "branches" INTEGER NOT NULL,
    "digitalFeatures" TEXT NOT NULL,
    "locations" TEXT NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankingProduct" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "minBalance" DOUBLE PRECISION NOT NULL,
    "monthlyFee" DOUBLE PRECISION NOT NULL,
    "perks" TEXT NOT NULL,

    CONSTRAINT "BankingProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankFee" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "BankFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankLoan" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apr" DOUBLE PRECISION NOT NULL,
    "initiationFee" DOUBLE PRECISION NOT NULL,
    "earlySettlementPenalty" DOUBLE PRECISION NOT NULL,
    "maxTermMonths" INTEGER NOT NULL,
    "requirements" TEXT NOT NULL,

    CONSTRAINT "BankLoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelecomProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "logo" TEXT,
    "transparencyScore" INTEGER NOT NULL,
    "digitalScore" INTEGER,
    "website" TEXT,
    "headOfficeAddress" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "coverageScore" INTEGER NOT NULL,
    "networkType" TEXT NOT NULL,
    "coverageCities" TEXT NOT NULL,

    CONSTRAINT "TelecomProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataBundle" (
    "id" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "bundle_group" TEXT NOT NULL,
    "bundle_name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "validity_type" TEXT NOT NULL,
    "validity_value" INTEGER NOT NULL,
    "validity_unit" TEXT NOT NULL,
    "total_data_mb" DOUBLE PRECISION NOT NULL,
    "peak_data_mb" DOUBLE PRECISION,
    "offpeak_data_mb" DOUBLE PRECISION,
    "onnet_minutes" DOUBLE PRECISION,
    "other_minutes" DOUBLE PRECISION,
    "cug_minutes" DOUBLE PRECISION,
    "international_minutes" DOUBLE PRECISION,
    "sms_count" DOUBLE PRECISION,
    "facebook_mb" DOUBLE PRECISION,
    "instagram_mb" DOUBLE PRECISION,
    "x_mb" DOUBLE PRECISION,
    "extras" TEXT,
    "ussd_code" TEXT,
    "source_url" TEXT,
    "source_name" TEXT,

    CONSTRAINT "DataBundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceRate" (
    "id" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "offer_type" TEXT NOT NULL,
    "bundle_group" TEXT NOT NULL,
    "bundle_name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "validity_type" TEXT NOT NULL,
    "validity_value" INTEGER NOT NULL,
    "validity_unit" TEXT NOT NULL,
    "offpeak_type" TEXT,
    "price_unit" TEXT,
    "onnet_min_count" DOUBLE PRECISION,
    "offnet_min_count" DOUBLE PRECISION,
    "landline_min_count" DOUBLE PRECISION,
    "intl_min_count" DOUBLE PRECISION,
    "sms_count" DOUBLE PRECISION,
    "offpeak_sms_count" DOUBLE PRECISION,
    "extras" TEXT,
    "ussd_code" TEXT,
    "source_url" TEXT,
    "source_name" TEXT,

    CONSTRAINT "VoiceRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "logo" TEXT,
    "transparencyScore" INTEGER NOT NULL,
    "digitalScore" INTEGER,
    "website" TEXT,
    "headOfficeAddress" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "curriculum" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "tuitionPerTerm" DOUBLE PRECISION NOT NULL,
    "boardingFeePerTerm" DOUBLE PRECISION,
    "totalAnnualCost" DOUBLE PRECISION NOT NULL,
    "passRate" DOUBLE PRECISION NOT NULL,
    "studentTeacherRatio" DOUBLE PRECISION NOT NULL,
    "facilities" TEXT NOT NULL,
    "sports" TEXT NOT NULL,
    "academicScore" INTEGER NOT NULL,
    "safetyScore" INTEGER NOT NULL,
    "numberOfTerms" INTEGER DEFAULT 3,
    "normalised" DOUBLE PRECISION,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "universities" (
    "id" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "provinceArea" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "programmeSummary" TEXT,
    "feeMinUSD" DOUBLE PRECISION,
    "feeMaxUSD" DOUBLE PRECISION,
    "feeNote" TEXT,
    "feeConfidence" TEXT,
    "programmeSourceUrl" TEXT,
    "annualFee" DOUBLE PRECISION,
    "programmeDuration" INTEGER,
    "programmeMatch" DOUBLE PRECISION,
    "normalised" DOUBLE PRECISION,

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "logo" TEXT,
    "transparencyScore" INTEGER NOT NULL,
    "digitalScore" INTEGER,
    "website" TEXT,
    "headOfficeAddress" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "claimsScore" INTEGER NOT NULL,
    "avgClaimDays" INTEGER NOT NULL,
    "serviceAreas" TEXT NOT NULL,

    CONSTRAINT "InsuranceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "monthlyPremium" DOUBLE PRECISION NOT NULL,
    "annualPremium" DOUBLE PRECISION NOT NULL,
    "excess" DOUBLE PRECISION NOT NULL,
    "waitingPeriodDays" INTEGER NOT NULL,
    "coverLimit" DOUBLE PRECISION NOT NULL,
    "benefits" TEXT NOT NULL,
    "exclusions" TEXT NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedComparison" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "itemIds" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedComparison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecentView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "dealershipId" TEXT NOT NULL,
    "dealershipName" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "engineCC" DOUBLE PRECISION NOT NULL,
    "fuelType" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL,
    "transmission" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "financingAvailable" BOOLEAN NOT NULL,
    "condition" TEXT NOT NULL,
    "bestValue" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT NOT NULL,
    "range" DOUBLE PRECISION,
    "batterySize" DOUBLE PRECISION,
    "owners" INTEGER,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarDealership" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "brands" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "yearsActive" INTEGER NOT NULL,
    "stockCount" INTEGER NOT NULL,
    "financingAvailable" BOOLEAN NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "CarDealership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrivingSchool" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "pricePerLesson" DOUBLE PRECISION NOT NULL,
    "packagePrice" DOUBLE PRECISION NOT NULL,
    "lessonsInPackage" INTEGER NOT NULL,
    "passRate" DOUBLE PRECISION NOT NULL,
    "yearsActive" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "DrivingSchool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusRoute" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "durationHours" DOUBLE PRECISION NOT NULL,
    "departureTimes" TEXT NOT NULL,
    "crossBorder" BOOLEAN NOT NULL,
    "borderCrossing" TEXT,
    "amenities" TEXT NOT NULL,
    "busType" TEXT NOT NULL,

    CONSTRAINT "BusRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT '',
    "stars" INTEGER NOT NULL,
    "pricePerNight" DOUBLE PRECISION NOT NULL,
    "amenities" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT 'hotel',
    "recommended" BOOLEAN NOT NULL DEFAULT false,
    "bestValue" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolarProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'residential',
    "rating" DOUBLE PRECISION NOT NULL,
    "installationCount" INTEGER NOT NULL DEFAULT 0,
    "warrantyYears" INTEGER NOT NULL DEFAULT 5,
    "packages" TEXT NOT NULL,

    CONSTRAINT "SolarProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UtilityProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UtilityProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolManualData" (
    "id" SERIAL NOT NULL,
    "schoolName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "schoolType" TEXT NOT NULL DEFAULT 'day',
    "province" TEXT NOT NULL DEFAULT '',
    "tuitionFee" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "admissionFee" DOUBLE PRECISION,
    "boardingFee" DOUBLE PRECISION,
    "uniformCost" DOUBLE PRECISION,
    "booksCost" DOUBLE PRECISION,
    "examFee" DOUBLE PRECISION,
    "passRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "numberOfTerms" INTEGER NOT NULL DEFAULT 3,
    "annualFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "normalised" DOUBLE PRECISION,
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolManualData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityManualData" (
    "id" SERIAL NOT NULL,
    "universityName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "tuitionFee" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "accommodationFee" DOUBLE PRECISION,
    "applicationFee" DOUBLE PRECISION,
    "labFee" DOUBLE PRECISION,
    "libraryFee" DOUBLE PRECISION,
    "studentUnionFee" DOUBLE PRECISION,
    "annualFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "programmeDuration" INTEGER NOT NULL DEFAULT 0,
    "programmeMatch" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "normalised" DOUBLE PRECISION,
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniversityManualData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceManualData" (
    "id" SERIAL NOT NULL,
    "providerName" TEXT NOT NULL,
    "insuranceType" TEXT NOT NULL,
    "basePremium" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "maxCoverage" DOUBLE PRECISION,
    "deductible" DOUBLE PRECISION,
    "coinsurance" DOUBLE PRECISION,
    "copay" DOUBLE PRECISION,
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceManualData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankingManualFee" (
    "id" SERIAL NOT NULL,
    "bankId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "feeType" TEXT NOT NULL,
    "feeCategory" TEXT NOT NULL,
    "feeName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "unit" TEXT,
    "description" TEXT,
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankingManualFee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "DataBundle_operator_idx" ON "DataBundle"("operator");

-- CreateIndex
CREATE INDEX "SchoolManualData_schoolName_idx" ON "SchoolManualData"("schoolName");

-- CreateIndex
CREATE INDEX "SchoolManualData_location_idx" ON "SchoolManualData"("location");

-- CreateIndex
CREATE INDEX "UniversityManualData_universityName_idx" ON "UniversityManualData"("universityName");

-- CreateIndex
CREATE INDEX "UniversityManualData_location_idx" ON "UniversityManualData"("location");

-- CreateIndex
CREATE INDEX "InsuranceManualData_providerName_idx" ON "InsuranceManualData"("providerName");

-- CreateIndex
CREATE INDEX "InsuranceManualData_insuranceType_idx" ON "InsuranceManualData"("insuranceType");

-- CreateIndex
CREATE INDEX "BankingManualFee_bankId_idx" ON "BankingManualFee"("bankId");

-- CreateIndex
CREATE INDEX "BankingManualFee_bankName_idx" ON "BankingManualFee"("bankName");

-- CreateIndex
CREATE INDEX "BankingManualFee_feeType_idx" ON "BankingManualFee"("feeType");

-- AddForeignKey
ALTER TABLE "BankingProduct" ADD CONSTRAINT "BankingProduct_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankFee" ADD CONSTRAINT "BankFee_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankLoan" ADD CONSTRAINT "BankLoan_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataBundle" ADD CONSTRAINT "DataBundle_operator_fkey" FOREIGN KEY ("operator") REFERENCES "TelecomProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceRate" ADD CONSTRAINT "VoiceRate_operator_fkey" FOREIGN KEY ("operator") REFERENCES "TelecomProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "InsuranceProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedComparison" ADD CONSTRAINT "SavedComparison_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

