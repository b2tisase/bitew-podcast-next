import React, { useState } from 'react';
import {
  Upload,
  Mic,
  Play,
  Pause,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Episode, EpisodeStatus, AnnouncementConfig } from '../types/podcast';
import { formatReleaseDate, formatTime } from '../utils/formatters';
import { PodcastArtwork } from './PodcastArtwork';
import { AnnouncementSetup } from './AnnouncementSetup';
import { AvailabilityView } from './AvailabilityView';

interface CreatorStudioProps {
  episodes: Episode[];
  onOpenUploadModal: () => void;
  onOpenLiveRecordModal: () => void;
  onTogglePublishStatus: (episodeId: string) => void;
  onEditEpisode: (episode: Episode) => void;
  onDeleteEpisode: (episodeId: string) => void;
  onPlayPreview: (episode: Episode) => void;
  currentPlayingId?: string;
  isPlaying?: boolean;
  announcementConfig: AnnouncementConfig;
  onUpdateAnnouncement: (config: AnnouncementConfig) => void;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({
  episodes,
  onOpenUploadModal,
  onOpenLiveRecordModal,
  onTogglePublishStatus,
  onEditEpisode,
  onDeleteEpisode,
  onPlayPreview,
  currentPlayingId,
  isPlaying,
  announcementConfig,
  onUpdateAnnouncement,
}) => {
  const [activeTab, setActiveTab] = useState<'episodes' | 'announcements' | 'availability'>('episodes');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');
  const [episodeToDelete, setEpisodeToDelete] = useState<Episode | null>(null);

  // Compute counts for filter pills
  const counts = {
    all: episodes.length,
    published: episodes.filter((e) => e.status === 'published').length,
    draft: episodes.filter((e) => e.status === 'draft').length,
    scheduled: episodes.filter((e) => e.status === 'scheduled').length,
  };

  const filteredEpisodes = episodes.filter((ep) => {
    if (filterStatus === 'all') return true;
    return ep.status === filterStatus;
  });

  const getStatusBadge = (status: EpisodeStatus, scheduledDate?: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Published
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/60 border border-amber-500/40 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Draft
          </span>
        );
      case 'scheduled':
        return (
          <div className="flex flex-col">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-950/60 border border-sky-500/40 text-sky-400">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              Scheduled
            </span>
            {scheduledDate && (
              <span className="text-[10px] text-sky-300/80 font-mono mt-0.5">
                {scheduledDate.replace('T', ' ')}
              </span>
            )}
          </div>
        );
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Studio Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-900/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Creator Studio
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-300 font-mono">
              v1.0 Production
            </span>
          </div>
          <p className="text-xs sm:text-sm text-purple-300/70 mt-0.5">
            Manage your audio episodes, announcements, and global syndication feeds
          </p>
        </div>

        {/* Studio Sub-Tabs */}
        <div className="flex items-center p-1 bg-slate-900/80 rounded-xl border border-purple-900/40 text-xs">
          <button
            onClick={() => setActiveTab('episodes')}
            className={`px-3.5 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'episodes'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Episodes
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3.5 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Announcement Setup
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-3.5 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'availability'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Availability
          </button>
        </div>
      </div>

      {/* TAB 1: EPISODES MANAGEMENT */}
      {activeTab === 'episodes' && (
        <div className="space-y-6">
          {/* Action Cards: "Upload New Episode" and "Live Voice Recording" */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Upload New Episode */}
            <div
              onClick={onOpenUploadModal}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900/70 to-slate-950 border border-purple-500/30 hover:border-purple-500/70 p-5 cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-purple-950/40"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider bg-purple-950/70 px-2 py-0.5 rounded-md border border-purple-800/40">
                  Step-by-step
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-4 group-hover:text-purple-200 transition-colors">
                Upload New Episode
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Import audio files, define Amharic show notes, schedule releases, or publish instantly to listeners.
              </p>
            </div>

            {/* Card 2: Live Voice Recording */}
            <div
              onClick={onOpenLiveRecordModal}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-950/30 via-slate-900/70 to-slate-950 border border-rose-500/30 hover:border-rose-500/70 p-5 cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-rose-950/40"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-300 group-hover:scale-105 transition-transform">
                  <Mic className="w-6 h-6 text-rose-400" />
                </div>
                <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider bg-rose-950/70 px-2 py-0.5 rounded-md border border-rose-800/40">
                  Direct mic
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-4 group-hover:text-rose-200 transition-colors">
                Live Voice Recording
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Capture studio voice directly in your browser with real-time audio waveform and instant editing handover.
              </p>
            </div>
          </div>

          {/* Episode Filter Pills: All, Published, Draft, Scheduled */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-purple-900/30 text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-purple-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>All</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 font-mono">
                  {counts.all}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('published')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  filterStatus === 'published'
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Published</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 font-mono">
                  {counts.published}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('draft')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  filterStatus === 'draft'
                    ? 'bg-amber-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Draft</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 font-mono">
                  {counts.draft}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('scheduled')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  filterStatus === 'scheduled'
                    ? 'bg-sky-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Scheduled</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 font-mono">
                  {counts.scheduled}
                </span>
              </button>
            </div>

            <div className="text-xs text-slate-400">
              Showing <span className="font-mono text-purple-300">{filteredEpisodes.length}</span> of{' '}
              <span className="font-mono">{episodes.length}</span> episodes
            </div>
          </div>

          {/* Interactive Catalog Table */}
          <div className="w-full rounded-2xl bg-[#0b0a17]/80 border border-purple-900/30 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-[#120f26] text-xs font-semibold text-purple-300/80 uppercase tracking-wider border-b border-purple-900/40">
                  <tr>
                    <th scope="col" className="px-4 sm:px-6 py-3.5">
                      Episode Title
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Duration
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3.5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/20 font-sans">
                  {filteredEpisodes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        No episodes match this status filter.
                      </td>
                    </tr>
                  ) : (
                    filteredEpisodes.map((ep) => {
                      const isThisPreviewing = currentPlayingId === ep.id && isPlaying;
                      return (
                        <tr
                          key={ep.id}
                          className="hover:bg-purple-950/20 transition-colors group"
                        >
                          {/* Title Column */}
                          <td className="px-4 sm:px-6 py-3.5 max-w-xs sm:max-w-md">
                            <div className="flex items-center gap-3">
                              <PodcastArtwork
                                size="sm"
                                category={ep.category}
                                episodeNumber={ep.episodeNumber}
                                className="shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-white group-hover:text-purple-200 truncate">
                                  {ep.amharicTitle}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                  {ep.title}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-purple-400/80 mt-0.5">
                                  <span>{ep.category}</span>
                                  <span>·</span>
                                  <span>S{ep.season} E{ep.episodeNumber}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Status Column */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            {getStatusBadge(ep.status, ep.scheduledDate)}
                          </td>

                          {/* Date Column */}
                          <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-slate-400">
                            {formatReleaseDate(ep.releaseDate)}
                          </td>

                          {/* Duration Column */}
                          <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-slate-300">
                            {formatTime(ep.duration)}
                          </td>

                          {/* Actions Column: Publish/Unpublish toggle, Play preview, Edit, Delete */}
                          <td className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Play Preview */}
                              <button
                                onClick={() => onPlayPreview(ep)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  isThisPreviewing
                                    ? 'bg-purple-600 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                                title={isThisPreviewing ? 'Pause preview' : 'Preview audio'}
                              >
                                {isThisPreviewing ? (
                                  <Pause className="w-4 h-4 fill-white" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </button>

                              {/* Publish / Unpublish Toggle */}
                              <button
                                onClick={() => onTogglePublishStatus(ep.id)}
                                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer border ${
                                  ep.status === 'published'
                                    ? 'text-amber-300 bg-amber-950/30 border-amber-800/40 hover:bg-amber-900/40'
                                    : 'text-emerald-300 bg-emerald-950/30 border-emerald-800/40 hover:bg-emerald-900/40'
                                }`}
                                title={ep.status === 'published' ? 'Unpublish to Draft' : 'Publish to Listeners'}
                              >
                                {ep.status === 'published' ? 'Unpublish' : 'Publish'}
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => onEditEpisode(ep)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Edit Episode"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setEpisodeToDelete(ep)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Delete Episode"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANNOUNCEMENT SETUP */}
      {activeTab === 'announcements' && (
        <AnnouncementSetup
          config={announcementConfig}
          onUpdateConfig={onUpdateAnnouncement}
        />
      )}

      {/* TAB 3: AVAILABILITY */}
      {activeTab === 'availability' && <AvailabilityView />}

      {/* Confirmation Modal for Delete */}
      {episodeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0e0d1d] border border-rose-500/40 p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Delete Episode?</h4>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete &ldquo;{episodeToDelete.amharicTitle}&rdquo;?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setEpisodeToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteEpisode(episodeToDelete.id);
                  setEpisodeToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Delete Episode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
