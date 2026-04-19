"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Logo } from "./Logo";
import Link from "next/link";
import { LayoutDashboard, MessageSquare, FileText, BookOpen, Languages } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Dash", href: "/dashboard", icon: LayoutDashboard },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Quiz", href: "/practice", icon: BookOpen },
  { name: "Trans", href: "/translate", icon: Languages },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

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
    <div className="min-h-screen bg-gradient-premium relative overflow-hidden flex flex-col md:flex-row">
      {/* Background blobs for overall site */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none fixed" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none fixed" />
      
      <Sidebar />
      
      <main className="flex-1 md:ml-64 pb-24 md:pb-0 p-4 md:p-8 h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto z-10 relative h-full flex flex-col">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 p-2 z-50 flex items-center justify-around bg-slate-900/95 backdrop-blur-xl pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center p-2 rounded-xl min-w-[64px] transition-all",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
