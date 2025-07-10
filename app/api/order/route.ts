
import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import z, {ZodError} from "zod"
import {prisma} from "../../../lib/prisma"
import crypto from "crypto"


type RazorpayOrderResponse = {
  id: string;
  entity: "order";
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: string | null;
  status: "created" | "attempted" | "paid";
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
};



const Subscription = z.enum([
    "MONTHLY",
    "QUARTERLY",
    "HALF_YEARLY",
    "YEARLY"
])

const orderSchema = z.object({
    amount:z.number(),
    clerkId:z.string(),
    subscription:Subscription
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
            notes: { Subscription: parsedData.data.subscription, clerkId:parsedData.data.clerkId }
        }) as RazorpayOrderResponse

        const saveOrderInDb = await prisma.order.create({
            data:{
                amount:parsedData.data.amount,
                clerkId:parsedData.data.clerkId,
                subscription:parsedData.data.subscription,
                razorPayOrderId:createNewOrder.id
            }
        })


        return NextResponse.json({
            success:true,
            order:createNewOrder
        })

    } catch (error) {
        console.error("error happened while creating the order: ", error);
        return NextResponse.json({
            success:false,
            message:"Internal Error happend Try Again Sorry for inconvience"
        }, {status:500})
    }
}


