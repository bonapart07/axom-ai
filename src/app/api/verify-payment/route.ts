import { NextResponse } from "next/server";
import crypto from "crypto";
import { getFirebaseAdmin } from "@/firebaseAdmin";
import * as admin from "firebase-admin";

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userId,
      email,
      amount
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const secret = (process.env.RAZORPAY_KEY_SECRET || "").replace(/['"]+/g, '');
    if (!secret) {
      console.error("Razorpay secret is missing in environment variables.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature. Payment verification failed." }, { status: 400 });
    }

    // Signature is valid. Update Firestore User Document using Admin SDK
    const { adminDb } = getFirebaseAdmin();
    const userRef = adminDb.collection('users').doc(userId);
    
    // Calculate subscription dates
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + 30); // 30 days of premium

    await userRef.update({
      plan: "premium",
      dailyLimit: 100,
      subscriptionStart: now.toISOString(),
      subscriptionEnd: endDate.toISOString(),
      isUnlimited: false,
      updatedAt: now.toISOString()
    });

    // Log the payment history
    await adminDb.collection('payments').add({
      userId,
      email: email || "unknown",
      amount: amount || 9900, // paise
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: "success",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return NextResponse.json({ success: true, message: "Payment verified successfully" });
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
