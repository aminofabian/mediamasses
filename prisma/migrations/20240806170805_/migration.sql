/*
  Warnings:

  - Added the required column `phoneNumber` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentInitiated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentInitiatedAt" TIMESTAMP(3),
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "status" "PaymentStatus" NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "transactionId" TEXT,
    "paymentProviderId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
