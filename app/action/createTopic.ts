"use server"

import {prisma} from "../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

async function createTopic(title:string, description:string):Promise<{success:boolean, message:string}> {

    try {
        
        const {userId} = await auth()


        if(!userId || !title || !description){
            return {success:false, message:"missing params and userId"}
        }

        const workapceId = await prisma.workspace.findUnique({
            where:{
                clerkId:userId
            },
            select:{
                id:true
            }
        })

        if(!workapceId){
            return {success:false, message:"could not find workspace please create one"}
        }


        const topicDetails =await prisma.topic.create({
            data:{
                title:title,
                description:description,
                workspaceId:workapceId.id
            }
        })

        return {success:true, message:"topic created successfully"}

    } catch (error) {

                    return {
      success: false,
      message: "Failed to create topic: " + (error instanceof Error ? error.message : "Unknown error"),
    };
        
    }
    
}

export default createTopic;