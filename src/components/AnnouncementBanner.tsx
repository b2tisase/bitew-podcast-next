import React, { useState } from 'react';
import { ArrowRight, X, BookOpen, ShieldCheck } from 'lucide-react';
import { AnnouncementConfig } from '../types/podcast';
import { BitewLogo } from './BitewLogo';

interface AnnouncementBannerProps {
  config: AnnouncementConfig;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ config }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!config.enabled) return null;

  return (
    <>
      <div className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/90 via-violet-950/80 to-[#100a26] border border-purple-500/30 p-4 sm:p-6 shadow-lg shadow-purple-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            {/* Crisp Official Brand Artwork Emblem in Main Hero Banner */}
            <div className="shrink-0">
              <BitewLogo size="lg" withSubtitle={false} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-sky-300 font-mono">
                  Official Media Hub
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-[11px] text-purple-300 font-sans">
                  Original Broadcast
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
                {config.title}
              </h3>
              <p className="text-xs sm:text-sm text-purple-200/80 mt-1 line-clamp-2 max-w-3xl leading-relaxed">
                {config.subtitle}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-end self-start md:self-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-purple-900/40 hover:shadow-purple-700/50 cursor-pointer whitespace-nowrap active:scale-95"
            >
              <span>{config.buttonText || 'Learn More'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Learn More Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0e0d1d] border border-purple-500/30 p-6 shadow-2xl text-slate-100">
            <div className="flex items-start justify-between gap-4 border-b border-purple-900/40 pb-4">
              <div className="flex items-center gap-3">
                <BitewLogo size="sm" />
                <div>
                  <h4 className="text-lg font-bold text-white">About BITEW PODCAST</h4>
                  <p className="text-xs text-purple-300/70">Official Broadcast &amp; Community Platform</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-slate-300 leading-relaxed">
              <p className="text-slate-200 font-medium">
                {config.detailedMessage ||
                  'Original episodes, literature readings (ፍቅር እስከ መቃብር), and community discussions on fundamental human rights, healthcare access, and socio-economic realities are recorded and published directly through this independent media hub.'}
              </p>

              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-purple-200 text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Platform Standards & Integrity</span>
                </div>
                <p className="text-xs text-slate-300">
                  Our episodes are recorded with uncensored community voices, prioritizing truth, cultural preservation, and constructive social dialogue for listeners across Ethiopia and the global diaspora.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-200 text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>Scheduled Series: &ldquo;ፍቅር እስከ መቃብር&rdquo;</span>
                </div>
                <p className="text-xs text-slate-400">
                  Weekly audio serialization of classic Ethiopian literature narrated by Bitew, with historical analysis, character profiles, and community feedback sessions.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-purple-900/40 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
