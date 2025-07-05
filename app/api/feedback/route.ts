import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
// /api/feedback route
export async function GET(req:NextRequest){
    try {
        
        const {searchParams} = req.nextUrl;
        const topicId = searchParams.get("topicId")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "5")

        if(!topicId){
            return NextResponse.json({sucess:false, message:"missing the topicId"}, {status:400})
        }

        const [getAllFeedbackForTopic,count] =await  Promise.all([  prisma.feedback.findMany({
            where:{
                topicId:topicId
            },
            take:limit,
            orderBy:{
                submittedAt:"desc"
            }
        }), 
     prisma.feedback.count({where:{
        topicId:topicId
    }})])

    return NextResponse.json({
        success:true,
        data:getAllFeedbackForTopic,
        total:count,
        page,
        totalPage: Math.ceil(count/limit)
    })


    } catch (error) {

        console.error("error happend while getting feedback data", error)

        return NextResponse.json({
            success:false,
            message:"error happened while getting feedback data"
        }, {status:500})
        
    }
}