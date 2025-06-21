/*
  Warnings:

  - You are about to drop the column `from_user_email` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `request_user_email` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Booking_from_user_email_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "from_user_email",
ADD COLUMN     "request_user_email" VARCHAR(60) NOT NULL;
