"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, Copy, BookOpen, Languages, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { logUserActivity } from "@/firebase";
import clsx from "clsx";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

// Mock responses for MVP without real API
const getMockResponse = (input: string) => {
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes("photosynthesis") || lowerInput.includes("plant")) {
    return "ফটোচিন্থেছিছ (Photosynthesis) হ'ল এনে এটা প্ৰক্ৰিয়া য'ত গছে সূৰ্যৰ পোহৰ, পানী আৰু কাৰ্বন ডাই-অক্সাইড ব্যৱহাৰ কৰি নিজৰ খাদ্য প্ৰস্তুত কৰে।\n\nউদাহৰণস্বৰূপে: মেৰামতিত যিদৰে আমি জুইশালত খাদ্য বনাওঁ, তেনেকৈ গছৰ পাতবোৰে সূৰ্যৰ তাপত খাদ্য প্ৰস্তুত কৰে।";
  } else if (lowerInput.includes("newton")) {
    return "নিউটনৰ গতিৰ প্ৰথম সূত্ৰটো হ'ল: যদি কোনো বস্তুত বাহিৰৰ পৰা বল প্ৰয়োগ কৰা নহয়, তেন্তে স্থিৰ বস্তু সদায় স্থিৰ অৱস্থাতেই থাকিব আৰু গতিশীল বস্তু সদায় একে বেগত গতি কৰি থাকিব। ইয়াকে জড়তাৰ সূত্ৰ (Law of Inertia) বুলিও কোৱা হয়।";
  } else {
    return "মই বুজি পাইছোঁ! আপুনি এই বিষয়ে সুধিছে। এতিয়া মই এটা Mock AI, গতিকে এইটো মোৰ সাধাৰণ উত্তৰ। যেতিয়া প্ৰকৃত API সংযোগ কৰা হ'ব, মই আপোনাক সকলো প্ৰশ্নৰ উত্তৰ অসমীয়াত সুন্দৰকৈ বুজাই দিম!";
  }
};

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "নমস্কাৰ! মই আপোনাৰ Axom AI সহায়ক। আজি মই আপোনাক কিহত সহায় কৰিব পাৰোঁ? (যিকোনো বিষয় সুধিব পাৰে)"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });

      const data = await res.json();
      setIsTyping(false);
      
      if (data.reply) {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.reply }]);
        
        // Log the activity to Dashboard
        if ((session?.user as any)?.id) {
          logUserActivity((session.user as any).id, "Chat", userMsg.content);
        }
      } else {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Error: " + (data.error || "Unknown Error") }]);
      }
    } catch (error) {
      setIsTyping(false);
      console.error(error);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Network error occurred." }]);
    }
  };

  const handleActionClick = async (action: string, msgContent: string) => {
    if (action === "copy") {
      navigator.clipboard.writeText(msgContent);
      // Optional: Add some tiny UI feedback later if needed
      return;
    }

    let prompt = "";
    if (action === "simplify") prompt = `Please simplify this explanation further in Assamese so a young student can easily understand: "${msgContent}"`;
    if (action === "english") prompt = `Please translate and explain this previous response completely in English: "${msgContent}"`;
    if (action === "example") prompt = `Please provide a clear, real-life example for this concept in Assamese: "${msgContent}"`;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();
      setIsTyping(false);
      
      if (data.reply) {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.reply }]);
        
        if ((session?.user as any)?.id) {
          logUserActivity((session.user as any).id, "Chat", `Action: ${action}`);
        }
      } else {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Error: " + (data.error || "Unknown Error") }]);
      }
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Network error occurred." }]);
    }
  };

  const ActionButton = ({ icon: Icon, text, onClick }: { icon: React.ElementType, text: string, onClick: () => void }) => (
    <button onClick={onClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
      <Icon className="w-3.5 h-3.5" />
      {text}
    </button>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in relative z-10 w-full max-w-4xl mx-auto glass-panel border-white/10 mt-4 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">AI Teacher</h2>
            <div className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Always ready to help
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={clsx("flex flex-col", msg.role === "user" ? "items-end" : "items-start")}>
              <div className={clsx(
                "max-w-[85%] rounded-2xl p-4 shadow-sm",
                msg.role === "user" 
                  ? "bg-primary text-white rounded-br-sm" 
                  : "glass-panel bg-slate-800/60 rounded-bl-sm border border-slate-700/50 text-slate-200"
              )}>
                <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</div>
              </div>
              
              {/* Context Actions for Assistant */}
              {msg.role === "assistant" && msg.id !== "welcome" && (
                <div className="flex flex-wrap gap-2 mt-2 ml-2">
                  <ActionButton icon={Sparkles} text="Simplify More" onClick={() => handleActionClick("simplify", msg.content)} />
                  <ActionButton icon={Languages} text="Explain in English" onClick={() => handleActionClick("english", msg.content)} />
                  <ActionButton icon={BookOpen} text="Give Example" onClick={() => handleActionClick("example", msg.content)} />
                  <ActionButton icon={Copy} text="Copy" onClick={() => handleActionClick("copy", msg.content)} />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex flex-col items-start">
              <div className="glass-panel bg-slate-800/60 rounded-2xl rounded-bl-sm p-4 w-20 flex justify-center border border-slate-700/50 delay-75">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
          <form onSubmit={handleSend} className="relative flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask your question here... (e.g. What is Photosynthesis?)"
                className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl py-3 pl-4 pr-12 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 min-h-[52px] max-h-[120px] resize-none"
                rows={1}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="h-[52px] w-[52px] flex items-center justify-center bg-primary rounded-xl text-white hover:bg-primary/90 transition-all disabled:opacity-50 shadow-[0_0_10px_rgba(79,70,229,0.3)] shrink-0"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-slate-500">AI can make mistakes. Consider verifying important information.</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
