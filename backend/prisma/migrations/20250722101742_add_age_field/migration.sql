/*
  Warnings:

  - You are about to drop the column `bloodGroup` on the `User` table. All the data in the column will be lost.
  - Added the required column `blood_group` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "bloodGroup",
ADD COLUMN     "blood_group" TEXT NOT NULL;
