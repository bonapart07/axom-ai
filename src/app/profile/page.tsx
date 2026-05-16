"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getUserProfileInfo, updateUserProfile, auth } from "@/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Calendar, Shield, Zap, Clock, TrendingUp, 
  Settings, LogOut, Edit3, Lock, Moon, Crown, GraduationCap, AlertTriangle,
  X, CheckCircle, MapPin
} from "lucide-react";
import clsx from "clsx";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Settings State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhotoURL, setEditPhotoURL] = useState("");
  const [editClass, setEditClass] = useState("");
  const [editDistrict, setEditDistrict] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Password Reset State
  const [resetStatus, setResetStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    async function loadProfile() {
      if ((session?.user as any)?.id || (session?.user as any)?.uid) {
        const uid = (session?.user as any)?.id || (session?.user as any)?.uid;
        const data = await getUserProfileInfo(uid) as any;
        setProfile(data);
        if (data) {
          setEditName(data.name || "");
          setEditPhotoURL(data.photoURL || "");
          setEditClass(data.class || "");
          setEditDistrict(data.district || "");
        }
      }
      setLoading(false);
    }
    
    if (status === "authenticated") {
      loadProfile();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }

    // Check saved theme
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      } else {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, [session, status]);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSaveProfile = async () => {
    if (!profile?.uid && !(session?.user as any)?.id) return;
    setIsSaving(true);
    const uid = profile?.uid || (session?.user as any).id;
    const success = await updateUserProfile(uid, { 
      name: editName, 
      photoURL: editPhotoURL,
      class: editClass,
      district: editDistrict
    });
    if (success) {
      setProfile({ ...profile, name: editName, photoURL: editPhotoURL, class: editClass, district: editDistrict });
      setShowEditModal(false);
    } else {
      alert("Failed to update profile. Please try again.");
    }
    setIsSaving(false);
  };

  const handlePasswordReset = async () => {
    if (!profile?.email) return;
    setResetStatus("loading");
    try {
      await sendPasswordResetEmail(auth, profile.email);
      setResetStatus("success");
      setTimeout(() => setResetStatus("idle"), 5000);
    } catch (error) {
      console.error(error);
      setResetStatus("error");
      setTimeout(() => setResetStatus("idle"), 5000);
    }
  };

  const handleUpgrade = async () => {
    setIsProcessingPayment(true);
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
        setIsProcessingPayment(false);
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
        setIsProcessingPayment(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Axom AI Study Assistant",
        description: "Premium Subscription",
        order_id: orderData.id,
        handler: async function (response: any) {
          const userId = profile?.uid || (session?.user as any)?.id;
          // Verify payment
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: userId,
              email: profile?.email,
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
          name: profile?.name,
          email: profile?.email,
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
    setIsProcessingPayment(false);
  };

  if (loading || status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile && status === "authenticated") {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center text-slate-400">
          Failed to load profile data.
        </div>
      </DashboardLayout>
    );
  }

  const getPlanBadgeConfig = (plan: string) => {
    switch(plan) {
      case 'premium':
        return { color: 'bg-gradient-to-r from-yellow-400 to-amber-600 text-white', icon: Crown, label: 'Premium' };
      case 'school':
        return { color: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white', icon: GraduationCap, label: 'School Access' };
      default:
        return { color: 'bg-slate-700 text-slate-200', icon: Shield, label: 'Free Plan' };
    }
  };

  const planBadge = getPlanBadgeConfig(profile?.plan || 'free');
  
  let remainingDays = 0;
  if (profile?.subscriptionEnd) {
    const end = new Date(profile.subscriptionEnd).getTime();
    const now = new Date().getTime();
    remainingDays = Math.ceil((end - now) / (1000 * 3600 * 24));
  }

  const getSubscriptionColor = (days: number) => {
    if (days < 0) return 'text-rose-400';
    if (days <= 7) return 'text-orange-400';
    return 'text-emerald-400';
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-4xl mx-auto space-y-6 pb-8">
        
        {/* Expiry Warning Banner */}
        <AnimatePresence>
          {profile?.plan === 'premium' && remainingDays >= 0 && remainingDays <= 5 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-500/20 border border-orange-500/50 rounded-xl p-4 flex items-center justify-between backdrop-blur-md"
            >
              <div className="flex items-center gap-3 text-orange-200">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <p className="font-medium">Your subscription is expiring in {remainingDays} days.</p>
              </div>
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-orange-500/20">
                Renew Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -z-10 rounded-full mix-blend-screen" />
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-800 shadow-xl bg-slate-800 flex items-center justify-center">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <button 
                onClick={() => setShowEditModal(true)}
                className="absolute bottom-0 right-0 bg-primary hover:bg-primary/80 p-2 rounded-full text-white transition-colors shadow-lg"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">{profile?.name || 'User'}</h1>
              <div className="flex flex-wrap md:items-center gap-x-4 gap-y-2 text-slate-400 text-sm justify-center md:justify-start">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {profile?.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Joined {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}
                </span>
                {profile?.class && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4 text-primary" /> {profile.class}
                  </span>
                )}
                {profile?.district && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" /> {profile.district}
                  </span>
                )}
              </div>
            </div>
            
            <div className={clsx("flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow-lg", planBadge.color)}>
              <planBadge.icon className="w-5 h-5" />
              {planBadge.label}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Usage Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Daily Usage</h2>
            </div>
            
            {profile?.isUnlimited ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
                <Crown className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-emerald-300">Unlimited Access Enabled</h3>
                <p className="text-sm text-emerald-400/70 mt-1">Ask as many questions as you need.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm text-slate-400">Queries used today</span>
                  <span className="text-2xl font-bold text-white">
                    {profile?.usedToday || 0} <span className="text-slate-500 text-lg">/ {profile?.dailyLimit || 5}</span>
                  </span>
                </div>
                
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(((profile?.usedToday || 0) / (profile?.dailyLimit || 5)) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={clsx(
                      "h-full rounded-full transition-all duration-500",
                      (profile?.usedToday || 0) >= (profile?.dailyLimit || 5) ? "bg-rose-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"
                    )}
                  />
                </div>
                
                <p className="text-sm text-slate-400 text-right">
                  {Math.max((profile?.dailyLimit || 5) - (profile?.usedToday || 0), 0)} queries remaining
                </p>
              </div>
            )}
          </motion.div>

          {/* Subscription Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Subscription Details</h2>
            </div>
            
            {profile?.plan === 'free' ? (
              <div className="bg-slate-800/50 rounded-xl p-6 text-center border border-slate-700">
                <h3 className="text-lg font-medium text-slate-300">Free Tier</h3>
                <p className="text-sm text-slate-400 mt-1 mb-4">Limited daily access to AI features.</p>
                <button 
                  onClick={handleUpgrade}
                  disabled={isProcessingPayment}
                  className="w-full py-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white font-medium rounded-lg transition-opacity shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:opacity-70"
                >
                  {isProcessingPayment ? "Processing..." : "Upgrade to Premium"}
                </button>
              </div>
            ) : profile?.plan === 'school' ? (
              <div className="bg-blue-500/10 rounded-xl p-6 text-center border border-blue-500/20">
                <GraduationCap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-blue-300">Unlimited School Access</h3>
                <p className="text-sm text-blue-400/70 mt-1">Provided by {profile?.schoolName || 'your institution'}.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Current Plan</span>
                  <span className="font-medium text-white capitalize">{profile?.plan} Plan</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Valid till</span>
                  <span className="font-medium text-white">
                    {profile?.subscriptionEnd ? new Date(profile.subscriptionEnd).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Status</span>
                  <span className={clsx("font-bold", getSubscriptionColor(remainingDays))}>
                    {remainingDays < 0 ? 'Subscription Expired' : `${remainingDays} days remaining`}
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Activity Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 rounded-2xl border border-white/10 md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Activity Summary</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                <div className="text-slate-400 text-sm mb-1">Questions Asked</div>
                <div className="text-2xl font-bold text-white">{profile?.stats?.questionsAsked || 0}</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                <div className="text-slate-400 text-sm mb-1">Topics Learned</div>
                <div className="text-2xl font-bold text-white">{profile?.stats?.topicsLearned || 0}</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                <div className="text-slate-400 text-sm mb-1">Quizzes Taken</div>
                <div className="text-2xl font-bold text-white">{profile?.stats?.quizzesSubmitted || 0}</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                <div className="text-slate-400 text-sm mb-1">Last Active</div>
                <div className="text-lg font-bold text-white truncate">
                  {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'Today'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-6 rounded-2xl border border-white/10 md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-500/20 rounded-lg">
                <Settings className="w-6 h-6 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={toggleDarkMode}
                className="flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/60 rounded-xl border border-white/5 transition-colors group"
              >
                <div className="flex items-center gap-3 text-slate-300 group-hover:text-white transition-colors">
                  <Moon className="w-5 h-5" />
                  <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <div className={clsx(
                  "w-10 h-5 rounded-full relative transition-colors duration-300",
                  isDarkMode ? "bg-primary" : "bg-slate-500"
                )}>
                  <div className={clsx(
                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300",
                    isDarkMode ? "right-1" : "left-1"
                  )}></div>
                </div>
              </button>
              
              <button 
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-3 p-4 bg-slate-800/30 hover:bg-slate-800/60 rounded-xl border border-white/5 transition-colors text-slate-300 hover:text-white"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
              
              <button 
                onClick={handlePasswordReset}
                disabled={resetStatus === "loading" || resetStatus === "success"}
                className={clsx(
                  "flex items-center gap-3 p-4 rounded-xl border transition-colors",
                  resetStatus === "success" 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : resetStatus === "error"
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    : "bg-slate-800/30 hover:bg-slate-800/60 border-white/5 text-slate-300 hover:text-white"
                )}
              >
                {resetStatus === "loading" ? (
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                ) : resetStatus === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : resetStatus === "error" ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
                <span>
                  {resetStatus === "success" ? "Email Sent" : resetStatus === "error" ? "Error" : "Reset Password"}
                </span>
              </button>
              
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-3 p-4 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl border border-rose-500/20 transition-colors text-rose-400 hover:text-rose-300"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>

          {/* Premium CTA (Only for Free Users) */}
          {profile?.plan === 'free' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="glass-panel p-8 rounded-2xl border border-primary/30 md:col-span-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-600/10 z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm font-medium mb-3">
                    <Crown className="w-4 h-4" /> Go Premium
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Unlock Unlimited AI Power</h2>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div> 100 daily queries</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Faster AI responses</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Exclusive Premium badge</li>
                  </ul>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-white mb-4">
                    ₹49<span className="text-lg text-slate-400 font-normal">/month</span>
                  </div>
                  <button 
                    onClick={handleUpgrade}
                    disabled={isProcessingPayment}
                    className="px-8 py-3 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-bold rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:shadow-[0_0_40px_rgba(79,70,229,0.7)] transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {isProcessingPayment ? "Processing..." : "Upgrade Now"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-black border border-white/20 p-6 rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Edit Profile</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Photo URL</label>
                  <input 
                    type="text" 
                    value={editPhotoURL}
                    onChange={(e) => setEditPhotoURL(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="https://example.com/photo.jpg"
                  />
                  <p className="text-xs text-slate-500 mt-1">Provide a direct link to an image (e.g., from Imgur).</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Class</label>
                    <select
                      value={editClass}
                      onChange={(e) => setEditClass(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer"
                    >
                      <option value="">Select Class</option>
                      {["Class 9", "Class 10", "Class 11", "Class 12", "Degree", "Other"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">District</label>
                    <select
                      value={editDistrict}
                      onChange={(e) => setEditDistrict(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer text-sm"
                    >
                      <option value="">Select District</option>
                      {[
                        "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", 
                        "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", 
                        "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", 
                        "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Dima Hasao", 
                        "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", 
                        "West Karbi Anglong", "Bajali", "Tamulpur"
                      ].sort().map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
