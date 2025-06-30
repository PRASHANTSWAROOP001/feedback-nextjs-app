"use server"

import {prisma} from "../../../lib/prisma"

async function deleteEmail(emailId:string):Promise<{success:boolean, message:string}>{
    try {
        
        if(!emailId){
            return {success:false, message:"missing id params"}
        }

        const deleteEmail = await prisma.emailEntry.delete({where:{
            id:emailId
        }})

        if(!deleteEmail){
            return {success:false, message:"could not delete the email"}
        }

        return {success:true, message:"email deleted successfully"}

    } catch (error) {

        console.error("error happend while deleting the email", error);

        return {success:false, message:"error happend while deleting email"}
        
    }
}

export default deleteEmail;