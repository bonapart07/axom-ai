"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, FileText, BookOpen, Languages, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import clsx from "clsx";
import { Logo } from "./Logo";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Chat", href: "/chat", icon: MessageSquare },
  { name: "Notes Explainer", href: "/notes", icon: FileText },
  { name: "Practice", href: "/practice", icon: BookOpen },
  { name: "Translate", href: "/translate", icon: Languages },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 border-r border-white/10 glass-panel border-y-0 border-l-0 rounded-none h-screen fixed left-0 top-0 flex flex-col pt-6 z-20 hidden md:flex">
      <div className="px-6 mb-10 flex items-center gap-3">
        <Logo className="w-10 h-10" />
        <span className="text-xl font-bold tracking-tight">Axom<span className="text-primary">AI</span></span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(79,70,229,0.1)]" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}

        {/* Dynamically render Admin link if user is admin */}
        {(session?.user as any)?.isAdmin && (
          <Link
            href="/admin"
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mt-4",
              pathname === '/admin'
                ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]" 
                : "text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
            )}
          >
            <div className="w-5 h-5 flex items-center justify-center">⚙️</div>
            Admin Controls
          </Link>
        )}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          {session?.user?.image ? (
            <img src={session.user.image} alt="User" className="w-10 h-10 rounded-full bg-white/10" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xl">🎓</span>
            </div>
          )}
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">{session?.user?.name || "Student"}</span>
            <span className="text-xs text-slate-500 truncate">{session?.user?.email || "Offline Module"}</span>
          </div>
        </div>
        
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
