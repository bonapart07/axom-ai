"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Bot, FileText, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-premium relative overflow-hidden flex flex-col items-center">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full max-w-7xl px-6 py-6 flex items-center justify-between z-10 glass-panel mt-4 rounded-2xl mx-4">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10" />
          <span className="text-xl font-bold tracking-tight">Axom<span className="text-primary">AI</span></span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2.5 text-sm font-medium hover:text-primary transition-colors">
            Login
          </Link>
          <Link href="/signup" className="px-5 py-2.5 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            Start Learning
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl px-6 flex flex-col items-center justify-center text-center z-10 mt-20 mb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-primary/30 text-primary">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Assam&apos;s First AI Study Platform</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            আহক <span className="text-gradient">AIৰ সৈতে আগবাঢ়োঁ,</span> <br />নিজৰ সপোন বাস্তৱ কৰোঁ 💡
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            Your friendly AI teacher that explains complex concepts in simple Assamese. 
            Upload notes, take smart quizzes, and master any subject faster.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard" className="px-8 py-4 text-base font-semibold bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(79,70,229,0.6)] hover:scale-105 active:scale-95">
              Start Learning Now
            </Link>
            <Link href="#features" className="px-8 py-4 text-base font-semibold glass-panel hover:bg-white/10 transition-all rounded-full border border-white/10">
              See How It Works
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          id="features"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full"
        >
          {[
            {
              icon: <Bot className="w-8 h-8 text-blue-400" />,
              title: "AI Chat Assistant",
              desc: "Ask anything and get answers in simple Assamese with helpful examples."
            },
            {
              icon: <FileText className="w-8 h-8 text-purple-400" />,
              title: "Notes Explainer",
              desc: "Upload images or PDFs of your notes and let AI break it down for you."
            },
            {
              icon: <BookOpen className="w-8 h-8 text-green-400" />,
              title: "Smart Practice",
              desc: "Generate MCQs and short questions on any topic to test your knowledge."
            }
          ].map((feat, idx) => (
            <motion.div key={idx} variants={itemVariants} className="p-8 glass-panel flex flex-col items-start text-left hover:-translate-y-2 transition-transform duration-300">
              <div className="p-3 bg-white/5 rounded-xl mb-6">
                {feat.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feat.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
      
      <footer className="w-full py-8 text-center text-slate-500 text-sm z-10 glass-panel rounded-t-3xl border-b-0 border-x-0">
        &copy; {new Date().getFullYear()} Axom AI Study Assistant. All rights reserved.
      </footer>
    </div>
  );
}
