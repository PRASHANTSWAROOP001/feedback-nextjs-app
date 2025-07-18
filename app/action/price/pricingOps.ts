"use server"

import { prisma } from "../../../lib/prisma"
import { auth } from "@clerk/nextjs/server"
import z from "zod"

export async function getPricingFeatures() {

  try {

    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "missing auth details" }
    }

    const getPriceDetails = await prisma.pricing.findMany({
      include: {
        features: true
      },
      orderBy:{
        price:"asc"
      }
    })

    return { success: true, message: "data fetched successfully", pricing: getPriceDetails }

  } catch (error) {

    console.error("error happend while getting the pricing plans", error)

    return { success: false, message: "error happend at our side" }

  }

}

const pricingSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  period: z.string(),
  popular: z.boolean().default(false),
  saving: z.string().optional(),
  currency: z.string().default("INR"),
  validity: z.number(),
  emailUsageLimit: z.number(),
  subscription: z.enum(['MONTHLY', "QUARTERLY", "HALF_YEARLY", "YEARLY"]),
  features: z.array(z.string())
})

export async function addPricing(data: unknown) {
  try {
    const parsedPricingData = pricingSchema.safeParse(data);

    const {userId} = await auth()

    if(!userId){
      return {success:false, message:"missing auth details"}
    }
    else if(userId != process.env.ADMIN_ID!){
      return {success:false, message:"not admin"}
    }

    if (!parsedPricingData.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsedPricingData.error.flatten().fieldErrors,
      };
    }

    const verifiedData = parsedPricingData.data;
    const features: string[] = verifiedData.features;

    await prisma.$transaction(async (tx) => {
      const savePricingData = await tx.pricing.create({
        data: {
          admin: userId,
          name: verifiedData.name,
          description: verifiedData.description,
          price: verifiedData.price,
          period: verifiedData.period,
          popular: verifiedData.popular,
          savings: verifiedData.saving,
          currency: verifiedData.currency,
          validity: verifiedData.validity,
          emailUsageLimit: verifiedData.emailUsageLimit,
          subscription: verifiedData.subscription,
        },
      });

      await tx.feature.createMany({
        data: features.map((text) => ({
          pricingId: savePricingData.id,
          text,
        })),
      });
    });

    return {
      success: true,
      message: "Pricing plan created successfully",
    };

  } catch (error) {
    console.error("Error creating pricing plan:", error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}

export async function deletePricing(id: string) {
  try {


    const { userId } = await auth()

    const searchPricingPlan = await prisma.pricing.findUnique({ where: { id } })

    if (!searchPricingPlan) {
      return { success: false, message: "could not find the plans" }
    }
    else if (userId !== searchPricingPlan.admin) {
      return { success: false, message: "unverified person not today little bro :)" }
    }

    await prisma.pricing.delete({
      where: { id }
    })


    return { success: true, message: "deleted successfully" }
  } catch (error) {
    console.error('error happend while trying to delete the pricing plan', error)
    return { success: false, message: "error happend while tring to delete plan" }

  }
}



export async function updatePricing(updateData: unknown, id: string) {
  try {
    const { userId } = await auth();

    const searchPricing = await prisma.pricing.findUnique({
      where: { id },
    });

    if (!searchPricing) {
      return { success: false, message: "could not find the pricing" };
    } else if (searchPricing.admin !== process.env.ADMIN_ID! || userId !== searchPricing.admin) {
      return { success: false, message: "not verified" };
    }

    const parsedUpdatedData = pricingSchema.safeParse(updateData);

    if (!parsedUpdatedData.success) {
      return {
        success: false,
        message: `error in data validation ${
          parsedUpdatedData.error.flatten().fieldErrors
        }`,
      };
    }

    const verifiedData = parsedUpdatedData.data;

    const features: string[] = parsedUpdatedData.data.features;

    await prisma.$transaction(async (tx) => {
      await tx.pricing.update({
        where: {
          id,
        },
        data: {
          name: verifiedData.name,
          description: verifiedData.description,
          price: verifiedData.price,
          period: verifiedData.period,
          popular: verifiedData.popular,
          savings: verifiedData.saving,
          currency: verifiedData.currency,
          validity: verifiedData.validity,
          emailUsageLimit: verifiedData.emailUsageLimit,
          subscription: verifiedData.subscription,
        },
      });
// Step 1: Delete old features
await tx.feature.deleteMany({
  where: { pricingId: id },
});

// Step 2: Create new features
await tx.feature.createMany({
  data: features.map((text: string) => ({
    pricingId: id,
    text,
  })),
});

    });

    return {success:true, message:"data updated successfully"}

  } catch (error) {
    console.error("error happend while updating the pricing table", error);
    return {success:false, message:"error happend at server side"}
  }
}
