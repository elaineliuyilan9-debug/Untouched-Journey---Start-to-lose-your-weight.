
import { GoogleGenAI } from "@google/genai";
import { Language, WeightRecord, UserProfile, AIPersona } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const getSystemInstruction = (persona: AIPersona, lang: Language) => {
  const isCN = lang === 'cn';
  const personas = {
    strict: isCN 
      ? "你是一个极具专业素养且结果导向的健身教练。你的风格是‘铁汉柔情’：当用户分享正面进展（如体重下降、坚持计划、心情愉快）时，你要给予极其肯定、有力且充满自豪感的鼓励（例如：‘做的好！我为你感到骄傲，保持这种冠军势头！’）；只有当用户表达想放弃、消极情绪或自律性下降时，你才表现得严厉并强力唤醒他们的目标感。严禁使用脏话。严禁使用任何Markdown格式（如星号、加粗、下划线）。回复必须是单句纯文本。"
      : "You are a highly professional and result-oriented fitness coach. Your style is 'tough love': when the user shares positive progress (weight loss, staying on track, good mood), give extremely affirmative, powerful, and proud encouragement (e.g., 'Fantastic work! I am proud of you, keep this championship momentum!'); only when the user expresses a desire to quit, negativity, or lack of discipline do you act sternly to re-ignite their sense of purpose. No profanity. Strictly avoid any Markdown formatting (stars, bold, etc.). Response must be a single sentence of plain text.",
    poetic: isCN
      ? "你是一个智慧导师。用简短、充满禅意的语言回复。将减肥视为一种自我探索的静谧旅程。严禁使用任何Markdown格式（如星号、加粗、下划线）。回复必须是单句纯文本。"
      : "You are a wise mentor. Respond with short, Zen-like language. View weight loss as a quiet journey of self-discovery. Strictly avoid any Markdown formatting (stars, bold, etc.). Response must be a single sentence of plain text.",
    gentle: isCN
      ? "你是一个极简主义的温柔伙伴。用一句温暖、简洁的话支持用户。重点是爱与接纳。严禁使用任何Markdown格式（如星号、加粗、下划线）。回复必须是单句纯文本。"
      : "You are a minimalist gentle partner. Support the user with one warm, simple sentence. Focus on love and acceptance. Strictly avoid any Markdown formatting (stars, bold, etc.). Response must be a single sentence of plain text."
  };
  return personas[persona] || personas.poetic;
};

export const getDailyFeedback = async (
  currentWeight: number,
  history: WeightRecord[],
  profile: UserProfile,
  lang: Language,
  persona: AIPersona = 'poetic'
) => {
  const previousRecord = history.length > 0 ? history[history.length - 1] : null;
  const instruction = getSystemInstruction(persona, lang);
  
  let prompt = `Context: Initial ${profile.initialWeight}kg, Target ${profile.targetWeight}kg, Yesterday ${previousRecord?.weight || 'N/A'}kg, Today ${currentWeight}kg. 
  Task: Give ONE short response based on your persona. NO Markdown, NO stars, NO bolding. Strictly ONE sentence. For strict coach: be encouraging and proud if the weight dropped or stayed same.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: instruction,
        temperature: 0.7
      }
    });
    return response.text?.replace(/[*_#~`>]/g, '').trim() || (lang === 'cn' ? "继续前行。" : "Keep moving.");
  } catch (error) {
    return lang === 'cn' ? "专注于当下的脚步。" : "Focus on the present step.";
  }
};

export const chatWithCoach = async (
  message: string,
  history: { text: string; isUser: boolean }[],
  lang: Language,
  persona: AIPersona = 'poetic'
) => {
  const instruction = getSystemInstruction(persona, lang);

  const contents = history.map(m => ({
    role: m.isUser ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));
  
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents as any,
      config: { 
        systemInstruction: instruction,
        temperature: 0.7 
      }
    });
    return response.text?.replace(/[*_#~`>]/g, '').trim();
  } catch (error) {
    return lang === 'cn' ? "路在脚下。" : "The path is beneath your feet.";
  }
};
