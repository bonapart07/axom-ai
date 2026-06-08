"use client";

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, User, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider, syncUserToFirestore } from "@/firebase";
import { useEffect } from "react";

export default function SignupPage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setLoading(true);
          await syncUserToFirestore(result.user);
          const idToken = await result.user.getIdToken();
          const res = await signIn("credentials", {
            idToken,
            redirect: false,
          });
          if (res?.ok) {
            router.push("/dashboard");
          } else {
            setLoading(false);
            setError("Google Login sync failed.");
          }
        }
      } catch (error: any) {
        console.error("Redirect result error:", error);
      }
    };
    checkRedirect();
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        await syncUserToFirestore(userCredential.user, name);
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.ok) {
        router.push("/dashboard");
      } else {
        setLoading(false);
        setError("Account created, but automatic login failed. Please go to Login page.");
        router.push("/login");
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Signup error:", error);
      setError(error.message || "Failed to create account. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        await syncUserToFirestore(result.user);
        const idToken = await result.user.getIdToken();
        const res = await signIn("credentials", {
          idToken,
          redirect: false,
        });
        if (res?.ok) {
          router.push("/dashboard");
        } else {
          setLoading(false);
          setError("Google Login sync failed.");
        }
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Google login failed:", error);
      setError(error.message || "Failed to login with Google");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-premium relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center group-hover:scale-105 transition-transform">
          <ArrowRight className="w-5 h-5 rotate-180" />
        </div>
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 md:p-10 z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)] bg-primary/10 border border-primary/20 p-2">
            <Logo className="w-full h-full object-contain" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Join us and start learning today.</p>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm overflow-hidden"
            >
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <span className="font-bold">!</span>
              </div>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 px-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                placeholder="Rahul Das"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 px-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                placeholder="student@axom.ai"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 px-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
          
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all text-sm flex items-center justify-center gap-2 relative overflow-hidden"
          >
            <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5 absolute left-4" />
            Sign up with Google
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
