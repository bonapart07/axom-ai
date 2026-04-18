"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { BookOpen, Target, ChevronRight, CheckCircle2, RotateCcw } from "lucide-react";

type Question = {
  id: number;
  text: string;
  options: string[];
  correct: number;
};

const mockQuestions: Record<string, Question[]> = {
  "science": [
    {
      id: 1,
      text: "পোহৰৰ বেগ কিমান?",
      options: ["৩ লাখ কি.মি./ছেকেণ্ড", "২ লাখ কি.মি./ছেকেণ্ড", "১.৫ লাখ কি.মি./ছেকেণ্ড", "৩.৫ লাখ কি.মি./ছেকেণ্ড"],
      correct: 0
    },
    {
      id: 2,
      text: "পানীত কি কি মৌল থাকে?",
      options: ["হাইড্ৰ'জেন আৰু ছালফাৰ", "অক্সিজেন আৰু নাইট্ৰ'জেন", "হাইড্ৰ'জেন আৰু অক্সিজেন", "কাৰ্বন আৰু অক্সিজেন"],
      correct: 2
    }
  ]
};

export default function PracticePage() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizState, setQuizState] = useState<"idle" | "playing" | "results">("idle");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      setQuestions(data);
      setQuizState("playing");
      setCurrentQIndex(0);
      setSelectedAnswers({});
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
      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto py-8">
        <header className="text-center mb-4 text-white">
          <div className="inline-flex justify-center items-center p-3 bg-green-500/20 rounded-2xl text-green-400 mb-4 border border-green-500/30">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Practice Mode</h1>
          <p className="text-slate-400">Generate quizzes on any topic instantly to test your knowledge.</p>
        </header>

        {quizState === "idle" && (
          <form onSubmit={handleGenerate} className="glass-panel p-8 rounded-2xl flex flex-col items-center">
            <Target className="w-16 h-16 text-slate-600 mb-6" />
            <h2 className="text-xl font-bold mb-6">What do you want to practice today?</h2>
            
            <div className="w-full relative mb-6">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g. Class 10 Science Chapter 1, History of Assam..."
                className="w-full bg-slate-900/60 border border-slate-700 p-4 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary/50"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="px-8 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] disabled:opacity-50 min-w-[200px]"
            >
              {isGenerating ? "Generating Quiz..." : "Start Practice"}
            </button>
          </form>
        )}

        {quizState === "playing" && questions.length > 0 && (
          <div className="glass-panel p-8 rounded-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <span className="text-slate-400 font-medium tracking-wide text-sm uppercase">
                Question {currentQIndex + 1} of {questions.length}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-primary">
                {topic}
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-8 leading-relaxed">
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
                        ? "border-primary bg-primary/20 text-white" 
                        : "border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-300"
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
                  }
                }}
                disabled={selectedAnswers[currentQIndex] === undefined}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                {currentQIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {quizState === "results" && (
          <div className="glass-panel p-10 rounded-2xl flex flex-col items-center animate-fade-in text-center">
            <CheckCircle2 className="w-20 h-20 text-green-400 mb-6" />
            <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
            <p className="text-slate-400 mb-8">Great job practicing your knowledge.</p>
            
            <div className="flex items-center justify-center gap-4 mb-10 pl-4 pr-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 w-40">
                <p className="text-4xl font-black text-primary mb-1">{calculateScore()}</p>
                <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold">Score</p>
              </div>
              <div className="text-3xl font-light text-slate-600">/</div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 w-40">
                <p className="text-4xl font-black text-white mb-1">{questions.length}</p>
                <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold">Total</p>
              </div>
            </div>

            <button
              onClick={() => {
                setTopic("");
                setQuizState("idle");
              }}
              className="flex items-center gap-2 px-8 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-full hover:bg-white/20 transition-all text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Practice Another Topic
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
