export type EpisodeStatus = 'published' | 'draft' | 'scheduled';

export type EpisodeCategory = 
  | 'Arts' 
  | 'Human Rights' 
  | 'Healthcare' 
  | 'Socio-Economic' 
  | 'Environment' 
  | 'Women\'s Issues';

export interface Episode {
  id: string;
  title: string;
  amharicTitle: string;
  description: string;
  amharicDescription: string;
  showNotes: string;
  category: EpisodeCategory;
  season: number;
  episodeNumber: number;
  releaseDate: string; // ISO format or YYYY-MM-DD
  scheduledDate?: string; // Datetime-local format or ISO format
  duration: number; // in seconds
  audioUrl?: string;
  status: EpisodeStatus;
  listensCount: number;
  artworkGradient: string;
  host: string;
  recordingBlob?: Blob;
}

export interface AnnouncementConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  buttonText: string;
  detailedMessage: string;
}

export type PlaybackRate = 1.0 | 1.25 | 1.5 | 2.0;

export interface PlayerState {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: PlaybackRate;
  volume: number;
  isMuted: boolean;
}
