import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Amount must be at least 100 paise" }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay API keys are missing in the environment variables.");
      return NextResponse.json({ error: "Razorpay is not configured on this server." }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount).toString(), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error: any) {
    console.error("CRITICAL: Razorpay Order Creation Error:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      env_present: {
        key_id: !!process.env.RAZORPAY_KEY_ID,
        key_secret: !!process.env.RAZORPAY_KEY_SECRET
      }
    });
    return NextResponse.json(
      { error: `Payment gateway error: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
