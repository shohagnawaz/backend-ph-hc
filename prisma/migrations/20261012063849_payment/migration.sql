/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `patient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "invoiceUrl" TEXT;

-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "pdfUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "patient_email_key" ON "patient"("email");
