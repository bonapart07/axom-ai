"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, User, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, sendSignInLinkToEmail } from "firebase/auth";
import { auth, googleProvider, syncUserToFirestore } from "@/firebase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Create the user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update their display name and sync to db
      if (userCredential.user) {
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        await syncUserToFirestore(userCredential.user, name);
      }

      // 3. Immediately sign them in using our NextAuth integration
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.ok) {
        router.push("/dashboard");
      } else {
        setLoading(false);
        alert("Account created, but automatic login failed. Please go to Login page.");
        router.push("/login");
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Signup error:", error);
      alert(error.message || "Failed to create account. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
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
        alert("Google Login sync failed.");
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Google login failed:", error);
      alert(error.message || "Failed to login with Google");
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      alert("Please enter your email first to receive a magic link.");
      return;
    }
    setLoading(true);
    try {
      const actionCodeSettings = {
        url: window.location.origin + '/dashboard',
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setMagicLinkSent(true);
      setLoading(false);
      alert(`Magic link sent! Please check your inbox for ${email}`);
    } catch (error: any) {
      setLoading(false);
      console.error("Magic link error:", error);
      alert(error.message || "Failed to send magic link.");
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
            className="w-full py-3 mt-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={loading || magicLinkSent}
              className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              {magicLinkSent ? "Link Sent!" : "Sign up with Magic Link"}
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all text-sm flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5 absolute left-4" />
              Google
            </button>
          </div>
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
