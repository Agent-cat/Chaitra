-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'VILLA', 'PLOT', 'INDEPENDENTHOUSE');

-- AlterTable
ALTER TABLE "property" ADD COLUMN     "type" "PropertyType";
