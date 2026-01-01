
import React, { useState } from 'react';
import { Language, UserProfile, WeightRecord, AIPersona } from '../types';
import { TRANSLATIONS } from '../constants';
import { getDailyFeedback } from '../services/geminiService';

interface DailyInputModalProps {
  lang: Language;
  profile: UserProfile;
  history: WeightRecord[];
  onSave: (weight: number) => void;
  persona: AIPersona;
}

const DailyInputModal: React.FC<DailyInputModalProps> = ({ lang, profile, history, onSave, persona }) => {
  const [weight, setWeight] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleSubmit = async () => {
    if (!weight) return;
    setLoading(true);
    const numWeight = parseFloat(weight);
    
    // Get AI Feedback with persona
    const aiFeedback = await getDailyFeedback(numWeight, history, profile, lang, persona);
    setFeedback(aiFeedback);
    setLoading(false);
  };

  const handleFinish = () => {
    onSave(parseFloat(weight));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
      <div className="relative glass w-full max-w-lg rounded-[2.5rem] p-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {!feedback ? (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-light text-center mb-10">{t.recordToday}</h2>
            <input 
              type="number"
              autoFocus
              className="w-full bg-transparent border-b border-white/10 text-center text-7xl font-light py-4 focus:outline-none transition-colors"
              placeholder="0.0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button 
              disabled={!weight || loading}
              onClick={handleSubmit}
              className="mt-12 w-full py-5 bg-white text-black text-xl font-bold rounded-full disabled:opacity-50 flex items-center justify-center gap-3 transition-transform active:scale-95"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                t.confirm
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-black/20"
              style={{ background: 'var(--primary-gradient)' }}
             >
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </div>
             <p className="text-2xl font-medium leading-relaxed mb-10 text-white/90 italic px-4">
               "{feedback}"
             </p>
             <button 
              onClick={handleFinish}
              className="w-full py-5 glass hover:bg-white/10 text-xl font-bold rounded-full transition-colors"
             >
               {t.continue}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyInputModal;
