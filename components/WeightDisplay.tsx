
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface WeightDisplayProps {
  currentWeight: number;
  initialWeight: number;
  targetWeight: number;
  lang: Language;
}

const WeightDisplay: React.FC<WeightDisplayProps> = ({ currentWeight, initialWeight, targetWeight, lang }) => {
  const [showChart, setShowChart] = useState(false);
  const t = TRANSLATIONS[lang];

  const totalToLose = Math.max(initialWeight - targetWeight, 0.1);
  const lostSoFar = Math.max(initialWeight - currentWeight, 0);
  const percentLost = Math.min((lostSoFar / totalToLose) * 100, 100);

  const data = [
    { name: 'Lost', value: percentLost },
    { name: 'Remaining', value: 100 - percentLost },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl cursor-pointer transition-transform hover:scale-105 select-none" onClick={() => setShowChart(!showChart)}>
      {!showChart ? (
        <div className="text-center w-full px-4">
          <h2 className="text-white text-xl md:text-3xl uppercase tracking-[0.5em] mb-6 md:mb-12 font-black drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] opacity-60">
            {t.currentWeight}
          </h2>
          <div className="text-7xl sm:text-8xl md:text-[11rem] font-black text-theme leading-none flex items-baseline justify-center">
            <span className="tracking-tighter">{currentWeight}</span>
            <span className="text-3xl md:text-5xl ml-4 md:ml-12 opacity-50 font-medium tracking-[0.2em] uppercase" style={{ color: 'var(--font-color)' }}>kg</span>
          </div>
        </div>
      ) : (
        <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-[32rem] md:h-[32rem] flex flex-col items-center justify-center animate-in zoom-in duration-300 relative">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="pieGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--gradient-start, #6366f1)" />
                  <stop offset="100%" stopColor="var(--gradient-end, #ec4899)" />
                </linearGradient>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="95%"
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={450}
                stroke="none"
              >
                <Cell fill="rgba(255,255,255,0.08)" />
                <Cell fill="url(#pieGradient)" style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))' }} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl md:text-7xl font-black tracking-tighter" style={{ color: 'var(--font-color)' }}>{Math.round(percentLost)}%</span>
            <span className="text-xs md:text-xl text-white/40 uppercase tracking-[0.4em] mt-2 md:mt-4 font-black">{t.lost}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightDisplay;
