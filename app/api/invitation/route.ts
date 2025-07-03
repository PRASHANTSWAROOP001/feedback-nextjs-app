import {prisma} from "../../../lib/prisma"
import { NextResponse, NextRequest } from "next/server"
import  nodeMailer from "nodemailer"


export  async function POST( req:NextRequest){

    try {

        const formData = await req.formData()

        const emailId = formData.getAll("emailIds");

        const topicId = formData.get("topicId")
        

        console.log("emailIds", emailId)
        console.log("topicId", topicId)

        if( !emailId ||!emailId.length ){
            return NextResponse.json({
                success:false,
                message:"either emailId is not sent or empty array sent"
            }, {status:400})
        }

        if(!topicId){
            return NextResponse.json({
                success:false,
                message:"Please send topicId"
            } ,{status:400})
        }

        return NextResponse.json({
            success:true,
            message:"successfully sent the data"
        })


    } catch (error) {
        
        console.error("error while adding invitation data", error);
        return NextResponse.json({
            success:false,
            message:"Error at our side"
        } , {
            status:500
        })
    }

}