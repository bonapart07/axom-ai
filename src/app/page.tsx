"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BookOpen, Bot, FileText, Sparkles, GraduationCap, 
  Zap, Trophy, Shield, HelpCircle, ArrowRight, 
  MessageSquare, User, Briefcase, Award, Languages, PhoneCall 
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
      <nav className="w-full max-w-7xl px-4 md:px-6 py-4 md:py-6 flex items-center justify-between z-10 glass-panel mt-2 md:mt-4 rounded-2xl mx-2 md:mx-4">
        <Link href="/" className="flex items-center gap-2 md:gap-3 group">
          <Logo className="w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-105" />
          <span className="text-lg md:text-xl font-bold tracking-tight">Axom<span className="text-primary">AI</span></span>
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <Link 
              href="/dashboard" 
              className="px-4 md:px-6 py-2 text-xs md:text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)] whitespace-nowrap text-center flex items-center gap-2 hover:scale-[1.03] active:scale-95"
            >
              <span>Go to Dashboard</span>
              {session.user?.image ? (
                <img src={session.user.image} alt="User" className="w-5 h-5 rounded-full object-cover border border-white/20" />
              ) : (
                <span className="text-sm">🎓</span>
              )}
            </Link>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/login" className="px-3 md:px-5 py-2 text-sm font-medium hover:text-primary transition-colors text-center">
                Login
              </Link>
              <Link href="/signup" className="px-4 md:px-6 py-2 text-xs md:text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)] whitespace-nowrap text-center">
                Start Learning
              </Link>
            </div>
          )}
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
            <span className="text-sm font-medium text-center">Assam&apos;s First AI Study Platform</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-white">
            আহক <span className="text-gradient">AI ৰ সৈতে আগবাঢ়োঁ,</span> <br />নিজৰ সপোন বাস্তৱ কৰোঁ 💡
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-base md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            Your friendly AI teacher that explains complex concepts in simple Assamese. 
            Upload notes, take smart quizzes, and master any subject faster.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0 mb-16">
            <Link href="/dashboard" className="w-full sm:w-auto text-center px-8 py-4 text-base font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(79,70,229,0.6)] hover:scale-105 active:scale-95">
              Start Learning Now
            </Link>
            <Link href="#why-axom" className="w-full sm:w-auto text-center px-8 py-4 text-base font-semibold glass-panel hover:bg-white/10 transition-all rounded-full border border-white/10">
              See How It Works
            </Link>
          </motion.div>
        </motion.div>

        {/* 1. TRUST STATS SECTION */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full max-w-5xl"
        >
          {[
            { value: "5,00,000+", label: "AI Questions Solved", color: "from-blue-500/10 to-purple-500/10" },
            { value: "25,000+", label: "Students Learning", color: "from-indigo-500/10 to-cyan-500/10" },
            { value: "1,20,000+", label: "Notes Analyzed", color: "from-purple-500/10 to-pink-500/10" },
            { value: "80,000+", label: "Practice Tests Generated", color: "from-emerald-500/10 to-teal-500/10" }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`p-6 glass-panel flex flex-col items-center text-center bg-gradient-to-br ${stat.color} border-white/10 hover:border-primary/30 hover:shadow-[0_0_25px_rgba(79,70,229,0.2)] transition-all duration-300 hover:-translate-y-1.5`}
            >
              <span className="text-2xl md:text-4xl font-black text-white tracking-tight mb-2">{stat.value}</span>
              <span className="text-xs md:text-sm text-slate-400 font-semibold leading-relaxed">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* 2. WHY AXOM AI SECTION */}
        <motion.div
          id="why-axom"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mt-36 max-w-6xl"
        >
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest mb-3 block">Why Choose Us?</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white">Why Axom AI?</h2>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Empowering Assamese students with premium, localized, and modern AI learning tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Assamese AI Learning",
                desc: "The only platform offering complex science, math, and board explanations in highly natural, simple Assamese.",
                icon: "🗣️"
              },
              {
                title: "Rural-Friendly Education",
                desc: "Designed to operate flawlessly on basic mobile networks, bringing elite virtual study support to every remote school.",
                icon: "🏡"
              },
              {
                title: "Career Guidance",
                desc: "AI mentors guiding students on modern career fields, online freelancing, and skills tailored to regional opportunities.",
                icon: "🚀"
              },
              {
                title: "AI Study Assistant",
                desc: "A smart 24/7 teacher that breaks down textbooks, writes key bullet points, and solves doubts instantly.",
                icon: "🤖"
              },
              {
                title: "Smart Practice",
                desc: "Generates custom mock quizzes, board syllabus questions, and entrance practice assessments in seconds.",
                icon: "🎯"
              },
              {
                title: "Personalized Learning",
                desc: "Analyzes student activity and quiz scores to identify weak subject areas and optimize preparation.",
                icon: "📈"
              }
            ].map((why, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="p-8 glass-panel border-white/10 hover:border-primary/30 transition-all duration-300 text-left hover:-translate-y-1 bg-white/[0.02]"
              >
                <span className="text-4xl mb-4 block">{why.icon}</span>
                <h3 className="text-xl font-bold mb-3 text-white">{why.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{why.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 3. AI CHAT DEMO PREVIEW */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mt-36 max-w-4xl glass-panel p-6 md:p-8 border-white/15 relative overflow-hidden bg-black/60 shadow-[0_0_40px_rgba(79,70,229,0.2)] rounded-3xl"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 blur-[50px] pointer-events-none rounded-full" />
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Live AI Interactive Preview</span>
          </div>

          <div className="space-y-6">
            {/* Student input */}
            <div className="flex flex-col items-end">
              <div className="bg-primary text-white rounded-2xl rounded-br-sm p-4 max-w-[85%] text-sm md:text-base font-semibold shadow-md text-left">
                What is photosynthesis?
              </div>
              <span className="text-[10px] text-slate-500 mt-1.5 mr-1 font-medium">Student (Class 10 SEBA)</span>
            </div>

            {/* AI response */}
            <div className="flex flex-col items-start">
              <div className="glass-panel bg-white/5 border-white/10 rounded-2xl rounded-bl-sm p-5 max-w-[85%] text-sm md:text-base text-slate-200 leading-relaxed text-left">
                <div className="flex items-center gap-2 mb-3 font-bold text-primary text-xs uppercase tracking-wider">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  Axom AI Assistant
                </div>
                <b>সালোক-সংশ্লেষণ (Photosynthesis):</b>
                <br/><br/>
                <b>১. সংজ্ঞা:</b> যি প্ৰক্ৰিয়াত সেউজীয়া উদ্ভিদে সূৰ্যৰ পোহৰ আৰু ক্ল’ৰ’ফিলৰ উপস্থিতিত বায়ুমণ্ডলৰ পৰা লোৱা কাৰ্বন ডাই-অক্সাইড আৰু মাটিৰ পৰা শোষণ কৰা পানীৰ মাজত বিক্ৰিয়া ঘটাই কাৰ্বহাইড্ৰেট বা গ্লুক’জ জাতীয় খাদ্য প্ৰস্তুত কৰে আৰু উপজাত পদাৰ্থ হিচাপে অক্সিজেন বায়ুমণ্ডললৈ এৰি দিয়ে, তাক সালোক-সংশ্লেষণ বোলে।
                <br/><br/>
                <b>২. ৰাসায়নিক সমীকৰণ:</b>
                <br/>
                <code className="block bg-black/40 p-2 rounded my-1 text-xs">6CO₂ + 6H₂O + সূৰ্যৰ পোহৰ + ক্ল’ৰ’ফিল → C₆H₁₂O₆ + 6O₂</code>
                <br/>
                <b>৩. প্ৰয়োজনীয় উপাদানসমূহ:</b>
                <br/>
                • কাৰ্বন ডাই-অক্সাইড (CO₂)<br/>
                • পানী (H₂O)<br/>
                • সূৰ্যৰ পোহৰ<br/>
                • ক্ল’ৰ’ফিল
              </div>
              <span className="text-[10px] text-slate-500 mt-1.5 ml-1 font-medium">Axom AI virtual Tutor</span>
            </div>
          </div>
        </motion.div>

        {/* 4. HOW IT WORKS SECTION */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mt-36 max-w-5xl"
        >
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest mb-3 block">Simple Setup</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white">How It Works</h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Master any subject in three simple steps.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
            {/* Gradient connecting line */}
            <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 hidden md:block -z-10" />

            {[
              { step: "01", title: "Ask or Upload", desc: "Type your query in simple Assamese or upload images/PDFs of your textbook notes easily." },
              { step: "02", title: "AI Explains", desc: "Axom AI breaks down difficult ideas into highly simple bullet points with real-life comparisons." },
              { step: "03", title: "Practice & Improve", desc: "Take smart mock quizzes on the topic to evaluate your knowledge and master the chapter." }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="p-8 glass-panel border-white/10 hover:border-primary/20 transition-all text-center flex flex-col items-center bg-black/40"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-xl font-extrabold text-primary mb-6 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 5. BUILT FOR ASSAM SECTION */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mt-36 max-w-6xl glass-panel p-8 md:p-12 border-white/15 bg-gradient-to-r from-black/85 to-slate-950/60 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center rounded-3xl"
        >
          {/* Assam glowing accent */}
          <div className="absolute -right-20 w-64 h-64 bg-primary/15 blur-[90px] rounded-full pointer-events-none" />

          <div className="flex-1 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2.5 block">Our Sacred Mission</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              Built Specially for <br/><span className="text-gradient">Assam&apos;s Bright Future</span> 🌾
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6 text-base md:text-lg">
              Every child in Assam, from the busy classrooms of Guwahati to the remotest schools of Dhemaji, deserves elite guidance. We are on a mission to completely eliminate the regional language barrier in digital technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2.5 text-slate-300 text-sm font-semibold">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full shrink-0" /> Assamese Local Language Explanations
              </div>
              <div className="flex items-center gap-2.5 text-slate-300 text-sm font-semibold">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full shrink-0" /> Light-weight Design for Rural Networks
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 flex-shrink-0 relative">
            <div className="glass-panel p-6 border-white/10 text-center relative rotate-2 shadow-2xl bg-slate-950/90 max-w-sm mx-auto">
              <span className="text-6xl mb-4 block">🏡</span>
              <h4 className="text-lg font-bold text-white mb-2">100% Vernacular</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Proudly crafted in Assam. Bridging rural classrooms using advanced, simple Assamese AI instructions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 6. COMPREHENSIVE FEATURES GRID */}
        <motion.div
          id="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mt-36"
        >
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest mb-3 block">Intelligent Workspace</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white">Our Premium Features</h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Explore powerful, robust study tools built to elevate your academy preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {[
              {
                icon: <Bot className="w-8 h-8 text-blue-400 animate-pulse" />,
                title: "AI Chat Assistant",
                desc: "Ask anything and get answers in simple Assamese with helpful everyday comparisons.",
                isOriginal: true
              },
              {
                icon: <FileText className="w-8 h-8 text-purple-400" />,
                title: "Notes Explainer",
                desc: "Upload images or PDFs of your school notes and let AI break it down for you instantly.",
                isOriginal: true
              },
              {
                icon: <BookOpen className="w-8 h-8 text-green-400" />,
                title: "Smart Practice",
                desc: "Generate custom MCQs and short practice questions on any topic to test your knowledge.",
                isOriginal: true
              },
              {
                icon: <MessageSquare className="w-8 h-8 text-rose-400" />,
                title: "Mock Interviews",
                desc: "Practice school viva-voce and college entrance interviews with interactive AI voice logic."
              }
            ].map((feat, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants} 
                className={`p-8 glass-panel flex flex-col items-start text-left hover:-translate-y-2 transition-transform duration-300 ${feat.isOriginal ? 'border-primary/20 bg-primary/[0.01]' : 'border-white/10'}`}
              >
                <div className="p-3 bg-white/5 rounded-xl mb-6">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  {feat.title}
                  {feat.isOriginal && <span className="bg-primary/20 text-primary text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">Core</span>}
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 7. STUDENT TESTIMONIALS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mt-36 max-w-6xl"
        >
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest mb-3 block">Student Voice</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white">Beloved by Students</h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Read inspiring success stories from pupils across different districts of Assam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Rahul Das", district: "Jorhat", review: "Axom AI is a lifesaver. Explaining complicated science laws in simple Assamese with real-life comparisons helped me score 92% in my school examinations!" },
              { name: "Priya Borah", district: "Kamrup", review: "The Notes Explainer is incredible. I just upload a snap of my handwritten chemistry textbook pages, and I get a simple Assamese study map instantly." },
              { name: "Abhijit Gogoi", district: "Dibrugarh", review: "The AI Chat feature showed me how to learn prompt engineering and start web coding from home. This is the future of learning!" }
            ].map((t, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="p-8 glass-panel border-white/10 bg-slate-950/30 hover:border-primary/20 transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-yellow-500 text-sm mb-4">⭐⭐⭐⭐⭐</div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>
                <div className="border-t border-white/5 pt-4">
                  <h4 className="font-bold text-white text-sm">{t.name}</h4>
                  <span className="text-xs text-primary font-semibold">{t.district} District</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sections 8 & 9 removed (Future Skills and Daily Challenges) */}

        {/* 10. MOBILE APP PREVIEW */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mt-36 max-w-5xl glass-panel p-8 border-white/10 relative overflow-hidden bg-gradient-to-r from-indigo-950/20 to-purple-950/20 rounded-3xl flex flex-col md:flex-row gap-8 items-center"
        >
          <div className="flex-1 text-left">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider mb-3 inline-block">Android Mobile App</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              Axom AI on the Go!
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6 text-sm md:text-base">
              Study anywhere, anytime. Download notes explanations, practice quizzes offline, and chat with your friendly AI tutor on our robust, lightweight mobile application.
            </p>
            <span className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 select-none shadow-[0_0_15px_rgba(255,255,255,0.1)] border-primary/30 text-primary">
              <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse" /> Coming Soon to Google Play Store
            </span>
          </div>

          <div className="w-72 flex-shrink-0 flex justify-center mt-6 md:mt-0">
            {/* Mock phone screenshot */}
            <div className="w-56 h-[380px] border-[5px] border-slate-800 rounded-[32px] bg-black shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2.5 relative overflow-hidden flex flex-col justify-between select-none">
              <div className="w-20 h-3.5 bg-slate-800 rounded-full mx-auto -mt-1.5 mb-2.5 z-20" />
              
              <div className="flex-1 rounded-[22px] bg-gradient-premium relative overflow-hidden p-3 flex flex-col justify-between border border-white/5">
                <div className="flex justify-between items-center text-[7px] text-slate-500 font-bold">
                  <span>Axom AI Mobile</span>
                  <span className="text-green-400 flex items-center gap-0.5">
                    <span className="w-1 h-1 bg-green-400 rounded-full" /> Connected
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
                  <Logo className="w-10 h-10" />
                  <h4 className="text-[10px] font-black text-white leading-tight">আহক AI ৰ সৈতে আগবাঢ়োঁ</h4>
                  <span className="text-[7px] text-slate-400 uppercase tracking-widest">Board Exam Prep</span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-2 text-left">
                  <span className="text-[7px] text-primary font-bold block mb-0.5">Assamese AI Explainer</span>
                  <p className="text-[6.5px] text-slate-300 leading-normal">
                    ফটোচিন্থেছিছ হ&apos;ল গছৰ খাদ্য তৈয়াৰ কৰা প্ৰক্ৰিয়া...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 11. SEO FAQ SECTION */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mt-36 max-w-4xl"
        >
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest mb-3 block flex justify-center items-center gap-1">
              <HelpCircle className="w-4 h-4" /> Commonly Asked Queries
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Find answers to understand how Axom AI assists students and schools throughout Assam.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: "What is Axom AI?", a: "Axom AI is Assam's first AI-powered study platform, specifically built to explain complex syllabus concepts (science, math, geography, history) in simple Assamese to help students study smart and score higher on board examinations." },
              { q: "How does AI learning work?", a: "Students can type questions directly, explain dynamic topics, or upload notes (PDFs or images). Axom AI analyzes the materials and instantly structures simplified, board-compliant summaries and mock practice tests." },
              { q: "Can students learn in Assamese?", a: "Yes! Axom AI is designed specifically for vernacular medium students in Assam, breaking the complex English text language barrier down into standard everyday Assamese with real-life comparisons." },
              { q: "Is Axom AI free?", a: "Axom AI offers a generous free tier containing 5 daily query assists. To unlock unlimited practice quizzes, longer notes summaries, and priority AI access, students can upgrade to Premium for just ₹49/month." },
              { q: "Who can use Axom AI?", a: "Any student from Class 6 up to Degree level, as well as SEBA/AHSEC board examinees looking for high-quality practice guides and career counseling, can use Axom AI." }
            ].map((faq, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="p-6 glass-panel border-white/10 text-left bg-slate-950/20"
              >
                <h3 className="text-base md:text-lg font-bold text-white mb-2 flex items-start gap-2">
                  <span className="text-primary font-black">Q.</span> {faq.q}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed pl-6 border-l border-white/10">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      
      {/* 12. IMPROVED FOOTER */}
      <footer className="w-full mt-36 z-10 glass-panel rounded-t-3xl border-b-0 border-x-0 bg-black/85 backdrop-blur-xl border-white/10 p-8 md:p-12 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="text-lg font-bold tracking-tight text-white">Axom<span className="text-primary">AI</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Assam&apos;s first AI-powered virtual academy. Breaking vernacular education barriers and enabling next-generation career learning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Student Login</Link></li>
              <li><Link href="/signup" className="hover:text-primary transition-colors">Start Learning</Link></li>
            </ul>
          </div>

          {/* Legal & Terms */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Legals</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Contact & Support</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Guwahati, Kamrup Metropolitan, Assam, India.
            </p>
            <span className="text-xs font-bold text-primary block mb-2">raxgamer84@gmail.com</span>
            <div className="flex gap-3.5 mt-3 text-slate-500">
              <a href="https://facebook.com" className="hover:text-white transition-colors text-sm">🌐 Facebook</a>
              <a href="https://twitter.com" className="hover:text-white transition-colors text-sm">🐦 Twitter</a>
              <a href="https://instagram.com" className="hover:text-white transition-colors text-sm">📷 Instagram</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-slate-500 text-xs font-medium">
          &copy; {new Date().getFullYear()} Axom AI Study Assistant. All rights reserved. Crafted with ❤️ in Assam.
        </div>
      </footer>
    </div>
  );
}
