"use server"

import { auth } from "@clerk/nextjs/server"
import {prisma }from "../../lib/prisma"



export async function addWorkspace(formdata:FormData){
   try {
    
     const {userId} = await auth();

    if(!userId){
        throw new Error("not logged in");
    }

    const workspaceName = formdata.get("workspace-name") as string;
    const response = await prisma.workspace.create({
        data:{
            clerkId:userId,
            name:workspaceName
        }
    })

    return {success:true, data:response}

   } catch (error) {
    console.error("error happend:", error);
    return {success:false, message:"Error ouccured"}
    
   }
}