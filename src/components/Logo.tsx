export function Logo({ className = "w-8 h-8", variant = "default" }: { className?: string, variant?: "default" | "white" }) {
  const isWhite = variant === "white";

  return (
    <div className={`relative flex-shrink-0 flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
      >
        <defs>
          <linearGradient id="glossyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="50%" stopColor="#888888" stopOpacity="1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="mirrorHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base Circle */}
        {!isWhite && (
          <>
            <circle cx="50" cy="50" r="48" fill="url(#glossyGradient)" />
            <circle cx="50" cy="50" r="48" fill="url(#mirrorHighlight)" />
          </>
        )}
        <circle cx="50" cy="50" r="46" fill={isWhite ? "transparent" : "#000000"} />
        
        {/* Japi Conical Hat Shape */}
        <path 
          d="M 50 20 L 85 65 Q 50 80 15 65 Z" 
          fill={isWhite ? "transparent" : "url(#glossyGradient)"} 
          stroke={isWhite ? "#ffffff" : "none"}
          strokeWidth={isWhite ? "2" : "0"}
        />
        {!isWhite && (
          <path 
            d="M 50 20 L 85 65 Q 50 80 15 65 Z" 
            fill="url(#mirrorHighlight)" 
          />
        )}
        
        {/* Japi Bottom Brim Detail */}
        <path 
          d="M 10 65 Q 50 85 90 65 Q 50 75 10 65" 
          fill={isWhite ? "#ffffff" : "#ffffff"} 
        />

        {/* Japi Top Decoration (Tassel approximation) */}
        <circle cx="50" cy="18" r="4" fill="#ffffff" />
        
        {/* Abstract Tech Lines over Japi */}
        <path d="M 50 20 L 50 72" stroke="#ffffff" strokeWidth="2" strokeOpacity={isWhite ? "1" : "0.5"} />
        <path d="M 32 42 L 68 42" stroke="#ffffff" strokeWidth="2" strokeOpacity={isWhite ? "1" : "0.5"} />
        <path d="M 23 55 L 77 55" stroke="#ffffff" strokeWidth="2" strokeOpacity={isWhite ? "1" : "0.5"} />
      </svg>
    </div>
  );
}
