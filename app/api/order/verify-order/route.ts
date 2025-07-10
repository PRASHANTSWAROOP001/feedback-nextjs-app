import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"

export async function POST(req:NextRequest) {

    try {

        const body = await req.json();

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        const hmac = crypto.createHmac("sha256", process.env.RAZOR_SECRET_ID!)

        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);

        const generatedSign = hmac.digest("hex")

        const isValid = generatedSign ===razorpay_signature

        return NextResponse.json({
            success:isValid
        })
        
    } catch (error) {

        console.error("error happend while trying to verify the secret", error);
        return NextResponse.json({
            success:false,
            message:"error happend at our side."
        }, {status:500})
        
    }
    
}