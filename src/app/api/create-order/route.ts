import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Amount must be at least 100 paise" }, { status: 400 });
    }

    const key_id = (process.env.RAZORPAY_KEY_ID || "").replace(/['"]+/g, '');
    const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").replace(/['"]+/g, '');

    if (!key_id || !key_secret) {
      console.error("Razorpay API keys are missing in the environment variables.");
      return NextResponse.json({ error: "Razorpay is not configured on this server." }, { status: 500 });
    }

    // Create order using direct fetch to avoid SDK issues in serverless
    const auth = Buffer.from(`${key_id}:${key_secret}`).toString("base64");
    
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        currency: "INR",
        receipt: `receipt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      }),
    });

    const orderData = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      console.error("Razorpay API Error:", orderData);
      return NextResponse.json({ error: orderData.error?.description || "Payment gateway error" }, { status: 500 });
    }

    return NextResponse.json({
      id: orderData.id,
      currency: orderData.currency,
      amount: orderData.amount,
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
