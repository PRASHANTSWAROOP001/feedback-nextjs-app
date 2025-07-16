'use client'

import { useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { Button } from '../ui/button';

type PaymentProp = {
  pricingId: string,
};

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};


type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
};



export default function RazorpayPage({ pricingId }: PaymentProp) {
  const { user } = useUser();
  const clerkId = user?.id;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!clerkId) {
      toast("Kindly login before payment");
      return;
    }

    try {
      const res = await axios.post("/api/order", {
        pricingId,
        clerkId,
      });

      const { order } = res.data;

      if (!order?.id) {
        toast("Order creation failed");
        return;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: "INR",
        name: "Feedback Sass",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await fetch("/api/order/verify-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const data = await verifyRes.json();
          if (data.success) {
            toast("Payment verified!");
          } else {
            toast("Payment verification failed");
          }
        },
        prefill: {
          name: user?.fullName ?? "John Doe",
          email: user?.primaryEmailAddress?.emailAddress ?? "john@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      toast("Something went wrong during payment");
      console.error(error);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      size="lg"
      className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700"
    >
      Continue to Payment
    </Button>
  );
}
