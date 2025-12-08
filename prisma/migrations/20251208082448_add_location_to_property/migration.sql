/*
  Warnings:

  - Added the required column `location` to the `property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "property" ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "video" TEXT[];
