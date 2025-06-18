"use server"

import { auth } from "@clerk/nextjs/server"
import {prisma} from "../../lib/prisma"


export async function findWorkspace (){

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