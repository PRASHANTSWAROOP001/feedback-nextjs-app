"use server"

import { auth } from "@clerk/nextjs/server"
import {prisma }from "../../../lib/prisma"
import { revalidatePath } from "next/cache"

async function deleteCategory(id:string):Promise<{success:boolean, message:string}>{
    try {
        
        if(!id){
            return {success:false, message:"missing id param"}
        }

        const deleteCategory = await prisma.category.delete({
            where:{
                id:id
            }
        })

        if(!deleteCategory){
            return {success:false, message:"could not be deleted"}
        }
        revalidatePath("/dashboard")
        return {success:true, message:"deleted successfully"}

    } catch (error) {

        console.error("error happend while deleting the category")
        
        return {success:false, message:"error happend"}
        
    }
}

export default deleteCategory;