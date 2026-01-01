
import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language, ThemeSettings, FontStyle, FontSize } from '../types';

interface CustomizationModalProps {
  lang: Language;
  theme: ThemeSettings;
  onUpdate: (theme: Partial<ThemeSettings>) => void;
  onClose: () => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ lang, theme, onUpdate, onClose }) => {
  const t = TRANSLATIONS[lang];
  const [c1, setC1] = useState('#6366f1');
  const [c2, setC2] = useState('#ec4899');

  const fonts: { id: FontStyle | 'lora' | 'eb' | 'montserrat'; label: string; class: string }[] = [
    { id: 'sans', label: 'Inter Modern', class: 'font-sans' },
    { id: 'serif', label: 'Playfair Display', class: 'font-serif' },
    { id: 'lora', label: 'Lora Poetic', class: 'font-lora' },
    { id: 'eb', label: 'Garamond Classic', class: 'font-eb' },
    { id: 'montserrat', label: 'Montserrat Bold', class: 'font-montserrat' },
    { id: 'mono', label: 'JetBrains Tech', class: 'font-mono' },
  ];

  const sizes: { id: FontSize; label: string }[] = [
    { id: 'small', label: 'S' },
    { id: 'medium', label: 'M' },
    { id: 'large', label: 'L' },
  ];

  const applyCustomGradient = () => {
    onUpdate({ primaryGradient: `linear-gradient(90deg, ${c1}, ${c2})` });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-[95%] md:max-w-[80%] h-[90vh] md:h-[80vh] glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="flex justify-between items-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-light text-white/40 tracking-tight">{t.customize}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>
          </button>
        </div>
        
        <div className="flex-1 flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 overflow-y-auto custom-scroll pr-1">
          {/* Typography Section */}
          <div className="flex flex-col gap-8 md:gap-10">
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">{t.selectFont}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fonts.map(f => (
                  <button
                    key={f.id}
                    onClick={() => onUpdate({ fontFamily: f.id as any })}
                    className={`text-left px-4 py-3 md:py-4 rounded-xl transition-all border ${theme.fontFamily === f.id ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-white/40 hover:bg-white/5'}`}
                  >
                    <span className={`text-sm md:text-base ${f.class}`}>{f.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <section>
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">{t.fontSize}</h3>
                <div className="flex gap-2">
                  {sizes.map(s => (
                    <button
                      key={s.id}
                      onClick={() => onUpdate({ fontSize: s.id })}
                      className={`flex-1 h-12 rounded-xl border flex items-center justify-center transition-all ${theme.fontSize === s.id ? 'bg-white text-black font-bold' : 'border-white/10 text-white/40 hover:border-white/20'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">{t.fontColor}</h3>
                <div className="flex items-center gap-4 h-12 glass rounded-xl px-4 border border-white/5">
                  <input 
                    type="color" 
                    value={theme.fontColor} 
                    onChange={(e) => onUpdate({ fontColor: e.target.value })} 
                    className="w-8 h-8 bg-transparent cursor-pointer rounded-full border-none overflow-hidden" 
                  />
                  <span className="text-xs opacity-40 font-mono">{theme.fontColor.toUpperCase()}</span>
                </div>
              </section>
            </div>
          </div>

          {/* Theme Colors Section */}
          <div className="flex flex-col gap-8 md:gap-10">
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">{t.themeColor}</h3>
              <div className="grid grid-cols-1 gap-3">
                {['linear-gradient(90deg, #6366f1, #a855f7, #ec4899)', 'linear-gradient(90deg, #10b981, #3b82f6, #6366f1)', 'linear-gradient(90deg, #f59e0b, #ef4444, #ec4899)', 'linear-gradient(90deg, #71717a, #3f3f46, #18181b)'].map(g => (
                  <button
                    key={g}
                    onClick={() => onUpdate({ primaryGradient: g })}
                    className={`w-full h-12 rounded-xl border-2 transition-all ${theme.primaryGradient === g ? 'border-white' : 'border-transparent hover:border-white/20'}`}
                    style={{ background: g }}
                  />
                ))}
              </div>

              <div className="mt-6 md:mt-8 p-4 md:p-6 glass rounded-2xl md:rounded-3xl border border-white/5 bg-black/20">
                <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6">{t.customGradient}</h4>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-4">
                       <input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="w-10 h-10 bg-transparent cursor-pointer rounded-lg border-none" />
                       <input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="w-10 h-10 bg-transparent cursor-pointer rounded-lg border-none" />
                    </div>
                    <button 
                      onClick={applyCustomGradient}
                      className="px-6 md:px-8 h-10 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
                    >
                      {t.apply}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
