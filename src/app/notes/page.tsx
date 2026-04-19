"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { UploadCloud, FileText, Sparkles, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { logUserActivity } from "@/firebase";
import clsx from "clsx";

export default function NotesPage() {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ summary: string; points: string[] } | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      // 1. Convert file to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result as string;
        // String looks like: "data:image/png;base64,iVBORw0KGgo..."
        const base64Data = base64String.split(",")[1];
        const mimeType = file.type;

        // 2. Fetch from our API
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileData: base64Data, mimeType }),
        });

        const data = await res.json();
        
        if (data.error) throw new Error(data.error);

        setResult(data);
        setIsProcessing(false);
        
        if ((session?.user as any)?.id) {
          logUserActivity((session.user as any).id, "Notes", `Note Summary: ${file.name}`);
        }
      };
      reader.onerror = () => {
        throw new Error("Failed to read file.");
      }
    } catch (error: any) {
      setIsProcessing(false);
      console.error(error);
      alert(error.message || "Failed to analyze document.");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 animate-fade-in w-full max-w-5xl mx-auto py-8">
        <header>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">Notes Explainer</h1>
          </div>
          <p className="text-slate-400">Upload your notes (PDF or Image) and let AI summarize it in simple Assamese.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          
          {/* Upload Section */}
          <div className="flex flex-col gap-4">
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={clsx(
                "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors h-[300px]",
                file ? "border-primary/50 bg-primary/5" : "border-slate-700 hover:border-slate-500 bg-slate-900/30"
              )}
            >
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <UploadCloud className={clsx("w-8 h-8", file ? "text-primary" : "text-slate-400")} />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {file ? file.name : "Drag & Drop your notes here"}
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports PDF, JPG, PNG (Max 10MB)"}
              </p>
              
              <label className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-sm font-medium">
                Browse Files
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,image/*"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
              </label>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || isProcessing}
              className="w-full py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
            >
              {isProcessing ? (
                <>Processing with AI <span className="animate-pulse">...</span></>
              ) : (
                <>Explain This Note <Sparkles className="w-4 h-4 ml-1" /></>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="glass-panel p-6 h-[400px] overflow-y-auto relative rounded-2xl border border-white/10">
            {!result && !isProcessing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                <p>Upload a file to see the AI-generated explanation and summary here.</p>
              </div>
            ) : isProcessing ? (
              <div className="space-y-6 animate-pulse p-4">
                <div className="w-1/3 h-6 bg-slate-800 rounded"></div>
                <div className="w-full h-24 bg-slate-800/50 rounded-xl"></div>
                
                <div className="w-1/4 h-6 bg-slate-800 rounded mt-8"></div>
                <div className="space-y-3">
                  <div className="w-full h-10 bg-slate-800/50 rounded-lg"></div>
                  <div className="w-5/6 h-10 bg-slate-800/50 rounded-lg"></div>
                </div>
              </div>
            ) : result ? (
              <div className="animate-fade-in flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-purple-400" />
                    সাৰাংশ (Summary)
                  </h3>
                  <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl text-slate-200 leading-relaxed">
                    {result.summary}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-3">মুখ্য বিন্দুসমূহ (Key Points)</h3>
                  <ul className="space-y-3">
                    {result.points.map((pt, i) => (
                      <li key={i} className="flex gap-3 items-start bg-white/5 p-3 rounded-lg border border-white/5">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-sm font-bold">
                          {i + 1}
                        </span>
                        <span className="text-slate-200 mt-0.5">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
