"use server"
import {prisma} from "../../lib/prisma"
import { auth } from "@clerk/nextjs/server"


async function createCategory(name:string):Promise<{success:boolean, message:string}>{
    try {
        
        const {userId} = await auth()

        if(!userId || !name){
            return {success:false, message:"missing auth details/name params"}
        }

        const findWorkspace = await prisma.workspace.findUnique({
            where:{
                clerkId:userId
            },
            select:{
                id:true
            }
        })

        if(!findWorkspace){
            return {success:false, message:"create a workspace first."}
        }

        const createCategory = await prisma.category.create({
            data:{
                name:name,
                workspaceId:findWorkspace.id
            }
        })

        return {success:true, message:"created category"}

    } catch (error) {

        console.error("Error while creting category", error);

            return {
      success: false,
      message: "Failed to fetch categories: " + (error instanceof Error ? error.message : "Unknown error"),
    };
    }
}

export default createCategory;