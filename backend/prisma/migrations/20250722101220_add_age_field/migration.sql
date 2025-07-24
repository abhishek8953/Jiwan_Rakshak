/*
  Warnings:

  - You are about to drop the column `mobileNo` on the `User` table. All the data in the column will be lost.
  - Added the required column `phone` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile_no` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "phone" INTEGER NOT NULL,
ADD COLUMN     "rating" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "mobileNo",
ADD COLUMN     "mobile_no" TEXT NOT NULL;
