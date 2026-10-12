import React, { useState } from 'react';
import { Megaphone, Save, Check, RefreshCw } from 'lucide-react';
import { AnnouncementConfig } from '../types/podcast';

interface AnnouncementSetupProps {
  config: AnnouncementConfig;
  onUpdateConfig: (newConfig: AnnouncementConfig) => void;
}

export const AnnouncementSetup: React.FC<AnnouncementSetupProps> = ({
  config,
  onUpdateConfig,
}) => {
  const [formData, setFormData] = useState<AnnouncementConfig>(config);
  const [savedToast, setSavedToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleReset = () => {
    const defaultVal: AnnouncementConfig = {
      enabled: true,
      title: 'Welcome to the Official BITEW PODCAST Platform',
      subtitle: 'Original episodes and community discussions are published directly through this media hub.',
      buttonText: 'Learn More',
      detailedMessage: 'Original episodes, literature readings (ፍቅር እስከ መቃብር), and community discussions on fundamental human rights, healthcare access, and socio-economic realities are recorded and published directly through this media hub.',
    };
    setFormData(defaultVal);
    onUpdateConfig(defaultVal);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Announcement Banner Setup</h3>
          <p className="text-xs text-purple-300/70">
            Customize the platform announcement card displayed to all listeners.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Enable / Disable Switch */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-purple-950/20 border border-purple-900/30">
          <div>
            <p className="text-sm font-semibold text-white">Display Announcement Banner</p>
            <p className="text-xs text-slate-400">Show or hide the header banner on the public listener view</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">
            Banner Headline Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-900/40 text-sm text-white"
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">
            Subtitle / Summary Text
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-900/40 text-sm text-white"
          />
        </div>

        {/* Button text */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">
            Action Button Label
          </label>
          <input
            type="text"
            value={formData.buttonText}
            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
            className="w-full max-w-xs px-3.5 py-2 rounded-xl bg-slate-900 border border-purple-900/40 text-sm text-white"
          />
        </div>

        {/* Detailed Modal Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">
            Detailed Announcement Message (Opened via &ldquo;Learn More&rdquo;)
          </label>
          <textarea
            rows={4}
            value={formData.detailedMessage}
            onChange={(e) => setFormData({ ...formData, detailedMessage: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-900/40 text-sm text-white"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 flex items-center justify-between">
          {savedToast ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <Check className="w-4 h-4" />
              <span>Announcement updated successfully!</span>
            </span>
          ) : (
            <span className="text-xs text-slate-500">Changes reflect immediately.</span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-purple-950/60 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
