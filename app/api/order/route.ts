import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import z from "zod";
import { prisma } from "../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { OrderStatus } from "@/app/generated/prisma";

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

// const Subscription = z.enum(["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"]);

const orderSchema = z.object({
  pricingId: z.string(),
  clerkId: z.string(),
});



if (!process.env.RAZOR_KEY_ID || !process.env.RAZOR_SECRET_ID) {
  throw new Error("Razorpay environment variables are missing");
}

const razorPay = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID as string,
  key_secret: process.env.RAZOR_SECRET_ID as string,
});

// we are taking pricing plan for order creation 
// find the plan user want to subscribe 
// then create a order for that subscription plan
// if user has already an active plan we are not letting them stack plans

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsedData = orderSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        {
          success: false,
          message: `validation failed: ${parsedData.error.message}`,
        },
        { status: 400 }
      );
    }

    // lets check active subscription

    const checkSubscription = await prisma.activeSubscription.findFirst({
      where: {
        clerkId: parsedData.data.clerkId,
        isCancelled: false,
        expiryDate: {
          gt: new Date(),
        },
      },
    });

    if (checkSubscription) {
      return NextResponse.json(
        { success: true, message: "You already have an active subscription" },
        { status: 200 }
      );
    }
   // check subscription user want to pay for
    const fetchPricingPlan = await prisma.pricing.findUnique({
      where: {
        id: parsedData.data.pricingId,
      },
    });

    if (!fetchPricingPlan) {
      return NextResponse.json(
        {
          success: false,
          message: "could not find the plan",
        },
        { status: 404 }
      );
    }
    // create new order 
    const createNewOrder = (await razorPay.orders.create({
      amount: fetchPricingPlan.price,
      currency: fetchPricingPlan.currency,
      receipt: parsedData.data.clerkId,
      notes: {
        Subscription: fetchPricingPlan.subscription,
        clerkId: parsedData.data.clerkId,
      },
    })) as RazorpayOrderResponse;

    await prisma.order.create({
      data: {
        amount: fetchPricingPlan.price,
        clerkId: parsedData.data.clerkId,
        subscription: fetchPricingPlan.subscription,
        razorPayOrderId: createNewOrder.id,
        pricingId: parsedData.data.pricingId,
        status:"CREATED"
      },
    });

    return NextResponse.json({
      success: true,
      order: createNewOrder,
    });
  } catch (error) {
    console.error("error happened while creating the order: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Error happend Try Again Sorry for inconvience",
      },
      { status: 500 }
    );
  }
}

export async function GET(req:NextRequest){
  try {
    
        const {searchParams} = req.nextUrl;
        const search = searchParams.get('q')||""
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const orderStatus = searchParams.get("status") as OrderStatus

        const {userId} = await auth()
        
        if(!userId){
          return NextResponse.json({
            success:false,
            message:"not logged in"
          }, {status:400})
        }

        console.log("userId", userId)

        console.log("orderStatus", orderStatus)

        const [getAllOrder, count] = await Promise.all([
          prisma.order.findMany({
            where:{
              clerkId:userId,
              ...(search && {
                razorPayOrderId:{
                  contains: search,
                  mode:"insensitive"
                }
              }),
              ...(orderStatus && {
                status:orderStatus
              })
            },
            take: limit,
            skip:(page-1)*limit,
            select:{
              status:true,
              amount:true,
              currency:true,
              razorPayOrderId:true,
              createdAt:true,
              payments:{
                select:{
                  isVerified:true,
                  failureReason:true
                },
                orderBy:{
                  createdAt:"desc"
                },
                take:1
              },
              pricing:{
                select:{
                  name:true
                }
              }
            }
          }),
          await prisma.order.count({
            where:{
              clerkId:userId,
              ...(search && {
                id:search
              })
            }
          })
        ])


        console.log("orders", getAllOrder)


        if(getAllOrder.length > 0){
          return NextResponse.json({
            success:true,
            messsage:"got the orders",
            orderData: getAllOrder,
            page:page,
            total:count,
            totalPages:Math.ceil(count/limit)
          })
        }
        else{
          return NextResponse.json({
            success:true,
            message:"no orders found",
            page:page,
            total:0,
            totalPage:0,
            orderData:[]
          })
        }

  } catch (error) {

    console.error("error happened while fetching order details: ", error);
    return NextResponse.json({
      success:false,
      message:"internal server error",
    
    }, {status:500})
    
  }
}
