"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Logo } from "./Logo";
import Link from "next/link";
import { LayoutDashboard, MessageSquare, FileText, BookOpen, Languages, User, GraduationCap } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Dash", href: "/dashboard", icon: LayoutDashboard },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "AI Chat", href: "/chat", isLogo: true },
  { name: "Quiz", href: "/practice", icon: BookOpen },
  { name: "Profile", href: "/profile", icon: User },
  { name: "School", href: "/school", icon: GraduationCap, schoolOnly: true },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
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

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-premium relative overflow-hidden flex flex-col md:flex-row">
      {/* Background blobs for overall site */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none fixed" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none fixed" />
      
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-6xl mx-auto z-10 relative pb-24 md:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 p-2 z-50 flex items-center justify-around bg-black/95 backdrop-blur-xl pb-safe">
        {navItems.filter(item => !item.schoolOnly || (session?.user as any)?.plan === 'school').map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
          const isCenter = item.isLogo;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center p-1 rounded-xl transition-all relative flex-1 min-w-0 select-none",
                isCenter ? "-mt-10 active:scale-90" : "min-w-[50px] active:bg-white/5",
                isActive && !isCenter ? "text-white" : "text-slate-400 hover:text-white"
              )}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {isCenter ? (
                <div className={clsx(
                  "w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(79,70,229,0.5)] border-4 border-[#000000] mb-1 transition-transform hover:scale-110",
                  isActive ? "bg-primary" : "bg-primary/90"
                )}>
                  <Logo className="w-10 h-10" variant="white" />
                </div>
              ) : (
                item.icon && <item.icon className="w-5 h-5 mb-1" />
              )}
              <span className={clsx("font-medium truncate w-full text-center px-1", isCenter ? "text-[10px] text-primary font-bold" : "text-[9px]")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
