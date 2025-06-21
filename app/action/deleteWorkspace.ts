"use server"
import {prisma} from "../../lib/prisma"
import { revalidatePath } from "next/cache";


export async function deleteWorkSpace(id:string):Promise<{success:boolean, message:string}> {

    try {
        if(!id){
            throw new Error("Error id not provided for deleting workspace");
        }

        const findWorkSpaceById = await prisma.workspace.findUnique({
            where:{
                id:id
            }
        })

        if(!findWorkSpaceById){
            return {success:false, message:"Could not find the workspace with given id"}
        }

        const deletedWorkspace = await prisma.workspace.delete({
            where:{
                id:id
            }
        })

        revalidatePath("/dashboard")
        

        return {success:true, message:"deleted successfully"}

    } catch (error) {
        console.error("error happened while deleting workspace", error);
        return {success:false, message:"error"}
    }

}