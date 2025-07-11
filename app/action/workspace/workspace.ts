"use server"

import { auth } from "@clerk/nextjs/server"
import {prisma }from "../../../lib/prisma"
import { revalidatePath } from "next/cache";

// add workspace
async function addWorkspace(formdata:FormData){
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

    revalidatePath("/dashboard");
    return {success:true, data:response}
    
   } catch (error) {
    console.error("error happend:", error);
    return {success:false, message:"Error ouccured"}
    
   }
}

// check workspace
 async function findWorkspace (){

    try {
        
        const {userId} = await auth();

        if(!userId){
            throw new Error("user not logged in");
        }

        const findWorkspace = await prisma.workspace.findUnique({
            where:{
                clerkId:userId
            }
        })


        if(!findWorkspace){
            return {success:false, message:"Please Create A Workspace!"}
        }

        return {success:true, message:"Already has an workspace",data:findWorkspace}

    } catch (error) {

        console.error("error happend while checking workspace", error);

        return {success:false, message:"error happend"}
        
    }
}

// delete workspace 

async function deleteWorkSpace(id:string):Promise<{success:boolean, message:string}> {

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

// edit workspace 

async function updateWorkspace(id:string, name:string){
    try {
        
        if(!id || !name){
            return {success:false, message:"missing params"}
        }

        const findWorkspace = await prisma.workspace.findUnique({
            where:{
                id:id
            }
        })

        if(!findWorkspace){
            return {success:false, message:"could not find workspace"}
        }

        await prisma.workspace.update({
            where:{
                id:findWorkspace.id},data:{
                    name:name
                }
        })

        return {success:true, message:"success"}

    } catch (error) {
        console.error("error happend while updating workspace");
        return {success:false, message:"error happened"}
    }
}

export {addWorkspace, findWorkspace, deleteWorkSpace, updateWorkspace }