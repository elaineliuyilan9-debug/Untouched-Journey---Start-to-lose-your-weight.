
import React, { useState, useRef, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language, AIPersona } from '../types';
import { chatWithCoach } from '../services/geminiService';

interface ChatBotProps {
  lang: Language;
  persona: AIPersona | null;
  onPersonaSelect: (p: AIPersona | null) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ lang, persona, onPersonaSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const t = TRANSLATIONS[lang];
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && persona) {
      inputRef.current?.focus();
    }
  }, [isOpen, persona]);

  useEffect(() => {
    if (!persona) {
      setMessages([]);
      setInputValue('');
    }
  }, [persona]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || !persona) return;
    const userMsg = inputValue;
    const currentHistory = [...messages];
    
    setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
    setInputValue('');
    setIsTyping(true);

    const response = await chatWithCoach(userMsg, currentHistory, lang, persona);
    setMessages(prev => [...prev, { text: response || '...', isUser: false }]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
    if (e.key === 'Escape') setIsOpen(false);
  };

  const personaOptions: { id: AIPersona, title: string, titleEn: string, desc: string, descEn: string, icon: string }[] = [
    { 
      id: 'strict', title: '严厉教练', titleEn: 'Strict Coach', 
      desc: '坚定、果断、目标导向。', descEn: 'Firm, decisive, goal-driven.', 
      icon: '⚡' 
    },
    { 
      id: 'poetic', title: '哲思导师', titleEn: 'Poetic Mentor', 
      desc: '文艺、诗意、感悟旅程。', descEn: 'Zen, poetic, insight journey.', 
      icon: '🌿' 
    },
    { 
      id: 'gentle', title: '温柔伙伴', titleEn: 'Gentle Partner', 
      desc: '关怀、鼓励、暖心相伴。', descEn: 'Care, support, warm companion.', 
      icon: '☁️' 
    },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-full p-[2px] shadow-2xl hover:scale-110 transition-transform z-40"
        style={{ background: 'var(--primary-gradient)' }}
      >
        <div className="w-full h-full bg-black rounded-full flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
          <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 text-white z-10" fill="currentColor">
            <path d="M12 2C10.34 2 9 3.34 9 5V13C9 14.66 10.34 16 12 16C13.66 16 15 14.66 15 13V5C15 3.34 13.66 2 12 2Z" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative w-[95vw] md:w-[85vw] h-[90vh] md:h-[80vh] glass rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-500 border border-white/5">
            {!persona ? (
              <div className="w-full flex flex-col items-center justify-center p-6 md:p-12 animate-in fade-in duration-700 overflow-y-auto custom-scroll">
                <h2 className="text-2xl md:text-4xl font-light mb-8 md:mb-16 text-white/30 tracking-[0.2em] uppercase text-center">Choose your Guide</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 w-full max-w-6xl">
                  {personaOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => onPersonaSelect(opt.id)}
                      className="group relative glass p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col items-center text-center transition-all hover:scale-105 hover:bg-white/10 border border-white/5"
                    >
                      <div className="text-4xl md:text-6xl mb-4 md:mb-8 grayscale group-hover:grayscale-0 transition-all">{opt.icon}</div>
                      <h3 className="text-xl md:text-2xl font-black mb-2">{lang === 'cn' ? opt.title : opt.titleEn}</h3>
                      <p className="text-sm text-white/50">{lang === 'cn' ? opt.desc : opt.descEn}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Chat History Section */}
                <div className="flex-1 md:w-1/2 p-6 md:p-12 flex flex-col border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                       <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-white/20">{t.chatbotGreeting}</span>
                       <button 
                        onClick={() => onPersonaSelect(null)} 
                        className="px-4 py-2 md:px-6 md:py-3 glass rounded-full text-[10px] md:text-xs text-white/70 hover:text-white transition-all font-black uppercase tracking-widest border border-white/20"
                       >
                         {t.changePersona}
                       </button>
                    </div>
                    <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scroll pr-2 space-y-6 md:space-y-10 pb-4">
                      {messages.map((m, i) => !m.isUser && (
                        <p key={i} className="text-2xl md:text-4xl font-light leading-snug text-white animate-in slide-in-from-left-4 fade-in duration-1000 tracking-tight">
                          {m.text}
                        </p>
                      ))}
                      {isTyping && (
                        <div className="flex gap-2 py-4">
                          <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                          <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="h-1/3 md:h-auto md:w-1/2 p-6 md:p-16 flex flex-col items-end justify-center bg-black/20 relative overflow-hidden">
                  <div className="text-right w-full overflow-y-auto custom-scroll max-h-[80%] mb-4 md:mb-12">
                    <p className="text-3xl md:text-5xl font-light text-theme break-words tracking-tighter leading-tight">
                      {inputValue || (messages.filter(m => m.isUser).length > 0 ? messages.filter(m => m.isUser).pop()?.text : "")}
                      <span className="inline-block w-[2px] md:w-[3px] h-8 md:h-[3.5rem] bg-current ml-2 md:ml-4 animate-pulse align-middle" style={{ color: 'var(--primary-gradient)' }}></span>
                    </p>
                  </div>
                  <input 
                    ref={inputRef}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.typeHere}
                  />
                  <div className="absolute bottom-4 right-6 md:bottom-12 md:right-12 text-[10px] text-white/30 font-black uppercase tracking-[0.4em]">
                    {t.pressEnter}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
