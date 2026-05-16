import { X, Sparkles, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { getUserProfileInfo } from "@/firebase";

type UpgradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      // Load razorpay script
      const res = await new Promise((resolve) => {
        if (typeof window !== "undefined" && (window as any).Razorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      // Create order
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 4900 }) // 49 INR in paise
      });
      const orderData = await response.json();

      if (orderData.error) {
        alert(orderData.error);
        setIsProcessing(false);
        return;
      }

      // Get profile info for prefill
      const uid = (session?.user as any)?.id || (session?.user as any)?.uid;
      const profile = await getUserProfileInfo(uid) as any;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Axom AI Study Assistant",
        description: "Premium Subscription",
        order_id: orderData.id,
        handler: async function (response: any) {
          // Verify payment
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: uid,
              email: session?.user?.email,
              amount: orderData.amount
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Premium Activated Successfully 🎉");
            window.location.reload();
          } else {
            alert("Payment Verification Failed: " + verifyData.error);
          }
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment Failed: " + response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong");
    }
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-8 overflow-hidden bg-slate-900 border border-white/20 rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.3)]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/30 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/30 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative flex flex-col items-center text-center z-10">
          <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 mb-6 shadow-[0_0_20px_rgba(79,70,229,0.5)] transform -rotate-3">
            <Zap className="w-10 h-10 text-primary animate-pulse" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3">
            প্ৰিমিয়ামলৈ আপগ্ৰেড কৰক
          </h2>
          
          <p className="text-slate-300 leading-relaxed mb-8">
            আপোনাৰ দৈনিক ব্যৱহাৰৰ সীমা শেষ হৈছে। মাত্ৰ <b>₹৪৯</b> ত এমাহৰ বাবে ১০০ টা দৈনিক প্ৰশ্ন আৰু দ্ৰুত AI সঁহাৰি লাভ কৰক।
          </p>

          <button 
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-xl mb-4 disabled:opacity-70"
          >
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                এতিয়াই আপগ্ৰেড কৰক (Pay ₹49)
              </>
            )}
          </button>
          
          <button 
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-white transition-colors"
          >
            এতিয়া নালাগে (Not now)
          </button>
        </div>
      </div>
    </div>
  );
}

