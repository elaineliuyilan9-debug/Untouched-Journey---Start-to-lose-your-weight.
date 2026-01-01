
import { Language } from './types';

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    letsStart: "Let's Start!",
    enterInitial: "Initial weight (kg):",
    enterTarget: "Target weight (kg):",
    enterTargetDays: "Target days:",
    beginPlan: "A new beginning awaits.",
    todayWeight: "Today's check-in",
    recordToday: "What's the number today?",
    currentWeight: "Current",
    lost: "Lost",
    remaining: "Target",
    chatbotGreeting: "Gentle words for a focused heart.",
    typeHere: "Whisper your thoughts...",
    switchLang: "ENG",
    continue: "Continue",
    weightInputPlaceholder: "0.0",
    confirm: "Confirm",
    day: "Day",
    goalReached: "Goal Reached!",
    plateau: "Stalling is part of winning. Hold fast.",
    siriTip: "Mentor",
    customize: "Personalize",
    selectFont: "Typography",
    themeColor: "Aura Colors",
    reset: "Default",
    customGradient: "Create Your Own",
    apply: "Apply",
    fontSize: "Text Size",
    fontColor: "Text Color",
    pressEnter: "Press Enter to Send",
    dataSynced: "Local Data Synced",
    changePersona: "Switch Guide"
  },
  cn: {
    letsStart: "起程",
    enterInitial: "初始体重 (kg)：",
    enterTarget: "目标体重 (kg)：",
    enterTargetDays: "计划天数：",
    beginPlan: "万物更新，由此开始。",
    todayWeight: "今日记录",
    recordToday: "今日的数字是？",
    currentWeight: "当前",
    lost: "已减",
    remaining: "目标",
    chatbotGreeting: "静心微语，专注当下。",
    typeHere: "倾诉你的想法...",
    switchLang: "中文",
    continue: "继续",
    weightInputPlaceholder: "0.0",
    confirm: "确认",
    day: "第",
    goalReached: "目标达成！",
    plateau: "静止亦是成长的一部分。",
    siriTip: "哲思教练",
    customize: "个性化设置",
    selectFont: "字体选择",
    themeColor: "灵动色调",
    reset: "重置",
    customGradient: "自定义渐变",
    apply: "应用",
    fontSize: "字体大小",
    fontColor: "字体颜色",
    pressEnter: "回车发送消息",
    dataSynced: "数据已同步至本地",
    changePersona: "更换向导"
  }
};

export const FONT_CLASSES = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  lora: 'font-lora',
  eb: 'font-eb',
  montserrat: 'font-montserrat'
};

export const FONT_SIZE_MAP = {
  small: '0.95rem',
  medium: '1.1rem',
  large: '1.25rem'
};
