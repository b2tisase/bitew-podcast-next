import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Episode, PlaybackRate } from '../types/podcast';
import { formatTime } from '../utils/formatters';
import { BitewLogo } from './BitewLogo';

interface PersistentPlayerProps {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: PlaybackRate;
  volume: number;
  isMuted: boolean;
  audioErrorMessage?: string | null;
  isLoading?: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSkipBack: (seconds: number) => void;
  onSkipForward: (seconds: number) => void;
  onChangeRate: (rate: PlaybackRate) => void;
  onChangeVolume: (vol: number) => void;
  onToggleMute: () => void;
  onClose: () => void;
}

export const PersistentPlayer: React.FC<PersistentPlayerProps> = ({
  currentEpisode,
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  volume,
  isMuted,
  audioErrorMessage,
  isLoading,
  onTogglePlay,
  onSeek,
  onSkipBack,
  onSkipForward,
  onChangeRate,
  onChangeVolume,
  onToggleMute,
  onClose,
}) => {
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);

  if (!currentEpisode) return null;

  const rates: PlaybackRate[] = [1.0, 1.25, 1.5, 2.0];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onSeek(val);
  };

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 px-2 sm:px-4 pb-2 sm:pb-3 pointer-events-none"
      style={{ maxWidth: '100vw' }}
    >
      <div
        className="max-w-5xl mx-auto rounded-2xl bg-[#0b0a17]/95 border border-purple-500/40 shadow-2xl shadow-purple-950/80 backdrop-blur-xl p-3 sm:p-4 pointer-events-auto transition-all duration-200"
        style={{ width: '100%', maxWidth: 'min(64rem, calc(100vw - 1rem))' }}
      >
        {/* Inline Audio Error Message when source fails */}
        {audioErrorMessage && (
          <div className="mb-2.5 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-between text-xs text-rose-300 animate-fade-in">
            <span className="flex items-center gap-1.5 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
              <span>Audio file unavailable</span>
            </span>
            <span className="text-[11px] text-rose-400/90 hidden xs:inline">
              Source file or URL could not be loaded
            </span>
          </div>
        )}

        {/* Loading state indicator */}
        {isLoading && !audioErrorMessage && (
          <div className="mb-2 px-3 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center gap-1.5 text-xs text-purple-300">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
            <span>Loading audio file...</span>
          </div>
        )}

        {/* Scrubber Bar at top */}
        <div className="w-full mb-2">
          <div className="relative group flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="1"
              value={currentTime}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:h-2 transition-all"
              aria-label="Audio scrubber"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1 tabular-nums">
            <span className="text-purple-300 font-semibold">{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Player Controls Grid */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Track Info (Left) with 48x48px rounded-lg Official Logo Thumbnail */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 max-w-[40%] sm:max-w-[32%]">
            <BitewLogo size="md" className="rounded-lg shrink-0" />
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate tracking-tight">
                {currentEpisode.amharicTitle}
              </h4>
              <p className="text-[10px] sm:text-xs text-purple-300/80 truncate">
                {currentEpisode.title}
              </p>
            </div>
          </div>

          {/* Central Playback Controls (Middle) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Skip Back 15s */}
            <button
              onClick={() => onSkipBack(15)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
              title="Skip back 15 seconds"
              aria-label="Skip back 15 seconds"
            >
              <RotateCcw className="w-4 h-4 text-purple-300" />
            </button>

            {/* Play / Pause Primary Button */}
            <button
              onClick={onTogglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-all shadow-md shadow-purple-900/60 cursor-pointer active:scale-90"
              aria-label={isPlaying ? 'Pause episode' : 'Play episode'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white ml-0.5" />
              )}
            </button>

            {/* Skip Forward 15s */}
            <button
              onClick={() => onSkipForward(15)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
              title="Skip forward 15 seconds"
              aria-label="Skip forward 15 seconds"
            >
              <RotateCw className="w-4 h-4 text-purple-300" />
            </button>
          </div>

          {/* Right Utilities: Speed Selector, Volume, Close */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 justify-end">
            {/* Speed Selector (1.0x, 1.25x, 1.5x, 2.0x) */}
            <div className="relative">
              <button
                onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                className="px-2 py-1 rounded-md bg-slate-900/90 border border-purple-900/40 text-[11px] font-mono font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                title="Playback Speed"
              >
                {playbackRate}x
              </button>

              {isSpeedMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 p-1 rounded-xl bg-[#14122d] border border-purple-500/30 shadow-xl flex flex-col gap-0.5 z-50 min-w-[70px]">
                  {rates.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        onChangeRate(rate);
                        setIsSpeedMenuOpen(false);
                      }}
                      className={`px-2.5 py-1 text-xs rounded-lg text-left font-mono font-medium transition-colors cursor-pointer ${
                        playbackRate === rate
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Volume control (hidden on smallest screens to save space) */}
            <div className="hidden md:flex items-center gap-1.5">
              <button
                onClick={onToggleMute}
                className="p-1.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-purple-300" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-slate-800 rounded-lg cursor-pointer accent-purple-500"
                aria-label="Volume slider"
              />
            </div>

            {/* Close / Dismiss player */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close audio player"
              title="Close player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
