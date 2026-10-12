import React from 'react';
import { Sparkles, Globe, HeartHandshake } from 'lucide-react';

export const MissionBanner: React.FC = () => {
  return (
    <section className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#120f26] via-[#0d0d1c] to-[#090912] border border-purple-500/20 p-5 sm:p-7 shadow-xl shadow-purple-950/20">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-purple-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mission & Core Purpose · ተልዕኳችን</span>
        </div>

        {/* English Mission */}
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-4xl font-medium">
          &ldquo;To address, whenever possible, other issues affecting human life such as health care, economic development, human rights, environment, socio-economic aspects and women&apos;s issues.&rdquo;
        </p>

        {/* Amharic Mission Statement */}
        <div className="pt-2 border-t border-purple-900/30">
          <p className="text-sm sm:text-base text-purple-200/90 leading-relaxed font-sans max-w-4xl">
            &ldquo;በእምባገነን መንግስት ሥር የሚኖሩ ዜጎች በሰብዓዊና ቋሳዊ እጦት እንዳይፈቀዱ፤ ፍትህ እና እኩልነት እንዲሰፍን የሚተጋ የድምፅ መድረክ።&rdquo;
          </p>
        </div>

        {/* Pillar tags */}
        <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-purple-400" /> Human Rights
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Healthcare Equity</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Socio-Economic Freedom</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Women&apos;s Voices</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" /> Environmental Care
          </span>
        </div>
      </div>
    </section>
  );
};
