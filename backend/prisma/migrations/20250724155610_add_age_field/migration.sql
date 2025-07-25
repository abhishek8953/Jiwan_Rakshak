/*
  Warnings:

  - Added the required column `repeat` to the `MedicineReminder` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Repeat" AS ENUM ('ONCE', 'DAILY', 'WEEKLY');

-- AlterTable
ALTER TABLE "MedicineReminder" ADD COLUMN     "repeat" "Repeat" NOT NULL;
