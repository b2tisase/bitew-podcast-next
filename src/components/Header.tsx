import React, { useState } from 'react';
import { RefreshCw, LayoutDashboard, Headphones, Check } from 'lucide-react';
import { BitewLogo } from './BitewLogo';

interface HeaderProps {
  currentView: 'listener' | 'creator';
  onToggleView: () => void;
  onSyncFeed: () => void;
  isSyncing: boolean;
  lastSyncedText: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onToggleView,
  onSyncFeed,
  isSyncing,
  lastSyncedText,
}) => {
  const [syncedJustNow, setSyncedJustNow] = useState(false);

  const handleSyncClick = () => {
    onSyncFeed();
    setSyncedJustNow(true);
    setTimeout(() => setSyncedJustNow(false), 2200);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-900/30 bg-[#090912]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Group with Official Bitew Logo */}
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          <BitewLogo size="sm" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
                BITEW PODCAST
              </h1>
              <span className="hidden sm:inline-flex text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300">
                Arts
              </span>
            </div>
            <p className="text-xs text-purple-300/70 tracking-wider font-medium truncate">
              Listen. Learn. Repeat.
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sync Feed Button */}
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            title={lastSyncedText}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-900/80 hover:bg-purple-950/50 border border-purple-900/40 transition-all cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-60"
          >
            {syncedJustNow ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isSyncing ? 'animate-spin' : ''}`} />
            )}
            <span className="hidden md:inline">Sync Feed</span>
          </button>

          {/* User Status Indicator Badge ("b2tisase" with online indicator) */}
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-300 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="truncate max-w-[80px] sm:max-w-[120px] font-sans font-medium text-slate-200">
              b2tisase
            </span>
          </div>

          {/* Creator Studio Toggle Button */}
          <button
            onClick={onToggleView}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-sm ${
              currentView === 'creator'
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30 shadow-md ring-2 ring-purple-400/30'
                : 'bg-gradient-to-r from-purple-900/70 to-indigo-900/70 hover:from-purple-800/80 hover:to-indigo-800/80 text-purple-200 border border-purple-500/40 hover:text-white'
            }`}
          >
            {currentView === 'creator' ? (
              <>
                <Headphones className="w-4 h-4 text-purple-200" />
                <span className="hidden xs:inline">Listener View</span>
              </>
            ) : (
              <>
                <LayoutDashboard className="w-4 h-4 text-purple-300" />
                <span>Creator Studio</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
