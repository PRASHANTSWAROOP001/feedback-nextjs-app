"use server"
import { EmailResponse } from "@/types/types"
import {prisma} from "../../../lib/prisma"
import z from "zod"

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