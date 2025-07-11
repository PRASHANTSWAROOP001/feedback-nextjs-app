/*
  Warnings:

  - A unique constraint covering the columns `[razorPayOrderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SUCCESS', 'FAILED', 'PENDING', 'REFUNDED');

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "razorPayPaymentId" TEXT NOT NULL,
    "razorPayOrderId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "razorPaySignature" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveSubscription" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clerkId" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "isCancelled" BOOLEAN NOT NULL DEFAULT false,
    "cancelledAt" TIMESTAMP(3),
    "paymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pricingId" TEXT NOT NULL,

    CONSTRAINT "ActiveSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pricing" (
    "id" TEXT NOT NULL,
    "admin" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "savings" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "validity" INTEGER NOT NULL,
    "emailUsageLimit" INTEGER NOT NULL DEFAULT 100,
    "subscription" "Subscription" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "Pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "pricingId" TEXT NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorPayPaymentId_key" ON "Payment"("razorPayPaymentId");

-- CreateIndex
CREATE INDEX "Payment_razorPayPaymentId_status_isVerified_idx" ON "Payment"("razorPayPaymentId", "status", "isVerified");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveSubscription_paymentId_key" ON "ActiveSubscription"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveSubscription_pricingId_key" ON "ActiveSubscription"("pricingId");

-- CreateIndex
CREATE UNIQUE INDEX "Pricing_admin_key" ON "Pricing"("admin");

-- CreateIndex
CREATE UNIQUE INDEX "Pricing_subscription_key" ON "Pricing"("subscription");

-- CreateIndex
CREATE INDEX "Feature_pricingId_idx" ON "Feature"("pricingId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_razorPayOrderId_key" ON "Order"("razorPayOrderId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveSubscription" ADD CONSTRAINT "ActiveSubscription_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveSubscription" ADD CONSTRAINT "ActiveSubscription_pricingId_fkey" FOREIGN KEY ("pricingId") REFERENCES "Pricing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_pricingId_fkey" FOREIGN KEY ("pricingId") REFERENCES "Pricing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
