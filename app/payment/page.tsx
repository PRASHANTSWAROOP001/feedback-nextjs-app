'use client'
import { useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
export default function RazorpayPage() {
    const {user} = useUser()
    const clerkId = user?.id

    if(!clerkId){
        toast("kindly login before payment")
        return;
    }

    console.log("env var", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)

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
    // Step 1: Create order via backend
    const res = await axios.post("/api/order", {
        amount:500,
        clerkId,
        subscription:"MONTHLY"
    })

    const {order} = res.data

    if (!order?.id) {
      toast("Order creation failed");
      return;
    }

    // Step 2: Open Razorpay Checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, // from .env
      amount: order.amount,
      currency: "INR",
      name: "Feedback Sass",
      description: "Test Transaction",
      order_id: order.id,
      handler: async function (response: any) {
        // Step 3: Send response to backend to verify
        const verifyRes = await fetch("/api/order/verify-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const data = await verifyRes.json();
        if (data.success) {
          alert("Payment verified!");
        } else {
          alert("Payment verification failed");
        }
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Make a Payment</h1>
      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Pay ₹500
      </button>
    </div>
  );
}
