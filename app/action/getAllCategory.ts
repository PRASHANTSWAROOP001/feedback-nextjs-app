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

        const findAllCategory = await prisma.category.findMany({
            where:{
                workspaceId:userId
            },
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
