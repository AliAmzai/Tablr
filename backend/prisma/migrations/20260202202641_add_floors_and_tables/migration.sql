/*
  Warnings:

  - You are about to drop the column `restaurantId` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `contactEmail` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `shareToken` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `widgetTheme` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `workingHours` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the `locations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `restaurants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_restaurantId_fkey";

-- DropIndex
DROP INDEX "restaurants_shareToken_key";

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "restaurantId";

-- AlterTable
ALTER TABLE "restaurants" DROP COLUMN "contactEmail",
DROP COLUMN "contactPhone",
DROP COLUMN "description",
DROP COLUMN "shareToken",
DROP COLUMN "widgetTheme",
DROP COLUMN "workingHours",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT;

-- DropTable
DROP TABLE "locations";

-- CreateTable
CREATE TABLE "floors" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Floor 1',
    "floorNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "floors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tables" (
    "id" SERIAL NOT NULL,
    "floorId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "shape" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "floors_restaurantId_floorNumber_key" ON "floors"("restaurantId", "floorNumber");

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_userId_key" ON "restaurants"("userId");

-- AddForeignKey
ALTER TABLE "floors" ADD CONSTRAINT "floors_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
