import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function validateQuota(workspaceId: string) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

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
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Please log in before inviting." });
  }

  const subscription = await prisma.activeSubscription.findFirst({
    where: { clerkId: userId, isCancelled: false },
  });

  if (emailUsage && emailUsage.sentCount >= 500 && !subscription) {
    return NextResponse.json({
      success: false,
      message: "Free tier exhausted. Wait until next month or upgrade.",
    });
  }

  return null; // No error
}
