import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, X, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';
import { formatTime } from '../utils/formatters';

interface LiveRecordingModalProps {
  onClose: () => void;
  onRecordingComplete: (audioBlob: Blob, durationSeconds: number) => void;
}

export const LiveRecordingModal: React.FC<LiveRecordingModalProps> = ({
  onClose,
  onRecordingComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewCurrentTime, setPreviewCurrentTime] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Start live voice recording
  const startRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup audio analysis for live waveform visualization
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setRecordedUrl(url);
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setDuration(0);

      // Start elapsed timer
      timerIntervalRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      // Start drawing canvas waveform
      drawLiveWaveform();
    } catch {
      setMicError('Microphone access is unavailable or denied. Please ensure microphone permissions are allowed.');
    }
  };

  // Draw real-time audio visualization
  const drawLiveWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = `rgba(168, 85, 247, ${Math.max(0.3, dataArray[i] / 255)})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    };

    render();
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    }
  };

  // Reset recording
  const resetRecording = () => {
    stopRecording();
    setRecordedBlob(null);
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl(null);
    }
    setDuration(0);
    setIsPlayingPreview(false);
  };

  // Preview playback controls
  const togglePreviewPlay = () => {
    if (!recordedUrl) return;
    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio(recordedUrl);
      previewAudioRef.current.onerror = () => {
        setIsPlayingPreview(false);
      };
      previewAudioRef.current.ontimeupdate = () => {
        if (previewAudioRef.current) {
          setPreviewCurrentTime(previewAudioRef.current.currentTime);
        }
      };
      previewAudioRef.current.onended = () => {
        setIsPlayingPreview(false);
        setPreviewCurrentTime(0);
      };
    }

    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current.play().then(() => {
        setIsPlayingPreview(true);
      }).catch(() => {});
    }
  };

  const handleUseRecording = () => {
    if (recordedBlob) {
      onRecordingComplete(recordedBlob, Math.max(duration, 1));
    }
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (previewAudioRef.current) previewAudioRef.current.pause();
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [recordedUrl]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0e0d1d] border border-purple-500/30 shadow-2xl p-5 sm:p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Live Voice Recording Studio</h3>
              <p className="text-xs text-purple-300/70">Record podcast commentary, interviews & voice tracks</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetRecording();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visualizer & Timer Area */}
        <div className="my-6 p-6 rounded-2xl bg-[#080712] border border-purple-900/40 flex flex-col items-center justify-center space-y-4">
          {/* Live Waveform Canvas */}
          <canvas
            ref={canvasRef}
            width={320}
            height={70}
            className={`w-full max-w-xs h-16 rounded-lg ${isRecording ? 'block' : 'opacity-30'}`}
          />

          {/* Time display */}
          <div className="text-3xl font-mono font-bold tracking-wider text-purple-200 tabular-nums">
            {formatTime(duration)}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            {isRecording ? (
              <span className="flex items-center gap-2 text-rose-400 font-semibold animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Live Recording In Progress...
              </span>
            ) : recordedBlob ? (
              <span className="text-emerald-400 font-medium">Recording Captured Successfully</span>
            ) : (
              <span>Ready to capture studio audio</span>
            )}
          </div>

          {micError && (
            <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{micError}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3">
          {!recordedBlob ? (
            <div className="flex items-center justify-center gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-900/60 active:scale-95 cursor-pointer"
                >
                  <Mic className="w-5 h-5" />
                  <span>Start Recording</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-900/60 active:scale-95 cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop & Save Recording</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Playback preview */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/30 border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePreviewPlay}
                    className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white cursor-pointer"
                  >
                    {isPlayingPreview ? (
                      <Pause className="w-4 h-4 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    )}
                  </button>
                  <div>
                    <p className="text-xs font-semibold text-white">Preview Track</p>
                    <p className="text-[11px] font-mono text-slate-400">
                      {formatTime(previewCurrentTime)} / {formatTime(duration)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetRecording}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-record</span>
                </button>
              </div>

              {/* Action button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    resetRecording();
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Discard
                </button>
                <button
                  onClick={handleUseRecording}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-purple-900/50 cursor-pointer active:scale-95"
                >
                  <span>Attach to New Episode</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
