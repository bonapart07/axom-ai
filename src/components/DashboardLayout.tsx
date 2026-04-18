"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Logo } from "./Logo";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.4)] border border-primary/20 bg-primary/10 animate-pulse mb-4 p-4">
          <Logo className="w-full h-full" />
        </div>
        <p className="text-slate-400 font-medium">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-premium relative overflow-hidden flex">
      {/* Background blobs for overall site */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none fixed" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none fixed" />
      
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto z-10 relative h-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
