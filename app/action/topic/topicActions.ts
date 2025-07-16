"use server"

import {prisma} from "../../../lib/prisma"
import { auth } from "@clerk/nextjs/server";
import { TopicResponse } from "@/types/types";


export  async function deleteTopic(id:string):Promise<{success:boolean, message:string}>{
    try {
        
        if(!id){
            return {success:false, "message":"missing id params"}
        }


         await prisma.topic.delete({
            where:{
                id:id
            }
        })


        return {success:true, message:` topic with ${id} deleted successfuly`}



    } catch (error) {
        console.log("error happend while deleting a topic with id", error)
        return {success:false, message:"error happend while deleting a topic"}
    }
}

export  async function editTopic(id:string, title:string, description:string, isActive:boolean = true):Promise<{success:boolean, message:string}>{
    try {
        if(!id || !description || !title){
            return {success:false, message:"missing params"}
        }

        const updateTopic = await prisma.topic.update({
            where:{
                id:id
            },
            data:{
                title, description, isActive
            }
        })

        return {success:true, message: `updated the topic with ${updateTopic.id}`}


    } catch (error) {
        console.error("error happend while updating topic", error);
        return   {success:false, message: `error at updating the topic with ${id}`}      
    }

}

export async function createTopic(title:string, description:string):Promise<{success:boolean, message:string}> {

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


        await prisma.topic.create({
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


export async function getAllTopics(limit?:number):Promise<TopicResponse>{
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
            ...(limit && {take:limit})
        })

        return {success:true, message:"fetched", data:topicData}

    } catch (error) {
        console.error("error while fetching topics", error)
        return {success:false, message:"error"}
    }
}