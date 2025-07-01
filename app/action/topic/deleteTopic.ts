"use server"

import {prisma} from "../../../lib/prisma"


export default async function deleteTopic(id:string):Promise<{success:boolean, message:string}>{
    try {
        
        if(!id){
            return {success:false, "message":"missing id params"}
        }


        const deleteTopicWithId = await prisma.topic.delete({
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