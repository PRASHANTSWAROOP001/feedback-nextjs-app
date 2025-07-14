"use server"
import {prisma} from "../../../lib/prisma"
import { auth } from "@clerk/nextjs/server"


export async function checkSubscription() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "User is not logged in" };
    }

    const activeSubscription = await prisma.activeSubscription.findFirst({
      where: {
        clerkId: userId,
        isCancelled: false,
      },
      select:{
        startDate:true,
        expiryDate:true,
        pricingId:true,
        pricing:{
            select:{
                name:true,
                emailUsageLimit:true,
                price:true,
                validity:true,
                savings:true
            }
        }
      },
    });

    if (!activeSubscription) {
      return {
        success: true,
        message: "No active subscription",
        subscription: false,
      };
    }

    const topThreeBenefits = await prisma.feature.findMany({
      where: {
        pricingId: activeSubscription.pricingId,
      },
      take: 3,
      select: {
        text: true,
      },
    });

    return {
      success: true,
      message: "Active subscription found",
      subscription: true,
      subscriptionData: activeSubscription,
      benefits: topThreeBenefits,
    };
  } catch (error) {
    console.error("Error while checking subscription:", error);
    return {
      success: false,
      message: "Error occurred while checking subscription",
    };
  }
}


export async function lastPaymentDetails() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "User is not logged in" };
    }

    // Get last successful payment
    const lastSuccessfulOrder = await prisma.order.findFirst({
      where: {
        clerkId: userId,
        status: "PAID",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get last payment attempt (CREATED but not paid)
    const lastAttemptedOrder = await prisma.order.findFirst({
      where: {
        clerkId: userId,
        status: "CREATED",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Return both if available
    if (lastSuccessfulOrder || lastAttemptedOrder) {
      return {
        success: true,
        message: "Fetched last payment details",
        order_success: lastSuccessfulOrder || null,
        order_attempt: lastAttemptedOrder || null,
      };
    }

    return {
      success: false,
      message: "No payment history found",
    };
  } catch (error) {
    console.error("Error getting payment details:", error);
    return {
      success: false,
      message: "Error fetching payment details",
    };
  }
}
