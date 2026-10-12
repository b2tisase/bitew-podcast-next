import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { MissionBanner } from './components/MissionBanner';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { SocialLinks } from './components/SocialLinks';
import { EpisodeList } from './components/EpisodeList';
import { PersistentPlayer } from './components/PersistentPlayer';
import { CreatorStudio } from './components/CreatorStudio';
import { EpisodeCreatorModal } from './components/EpisodeCreatorModal';
import { LiveRecordingModal } from './components/LiveRecordingModal';
import { EpisodeNotesModal } from './components/EpisodeNotesModal';
import { Episode, AnnouncementConfig, PlaybackRate } from './types/podcast';
import { INITIAL_EPISODES } from './data/initialEpisodes';
import { audioEngine } from './services/audioEngine';

export default function App() {
  // Navigation View: 'listener' | 'creator'
  const [currentView, setCurrentView] = useState<'listener' | 'creator'>('listener');

  // Episodes State with localStorage persistence (migrated to v3 for guaranteed valid audio sources)
  const [episodes, setEpisodes] = useState<Episode[]>(() => {
    try {
      const saved = localStorage.getItem('bitew_episodes_v3') || localStorage.getItem('bitew_episodes_v2') || localStorage.getItem('bitew_episodes_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((ep: Episode) => {
            const match = INITIAL_EPISODES.find((init) => init.id === ep.id);
            if (match && (!ep.audioUrl || ep.audioUrl.includes('archive.org'))) {
              return { ...ep, audioUrl: match.audioUrl };
            }
            return ep;
          });
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_EPISODES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('bitew_episodes_v3', JSON.stringify(episodes));
    } catch {
      // Storage quota or private mode
    }
  }, [episodes]);

  // Announcement Config State
  const [announcementConfig, setAnnouncementConfig] = useState<AnnouncementConfig>(() => {
    try {
      const saved = localStorage.getItem('bitew_announcement_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      enabled: true,
      title: 'Welcome to the Official BITEW PODCAST Platform',
      subtitle: 'Original episodes and community discussions are published directly through this media hub.',
      buttonText: 'Learn More',
      detailedMessage: 'Original episodes, literature readings (ፍቅር እስከ መቃብር), and community discussions on fundamental human rights, healthcare access, and socio-economic realities are recorded and published directly through this media hub.',
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('bitew_announcement_v1', JSON.stringify(announcementConfig));
    } catch {
      // Storage fallback
    }
  }, [announcementConfig]);

  // Audio Playback State backed directly by native HTMLAudioElement
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1.0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioErrorMessage, setAudioErrorMessage] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);

  // Sync Feed State
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedText, setLastSyncedText] = useState('Last synced just now');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLiveRecordModalOpen, setIsLiveRecordModalOpen] = useState(false);
  const [activeNotesEpisode, setActiveNotesEpisode] = useState<Episode | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [recordingBlobForCreator, setRecordingBlobForCreator] = useState<Blob | null>(null);
  const [recordingDurationForCreator, setRecordingDurationForCreator] = useState<number>(0);

  // Connect native HTML5 Audio element events directly to state
  useEffect(() => {
    audioEngine.setCallbacks({
      onTimeUpdate: (curTime, dur) => {
        setCurrentTime(curTime);
        if (dur > 0 && !isNaN(dur)) {
          setDuration(dur);
        }
      },
      onPlayState: (playing) => {
        setIsPlaying(playing);
      },
      onError: (err) => {
        setAudioErrorMessage(err);
      },
      onLoading: (loading) => {
        setIsLoadingAudio(loading);
      },
    });
  }, []);

  // Manage Native Audio Play / Pause
  const handlePlayEpisode = async (episode: Episode) => {
    const url = episode.audioUrl || `/audio/episodes/bitew_${episode.id}.mp3`;
    setAudioErrorMessage(null);

    if (currentEpisode?.id === episode.id) {
      if (isPlaying) {
        audioEngine.pause();
      } else {
        await audioEngine.playEpisode(url, currentTime, isMuted ? 0 : volume, playbackRate);
      }
    } else {
      audioEngine.stop();
      setCurrentEpisode(episode);
      setCurrentTime(0);
      setDuration(episode.duration);
      await audioEngine.playEpisode(url, 0, isMuted ? 0 : volume, playbackRate);

      // Increment listen counter
      setEpisodes((prev) =>
        prev.map((e) =>
          e.id === episode.id ? { ...e, listensCount: e.listensCount + 1 } : e
        )
      );
    }
  };

  const handleTogglePlay = async () => {
    if (!currentEpisode) return;
    if (isPlaying) {
      audioEngine.pause();
    } else {
      setAudioErrorMessage(null);
      const url = currentEpisode.audioUrl || `/audio/episodes/bitew_${currentEpisode.id}.mp3`;
      await audioEngine.playEpisode(url, currentTime, isMuted ? 0 : volume, playbackRate);
    }
  };

  // Scrubber seeking on native HTMLAudioElement
  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    audioEngine.seek(newTime);
  };

  // 15-second skip
  const handleSkipBack = (secs: number) => {
    audioEngine.skip(-secs);
  };

  const handleSkipForward = (secs: number) => {
    audioEngine.skip(secs);
  };

  // Speed multipliers (1.0x, 1.25x, 1.5x, 2.0x) on native audio element
  const handleChangeRate = (rate: PlaybackRate) => {
    setPlaybackRate(rate);
    audioEngine.setPlaybackRate(rate);
  };

  // Volume control directly on HTMLAudioElement
  const handleChangeVolume = (vol: number) => {
    setVolume(vol);
    setIsMuted(false);
    audioEngine.setVolume(vol);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(volume);
    } else {
      setIsMuted(true);
      audioEngine.setVolume(0);
    }
  };

  const handleClosePlayer = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setAudioErrorMessage(null);
    setCurrentEpisode(null);
  };

  // Feed Sync Handler
  const handleSyncFeed = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncedText(`Feed synced at ${timeStr}`);
    }, 1200);
  };

  // Creator studio actions
  const handleTogglePublishStatus = (episodeId: string) => {
    setEpisodes((prev) =>
      prev.map((e) => {
        if (e.id === episodeId) {
          const newStatus = e.status === 'published' ? 'draft' : 'published';
          return { ...e, status: newStatus };
        }
        return e;
      })
    );
  };

  const handleSaveEpisode = (episodeData: Episode) => {
    setEpisodes((prev) => {
      const exists = prev.some((e) => e.id === episodeData.id);
      if (exists) {
        return prev.map((e) => (e.id === episodeData.id ? episodeData : e));
      }
      return [episodeData, ...prev];
    });
    setEditingEpisode(null);
    setRecordingBlobForCreator(null);
  };

  const handleDeleteEpisode = (episodeId: string) => {
    if (currentEpisode?.id === episodeId) {
      handleClosePlayer();
    }
    setEpisodes((prev) => prev.filter((e) => e.id !== episodeId));
  };

  const handleLiveRecordingComplete = (blob: Blob, durationSecs: number) => {
    setRecordingBlobForCreator(blob);
    setRecordingDurationForCreator(durationSecs);
    setIsLiveRecordModalOpen(false);
    setEditingEpisode(null);
    setIsUploadModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080811] text-slate-100 flex flex-col overflow-x-hidden selection:bg-purple-600 selection:text-white">
      {/* 1. Brand Identity & Header */}
      <Header
        currentView={currentView}
        onToggleView={() => setCurrentView((prev) => (prev === 'listener' ? 'creator' : 'listener'))}
        onSyncFeed={handleSyncFeed}
        isSyncing={isSyncing}
        lastSyncedText={lastSyncedText}
      />

      {/* Main Container with strict max-width constraints */}
      <main
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7 pb-36"
        style={{ maxWidth: 'min(80rem, 100vw)' }}
      >
        {currentView === 'listener' ? (
          <>
            {/* Announcement Banner */}
            <AnnouncementBanner config={announcementConfig} />

            {/* Mission Statement */}
            <MissionBanner />

            {/* Social Connection Row */}
            <SocialLinks />

            {/* Public Listener Interface */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-3 border-b border-purple-900/30">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Broadcast Episodes · ክፍሎች
                </h2>
                <span className="text-xs text-purple-300/70 font-medium">
                  Continuous Audio Stream
                </span>
              </div>
              <div className="pt-4">
                <EpisodeList
                  episodes={episodes}
                  currentEpisode={currentEpisode}
                  isPlaying={isPlaying}
                  onPlayEpisode={handlePlayEpisode}
                  onOpenNotes={(ep) => setActiveNotesEpisode(ep)}
                />
              </div>
            </div>
          </>
        ) : (
          /* Creator Studio View */
          <CreatorStudio
            episodes={episodes}
            onOpenUploadModal={() => {
              setEditingEpisode(null);
              setRecordingBlobForCreator(null);
              setIsUploadModalOpen(true);
            }}
            onOpenLiveRecordModal={() => setIsLiveRecordModalOpen(true)}
            onTogglePublishStatus={handleTogglePublishStatus}
            onEditEpisode={(ep) => {
              setEditingEpisode(ep);
              setIsUploadModalOpen(true);
            }}
            onDeleteEpisode={handleDeleteEpisode}
            onPlayPreview={handlePlayEpisode}
            currentPlayingId={currentEpisode?.id}
            isPlaying={isPlaying}
            announcementConfig={announcementConfig}
            onUpdateAnnouncement={setAnnouncementConfig}
          />
        )}
      </main>

      {/* Persistent Bottom Audio Player */}
      <PersistentPlayer
        currentEpisode={currentEpisode}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        volume={volume}
        isMuted={isMuted}
        audioErrorMessage={audioErrorMessage}
        isLoading={isLoadingAudio}
        onTogglePlay={handleTogglePlay}
        onSeek={handleSeek}
        onSkipBack={handleSkipBack}
        onSkipForward={handleSkipForward}
        onChangeRate={handleChangeRate}
        onChangeVolume={handleChangeVolume}
        onToggleMute={handleToggleMute}
        onClose={handleClosePlayer}
      />

      {/* Episode Notes & Transcript Modal */}
      {activeNotesEpisode && (
        <EpisodeNotesModal
          episode={activeNotesEpisode}
          onClose={() => setActiveNotesEpisode(null)}
          onPlayEpisode={handlePlayEpisode}
          isPlayingThis={currentEpisode?.id === activeNotesEpisode.id && isPlaying}
        />
      )}

      {/* Multi-Step Episode Creator & Calendar Scheduler Modal */}
      <EpisodeCreatorModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setEditingEpisode(null);
          setRecordingBlobForCreator(null);
        }}
        onSaveEpisode={handleSaveEpisode}
        initialRecordingBlob={recordingBlobForCreator}
        initialDuration={recordingDurationForCreator}
        editingEpisode={editingEpisode}
      />

      {/* Live Voice Recording Modal */}
      {isLiveRecordModalOpen && (
        <LiveRecordingModal
          onClose={() => setIsLiveRecordModalOpen(false)}
          onRecordingComplete={handleLiveRecordingComplete}
        />
      )}
    </div>
  );
}
