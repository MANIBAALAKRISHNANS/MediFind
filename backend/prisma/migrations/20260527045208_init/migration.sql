-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "disease" TEXT,
    "specialty" TEXT,
    "severity" TEXT,
    "urgency" TEXT,
    "description" TEXT,
    "recommendations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "redFlags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "matchName" TEXT,
    "matchAddress" TEXT,
    "matchPhone" TEXT,
    "matchWebsite" TEXT,
    "matchType" TEXT,
    "matchDistanceKm" DOUBLE PRECISION,
    "matchLat" DOUBLE PRECISION,
    "matchLng" DOUBLE PRECISION,
    "matchOsmMapUrl" TEXT,
    "matchScore" INTEGER,
    "locationLat" DOUBLE PRECISION,
    "locationLng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Analysis_userId_createdAt_idx" ON "Analysis"("userId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
