/*
  Warnings:

  - You are about to drop the column `expires_att` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "expires_att",
ADD COLUMN     "expires_at" INTEGER;
