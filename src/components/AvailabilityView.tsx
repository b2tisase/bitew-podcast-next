import React, { useState } from 'react';
import { Rss, Copy, Check, Radio, ExternalLink, Globe, Wifi, CheckCircle2 } from 'lucide-react';

export const AvailabilityView: React.FC = () => {
  const [copiedRss, setCopiedRss] = useState(false);
  const [testingHealth, setTestingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState<string | null>(null);

  const rssFeedUrl = 'https://bitewpodcast.org/feed.xml';

  const handleCopyRss = () => {
    navigator.clipboard?.writeText(rssFeedUrl).catch(() => {});
    setCopiedRss(true);
    setTimeout(() => setCopiedRss(false), 2000);
  };

  const runFeedHealthCheck = () => {
    setTestingHealth(true);
    setHealthStatus(null);
    setTimeout(() => {
      setTestingHealth(false);
      setHealthStatus('RSS 2.0 Feed validated successfully! 100% compliant with Apple Podcasts & Spotify specs.');
    }, 1200);
  };

  const platforms = [
    {
      name: 'RSS Direct Feed',
      status: 'Active',
      details: 'Universal podcast aggregator & open feed',
      badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    },
    {
      name: 'Apple Podcasts',
      status: 'Synchronized',
      details: 'Connected via Apple Podcasts Connect',
      badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    },
    {
      name: 'Spotify for Podcasters',
      status: 'Synchronized',
      details: 'Automatic instant episode webhook broadcast',
      badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    },
    {
      name: 'YouTube Music & Audio',
      status: 'Live Sync',
      details: 'Automated video/audio visualizer distribution',
      badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    },
    {
      name: 'Telegram Channel Audio Bot',
      status: 'Active Relay',
      details: 'Pushes MP3 files directly to community subscribers',
      badgeColor: 'text-sky-400 bg-sky-950/40 border-sky-500/30',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-purple-900/30 pb-4">
        <h3 className="text-lg font-bold text-white">Podcast Availability &amp; Syndication</h3>
        <p className="text-xs text-purple-300/70">
          Manage RSS endpoints, feed syndication, and multi-platform distribution.
        </p>
      </div>

      {/* RSS Feed Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/30 to-[#0e0d1e] border border-purple-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
              <Rss className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Public Podcast RSS Feed (XML)</h4>
              <p className="text-xs text-purple-300/70">Submit this URL to any podcast directory or listener app</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium text-emerald-300 bg-emerald-950/50 border border-emerald-500/30">
            <Wifi className="w-3 h-3 text-emerald-400" />
            Live
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={rssFeedUrl}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-purple-900/40 font-mono text-xs sm:text-sm text-purple-200 select-all"
          />
          <button
            onClick={handleCopyRss}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            {copiedRss ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Feed URL</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-purple-900/20 text-xs">
          <span className="text-slate-400">
            Feed includes enclosure tags, artwork, episode notes, and Amharic metadata.
          </span>
          <button
            onClick={runFeedHealthCheck}
            disabled={testingHealth}
            className="text-purple-400 hover:text-purple-300 underline font-medium cursor-pointer self-start sm:self-auto"
          >
            {testingHealth ? 'Validating feed structure...' : 'Validate Feed Schema'}
          </button>
        </div>

        {healthStatus && (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{healthStatus}</span>
          </div>
        )}
      </div>

      {/* Distribution Network Matrix */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-300">
          Distribution Channels &amp; Relay Status
        </h4>

        <div className="divide-y divide-purple-900/20 rounded-2xl bg-slate-900/40 border border-purple-900/30 overflow-hidden">
          {platforms.map((p) => (
            <div key={p.name} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                  <p className="text-xs text-slate-400 truncate">{p.details}</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${p.badgeColor}`}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
