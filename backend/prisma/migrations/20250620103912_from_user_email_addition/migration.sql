/*
  Warnings:

  - You are about to drop the column `from_user` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `hourly_rate` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[from_user_email]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expired` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_user_email` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_user_name` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_from_user_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "from_user",
DROP COLUMN "hourly_rate",
ADD COLUMN     "expired" BOOLEAN NOT NULL,
ADD COLUMN     "from_user_email" VARCHAR(50) NOT NULL,
ADD COLUMN     "from_user_name" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hourly_rate" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_from_user_email_key" ON "Booking"("from_user_email");
