/*
  Warnings:

  - Added the required column `from_user` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_user` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "from_user" TEXT NOT NULL,
ADD COLUMN     "to_user" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_from_user_fkey" FOREIGN KEY ("from_user") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_to_user_fkey" FOREIGN KEY ("to_user") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
