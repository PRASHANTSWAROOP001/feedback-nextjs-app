"use server"
import {prisma} from "../../../lib/prisma"
import {auth} from "@clerk/nextjs/server"
import z from "zod"

export async function getPricingFeatures(){

    try {

        const {userId} = await auth();

        if(!userId){
            return {success:false, message:"missing auth details"}
        }

        const getPriceDetails = await prisma.pricing.findMany({
            include:{
                features:true
            }
        })

        return {success:true, message:"data fetched successfully", pricing:getPriceDetails}
        
    } catch (error) {

        console.error("error happend while getting the pricing plans", error)

        return {success:false, message:"error happend at our side"}
        
    }

}

const pricingSchema =z.object({
    adminId:z.string(),
    name:z.string(),
    description:z.string(),
    price:z.number(),
    period:z.string(),
    popular:z.boolean().default(false),
    saving:z.string().optional(),
    currency:z.string().default("INR"),
    validity:z.number(),
    emailUsageLimit:z.number(),
    subscription:z.enum(['MONTHLY',"QUARTERLY", "HALF_YEARLY", "YEARLY"]),
    features:z.array(z.string())
})

type PricingType = z.infer<typeof pricingSchema>

export async function addPricing(data: unknown) {
  try {
    const parsedPricingData = pricingSchema.safeParse(data);

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
          admin: verifiedData.adminId,
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

export async function deletePricing(id:string){
    try {
        

        const {userId} = await auth()

        const searchPricingPlan =  await prisma.pricing.findUnique({where:{id}})

        if(!searchPricingPlan){
            return {success:false, message:"could not find the plans"}
        }
        else if(userId !== searchPricingPlan.admin){
            return {success:false, message:"unverified person not today little bro :)"}
        }

        await prisma.pricing.delete({
            where:{id}
        })


        return {success:true, message:"deleted successfully"}
    } catch (error) {
        console.error('error happend while trying to delete the pricing plan',error)
        return {success:false, message:"error happend while tring to delete plan"}
        
    }
}