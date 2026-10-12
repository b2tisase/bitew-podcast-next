/**
 * Pure HTML5 Audio Engine for BITEW PODCAST
 * Directly plays user uploaded files via URL.createObjectURL(file) and hosted streaming audio URLs.
 * Completely free of any synthetic PCM generators or tone fallbacks.
 */

type TimeUpdateCallback = (currentTime: number, duration: number) => void;
type PlayStateCallback = (isPlaying: boolean) => void;
type ErrorCallback = (errorMsg: string | null) => void;
type LoadingCallback = (isLoading: boolean) => void;

class AudioEngine {
  private audio: HTMLAudioElement | null = null;
  private currentUrl: string | null = null;
  private _isPlaying = false;
  private onTimeUpdateCallback: TimeUpdateCallback | null = null;
  private onPlayStateCallback: PlayStateCallback | null = null;
  private onErrorCallback: ErrorCallback | null = null;
  private onLoadingCallback: LoadingCallback | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    if (this.audio) return;
    this.audio = new Audio();
    this.audio.preload = 'metadata';

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio && this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(
          this.audio.currentTime,
          isNaN(this.audio.duration) ? 0 : this.audio.duration
        );
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio && this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(
          this.audio.currentTime,
          isNaN(this.audio.duration) ? 0 : this.audio.duration
        );
      }
      if (this.onLoadingCallback) this.onLoadingCallback(false);
      if (this.onErrorCallback) this.onErrorCallback(null);
    });

    this.audio.addEventListener('waiting', () => {
      if (this.onLoadingCallback) this.onLoadingCallback(true);
    });

    this.audio.addEventListener('canplay', () => {
      if (this.onLoadingCallback) this.onLoadingCallback(false);
    });

    this.audio.addEventListener('play', () => {
      this._isPlaying = true;
      if (this.onPlayStateCallback) this.onPlayStateCallback(true);
      if (this.onErrorCallback) this.onErrorCallback(null);
    });

    this.audio.addEventListener('pause', () => {
      this._isPlaying = false;
      if (this.onPlayStateCallback) this.onPlayStateCallback(false);
    });

    this.audio.addEventListener('ended', () => {
      this._isPlaying = false;
      if (this.onPlayStateCallback) this.onPlayStateCallback(false);
    });

    this.audio.addEventListener('error', () => {
      this._isPlaying = false;
      if (this.onPlayStateCallback) this.onPlayStateCallback(false);
      if (this.onLoadingCallback) this.onLoadingCallback(false);
      // Report exact error message per spec
      if (this.onErrorCallback) {
        this.onErrorCallback('Audio file unavailable');
      }
    });
  }

  public setCallbacks(callbacks: {
    onTimeUpdate?: TimeUpdateCallback;
    onPlayState?: PlayStateCallback;
    onError?: ErrorCallback;
    onLoading?: LoadingCallback;
  }) {
    if (callbacks.onTimeUpdate) this.onTimeUpdateCallback = callbacks.onTimeUpdate;
    if (callbacks.onPlayState) this.onPlayStateCallback = callbacks.onPlayState;
    if (callbacks.onError) this.onErrorCallback = callbacks.onError;
    if (callbacks.onLoading) this.onLoadingCallback = callbacks.onLoading;
  }

  public async playEpisode(
    url?: string,
    startTime = 0,
    volume = 0.85,
    playbackRate = 1.0
  ): Promise<void> {
    this.initAudioElement();
    if (!this.audio) return;

    if (!url || url.trim() === '') {
      this._isPlaying = false;
      if (this.onErrorCallback) this.onErrorCallback('Audio file unavailable');
      return;
    }

    if (this.onErrorCallback) this.onErrorCallback(null);
    if (this.onLoadingCallback) this.onLoadingCallback(true);

    if (this.currentUrl !== url) {
      this.currentUrl = url;
      this.audio.src = url;
      this.audio.currentTime = startTime;
    } else if (startTime > 0 && Math.abs(this.audio.currentTime - startTime) > 2) {
      this.audio.currentTime = startTime;
    }

    this.audio.volume = Math.max(0, Math.min(1, volume));
    this.audio.playbackRate = playbackRate;

    try {
      await this.audio.play();
      this._isPlaying = true;
      if (this.onLoadingCallback) this.onLoadingCallback(false);
      if (this.onErrorCallback) this.onErrorCallback(null);
    } catch {
      this._isPlaying = false;
      if (this.onLoadingCallback) this.onLoadingCallback(false);
      if (this.onErrorCallback) {
        this.onErrorCallback('Audio file unavailable');
      }
    }
  }

  public pause(): void {
    if (this.audio) {
      this.audio.pause();
      this._isPlaying = false;
    }
  }

  public async resume(): Promise<void> {
    if (this.audio && this.currentUrl) {
      try {
        await this.audio.play();
        this._isPlaying = true;
        if (this.onErrorCallback) this.onErrorCallback(null);
      } catch {
        this._isPlaying = false;
        if (this.onErrorCallback) {
          this.onErrorCallback('Audio file unavailable');
        }
      }
    }
  }

  public seek(seconds: number): void {
    if (this.audio) {
      this.audio.currentTime = Math.max(0, seconds);
    }
  }

  public skip(seconds: number): void {
    if (this.audio) {
      const target = this.audio.currentTime + seconds;
      const maxDuration = isNaN(this.audio.duration) ? target : this.audio.duration;
      this.audio.currentTime = Math.max(0, Math.min(maxDuration, target));
    }
  }

  public setVolume(vol: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, vol));
    }
  }

  public setPlaybackRate(rate: number): void {
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
  }

  public getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  public getDuration(): number {
    return this.audio && !isNaN(this.audio.duration) ? this.audio.duration : 0;
  }

  public isPlaying(): boolean {
    return this._isPlaying;
  }

  public stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this._isPlaying = false;
    }
    if (this.onErrorCallback) this.onErrorCallback(null);
    if (this.onLoadingCallback) this.onLoadingCallback(false);
  }
}

export const audioEngine = new AudioEngine();
