
import React from 'react';

interface ProgressBarProps {
  currentDay: number;
  totalDays: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentDay, totalDays }) => {
  const progressPercent = Math.min((currentDay / totalDays) * 100, 100);
  
  // Determine milestones to display
  // Always include 0 and totalDays
  const step = totalDays > 40 ? 10 : 5;
  const milestones = [];
  for (let i = 0; i < totalDays; i += step) milestones.push(i);
  if (!milestones.includes(totalDays)) milestones.push(totalDays);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 md:pt-10 md:pb-4 overflow-hidden">
      <div className="relative h-4 md:h-6 glass rounded-full flex items-center">
        {/* Progress Fill */}
        <div 
          className="absolute left-0 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${progressPercent}%`,
            background: 'var(--primary-gradient)'
          }}
        />

        {/* The Centered Orb Indicator */}
        <div 
          className="absolute flex items-center justify-center h-8 w-8 md:h-10 md:w-10 bg-white text-black font-bold rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-1000 ease-out z-10 text-xs md:text-lg"
          style={{ 
            left: `calc(${progressPercent}% - ${progressPercent === 0 ? '0px' : progressPercent === 100 ? '32px' : '16px'})`,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          {currentDay}
        </div>
      </div>
      
      <div className="flex justify-between mt-4 md:mt-8 px-1 text-[9px] md:text-[11px] text-gray-500 font-black uppercase tracking-widest relative h-4">
        {milestones.map((s, idx) => {
          // Logic for mobile: always show start, end, and current
          const isStart = s === 0;
          const isEnd = s === totalDays;
          const isNearCurrent = Math.abs(s - currentDay) < step;
          
          return (
            <span 
              key={s} 
              className={`transition-colors duration-500 ${
                s <= currentDay ? 'text-white/80' : 'text-white/20'
              } ${
                (isStart || isEnd) ? 'opacity-100' : 'hidden sm:inline-block'
              }`}
            >
              {s}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
