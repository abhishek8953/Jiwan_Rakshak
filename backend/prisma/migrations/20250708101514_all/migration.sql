/*
  Warnings:

  - Added the required column `url` to the `HealthRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HealthRecord" ADD COLUMN     "url" TEXT NOT NULL;
