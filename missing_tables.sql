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

CREATE INDEX "SchoolManualData_schoolName_idx" ON "SchoolManualData"("schoolName");
CREATE INDEX "SchoolManualData_location_idx" ON "SchoolManualData"("location");
CREATE INDEX "UniversityManualData_universityName_idx" ON "UniversityManualData"("universityName");
CREATE INDEX "UniversityManualData_location_idx" ON "UniversityManualData"("location");
CREATE INDEX "InsuranceManualData_providerName_idx" ON "InsuranceManualData"("providerName");
CREATE INDEX "InsuranceManualData_insuranceType_idx" ON "InsuranceManualData"("insuranceType");
CREATE INDEX "BankingManualFee_bankId_idx" ON "BankingManualFee"("bankId");
CREATE INDEX "BankingManualFee_bankName_idx" ON "BankingManualFee"("bankName");
CREATE INDEX "BankingManualFee_feeType_idx" ON "BankingManualFee"("feeType");
