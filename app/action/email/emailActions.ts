"use server"
import { EmailResponse } from "@/types/types"
import {prisma} from "../../../lib/prisma"
import z from "zod"
import { auth } from "@clerk/nextjs/server"
import { Subscription } from "@/app/generated/prisma"

export async function deleteEmail(emailId:string):Promise<{success:boolean, message:string}>{
    try {
        
        if(!emailId){
            return {success:false, message:"missing id params"}
        }

        const deleteEmail = await prisma.emailEntry.delete({where:{
            id:emailId
        }})

        if(!deleteEmail){
            return {success:false, message:"could not delete the email"}
        }

        return {success:true, message:"email deleted successfully"}

    } catch (error) {

        console.error("error happend while deleting the email", error);

        return {success:false, message:"error happend while deleting email"}
        
    }
}

const emailSchema = z.object({
  email: z.string().trim().email("Please provide a valid email")
})

type emailType = z.infer<typeof emailSchema>

export async function updateEmail(emailId: string, newEmail: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!emailId || !newEmail) {
      return { success: false, message: "Missing emailId or newEmail" }
    }

    const parseResult = emailSchema.safeParse({ email: newEmail })

    if (!parseResult.success) {
      const zodError = parseResult.error.format()
      return {
        success: false,
        message: zodError.email?._errors?.[0] || "Invalid email format"
      }
    }

    // ✅ Check if the email exists
    const searchEmailId = await prisma.emailEntry.findUnique({
      where: {
        id: emailId
      }
    })

    if (!searchEmailId) {
      return {
        success: false,
        message: "Could not find the email"
      }
    }

    // ✅ Perform the update
    await prisma.emailEntry.update({
      where: {
        id: emailId
      },
      data: {
        email: newEmail
      }
    })

    return { success: true, message: "Updated successfully" }
  } catch (error) {
    console.error("Error while updating email:", error)
    return {
      success: false,
      message: "Server error while updating email"
    }
  }
}



export async function getLatestEmails(workspaceId:string,limit:number=3):Promise<EmailResponse>{
    try {
        
        if(!workspaceId){
            return {success:false, message:"missing workspaceId"}
        }

        const emails = await prisma.emailEntry.findMany({
            where:{
                workspaceId:workspaceId
            },
            orderBy:{
                createdAt:"desc"
            },

            take:limit,
        })

        return {success:true, message:"fetched success", data:emails}

    } catch (error) {

        console.error("error while fetching latest added emails", error);

        return {success:false, message:"error happpend at server while fetching latest added emails."}
        
    }
}

//dashboards email data acccess controllers
export async function getMonthlyEmailUseage() {

  try {

    const { userId } = await auth()

    if (!userId) {
      return { success: false, message: "not logged in log in now" }
    }

    const workspaceId = await prisma.workspace.findUnique({
      where: {
        clerkId: userId
      },
      select: {
        id: true
      }
    })

    if (!workspaceId) {
      return { success: false, message: "create workspace to see dashboard." }
    }

    const now = new Date()


    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)


    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)


    const emailUseage = await prisma.emailUsage.findUnique({
      where: {
        workspaceId: workspaceId.id,
        month: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      select: {
        sentCount: true
      }
    })

    return { success: true, message: "fetched successfully", usage: emailUseage?.sentCount }

  } catch (error) {
    console.error("error happened while getting monthly useage", error);
    return { success: false, message: "error happened at our side" }
  }
}

export async function allowedEmailQuoteCheck(){
  try {

        const { userId } = await auth()

    if (!userId) {
      return { success: false, message: "not logged in log in now" }
    }

    const checkActiveSubscription = await prisma.activeSubscription.findFirst({
    where:{
      isCancelled:false,
      clerkId:userId
    }
    })

    // default free quota per month = 500 emails
    // we will send monthly quota
    if(!checkActiveSubscription){
      return {success:true, message:"no active subscription free limit", limit:500}
    }

    const monthlyLimit = await prisma.pricing.findUnique({
      where:{
        id:checkActiveSubscription.pricingId
      }
    })

    if(!monthlyLimit){
      return {success:false, message:"please drop a email for support your plan is not linked to any pricing."}
    }

    return {success:true, message:"fetched successfully", limit:monthlyLimit.emailUsageLimit}

    
  } catch (error) {

    console.log("error while fetching user plans", error);
    return {success:false, message:"error happend while fetching subscription data"}
    
  }
}