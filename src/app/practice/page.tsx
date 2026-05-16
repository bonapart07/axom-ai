"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { BookOpen, Target, ChevronRight, CheckCircle2, RotateCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { logUserActivity, getUserProfileInfo } from "@/firebase";
import { UpgradeModal } from "@/components/UpgradeModal";
import { db } from "@/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { SUBJECTS, getChapters } from "@/data/syllabus";

type Question = {
  id: number;
  text: string;
  options: string[];
  correct: number;
};

export default function PracticePage() {
  const { data: session } = useSession();
  const [selection, setSelection] = useState({
    class: "",
    subject: "",
    chapter: "",
    count: 10
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [quizState, setQuizState] = useState<"idle" | "playing" | "results">("idle");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [availableChapters, setAvailableChapters] = useState<string[]>([]);
  
  // When class or subject changes, update available chapters
  useEffect(() => {
    if (selection.class && selection.subject) {
      const chapters = getChapters(selection.class, selection.subject);
      setAvailableChapters(chapters);
      setSelection(prev => ({ ...prev, chapter: "" }));
    } else {
      setAvailableChapters([]);
    }
  }, [selection.class, selection.subject]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selection.class || !selection.subject || !selection.chapter) return;

    // Check usage limits
    const userId = (session?.user as any)?.id || (session?.user as any)?.uid;
    if (userId) {
      const profile = await getUserProfileInfo(userId);
      // Practice limit: strictly 2 free trials
      if (profile && profile.plan !== "premium" && !profile.isUnlimited) {
        if ((profile.practiceFreeTrialsUsed || 0) >= 2) {
          setShowUpgradeModal(true);
          return;
        }
      }
    }
    
    setIsGenerating(true);
    
    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selection),
      });

      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      setQuestions(data);
      setQuizState("playing");
      setCurrentQIndex(0);
      setSelectedAnswers({});

      // Increment practice usage for free users
      if (userId) {
        const profile = await getUserProfileInfo(userId);
        if (profile && profile.plan !== "premium" && !profile.isUnlimited) {
          const userRef = doc(db, 'users', userId);
          await updateDoc(userRef, {
            practiceFreeTrialsUsed: increment(1)
          });
        }
      }

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to generate quiz.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQIndex]: optionIndex
    }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  return (
    <DashboardLayout>
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto py-8">
        <header className="text-center mb-4 text-white">
          <div className="inline-flex justify-center items-center p-3 bg-white/10 rounded-2xl text-white mb-4 border border-white/20 shadow-glossy">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">অনুশীলনী (Practice)</h1>
          <p className="text-slate-400">যিকোনো বিষয়ৰ ওপৰত কুইজ সৃষ্টি কৰি নিজৰ জ্ঞান পৰীক্ষা কৰক।</p>
        </header>

        {quizState === "idle" && (
          <form onSubmit={handleGenerate} className="glass-panel p-8 rounded-2xl flex flex-col items-center">
            <Target className="w-12 h-12 text-slate-600 mb-4" />
            <h2 className="text-xl font-bold mb-6 text-center">আপোনাৰ অনুশীলনী নিৰ্বাচন কৰক</h2>
            
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">শ্ৰেণী (Class)</label>
                <select
                  value={selection.class}
                  onChange={(e) => setSelection({...selection, class: e.target.value})}
                  className="w-full bg-black/60 border border-slate-800 p-3 rounded-xl text-white focus:outline-none focus:border-white/50 appearance-none cursor-pointer"
                  required
                >
                  <option value="">শ্ৰেণী বাছক (Select Class)</option>
                  {["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Degree"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">বিষয় (Subject)</label>
                <select
                  value={selection.subject}
                  onChange={(e) => setSelection({...selection, subject: e.target.value})}
                  className="w-full bg-black/60 border border-slate-800 p-3 rounded-xl text-white focus:outline-none focus:border-white/50 appearance-none cursor-pointer"
                  required
                >
                  <option value="">বিষয় বাছক (Select Subject)</option>
                  {SUBJECTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">অধ্যায় (Chapter)</label>
                <select
                  value={selection.chapter}
                  onChange={(e) => setSelection({...selection, chapter: e.target.value})}
                  className="w-full bg-black/60 border border-slate-800 p-3 rounded-xl text-white focus:outline-none focus:border-white/50 appearance-none cursor-pointer"
                  required
                  disabled={!selection.subject}
                >
                  <option value="">{selection.subject ? "অধ্যায় বাছক (Select Chapter)" : "প্ৰথমে বিষয় বাছক"}</option>
                  {availableChapters.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">প্ৰশ্নৰ সংখ্যা (Number of MCQs)</label>
                <select
                  value={selection.count}
                  onChange={(e) => setSelection({...selection, count: parseInt(e.target.value)})}
                  className="w-full bg-black/60 border border-slate-800 p-3 rounded-xl text-white focus:outline-none focus:border-white/50 appearance-none cursor-pointer"
                >
                  {[10, 20, 30, 40, 50].map(n => (
                    <option key={n} value={n}>{n} টা প্ৰশ্ন</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isGenerating || !selection.class || !selection.subject || !selection.chapter}
              className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.4)] disabled:opacity-50 min-w-[240px] flex items-center justify-center gap-2 group"
            >
              {isGenerating ? "কুইজ প্ৰস্তুত কৰা হৈছে..." : (
                <>
                  অনুশীলনী আৰম্ভ কৰক
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        {quizState === "playing" && questions.length > 0 && (
          <div className="glass-panel p-8 rounded-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <span className="text-slate-400 font-medium tracking-wide text-sm uppercase">
                প্ৰশ্ন {currentQIndex + 1} / {questions.length}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-white">
                {selection.class} • {selection.subject} • {selection.chapter}
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-8 leading-relaxed text-white">
              {questions[currentQIndex].text}
            </h3>

            <div className="space-y-4">
              {questions[currentQIndex].options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected 
                        ? "border-white bg-white/20 text-white shadow-glossy" 
                        : "border-slate-800 bg-black/40 hover:bg-white/10 text-slate-300"
                    }`}
                  >
                    <span className="inline-block w-8 font-bold opacity-50">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  if (currentQIndex < questions.length - 1) {
                    setCurrentQIndex(currentQIndex + 1);
                  } else {
                    setQuizState("results");
                    const userId = (session?.user as any)?.id;
                    if (userId) {
                      const finalScore = calculateScore();
                      logUserActivity(userId, "Quiz", `Practice: ${selection.subject} - ${selection.chapter}`, { score: finalScore, total: questions.length });
                    }
                  }
                }}                
                disabled={selectedAnswers[currentQIndex] === undefined}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                {currentQIndex === questions.length - 1 ? "কুইজ সমাপ্ত কৰক" : "পৰৱৰ্তী প্ৰশ্ন"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {quizState === "results" && (
          <div className="glass-panel p-10 rounded-2xl flex flex-col items-center animate-fade-in text-center">
            <CheckCircle2 className="w-20 h-20 text-white mb-6" />
            <h2 className="text-3xl font-bold mb-2 text-white">কুইজ সমাপ্ত!</h2>
            <p className="text-slate-400 mb-8">আপোনাৰ জ্ঞানৰ অনুশীলনী কৰাৰ বাবে ধন্যবাদ।</p>
            
            <div className="flex items-center justify-center gap-4 mb-10 pl-4 pr-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 w-40 shadow-glossy">
                <p className="text-4xl font-black text-white mb-1">{calculateScore()}</p>
                <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold">নম্বৰ</p>
              </div>
              <div className="text-3xl font-light text-slate-600">/</div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 w-40 shadow-glossy">
                <p className="text-4xl font-black text-white mb-1">{questions.length}</p>
                <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold">সৰ্বমুঠ</p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelection({...selection, chapter: ""});
                setQuizState("idle");
              }}
              className="flex items-center gap-2 px-8 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-full hover:bg-white/20 transition-all text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              অন্য এটা বিষয় অনুশীলন কৰক
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
