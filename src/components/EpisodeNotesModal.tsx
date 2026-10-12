import React, { useState } from 'react';
import { X, Play, Clock, Calendar, Bookmark, Share2, Check } from 'lucide-react';
import { Episode } from '../types/podcast';
import { formatReleaseDate, formatTime } from '../utils/formatters';
import { PodcastArtwork } from './PodcastArtwork';

interface EpisodeNotesModalProps {
  episode: Episode | null;
  onClose: () => void;
  onPlayEpisode: (ep: Episode) => void;
  isPlayingThis: boolean;
}

export const EpisodeNotesModal: React.FC<EpisodeNotesModalProps> = ({
  episode,
  onClose,
  onPlayEpisode,
  isPlayingThis,
}) => {
  const [copied, setCopied] = useState(false);

  if (!episode) return null;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(`${url}#episode-${episode.id}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl bg-[#0d0c1d] border border-purple-500/30 shadow-2xl overflow-hidden text-slate-100">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-purple-900/30 bg-[#120f26]">
          <div className="flex items-center gap-3 min-w-0">
            <PodcastArtwork
              size="md"
              category={episode.category}
              episodeNumber={episode.episodeNumber}
            />
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                {episode.category} · Season {episode.season} Ep {episode.episodeNumber}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white truncate">
                {episode.amharicTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Metadata pill row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pb-3 border-b border-purple-900/20">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              {formatReleaseDate(episode.releaseDate)}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              {formatTime(episode.duration)}
            </span>
            <span>·</span>
            <span className="font-mono text-purple-300">
              {episode.listensCount.toLocaleString()} listens
            </span>
            <span>·</span>
            <span className="text-slate-300 font-medium">Host: {episode.host}</span>
          </div>

          {/* Titles & Synopsis */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white">
              {episode.title}
            </h4>
            <p className="text-sm text-purple-200/90 font-sans leading-relaxed">
              {episode.amharicDescription}
            </p>
            <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
              {episode.description}
            </p>
          </div>

          {/* Show Notes Sections */}
          <div className="p-4 sm:p-5 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
              <Bookmark className="w-4 h-4 text-purple-400" />
              <span>የክፍሉ ዝርዝር ማስታወሻና ምዕራፎች (Detailed Show Notes)</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed font-sans">
              {episode.showNotes}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-purple-900/30 bg-[#120f26] flex items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-purple-900/40 hover:border-purple-500/40 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Share Episode</span>
              </>
            )}
          </button>

          <button
            onClick={() => onPlayEpisode(episode)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-purple-900/50 cursor-pointer active:scale-95"
          >
            <Play className={`w-4 h-4 ${isPlayingThis ? 'fill-white' : ''}`} />
            <span>{isPlayingThis ? 'Currently Playing' : 'Play Episode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
