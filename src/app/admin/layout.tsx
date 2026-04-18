import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Secure route check internally
  // @ts-expect-error
  if (!session || !session.user || !session.user.isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Universal Admin Navigation Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-primary px-2 py-1 rounded text-xs font-bold tracking-widest uppercase">Admin</span>
            <span className="font-semibold text-slate-200">Axom AI Command Center</span>
          </div>
          <div className="text-sm text-slate-400">
            {session.user.email}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
