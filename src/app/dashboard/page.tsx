"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { BookOpen, Calendar, Award, ArrowRight, FileText, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserDashboardData, getUserProfileInfo } from "@/firebase";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ questionsAsked: 0, topicsLearned: 0, quizAverage: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [userPlan, setUserPlan] = useState("free");
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if ((session?.user as any)?.id) {
      const userId = (session?.user as any)?.id;
      
      import("@/firebase").then(({ auth, getUserProfileInfo, getUserDashboardData }) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user && user.uid === userId) {
            getUserProfileInfo(userId).then(profile => {
              if (!profile?.class || !profile?.district) {
                router.push("/onboarding");
                return;
              }

              getUserDashboardData(userId).then((data) => {
                setStats(data.stats);
                setActivities(data.recentActivities);
                setUserPlan(data.plan || "free");
                setIsUnlimited(data.isUnlimited || false);
                setLoading(false);
              });
            }).catch(err => {
              console.error("Dashboard profile error:", err);
              // Do not redirect if it's a permission error, maybe just show a warning or retry
              setLoading(false);
            });
          }
        });
        
        // Timeout fallback
        setTimeout(() => {
           if (loading) setLoading(false);
        }, 3000);
        
        return () => unsubscribe();
      });
    }
  }, [session, router, loading]);

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col gap-8 animate-fade-in relative z-10 w-full">
        
        {/* Header */}
        {/* Header */}
        <header className="flex justify-between items-start pt-4">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary w-fit text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Welcome back to Axom AI
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
              আপোনাৰ <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Track your progress and continue where you left off. The AI is ready to assist you today.
            </p>
          </div>

          {/* Profile Icon */}
          <Link href="/profile" className="flex-shrink-0 group mt-2 md:mt-0">
             <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/10 bg-slate-800/50 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all">
               {session?.user?.image ? (
                 <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <span className="text-2xl">🎓</span>
               )}
             </div>
          </Link>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-6 flex flex-col hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">{loading ? "..." : stats.topicsLearned}</span>
            </div>
            <h3 className="font-medium text-slate-200">Insights Gained</h3>
            <p className="text-sm text-slate-500 mt-1">From Quizzes & Notes</p>
          </div>
          
          <div className="glass-panel p-6 flex flex-col hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                <Logo className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">{loading ? "..." : stats.questionsAsked}</span>
            </div>
            <h3 className="font-medium text-slate-200">Questions Asked</h3>
            <p className="text-sm text-slate-500 mt-1">To the AI Assistant</p>
          </div>
          
          <div className="glass-panel p-6 flex flex-col hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-500/10 text-green-400 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">{loading ? "..." : `${stats.quizAverage}%`}</span>
            </div>
            <h3 className="font-medium text-slate-200">Quiz Average</h3>
            <p className="text-sm text-slate-500 mt-1">Practice score</p>
          </div>
        </div>

        {/* Two Column Layout for Recent Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Upgrade Banner (Visible to Free Users Only) */}
            {!loading && userPlan !== "premium" && !isUnlimited && (
              <div className="relative overflow-hidden rounded-2xl bg-black border border-white/20 p-6 flex flex-col items-start gap-4 group shadow-glossy">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -z-10 rounded-full" />
                
                <div className="relative z-10 flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20 shadow-glossy">
                    <Zap className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Axom AI Premium - ₹49/month</h3>
                    <p className="text-sm text-slate-400">Unlock the full power of Axom AI.</p>
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        const res = await new Promise((resolve) => {
                          if (typeof window !== "undefined" && (window as any).Razorpay) {
                            resolve(true); return;
                          }
                          const script = document.createElement("script");
                          script.src = "https://checkout.razorpay.com/v1/checkout.js";
                          script.onload = () => resolve(true);
                          script.onerror = () => resolve(false);
                          document.body.appendChild(script);
                        });

                        if (!res) { alert("Payment Gateway failed to load."); return; }

                        const response = await fetch("/api/create-order", {
                          method: "POST", headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ amount: 4900 })
                        });
                        const orderData = await response.json();
                        if (orderData.error) { alert(orderData.error); return; }

                        const options = {
                          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "YOUR_TEST_KEY_HERE",
                          amount: orderData.amount,
                          currency: orderData.currency,
                          name: "Axom AI Premium",
                          description: "Monthly Subscription",
                          order_id: orderData.id,
                          handler: async function (response: any) {
                            const userId = (session?.user as any)?.id || (session?.user as any)?.uid;
                            const verifyRes = await fetch("/api/verify-payment", {
                              method: "POST", headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ ...response, userId, amount: orderData.amount })
                            });
                            const verifyData = await verifyRes.json();
                            if (verifyData.success) {
                              alert("Premium Activated!"); window.location.reload();
                            } else { alert("Verification Failed"); }
                          },
                          theme: { color: "#000000" }
                        };
                        const rzp = new (window as any).Razorpay(options);
                        rzp.open();
                      } catch (e) { alert("Something went wrong"); }
                    }}
                    className="relative z-10 whitespace-nowrap px-6 py-3 rounded-full bg-white hover:bg-gray-200 text-black font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105"
                  >
                    Upgrade Now
                  </button>
                </div>
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-white" /> 100 Daily Queries
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-white" /> Unlimited Practice Quizzes
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-white" /> Priority AI Access
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/chat" className="glass-panel p-6 group relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center p-1">
                      <Logo className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Ask AI Teacher</h3>
                      <p className="text-slate-400 text-sm">Clear a doubt in Assamese</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors group-hover:translate-x-1" />
                </div>
              </Link>
              
              <Link href="/notes" className="glass-panel p-6 group relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors" />
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Explain Notes</h3>
                      <p className="text-slate-400 text-sm">Upload PDF or Images</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>
            <div className="glass-panel border border-white/5 flex flex-col divide-y divide-white/5 min-h-[200px]">
              {loading ? (
                <div className="flex items-center justify-center h-full text-slate-500">Loading...</div>
              ) : activities.length === 0 ? (
                <div className="flex items-center justify-center h-full p-8 text-center text-slate-500">
                  No activity yet. Start chatting with Axom AI!
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-white/5 transition-colors flex justify-between items-center cursor-pointer">
                    <div className="flex-1 overflow-hidden pr-2">
                      <h4 className="font-medium text-sm text-slate-200 truncate">{activity.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{getTimeAgo(activity.createdAt)}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-white/10 text-slate-300 whitespace-nowrap">
                      {activity.type}
                    </span>
                  </div>
                ))
              )}
              {activities.length > 0 && (
                <div className="p-4 text-center">
                  <button className="text-sm text-primary hover:text-primary/80 font-medium">View all history</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
