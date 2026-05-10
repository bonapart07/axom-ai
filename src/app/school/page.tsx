"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { getUserProfileInfo } from "@/firebase";
import { useSession } from "next-auth/react";
import { GraduationCap, UserPlus, Copy, Check, Users, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SchoolDashboardPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();

  const fetchProfile = async () => {
    const userId = (session?.user as any)?.id;
    if (userId) {
      const data = await getUserProfileInfo(userId);
      if (data && data.plan !== 'school') {
        router.push('/dashboard');
        return;
      }
      setProfile(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleGenerateStudent = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/create-student', { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        alert("Student account generated successfully!");
        fetchProfile(); // Refresh table and progress bar
      } else {
        alert(data.error || "Failed to generate account");
      }
    } catch (error) {
      alert("Network error");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) return null;

  const maxAccounts = profile.maxStudentAccounts || 0;
  const createdAccounts = profile.createdStudentAccounts || 0;
  const accountsLeft = maxAccounts - createdAccounts;
  const progressPercent = maxAccounts > 0 ? (createdAccounts / maxAccounts) * 100 : 0;
  const studentAccounts = profile.studentAccounts || [];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-8">
        
        <header className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <GraduationCap className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">School Management Portal</h1>
          </div>
          <p className="text-slate-400">
            Welcome to the {profile.schoolName} dashboard. Generate and manage student login credentials below.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Quota Card */}
          <div className="glass-panel p-6 border border-white/5 md:col-span-1 h-fit">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-white">Account Quota</h2>
            </div>
            
            <div className="flex justify-between items-end mb-2">
              <div className="text-3xl font-bold text-white">
                {createdAccounts} <span className="text-lg text-slate-500 font-normal">/ {maxAccounts}</span>
              </div>
            </div>
            
            <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${progressPercent >= 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 text-right">{accountsLeft} accounts remaining</p>

            <button 
              onClick={handleGenerateStudent}
              disabled={isGenerating || createdAccounts >= maxAccounts}
              className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Generate Student Credential
                </>
              )}
            </button>
            {createdAccounts >= maxAccounts && (
              <p className="text-xs text-red-400 text-center mt-3">
                You have reached your maximum account limit. Contact support to increase it.
              </p>
            )}
          </div>

          {/* Accounts List */}
          <div className="glass-panel border border-white/5 md:col-span-2 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
              <h2 className="text-lg font-semibold text-white">Generated Credentials</h2>
              <p className="text-sm text-slate-400">Distribute these emails and passwords to your students.</p>
            </div>
            
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              {studentAccounts.length === 0 ? (
                <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center h-full">
                  <Users className="w-12 h-12 mb-3 opacity-20" />
                  <p>No student accounts generated yet.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-slate-900/90 backdrop-blur-md z-10 border-b border-white/5">
                    <tr className="text-xs text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium">Username / Email</th>
                      <th className="px-6 py-4 font-medium">Password</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[...studentAccounts].reverse().map((acc: any, index: number) => (
                      <tr key={acc.uid || index} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-mono text-sm text-blue-300">
                          {acc.email}
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-slate-300">
                          {acc.password}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => copyToClipboard(`Email: ${acc.email}\nPassword: ${acc.password}`, acc.uid)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs rounded-lg transition-colors border border-white/10"
                          >
                            {copiedId === acc.uid ? (
                              <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</>
                            ) : (
                              <><Copy className="w-3.5 h-3.5" /> Copy Details</>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
