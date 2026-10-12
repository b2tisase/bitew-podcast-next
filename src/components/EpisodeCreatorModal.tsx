import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  ArrowRight,
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  FileAudio,
  Sparkles,
  Info,
} from 'lucide-react';
import { Episode, EpisodeCategory, EpisodeStatus } from '../types/podcast';
import { getDefaultScheduledDateTime, formatTime } from '../utils/formatters';
import { PodcastArtwork } from './PodcastArtwork';

interface EpisodeCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEpisode: (episode: Episode) => void;
  initialRecordingBlob?: Blob | null;
  initialDuration?: number;
  editingEpisode?: Episode | null;
}

export const EpisodeCreatorModal: React.FC<EpisodeCreatorModalProps> = ({
  isOpen,
  onClose,
  onSaveEpisode,
  initialRecordingBlob,
  initialDuration = 0,
  editingEpisode,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [amharicTitle, setAmharicTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amharicDescription, setAmharicDescription] = useState('');
  const [showNotes, setShowNotes] = useState('');
  const [category, setCategory] = useState<EpisodeCategory>('Arts');
  const [season, setSeason] = useState(1);
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [duration, setDuration] = useState(initialDuration || 2400);
  const [host, setHost] = useState('Bitew');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');

  // Step 3 Publish Action Choice
  const [publishChoice, setPublishChoice] = useState<'publish' | 'draft' | 'schedule'>('publish');
  // Default to exactly 7 days from today per prompt:
  const [scheduledDateTime, setScheduledDateTime] = useState<string>(getDefaultScheduledDateTime());

  // Error validations
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingEpisode) {
      setTitle(editingEpisode.title);
      setAmharicTitle(editingEpisode.amharicTitle);
      setDescription(editingEpisode.description);
      setAmharicDescription(editingEpisode.amharicDescription);
      setShowNotes(editingEpisode.showNotes);
      setCategory(editingEpisode.category);
      setSeason(editingEpisode.season);
      setEpisodeNumber(editingEpisode.episodeNumber);
      setDuration(editingEpisode.duration);
      setHost(editingEpisode.host);
      setAudioUrl(editingEpisode.audioUrl || '');
      if (editingEpisode.status === 'scheduled') {
        setPublishChoice('schedule');
        if (editingEpisode.scheduledDate) {
          setScheduledDateTime(editingEpisode.scheduledDate);
        }
      } else if (editingEpisode.status === 'draft') {
        setPublishChoice('draft');
      } else {
        setPublishChoice('publish');
      }
    } else {
      if (initialRecordingBlob) {
        setUploadedFileName('Live_Studio_Recording.webm');
        setDuration(initialDuration || 1800);
        const objUrl = URL.createObjectURL(initialRecordingBlob);
        setAudioUrl(objUrl);
      }
    }
  }, [editingEpisode, initialRecordingBlob, initialDuration]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local object URL for uploaded MP3/WAV/AAC/WebM file
      const objectUrl = URL.createObjectURL(file);
      setAudioUrl(objectUrl);
      setUploadedFileName(file.name);

      // Read real audio duration via native Audio element
      const tempAudio = new Audio(objectUrl);
      tempAudio.onloadedmetadata = () => {
        if (tempAudio.duration && !isNaN(tempAudio.duration)) {
          setDuration(Math.round(tempAudio.duration));
        }
      };

      // Auto-populate default title if empty
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!amharicTitle.trim()) {
      newErrors.amharicTitle = 'Amharic Title is required (የክፍሉ ርዕስ ያስፈልጋል)';
    }
    if (!title.trim()) {
      newErrors.title = 'Title / Subtitle is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 2) setCurrentStep(1);
    if (currentStep === 3) setCurrentStep(2);
  };

  const handleFinalSubmit = () => {
    let finalStatus: EpisodeStatus = 'published';
    let targetScheduled: string | undefined = undefined;

    if (publishChoice === 'draft') {
      finalStatus = 'draft';
    } else if (publishChoice === 'schedule') {
      finalStatus = 'scheduled';
      targetScheduled = scheduledDateTime;
    }

    const episodeData: Episode = {
      id: editingEpisode ? editingEpisode.id : `ep-${Date.now()}`,
      title,
      amharicTitle,
      description: description || 'Discussion and reflections on BITEW PODCAST.',
      amharicDescription: amharicDescription || amharicTitle,
      showNotes: showNotes || '### ማስታወሻ\n- የውይይት መሪ ሃሳቦች እና ዋና ዋና ነጥቦች።',
      category,
      season: Number(season) || 1,
      episodeNumber: Number(episodeNumber) || 1,
      releaseDate: editingEpisode ? editingEpisode.releaseDate : new Date().toISOString(),
      scheduledDate: targetScheduled,
      duration: Number(duration) || 2400,
      audioUrl: audioUrl || editingEpisode?.audioUrl || `/audio/episodes/bitew_episode_${episodeNumber || 1}.mp3`,
      status: finalStatus,
      listensCount: editingEpisode ? editingEpisode.listensCount : 0,
      artworkGradient: 'from-purple-900 via-violet-950 to-neutral-950',
      host: host || 'Bitew',
      recordingBlob: initialRecordingBlob || undefined,
    };

    onSaveEpisode(episodeData);
    onClose();
  };

  const categories: EpisodeCategory[] = [
    'Arts',
    'Human Rights',
    'Healthcare',
    'Socio-Economic',
    'Women\'s Issues',
    'Environment',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0e0d1e] border border-purple-500/40 shadow-2xl shadow-purple-950/80 overflow-hidden text-slate-100">
        {/* Stepper Header */}
        <div className="p-4 sm:p-5 border-b border-purple-900/30 bg-[#120f26]">
          <div className="flex items-center justify-between pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {editingEpisode ? 'Edit Episode' : 'New Episode Creator'}
              </h3>
              <p className="text-xs text-purple-300/70">
                Produce, schedule, and publish to BITEW PODCAST
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-between max-w-sm mx-auto pt-2">
            {[
              { step: 1, label: '1. Upload' },
              { step: 2, label: '2. Details' },
              { step: 3, label: '3. Review' },
            ].map((s) => {
              const isPast = currentStep > s.step;
              const isCurrent = currentStep === s.step;
              return (
                <div key={s.step} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400/50'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPast ? '✓' : s.step}
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap ${
                      isCurrent ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Stepper Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* STEP 1: UPLOAD */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-6 sm:p-8 text-center bg-purple-950/10 transition-all">
                <input
                  type="file"
                  id="podcast-audio-upload"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="podcast-audio-upload"
                  className="flex flex-col items-center justify-center cursor-pointer space-y-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-purple-300 hover:text-purple-200">
                      Click to browse or drop podcast audio file
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      Supports MP3, WAV, AAC, M4A, WebM (up to 500MB)
                    </p>
                  </div>
                </label>

                {uploadedFileName && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                    <FileAudio className="w-4 h-4" />
                    <span>Attached: {uploadedFileName}</span>
                  </div>
                )}
              </div>

              {/* Direct Audio Stream URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-purple-300">
                  Audio URL (Direct streaming link or uploaded source)
                </label>
                <input
                  type="url"
                  value={audioUrl}
                  onChange={(e) => {
                    const newUrl = e.target.value.trim();
                    setAudioUrl(newUrl);
                    if (newUrl.startsWith('http://') || newUrl.startsWith('https://') || newUrl.startsWith('blob:')) {
                      try {
                        const probe = new Audio();
                        probe.onerror = () => {};
                        probe.onloadedmetadata = () => {
                          if (probe.duration && !isNaN(probe.duration) && isFinite(probe.duration)) {
                            setDuration(Math.round(probe.duration));
                          }
                        };
                        probe.src = newUrl;
                      } catch {
                        // ignore invalid intermediate URL
                      }
                    }
                  }}
                  placeholder="/audio/episode_1.mp3"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-900/40 focus:border-purple-500 text-xs sm:text-sm text-slate-100 font-mono outline-none"
                />
                <p className="text-[11px] text-slate-400">
                  Upload an MP3/WAV file above or provide an explicit direct hosted audio URL (e.g., /audio/episode_1.mp3) for production streaming.
                </p>
              </div>

              {/* Duration & Host setup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Audio Duration (Seconds)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-purple-900/40 text-sm text-slate-100 font-mono"
                  />
                  <span className="text-[11px] text-purple-300/70 font-mono mt-1 block">
                    Formatted: {formatTime(duration)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Lead Host / Contributor
                  </label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    placeholder="Bitew"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-purple-900/40 text-sm text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-purple-300">
                  የክፍሉ ርዕስ (Amharic Title) *
                </label>
                <input
                  type="text"
                  value={amharicTitle}
                  onChange={(e) => {
                    setAmharicTitle(e.target.value);
                    if (errors.amharicTitle) setErrors((prev) => ({ ...prev, amharicTitle: '' }));
                  }}
                  placeholder="e.g., ፍቅር እስከ መቃብር ትረካ 'ትዳር' ክፍል 1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-900/40 focus:border-purple-500 text-sm text-white font-sans"
                />
                {errors.amharicTitle && (
                  <p className="text-xs text-rose-400">{errors.amharicTitle}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  English Title / Subtitle *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  placeholder="e.g., Love Unto Crypt Narrative: 'Marriage' Part 1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-900/40 focus:border-purple-500 text-sm text-white"
                />
                {errors.title && (
                  <p className="text-xs text-rose-400">{errors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EpisodeCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-purple-900/40 text-xs sm:text-sm text-slate-100"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Season
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={season}
                    onChange={(e) => setSeason(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-purple-900/40 text-xs sm:text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Episode #
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={episodeNumber}
                    onChange={(e) => setEpisodeNumber(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-purple-900/40 text-xs sm:text-sm text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-purple-300">
                  የክፍሉ መግለጫ (Amharic Description)
                </label>
                <textarea
                  rows={2}
                  value={amharicDescription}
                  onChange={(e) => setAmharicDescription(e.target.value)}
                  placeholder="የዚህ ክፍል ዋና ማብራሪያ..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-purple-900/40 text-xs sm:text-sm text-slate-100 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  English Description / Synopsis
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief synopsis for global listeners..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-purple-900/40 text-xs sm:text-sm text-slate-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Show Notes & Transcript Chapters
                </label>
                <textarea
                  rows={3}
                  value={showNotes}
                  onChange={(e) => setShowNotes(e.target.value)}
                  placeholder="### Show Notes&#10;- 00:00 Intro&#10;- 10:00 Historical contexts"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-purple-900/40 text-xs sm:text-sm text-slate-100 font-mono"
                />
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & PUBLISH ACTION */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              {/* Summary Card */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-start gap-4">
                <PodcastArtwork
                  size="md"
                  category={category}
                  episodeNumber={episodeNumber}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-purple-300 font-medium">
                    <span>{category}</span>
                    <span>·</span>
                    <span>S{season} E{episodeNumber}</span>
                    <span>·</span>
                    <span className="font-mono">{formatTime(duration)}</span>
                  </div>
                  <h4 className="text-base font-bold text-white truncate mt-0.5">
                    {amharicTitle}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    {title}
                  </p>
                </div>
              </div>

              {/* Three Publishing Choices: Publish Now, Save Draft, Schedule */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300">
                  Publishing Mode
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Publish Now */}
                  <button
                    type="button"
                    onClick={() => setPublishChoice('publish')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      publishChoice === 'publish'
                        ? 'bg-purple-600/30 border-purple-500 ring-2 ring-purple-400/30 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Publish Now</span>
                      {publishChoice === 'publish' && (
                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Instantly live on public listener feed
                    </p>
                  </button>

                  {/* Option 2: Save Draft */}
                  <button
                    type="button"
                    onClick={() => setPublishChoice('draft')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      publishChoice === 'draft'
                        ? 'bg-amber-600/20 border-amber-500/60 ring-2 ring-amber-400/30 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Save Draft</span>
                      {publishChoice === 'draft' && (
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Save to Studio catalog for later edits
                    </p>
                  </button>

                  {/* Option 3: Schedule */}
                  <button
                    type="button"
                    onClick={() => setPublishChoice('schedule')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      publishChoice === 'schedule'
                        ? 'bg-sky-600/30 border-sky-500 ring-2 ring-sky-400/30 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Schedule</span>
                      {publishChoice === 'schedule' && (
                        <CheckCircle2 className="w-4 h-4 text-sky-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Release automatically at target time
                    </p>
                  </button>
                </div>
              </div>

              {/* DEDICATED INTERACTIVE CALENDAR PICKER (When "Schedule" is active) */}
              {publishChoice === 'schedule' && (
                <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/40 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="scheduled-datetime-input"
                      className="text-xs font-semibold text-sky-200 flex items-center gap-2"
                    >
                      <CalendarIcon className="w-4 h-4 text-sky-400" />
                      <span>📅 Pick Target Release Date &amp; Time</span>
                    </label>
                    <span className="text-[11px] text-sky-300/80 font-mono">
                      (Defaulted to 7 days from today)
                    </span>
                  </div>

                  <input
                    id="scheduled-datetime-input"
                    type="datetime-local"
                    value={scheduledDateTime}
                    onChange={(e) => setScheduledDateTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-sky-500/40 text-sm text-sky-100 font-mono focus:border-sky-400 outline-none"
                  />

                  <div className="flex items-start gap-2 text-[11px] text-sky-300/80">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-sky-400" />
                    <span>
                      Episodes scheduled for future dates remain tagged as &ldquo;Scheduled&rdquo; and only become visible to the public listener view once their target timestamp arrives.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Stepper Footer */}
        <div className="p-4 border-t border-purple-900/30 bg-[#120f26] flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-purple-900/50 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white transition-all shadow-md cursor-pointer active:scale-95 ${
                publishChoice === 'schedule'
                  ? 'bg-sky-600 hover:bg-sky-500 shadow-sky-950/60'
                  : publishChoice === 'draft'
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/60'
                  : 'bg-purple-600 hover:bg-purple-500 shadow-purple-950/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {publishChoice === 'schedule'
                  ? 'Confirm Schedule'
                  : publishChoice === 'draft'
                  ? 'Save As Draft'
                  : 'Publish Episode Now'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
