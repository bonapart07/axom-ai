"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { ArrowRightLeft, Languages, Copy, Check } from "lucide-react";
import clsx from "clsx";

export default function TranslatePage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [direction, setDirection] = useState<"en-as" | "as-en">("en-as");
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: inputText, 
          targetLanguage: direction === "en-as" ? "as" : "en" 
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setOutputText(data.translation);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setDirection(prev => prev === "en-as" ? "as-en" : "en-as");
    setInputText(outputText);
    setOutputText("");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-8">
        <header className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <Languages className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">Language Converter</h1>
          </div>
          <p className="text-slate-400">Translate any text seamlessly between Assamese and English.</p>
        </header>

        <div className="glass-panel rounded-3xl p-1 flex flex-col md:flex-row shadow-2xl relative">
          
          {/* Controls Bar (Mobile) / Middle Swap (Desktop) */}
          <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 flex justify-center py-4 md:py-0 border-b md:border-b-0 border-white/5 mx-4 md:mx-0">
            <button 
              onClick={handleSwap}
              className="p-3 bg-primary rounded-full hover:bg-primary/90 transition-all text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] md:hover:rotate-180 duration-500"
            >
              <ArrowRightLeft className="w-5 h-5 mx-2" />
            </button>
          </div>

          {/* Left Panel */}
          <div className="flex-1 flex flex-col p-6 min-h-[300px] border-r border-white/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
                {direction === "en-as" ? "English" : "Assamese"}
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Type something in ${direction === "en-as" ? "English" : "Assamese"}...`}
              className="w-full flex-1 bg-transparent border-none resize-none focus:outline-none text-xl leading-relaxed text-slate-200 placeholder-slate-600"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleTranslate}
                disabled={!inputText.trim() || isTranslating}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all text-sm disabled:opacity-50"
              >
                {isTranslating ? "Translating..." : "Translate"}
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col p-6 min-h-[300px] bg-slate-900/30 rounded-r-3xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
                {direction === "en-as" ? "Assamese" : "English"}
              </span>
              {outputText && (
                <button 
                  onClick={handleCopy}
                  className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-colors flex items-center gap-1 text-xs"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>
            <div className={clsx("flex-1 text-xl leading-relaxed", !outputText ? "text-slate-600" : "text-white")}>
              {outputText ? (
                <p className="animate-fade-in">{outputText}</p>
              ) : (
                <p className="italic">Translation will appear here...</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
