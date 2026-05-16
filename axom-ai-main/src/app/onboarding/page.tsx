"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, GraduationCap, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { getUserProfileInfo, updateUserProfile } from "@/firebase";

const ASSAM_DISTRICTS = [
  "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", 
  "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", 
  "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", 
  "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", 
  "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", 
  "West Karbi Anglong", "Bajali", "Tamulpur"
].sort();

const CLASSES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Degree", "Other"];

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    district: "",
    acceptedTerms: false
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const userId = (session?.user as any)?.id;
      
      // We must ensure Firebase Client Auth is ready before fetching from Firestore to avoid permission errors
      import("@/firebase").then(({ auth, getUserProfileInfo }) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user && user.uid === userId) {
            getUserProfileInfo(userId).then(profile => {
              if (profile?.class && profile?.district) {
                // Already onboarded
                window.location.href = "/dashboard";
              } else {
                setFormData({
                  name: profile?.name || session.user?.name || "",
                  class: profile?.class || "",
                  district: profile?.district || ""
                });
                setLoading(false);
              }
            }).catch(err => {
              console.error("Profile fetch error:", err);
              setLoading(false);
              alert("Error loading profile. Please check your Firebase Security Rules or try refreshing.");
            });
          }
        });
        
        // Timeout fallback just in case auth takes too long or fails silently
        setTimeout(() => {
           if (loading) setLoading(false);
        }, 3000);
        
        return () => unsubscribe();
      });
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.class || !formData.district) {
      alert("Please fill all fields");
      return;
    }
    if (!formData.acceptedTerms) {
      alert("You must accept the Privacy Policy and Terms of Service to continue.");
      return;
    }

    setSaving(true);
    try {
      const userId = (session?.user as any)?.id;
      if (userId) {
        console.log("Saving onboarding for UID:", userId, formData);
        await updateUserProfile(userId, {
          name: formData.name,
          class: formData.class,
          district: formData.district
        });
        console.log("UpdateUserProfile successful");
        
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name
          }
        });

        // Force a full page reload to Dashboard to ensure all states/sessions are fresh
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      }
    } catch (error: any) {
      console.error("Onboarding error:", error);
      if (error.message && error.message.includes("permission")) {
        alert("Permission denied. Please update your Firebase Firestore rules as instructed.");
      } else {
        alert("Failed to save profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)] border border-white/10 bg-white/5 animate-pulse mb-6 p-4">
          <Logo className="w-full h-full" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-white font-bold text-xl tracking-tight">Initializing AI</p>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-premium relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      
      {/* Policy Links for easy reference during onboarding */}
      <div className="fixed top-4 right-4 flex gap-4 z-50">
        <Link href="/privacy" target="_blank" className="text-xs text-slate-500 hover:text-white underline">Privacy Policy</Link>
        <Link href="/terms" target="_blank" className="text-xs text-slate-500 hover:text-white underline">Terms of Service</Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass-panel p-6 md:p-10 z-10 overflow-y-auto max-h-[90vh] hide-scrollbar"
      >
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)] bg-primary/10 border border-primary/20 p-2">
            <Logo className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Welcome to Axom AI</h1>
          <p className="text-slate-400 text-sm">Let&apos;s personalize your learning experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Rahul Das"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" /> Your Class
            </label>
            <select
              value={formData.class}
              onChange={(e) => setFormData({...formData, class: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer"
              required
            >
              <option value="" disabled className="bg-slate-900">Select Class</option>
              {CLASSES.map(c => (
                <option key={c} value={c} className="bg-slate-900">{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> District (Assam)
            </label>
            <select
              value={formData.district}
              onChange={(e) => setFormData({...formData, district: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer"
              required
            >
              <option value="" disabled className="bg-slate-900">Select District</option>
              {ASSAM_DISTRICTS.map(d => (
                <option key={d} value={d} className="bg-slate-900">{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <input 
              type="checkbox" 
              id="terms"
              checked={formData.acceptedTerms}
              onChange={(e) => setFormData({...formData, acceptedTerms: e.target.checked})}
              className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary/50 cursor-pointer"
              required
            />
            <label htmlFor="terms" className="text-xs text-slate-400 leading-normal cursor-pointer select-none">
              I agree to the <Link href="/terms" target="_blank" className="text-primary hover:underline font-medium">Terms of Service</Link> and <Link href="/privacy" target="_blank" className="text-primary hover:underline font-medium">Privacy Policy</Link>. I understand that Axom AI uses AI to generate content for educational purposes.
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 mt-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {saving ? "Saving Profile..." : (
              <>
                Continue to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>We use this to customize your study materials.</span>
        </div>
      </motion.div>
    </div>
  );
}
