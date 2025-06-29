"use server"
import {prisma} from "../../lib/prisma"
import { auth } from "@clerk/nextjs/server"
import {CategoryResponse} from "../../types/types"

async function getAllCategory():Promise<CategoryResponse>{
    try {

        const {userId} = await auth();

        if(!userId){
            return {success:false, message:"user not found"}
        }

        const workspaceId = await prisma.workspace.findUnique({
            where:{
                clerkId:userId
            },
            select:{
                id:true
            }
        })

        if(!workspaceId){
            return {success:false, message:"create your workspace first"}
        }

        const findAllCategory = await prisma.category.findMany({
            where:{
                workspaceId:workspaceId.id
            },
            take:6,
            orderBy:{
                createdAt:"desc"
            }
        })

        if(!findAllCategory){
            return {success:false, message:"could not found the category"}
        }

        return {success:true, message:"data fetched successfully",data:findAllCategory }

        
    } catch (error) {

        console.error("Error happend while fetching", error)

    return {
      success: false,
      message: "Failed to fetch categories: " + (error instanceof Error ? error.message : "Unknown error"),
    };
        
    }
}

export {getAllCategory}
