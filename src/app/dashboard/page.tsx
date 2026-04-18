import { DashboardLayout } from "@/components/DashboardLayout";
import { BookOpen, Calendar, Award, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col gap-8 animate-fade-in relative z-10 w-full">
        
        {/* Header */}
        <header className="flex flex-col gap-2 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary w-fit text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Welcome back to Axom AI
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
            আপোনাৰ <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Track your progress and continue where you left off. The AI is ready to assist you today.
          </p>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-6 flex flex-col hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">12</span>
            </div>
            <h3 className="font-medium text-slate-200">Topics Learned</h3>
            <p className="text-sm text-slate-500 mt-1">This month</p>
          </div>
          
          <div className="glass-panel p-6 flex flex-col hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                <Logo className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">85</span>
            </div>
            <h3 className="font-medium text-slate-200">Questions Asked</h3>
            <p className="text-sm text-slate-500 mt-1">To the AI Assistant</p>
          </div>
          
          <div className="glass-panel p-6 flex flex-col hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-500/10 text-green-400 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">92%</span>
            </div>
            <h3 className="font-medium text-slate-200">Quiz Average</h3>
            <p className="text-sm text-slate-500 mt-1">Practice score</p>
          </div>
        </div>

        {/* Two Column Layout for Recent Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Actions */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/chat" className="glass-panel p-6 group relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center p-1">
                      <Logo className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Ask AI Teacher</h3>
                      <p className="text-slate-400 text-sm">Clear a doubt in Assamese</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors group-hover:translate-x-1" />
                </div>
              </Link>
              
              <Link href="/notes" className="glass-panel p-6 group relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors" />
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Explain Notes</h3>
                      <p className="text-slate-400 text-sm">Upload PDF or Images</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>
            <div className="glass-panel border border-white/5 flex flex-col divide-y divide-white/5">
              {[
                { title: "Photosynthesis Explanation", time: "2 hours ago", type: "Chat" },
                { title: "History Chapter 4 Summary", time: "Yesterday", type: "Notes" },
                { title: "Math MCQs Practice", time: "Yesterday", type: "Quiz" },
              ].map((activity, i) => (
                <div key={i} className="p-4 hover:bg-white/5 transition-colors flex justify-between items-center cursor-pointer">
                  <div>
                    <h4 className="font-medium text-sm text-slate-200">{activity.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-white/10 text-slate-300">
                    {activity.type}
                  </span>
                </div>
              ))}
              <div className="p-4 text-center">
                <button className="text-sm text-primary hover:text-primary/80 font-medium">View all history</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
