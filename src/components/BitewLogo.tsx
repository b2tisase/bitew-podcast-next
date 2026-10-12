import React from 'react';

interface BitewLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  withSubtitle?: boolean;
  className?: string;
}

export const BitewLogo: React.FC<BitewLogoProps> = ({
  size = 'md',
  withSubtitle = false,
  className = '',
}) => {
  // Size dimensions for emblem
  const dimMap = {
    sm: { box: 'w-9 h-9 sm:w-10 sm:h-10', radius: 'rounded-xl', icon: 38 },
    md: { box: 'w-12 h-12', radius: 'rounded-xl', icon: 48 },
    lg: { box: 'w-18 h-18 sm:w-20 sm:h-20', radius: 'rounded-2xl', icon: 80 },
    hero: { box: 'w-24 h-24 sm:w-28 sm:h-28', radius: 'rounded-3xl', icon: 110 },
  };

  const currentDim = dimMap[size];

  return (
    <div className={`inline-flex flex-col items-center justify-center shrink-0 ${className}`}>
      {/* Metallic Badge Container */}
      <div
        className={`relative ${currentDim.box} ${currentDim.radius} p-0.5 overflow-hidden shadow-xl shadow-purple-950/50 transition-transform duration-300 group-hover:scale-105`}
        style={{
          background: 'linear-gradient(135deg, #e2e8f0 0%, #38bdf8 25%, #6366f1 50%, #1e1b4b 75%, #0f172a 100%)',
        }}
      >
        {/* Inner Metallic Bevel */}
        <div
          className={`w-full h-full ${currentDim.radius} bg-[#0b0c1b] flex items-center justify-center relative overflow-hidden`}
          style={{
            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), inset 0 -2px 6px rgba(0, 0, 0, 0.8)',
          }}
        >
          {/* Subtle brushed metal background shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/90 via-[#0f172a]/95 to-[#1e1b4b]/80" />

          {/* Radial cyan/silver glow behind letter */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.25)_0%,rgba(99,102,241,0.1)_50%,transparent_80%)]" />

          {/* Official Emblem Vector Graphics: Stylized B with Encircled Sound Waves */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full relative z-10 p-1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Metallic Silver Gradient */}
              <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="75%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#f8fafc" />
              </linearGradient>

              {/* Electric Blue / Cyan Glow Gradient */}
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>

              {/* Specular highlight */}
              <linearGradient id="bevelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#64748b" stopOpacity="0.1" />
              </linearGradient>

              <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Sound Wave Rings (Left Side) */}
            {/* Wave 1 - Inner */}
            <path
              d="M 28 36 C 24 40, 24 60, 28 64"
              stroke="url(#waveGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* Wave 2 - Outer */}
            <path
              d="M 21 28 C 14 36, 14 64, 21 72"
              stroke="url(#waveGrad)"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Wave 3 - Distant faint */}
            <path
              d="M 14 22 C 5 33, 5 67, 14 78"
              stroke="url(#waveGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.3"
            />

            {/* Sound Wave Rings (Right Side) */}
            {/* Wave 1 - Inner */}
            <path
              d="M 72 36 C 76 40, 76 60, 72 64"
              stroke="url(#waveGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* Wave 2 - Outer */}
            <path
              d="M 79 28 C 86 36, 86 64, 79 72"
              stroke="url(#waveGrad)"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Wave 3 - Distant faint */}
            <path
              d="M 86 22 C 95 33, 95 67, 86 78"
              stroke="url(#waveGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.3"
            />

            {/* The Stylized Capital 'B' Emblem */}
            {/* Main Outer Structure */}
            <path
              d="M 36 22 
                 H 55 
                 C 63 22, 68 26, 68 34 
                 C 68 40, 64 44, 58 47 
                 C 66 50, 70 55, 70 64 
                 C 70 73, 63 78, 54 78 
                 H 36 
                 Z"
              fill="url(#silverGrad)"
              filter="url(#glowFilter)"
            />

            {/* Inner Cutouts for 'B' with metallic contrast */}
            {/* Upper Counter */}
            <path
              d="M 44 30 
                 H 54 
                 C 58 30, 60 32, 60 36 
                 C 60 40, 58 42, 54 42 
                 H 44 
                 Z"
              fill="#0b0c1b"
            />

            {/* Lower Counter */}
            <path
              d="M 44 50 
                 H 55 
                 C 60 50, 62 53, 62 58 
                 C 62 64, 59 67, 54 67 
                 H 44 
                 Z"
              fill="#0b0c1b"
            />

            {/* Specular Glint & Bevel Lines */}
            <path
              d="M 36 22 L 40 26 V 74 L 36 78 Z"
              fill="url(#bevelGrad)"
              opacity="0.6"
            />
            <circle cx="60" cy="36" r="1.5" fill="#ffffff" opacity="0.8" />
            <circle cx="62" cy="58" r="1.5" fill="#38bdf8" opacity="0.8" />
          </svg>
        </div>
      </div>

      {/* Subtitle "BITEW PODCAST" Below Badge when requested */}
      {withSubtitle && (
        <div className="mt-2.5 text-center select-none">
          <p className="text-xs sm:text-sm font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-sky-200 to-slate-200 uppercase font-sans">
            BITEW PODCAST
          </p>
          <p className="text-[10px] font-semibold tracking-wider text-sky-400/90 uppercase font-mono">
            Official Broadcast
          </p>
        </div>
      )}
    </div>
  );
};
