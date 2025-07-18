import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function validateQuota(workspaceId: string) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Please log in before inviting." });
  }

  // Ensure usage entry exists or is reset for the new month
  const existingUsage = await prisma.emailUsage.findUnique({ where: { workspaceId } });

  if (!existingUsage) {
    await prisma.emailUsage.create({ data: { workspaceId, month: startOfMonth, sentCount: 0 } });
  } else if (existingUsage.month.getTime() < startOfMonth.getTime()) {
    await prisma.emailUsage.update({
      where: { workspaceId },
      data: { sentCount: 0, month: startOfMonth },
    });
  }

  const emailUsage = await prisma.emailUsage.findUnique({ where: { workspaceId } });

  const subscription = await prisma.activeSubscription.findFirst({
    where: { clerkId: userId, isCancelled: false },
  });

  // Handle free users
  if (!subscription && emailUsage && emailUsage.sentCount >= 500) {
    return NextResponse.json({
      success: false,
      message: "Free tier exhausted. Wait until next month or upgrade.",
    });
  }

  // Handle subscribed users with a pricing plan limit
  if (subscription && emailUsage) {
    const pricing = await prisma.pricing.findUnique({
      where: { id: subscription.pricingId },
      select: { emailUsageLimit: true },
    });

    if (
      pricing?.emailUsageLimit !== null &&
      pricing?.emailUsageLimit !== undefined &&
      emailUsage.sentCount >= pricing.emailUsageLimit
    ) {
      return NextResponse.json({
        success: false,
        message: "You have exhausted your quota for this month based on your plan.",
      });
    }
  }

  return null; // All good
}
