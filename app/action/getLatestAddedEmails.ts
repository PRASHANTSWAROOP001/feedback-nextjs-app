"use server"
import { prisma } from "@/lib/prisma"
import { EmailResponse } from "@/types/types"

async function getLatestEmails(workspaceId:string,limit:number=3):Promise<EmailResponse>{
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

export default getLatestEmails;