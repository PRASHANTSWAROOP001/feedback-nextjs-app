"use server"

import {prisma} from "../../../lib/prisma"


export default async function editTopic(id:string, title:string, description:string, isActive:boolean = true):Promise<{success:boolean, message:string}>{
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