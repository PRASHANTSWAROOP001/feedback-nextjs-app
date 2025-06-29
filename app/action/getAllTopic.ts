"use server"

import {prisma} from "../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TopicResponse } from "@/types/types";



async function getAllTopics():Promise<TopicResponse>{
    try {
        
        const {userId} = await auth()

        if(!userId){
            return {success:false, message:"user not logged in missing auth details"}
        }

        const findWorkspaceId = await prisma.workspace.findUnique({
            where:{
                clerkId:userId
            },
            select:{
                id:true
            }
        })

        if(!findWorkspaceId){
            return {success:false,message:"could not find workspaceId please create one"}
        }

        const topicData = await prisma.topic.findMany({
            where:{
                workspaceId:findWorkspaceId.id
            },
            take:6
        })

        return {success:true, message:"fetched", data:topicData}

    } catch (error) {
        console.error("error while fetching topics", error)
        return {success:false, message:"error"}
    }
}

export default getAllTopics;