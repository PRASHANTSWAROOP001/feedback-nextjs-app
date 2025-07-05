import { NextRequest, NextResponse } from "next/server";
import {prisma} from "../../../lib/prisma"


export async function GET(req:NextRequest){

    try {

        const {searchParams} = req.nextUrl;

        const token = searchParams.get("token")
        
        console.log("got token",token)

        if(!token || token.length == 0){
            return NextResponse.json({
                success:false,
                message:"missing tokens from param"
            }, {status:400})
        }

        const searchToken = await prisma.invitation.findUnique({
            where:{
                token:token
            }
        })


        if(!searchToken){
            return NextResponse.json({
                success:false,
                message:"Token is missing"
            }, {status:404})
        }

        if(searchToken.used == false){
            return NextResponse.json({success:true, message:"you are welcome", data:searchToken});
        }
        else{
            return NextResponse.json({success:false, message:"already used token provided"}, {status:401})
        }


    } catch (error) {
        console.error("error happend while validating users magic link", error);

        return NextResponse.json({success:true, message:"error happened while validating magic link"}, {status:500})
    }
}

export async function POST(req:NextRequest){
    try {

        const formData = await req.formData()

        const content = formData.get("content") as string
        const inviteId = formData.get("inviteId") as string
        const ratingRaw = formData.get("rating");
        const rating = ratingRaw ? parseInt(ratingRaw as string) : null;

        if(!inviteId){
            return NextResponse.json({
                success:false,
                message:"missing invite"
            }, {status:400})
        }

          if(!content){
            return NextResponse.json({
                success:false,
                message:"missing content"
            }, {status:400})
        }


        const checkInvite = await prisma.invitation.findUnique({where:{id:inviteId}})
        if(!checkInvite || checkInvite.used == true){
            return NextResponse.json({
                success:false,
                message:"either invite is deleted or used"
            }, {status:400})
        }

        await prisma.$transaction( async (tx)=>{
            await tx.feedback.create({
                data:{
                    content,
                    topicId:checkInvite.topicId,
                    invitationId:checkInvite.id,
                    rating
                }
            })

            await tx.invitation.update({
                where:{
                    id:checkInvite.id
                },
                data:{
                    emailEntryId:checkInvite.emailEntryId,
                    submittedAt:new Date(),
                    used:true
                }
            })
        })

        return NextResponse.json({success:true, message:"data added successfully"})

    } catch (error) {

        console.error("error happened while adding feedback", error);

        return NextResponse.json({
            success:false,
            message:"error happened while adding the feedback "
        }, {status:500})
        
    }
}