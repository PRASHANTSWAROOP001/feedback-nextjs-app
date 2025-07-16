"use server"
import {prisma }from "../../../lib/prisma"
import { revalidatePath } from "next/cache"

async function editCategory(id:string, newName:string):Promise<{success:boolean, message:string}>{
    try {
        
        if(!id || !newName){
            return {success:false, message:"missing id and newName params"}
        }

        const updateCategory = await prisma.category.update({
            where:{
                id:id
            },
            data:{
                name:newName
            }
        })

        if(!updateCategory){
            return {success:false, message:"could not update the category"}
        }

        revalidatePath("/dashboard")
        
        return {success:true, message:"updated successfully"}

    } catch (error) {
        console.error("error while updating the catergory", error)

        return {success:false, message:"error while updating category"}
    }
}


export default editCategory;