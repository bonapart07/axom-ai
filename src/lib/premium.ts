import { getFirebaseAdmin } from "@/firebaseAdmin";

export async function checkPremiumAccess(userId: string): Promise<{ isPremium: boolean; limit: number; usedToday: number }> {
  try {
    const { adminDb } = getFirebaseAdmin();
    const userDoc = await adminDb.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return { isPremium: false, limit: 5, usedToday: 0 };
    }

    const data = userDoc.data();
    if (!data) {
      return { isPremium: false, limit: 5, usedToday: 0 };
    }

    let plan = data.plan || "free";
    const isUnlimited = data.isUnlimited || false;
    const usedToday = data.usedToday || 0;

    // Backend checking for expired subscription
    if (plan === "premium" && data.subscriptionEnd) {
      const end = new Date(data.subscriptionEnd).getTime();
      const now = new Date().getTime();
      if (now > end) {
        // Expired subscription, downgrade Firestore document safely
        plan = "free";
        await adminDb.collection("users").doc(userId).update({
          plan: "free",
          dailyLimit: 5,
          updatedAt: new Date().toISOString()
        });
      }
    }

    const isPremium = plan === "premium" || plan === "school" || isUnlimited;
    const limit = data.dailyLimit ?? (isPremium ? 100 : 5);

    return {
      isPremium,
      limit,
      usedToday
    };
  } catch (error) {
    console.error("checkPremiumAccess error:", error);
    // Safe fallback: default free trial tier
    return { isPremium: false, limit: 5, usedToday: 0 };
  }
}
