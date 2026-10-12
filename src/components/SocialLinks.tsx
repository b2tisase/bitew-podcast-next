import React, { useState } from 'react';
import { Send, Youtube, Facebook, Twitter, ExternalLink, Check } from 'lucide-react';

interface SocialChannel {
  name: string;
  handle: string;
  url: string;
  icon: React.ReactNode;
  accent: string;
}

export const SocialLinks: React.FC = () => {
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  const channels: SocialChannel[] = [
    {
      name: 'YouTube',
      handle: '@BitewPodcast',
      url: 'https://youtube.com/@BitewPodcast',
      icon: <Youtube className="w-4 h-4 text-red-400" />,
      accent: 'hover:border-red-500/50 hover:bg-red-950/20',
    },
    {
      name: 'Telegram',
      handle: 't.me/bitewpodcast',
      url: 'https://t.me/bitewpodcast',
      icon: <Send className="w-4 h-4 text-sky-400" />,
      accent: 'hover:border-sky-500/50 hover:bg-sky-950/20',
    },
    {
      name: 'Facebook',
      handle: 'facebook.com/bitewpodcast',
      url: 'https://facebook.com/bitewpodcast',
      icon: <Facebook className="w-4 h-4 text-blue-400" />,
      accent: 'hover:border-blue-500/50 hover:bg-blue-950/20',
    },
    {
      name: 'X (Twitter)',
      handle: '@BitewPodcast',
      url: 'https://x.com/BitewPodcast',
      icon: <Twitter className="w-4 h-4 text-slate-300" />,
      accent: 'hover:border-slate-400/50 hover:bg-slate-800/30',
    },
  ];

  const handleCopy = (name: string, url: string) => {
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedChannel(name);
    setTimeout(() => setCopiedChannel(null), 2000);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-2 text-xs font-semibold text-purple-300/80 uppercase tracking-wider">
        <span>Connect & Community Feeds</span>
        <span className="text-[11px] text-slate-500 font-normal">Official Channels</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {channels.map((channel) => (
          <div
            key={channel.name}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-purple-900/30 transition-all duration-200 group ${channel.accent}`}
          >
            <a
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 min-w-0"
              title={`Visit ${channel.name}`}
            >
              <div className="p-1 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                {channel.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                  {channel.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate font-mono">
                  {channel.handle}
                </p>
              </div>
            </a>

            <div className="flex items-center gap-1 shrink-0 ml-1">
              <button
                onClick={() => handleCopy(channel.name, channel.url)}
                title="Copy link"
                className="p-1 text-slate-500 hover:text-purple-300 transition-colors rounded cursor-pointer"
              >
                {copiedChannel === channel.name ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
