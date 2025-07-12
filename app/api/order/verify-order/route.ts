import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {

    try {

        const body = await req.json();

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        const hmac = crypto.createHmac("sha256", process.env.RAZOR_SECRET_ID!)

        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);

        const generatedSign = hmac.digest("hex")

        const isValid = generatedSign === razorpay_signature


        if (!isValid) {
            return NextResponse.json({
                success: false,
                message: "payment data tampered"
            })
        }

        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "missing auth at server"
            })
        }

        const getOrder = await prisma.order.findUnique({
            where: {
                clerkId: userId,
                razorPayOrderId: razorpay_order_id
            }
        })

        if (!getOrder) {
            return NextResponse.json({
                success: false,
                message: "linked order could not be found"
            })
        }

        const updateTx = await prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: {
                    id: getOrder.id
                },
                data: {
                    status: "PAID"
                }
            })

            const payments = await tx.payment.create({
                data: {
                    razorPayPaymentId: razorpay_payment_id,
                    razorPayOrderId: razorpay_order_id,
                    razorPaySignature: razorpay_signature,
                    orderId: getOrder.id,
                    status: "SUCCESS",
                    isVerified: true,
                }
            })

            const fetchPlan = await tx.pricing.findUnique({
                where: {
                    id: getOrder.pricingId
                }
            })

            if (!fetchPlan?.validity) {
                throw new Error("Pricing plan missing validity");
            }

            // Calculate expiry date
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + fetchPlan.validity);

            const subs = await tx.activeSubscription.create({
                data: {
                    clerkId: userId,
                    paymentId: payments.id,
                    pricingId: getOrder.pricingId,
                    expiryDate: expiryDate
                }
            });

            return subs;

        })

        return NextResponse.json({
            success:true,
            message:"Payment Linked successfully.",
            data:updateTx
        })

    } catch (error) {

        console.error("error happend while trying to verify the secret", error);
        return NextResponse.json({
            success: false,
            message: "error happend at our side."
        }, { status: 500 })

    }

}