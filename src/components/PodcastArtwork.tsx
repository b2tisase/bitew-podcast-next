import React from 'react';
import { BitewLogo } from './BitewLogo';

interface PodcastArtworkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
  category?: string;
  episodeNumber?: number;
  className?: string;
}

export const PodcastArtwork: React.FC<PodcastArtworkProps> = ({
  size = 'md',
  category = 'Arts',
  episodeNumber,
  className = '',
}) => {
  if (size === 'sm') {
    return <BitewLogo size="sm" className={className} />;
  }

  if (size === 'md') {
    return <BitewLogo size="md" className={className} />;
  }

  return (
    <div className={`relative shrink-0 flex flex-col items-center justify-center ${className}`}>
      <BitewLogo size={size === 'xl' ? 'hero' : 'lg'} />
      {episodeNumber && (
        <span className="text-[10px] font-mono tracking-wider text-sky-300 font-semibold mt-1 px-2 py-0.5 rounded-full bg-slate-900/80 border border-purple-500/30">
          EP.{episodeNumber}
        </span>
      )}
    </div>
  );
};
