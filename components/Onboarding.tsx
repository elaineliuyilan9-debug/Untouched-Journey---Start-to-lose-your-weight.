
import React, { useState } from 'react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../constants';

interface OnboardingProps {
  lang: Language;
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ lang, onComplete }) => {
  const [step, setStep] = useState(0); 
  const [initialWeight, setInitialWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [targetDays, setTargetDays] = useState('');
  const t = TRANSLATIONS[lang];

  const nextStep = () => {
    if (step === 3) {
      setStep(4);
      setTimeout(() => {
        onComplete({
          initialWeight: parseFloat(initialWeight),
          targetWeight: parseFloat(targetWeight),
          targetDays: parseInt(targetDays),
          startDate: new Date().toISOString(),
        });
      }, 3000);
    } else {
      setStep(step + 1);
    }
  };

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="animate-in fade-in zoom-in duration-1000 flex flex-col items-center p-4">
            <h1 className="text-5xl md:text-7xl font-black mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 text-center">
              {t.letsStart}
            </h1>
            <button 
              onClick={nextStep}
              className="px-10 py-3 md:px-12 md:py-4 bg-white text-black font-bold rounded-full hover:scale-110 transition-transform active:scale-95 text-lg"
            >
              {t.continue}
            </button>
          </div>
        );
      case 1:
        return (
          <div className="animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500 w-full max-w-sm md:max-w-md flex flex-col items-center px-4">
            <h2 className="text-2xl md:text-3xl font-light mb-6 md:mb-8 text-center">{t.enterInitial}</h2>
            <input 
              type="number"
              autoFocus
              className="w-full bg-transparent border-b-2 border-white/20 text-center text-5xl md:text-6xl py-4 focus:outline-none focus:border-white transition-colors"
              placeholder={t.weightInputPlaceholder}
              value={initialWeight}
              onChange={(e) => setInitialWeight(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && initialWeight && nextStep()}
            />
            {initialWeight && (
               <button onClick={nextStep} className="mt-10 md:mt-12 px-10 py-3 md:px-12 md:py-4 glass rounded-full font-bold animate-in fade-in slide-in-from-top-4 duration-300">{t.confirm}</button>
            )}
          </div>
        );
      case 2:
        return (
          <div className="animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500 w-full max-w-sm md:max-w-md flex flex-col items-center px-4">
            <h2 className="text-2xl md:text-3xl font-light mb-6 md:mb-8 text-center">{t.enterTarget}</h2>
            <input 
              type="number"
              autoFocus
              className="w-full bg-transparent border-b-2 border-white/20 text-center text-5xl md:text-6xl py-4 focus:outline-none focus:border-white transition-colors"
              placeholder={t.weightInputPlaceholder}
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && targetWeight && nextStep()}
            />
             {targetWeight && (
               <button onClick={nextStep} className="mt-10 md:mt-12 px-10 py-3 md:px-12 md:py-4 glass rounded-full font-bold animate-in fade-in slide-in-from-top-4 duration-300">{t.confirm}</button>
            )}
          </div>
        );
      case 3:
        return (
          <div className="animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500 w-full max-w-sm md:max-w-md flex flex-col items-center px-4">
            <h2 className="text-2xl md:text-3xl font-light mb-6 md:mb-8 text-center">{t.enterTargetDays}</h2>
            <input 
              type="number"
              autoFocus
              className="w-full bg-transparent border-b-2 border-white/20 text-center text-5xl md:text-6xl py-4 focus:outline-none focus:border-white transition-colors"
              placeholder="30"
              value={targetDays}
              onChange={(e) => setTargetDays(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && targetDays && nextStep()}
            />
             {targetDays && (
               <button onClick={nextStep} className="mt-10 md:mt-12 px-10 py-3 md:px-12 md:py-4 glass rounded-full font-bold animate-in fade-in slide-in-from-top-4 duration-300">{t.confirm}</button>
            )}
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center animate-in zoom-in fade-in duration-500 p-4">
            <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6 md:mb-8"></div>
            <h2 className="text-2xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500 animate-pulse">
              {t.beginPlan}
            </h2>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center p-4 z-50">
      {renderContent()}
    </div>
  );
};

export default Onboarding;
