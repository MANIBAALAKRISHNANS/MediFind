-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN     "matchCompletenessScore" DOUBLE PRECISION,
ADD COLUMN     "matchDistanceScore" DOUBLE PRECISION,
ADD COLUMN     "matchSpecialtyScore" DOUBLE PRECISION,
ADD COLUMN     "matchTypeScore" DOUBLE PRECISION;
