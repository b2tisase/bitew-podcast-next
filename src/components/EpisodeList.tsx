import React, { useState, useMemo } from 'react';
import { Search, Play, Pause, FileText, Calendar, Clock, Filter, Sparkles, Volume2 } from 'lucide-react';
import { Episode, EpisodeCategory } from '../types/podcast';
import { formatReleaseDate, formatTime } from '../utils/formatters';
import { PodcastArtwork } from './PodcastArtwork';

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisode: Episode | null;
  isPlaying: boolean;
  onPlayEpisode: (episode: Episode) => void;
  onOpenNotes: (episode: Episode) => void;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({
  episodes,
  currentEpisode,
  isPlaying,
  onPlayEpisode,
  onOpenNotes,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter public visible episodes:
  // Scheduled episodes only become visible to public listeners once target timestamp arrives!
  // Drafts are never public.
  const publicEpisodes = useMemo(() => {
    const now = new Date();
    return episodes.filter((ep) => {
      if (ep.status === 'draft') return false;
      if (ep.status === 'scheduled') {
        if (!ep.scheduledDate) return false;
        const schedTime = new Date(ep.scheduledDate);
        // Only visible if scheduled time is <= now
        return schedTime.getTime() <= now.getTime();
      }
      return ep.status === 'published';
    });
  }, [episodes]);

  // Apply search query and category filter
  const filteredEpisodes = useMemo(() => {
    return publicEpisodes.filter((ep) => {
      const matchesCategory =
        selectedCategory === 'All' || ep.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        ep.title.toLowerCase().includes(q) ||
        ep.amharicTitle.toLowerCase().includes(q) ||
        ep.description.toLowerCase().includes(q) ||
        ep.amharicDescription.toLowerCase().includes(q) ||
        ep.category.toLowerCase().includes(q)
      );
    });
  }, [publicEpisodes, searchQuery, selectedCategory]);

  const categories: (string | EpisodeCategory)[] = [
    'All',
    'Arts',
    'Human Rights',
    'Healthcare',
    'Socio-Economic',
    'Women\'s Issues',
  ];

  return (
    <div className="w-full space-y-6">
      {/* Search and Episode Counter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar with Amharic placeholder */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-purple-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ፈልግ / Search episodes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-slate-100 placeholder:text-slate-500 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Episode Counter Badge */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="font-mono tabular-nums">{publicEpisodes.length}</span>
            <span>Episodes available</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills (Interactive Filter Controls) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <div className="flex items-center gap-1 text-slate-400 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden xs:inline">Topic:</span>
        </div>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/40 font-semibold'
                  : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-purple-900/20'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Episode Cards Grid / List */}
      {filteredEpisodes.length === 0 ? (
        <div className="w-full text-center py-16 px-4 rounded-2xl bg-slate-900/30 border border-purple-900/20 space-y-3">
          <Sparkles className="w-8 h-8 text-purple-400/50 mx-auto" />
          <h4 className="text-base font-semibold text-slate-300">
            ምንም ክፍል አልተገኘም (No episodes found)
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or filter to find other episodes from BITEW PODCAST.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs text-purple-400 hover:text-purple-300 underline font-medium cursor-pointer"
          >
            Reset search and filters
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredEpisodes.map((episode) => {
            const isCurrent = currentEpisode?.id === episode.id;
            const isThisPlaying = isCurrent && isPlaying;

            return (
              <div
                key={episode.id}
                className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 border ${
                  isCurrent
                    ? 'bg-purple-950/30 border-purple-500/60 shadow-lg shadow-purple-950/40'
                    : 'bg-[#0f0e21]/70 hover:bg-[#14122d]/90 border-purple-900/30 hover:border-purple-600/40'
                }`}
                style={{ maxWidth: '100%' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Thumbnail & Title Info */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <PodcastArtwork
                      size="lg"
                      category={episode.category}
                      episodeNumber={episode.episodeNumber}
                      className="shrink-0 group-hover:border-purple-400/40 transition-all"
                    />

                    <div className="min-w-0 space-y-1">
                      {/* Quiet unboxed metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-medium">
                        <span className="text-purple-300 font-semibold">{episode.category}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-purple-400/80" />
                          {formatReleaseDate(episode.releaseDate)}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-purple-400/80" />
                          {formatTime(episode.duration)}
                        </span>
                      </div>

                      {/* Amharic Title as Primary */}
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-200 transition-colors tracking-tight line-clamp-1">
                        {episode.amharicTitle}
                      </h3>

                      {/* English Title Subtitle */}
                      <p className="text-xs text-slate-400 font-medium line-clamp-1">
                        {episode.title}
                      </p>

                      {/* Amharic Description */}
                      <p className="text-xs sm:text-sm text-slate-300/80 line-clamp-2 pt-1 font-sans leading-relaxed">
                        {episode.amharicDescription}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions: Play/Pause and Notes Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-purple-900/20">
                    <button
                      onClick={() => onOpenNotes(episode)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-purple-950/60 border border-purple-900/40 transition-colors cursor-pointer"
                      title="View Show Notes & Transcript"
                    >
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      <span>Notes</span>
                    </button>

                    <button
                      onClick={() => onPlayEpisode(episode)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-95 shadow-md ${
                        isThisPlaying
                          ? 'bg-purple-500 text-white ring-2 ring-purple-300/50 shadow-purple-600/40'
                          : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-950/60'
                      }`}
                      aria-label={isThisPlaying ? 'Pause' : 'Play'}
                    >
                      {isThisPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-white" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" />
                          <span>Play</span>
                        </>
                      )}
                      {isThisPlaying && (
                        <Volume2 className="w-3.5 h-3.5 animate-pulse text-purple-200 hidden sm:inline" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
