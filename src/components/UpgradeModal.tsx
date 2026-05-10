import { X, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

type UpgradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-8 overflow-hidden bg-slate-900 border border-primary/30 rounded-3xl shadow-[0_0_40px_rgba(79,70,229,0.3)]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none" />

        <div className="relative flex flex-col items-center text-center z-10">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/30 mb-6 shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <Zap className="w-8 h-8 text-primary animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">
            সীমা শেষ হৈছে!
          </h2>
          
          <p className="text-slate-300 leading-relaxed mb-8">
            আপোনাৰ দৈনিক বিনামূলীয়া ব্যৱহাৰৰ সীমা (৫ টা প্ৰশ্ন) শেষ হৈছে। কোনো বাধা নোহোৱাকৈ Axom AI ব্যৱহাৰ কৰিবলৈ প্ৰিমিয়াম প্লেনলৈ আপগ্ৰেড কৰক।
          </p>

          <Link 
            href="/profile"
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg mb-3"
          >
            <Sparkles className="w-5 h-5" />
            প্ৰিমিয়ামলৈ আপগ্ৰেড কৰক
          </Link>
          
          <button 
            onClick={onClose}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            এতিয়া নালাগে (Not now)
          </button>
        </div>
      </div>
    </div>
  );
}
