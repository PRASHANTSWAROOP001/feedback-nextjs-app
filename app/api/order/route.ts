import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import z from "zod";
import { prisma } from "../../../lib/prisma";


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

const Subscription = z.enum(["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"]);

const orderSchema = z.object({
  pricingId: z.string(),
  clerkId: z.string(),
});

type orderType = z.infer<typeof orderSchema>;

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

    const saveOrderInDb = await prisma.order.create({
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

// export async function GET(req:NextRequest){
//   try {
    
//         const {searchParams} = req.nextUrl;
//         const topicId = searchParams.get("orderId")
//         const page = parseInt(searchParams.get("page") || "1")
//         const limit = parseInt(searchParams.get("limit") || "10")

//   } catch (error) {
    
//   }
// }
