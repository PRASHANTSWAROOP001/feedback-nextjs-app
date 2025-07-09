
import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import z, {ZodError} from "zod"


const Subscription = z.enum([
    "monthly",
    "quaterly",
    "half-yearly",
    "yearly"
])

const orderSchema = z.object({
    amount:z.number(),
    clerkId:z.string(),
    PlanType:Subscription
})


type orderType = z.infer<typeof orderSchema>

if (!process.env.RAZOR_KEY_ID || !process.env.RAZOR_SECRET_ID) {
  throw new Error("Razorpay environment variables are missing");
}


const razorPay = new Razorpay({
    key_id:process.env.RAZOR_KEY_ID as string,
    key_secret:process.env.RAZOR_SECRET_ID as string,
})



export async function POST(req:NextRequest){
    try {
        
        const body = await req.json();

        const parsedData = orderSchema.safeParse(body);

        if(!parsedData.success){
            return NextResponse.json({
                success:false,
                message:`validation failed: ${parsedData.error.message}`
            }, {status:400})
        }

        const createNewOrder = await razorPay.orders.create({
            amount:parsedData.data.amount,
            currency:"INR",
            receipt:parsedData.data.clerkId,
            notes: { Subscription: parsedData.data.PlanType, clerkId:parsedData.data.clerkId }
        })

        return NextResponse.json({
            success:true,
            data:createNewOrder
        })

    } catch (error) {
        console.error("error happened while creating the order: ", error);
        return NextResponse.json({
            success:false,
            message:"Internal Error happend Try Sorry for inconvience"
        }, {status:500})
    }
}