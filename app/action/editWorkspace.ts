"use server"

import {prisma} from "../../lib/prisma"


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

export default updateWorkspace;