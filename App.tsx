
import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, WeightRecord, Language, AppState, ThemeSettings, AIPersona } from './types';
import { TRANSLATIONS, FONT_CLASSES, FONT_SIZE_MAP } from './constants';
import Onboarding from './components/Onboarding';
import ProgressBar from './components/ProgressBar';
import WeightDisplay from './components/WeightDisplay';
import ChatBot from './components/ChatBot';
import DailyInputModal from './components/DailyInputModal';
import CustomizationModal from './components/CustomizationModal';

const DEFAULT_THEME: ThemeSettings = {
  fontFamily: 'sans',
  primaryGradient: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
  fontSize: 'medium',
  fontColor: '#ffffff'
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('fitfocus_responsive_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    }
    return {
      language: 'cn',
      onboarded: false,
      profile: null,
      history: [],
      theme: DEFAULT_THEME,
      persona: null
    };
  });

  const [showDailyInput, setShowDailyInput] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  useEffect(() => {
    localStorage.setItem('fitfocus_responsive_state', JSON.stringify(state));
  }, [state]);

  const themeColors = useMemo(() => {
    const matches = state.theme.primaryGradient.match(/#[a-fA-F0-9]{6}/g);
    return {
      start: matches?.[0] || '#6366f1',
      end: matches?.[1] || '#ec4899'
    };
  }, [state.theme.primaryGradient]);

  useEffect(() => {
    if (state.onboarded && state.profile) {
      const today = new Date().toISOString().split('T')[0];
      const hasEntryToday = state.history.some(h => h.date === today);
      if (!hasEntryToday) setShowDailyInput(true);
    }
  }, [state.onboarded, state.history, state.profile]);

  const updateTheme = (newTheme: Partial<ThemeSettings>) => {
    setState(prev => ({ ...prev, theme: { ...prev.theme, ...newTheme } }));
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setState(prev => ({
      ...prev,
      onboarded: true,
      profile,
      history: [{ date: new Date().toISOString().split('T')[0], weight: profile.initialWeight }]
    }));
  };

  const currentDay = useMemo(() => {
    if (!state.profile) return 1;
    const start = new Date(state.profile.startDate);
    const today = new Date();
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff + 1, 1);
  }, [state.profile]);

  const currentWeight = state.history.length > 0 ? state.history[state.history.length - 1].weight : 0;

  if (!state.onboarded) {
    return <Onboarding lang={state.language} onComplete={handleOnboardingComplete} />;
  }

  return (
    <div 
      className={`min-h-screen relative flex flex-col overflow-x-hidden transition-all duration-1000 ${FONT_CLASSES[state.theme.fontFamily as keyof typeof FONT_CLASSES] || 'font-sans'}`}
      style={{
        color: state.theme.fontColor,
        fontSize: FONT_SIZE_MAP[state.theme.fontSize],
        ['--primary-gradient' as any]: state.theme.primaryGradient,
        ['--gradient-start' as any]: themeColors.start,
        ['--gradient-end' as any]: themeColors.end,
      }}
    >
      <style>{`
        :root {
          --primary-gradient: ${state.theme.primaryGradient};
          --font-color: ${state.theme.fontColor};
        }
        .gradient-theme { background: var(--primary-gradient); }
        .text-theme { background: var(--primary-gradient); -webkit-background-clip: text; color: transparent; }
        .border-theme { border-image: var(--primary-gradient) 1; }
        * { font-size: inherit; }
      `}</style>

      {/* AMBIENT BACKGROUND LAYER */}
      <div className="fixed inset-0 -z-30 bg-[#050505] overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-[120%] h-[120%] bg-blue-900/10 blur-[180px] rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-[120%] h-[120%] bg-purple-900/10 blur-[180px] rounded-full opacity-40 animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="fixed inset-0 -z-20 backdrop-blur-[60px] bg-black/10"></div>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none"></div>

      <header className="p-4 md:p-8 relative z-10 w-full overflow-hidden">
        <ProgressBar currentDay={currentDay} totalDays={state.profile?.targetDays || 30} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-8">
        {state.profile && (
          <WeightDisplay 
            currentWeight={currentWeight} 
            initialWeight={state.profile.initialWeight}
            targetWeight={state.profile.targetWeight}
            lang={state.language} 
          />
        )}
      </main>

      <footer className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between z-20 gap-6">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => setState(p => ({ ...p, language: p.language === 'en' ? 'cn' : 'en' }))}
            className="glass h-12 md:h-14 px-6 md:px-8 rounded-full text-sm md:text-base font-black hover:bg-white/10 transition-all uppercase tracking-[0.3em] border border-white/10"
            style={{ color: state.theme.fontColor }}
          >
            {TRANSLATIONS[state.language].switchLang}
          </button>

          <button 
            onClick={() => setShowCustomizer(true)}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform relative group border border-white/10"
          >
            <div 
              className="w-5 h-5 md:w-6 md:h-6 rounded-full animate-spin-slow" 
              style={{ background: 'var(--primary-gradient)' }}
            ></div>
          </button>
        </div>

        <div className="hidden md:flex flex-col items-end gap-2 pr-28 opacity-40 hover:opacity-100 transition-opacity">
           <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[10px] uppercase tracking-[0.4em] font-black" style={{ color: state.theme.fontColor }}>
               {TRANSLATIONS[state.language].dataSynced}
             </span>
           </div>
        </div>
      </footer>

      <ChatBot 
        lang={state.language} 
        persona={state.persona} 
        onPersonaSelect={(p) => setState(prev => ({...prev, persona: p}))}
      />

      {showCustomizer && (
        <CustomizationModal 
          lang={state.language}
          theme={state.theme}
          onUpdate={updateTheme}
          onClose={() => setShowCustomizer(false)}
        />
      )}

      {showDailyInput && (
        <DailyInputModal 
          lang={state.language} 
          profile={state.profile!} 
          history={state.history}
          onSave={(w) => {
            const today = new Date().toISOString().split('T')[0];
            setState(prev => ({ 
              ...prev, 
              history: [...prev.history, { date: today, weight: w }] 
            }));
            setShowDailyInput(false);
          }}
          persona={state.persona || 'poetic'}
        />
      )}
    </div>
  );
};

export default App;
