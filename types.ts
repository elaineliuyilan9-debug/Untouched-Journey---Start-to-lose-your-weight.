
export type Language = 'en' | 'cn';

export type FontStyle = 'sans' | 'serif' | 'mono' | 'lora' | 'eb' | 'montserrat';

export type AIPersona = 'strict' | 'poetic' | 'gentle';

export type FontSize = 'small' | 'medium' | 'large';

export interface ThemeSettings {
  fontFamily: FontStyle;
  primaryGradient: string;
  fontSize: FontSize;
  fontColor: string;
}

export interface UserProfile {
  initialWeight: number;
  targetWeight: number;
  targetDays: number;
  startDate: string;
}

export interface WeightRecord {
  date: string;
  weight: number;
}

export interface AppState {
  language: Language;
  onboarded: boolean;
  profile: UserProfile | null;
  history: WeightRecord[];
  theme: ThemeSettings;
  persona: AIPersona | null;
}
