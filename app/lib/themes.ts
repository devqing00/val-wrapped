export type ThemeId = 
  | 'dreamy-pink' 
  | 'dark-romance' 
  | 'retro' 
  | 'neon' 
  | 'golden-hour' 
  | 'midnight-blue' 
  | 'lavender-dreams' 
  | 'sunset-kiss';

export interface Theme {
  id: ThemeId;
  name: string;
  emoji: string;
  description: string;
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    backgroundAlt: string;
    cardBg: string;
    cardBorder: string;
    text: string;
    textMuted: string;
    accent: string;
    glow: string;
    buttonText: string;
  };
  gradients: {
    background: string;
    button: string;
    card: string;
    overlay: string;
  };
  effects: {
    blur: string;
    shadow: string;
    glow: string;
  };
}

export const themes: Record<ThemeId, Theme> = {
  'dreamy-pink': {
    id: 'dreamy-pink',
    name: 'Dreamy Pink',
    emoji: '🌸',
    description: 'Soft & romantic',
    isDark: false,
    colors: {
      primary: '#FF004D',
      secondary: '#FFD1DC',
      background: '#FFD1DC',
      backgroundAlt: '#FFC4D6',
      cardBg: 'rgba(255, 255, 255, 0.5)',
      cardBorder: 'rgba(255, 255, 255, 0.7)',
      text: '#4A0E18',
      textMuted: 'rgba(74, 14, 24, 0.6)',
      accent: '#FF6B9D',
      glow: 'rgba(255, 0, 77, 0.4)',
      buttonText: '#FFFFFF',
    },
    gradients: {
      background: 'linear-gradient(135deg, #FFD1DC 0%, #FFC4D6 50%, #FFB8D0 100%)',
      button: 'linear-gradient(180deg, #FF3366 0%, #FF004D 50%, #CC003D 100%)',
      card: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%)',
      overlay: 'linear-gradient(180deg, rgba(255,209,220,0) 0%, rgba(255,209,220,0.8) 100%)',
    },
    effects: {
      blur: '12px',
      shadow: '0 8px 32px rgba(255, 0, 77, 0.15)',
      glow: '0 0 30px rgba(255, 0, 77, 0.4)',
    },
  },
  'dark-romance': {
    id: 'dark-romance',
    name: 'Dark Romance',
    emoji: '🥀',
    description: 'Gothic & mysterious',
    isDark: true,
    colors: {
      primary: '#DC143C',
      secondary: '#2D1B2E',
      background: '#1A0A1A',
      backgroundAlt: '#2D1B2E',
      cardBg: 'rgba(45, 27, 46, 0.85)',
      cardBorder: 'rgba(220, 20, 60, 0.3)',
      text: '#F5E6E8',
      textMuted: 'rgba(245, 230, 232, 0.6)',
      accent: '#8B0000',
      glow: 'rgba(220, 20, 60, 0.5)',
      buttonText: '#FFFFFF',
    },
    gradients: {
      background: 'linear-gradient(135deg, #1A0A1A 0%, #2D1B2E 50%, #1A0A1A 100%)',
      button: 'linear-gradient(180deg, #DC143C 0%, #8B0000 100%)',
      card: 'linear-gradient(135deg, rgba(45,27,46,0.9) 0%, rgba(26,10,26,0.8) 100%)',
      overlay: 'linear-gradient(180deg, rgba(26,10,26,0) 0%, rgba(26,10,26,0.9) 100%)',
    },
    effects: {
      blur: '16px',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      glow: '0 0 40px rgba(220, 20, 60, 0.5)',
    },
  },
  'retro': {
    id: 'retro',
    name: 'Retro Vibes',
    emoji: '📼',
    description: 'Nostalgic & warm',
    isDark: false,
    colors: {
      primary: '#E91E63',
      secondary: '#FFF8E1',
      background: '#FFF8E1',
      backgroundAlt: '#FFECB3',
      cardBg: 'rgba(255, 248, 225, 0.9)',
      cardBorder: 'rgba(233, 30, 99, 0.3)',
      text: '#5D4037',
      textMuted: 'rgba(93, 64, 55, 0.6)',
      accent: '#FF5722',
      glow: 'rgba(233, 30, 99, 0.4)',
      buttonText: '#FFFFFF',
    },
    gradients: {
      background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 50%, #FFE082 100%)',
      button: 'linear-gradient(180deg, #E91E63 0%, #C2185B 100%)',
      card: 'linear-gradient(135deg, rgba(255,248,225,0.95) 0%, rgba(255,236,179,0.9) 100%)',
      overlay: 'linear-gradient(180deg, rgba(255,248,225,0) 0%, rgba(255,236,179,0.8) 100%)',
    },
    effects: {
      blur: '10px',
      shadow: '0 8px 32px rgba(233, 30, 99, 0.15)',
      glow: '0 0 25px rgba(233, 30, 99, 0.4)',
    },
  },
  'neon': {
    id: 'neon',
    name: 'Neon Nights',
    emoji: '💜',
    description: 'Electric & bold',
    isDark: true,
    colors: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      background: '#0D0221',
      backgroundAlt: '#150734',
      cardBg: 'rgba(13, 2, 33, 0.85)',
      cardBorder: 'rgba(255, 0, 255, 0.4)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.7)',
      accent: '#00FFFF',
      glow: 'rgba(255, 0, 255, 0.6)',
      buttonText: '#FFFFFF',
    },
    gradients: {
      background: 'linear-gradient(135deg, #0D0221 0%, #150734 50%, #0D0221 100%)',
      button: 'linear-gradient(180deg, #FF00FF 0%, #CC00CC 50%, #AA00FF 100%)',
      card: 'linear-gradient(135deg, rgba(255,0,255,0.15) 0%, rgba(0,255,255,0.1) 100%)',
      overlay: 'linear-gradient(180deg, rgba(13,2,33,0) 0%, rgba(13,2,33,0.95) 100%)',
    },
    effects: {
      blur: '20px',
      shadow: '0 8px 32px rgba(255, 0, 255, 0.3)',
      glow: '0 0 50px rgba(255, 0, 255, 0.6)',
    },
  },
  'golden-hour': {
    id: 'golden-hour',
    name: 'Golden Hour',
    emoji: '🌅',
    description: 'Warm & magical',
    isDark: false,
    colors: {
      primary: '#FF6B35',
      secondary: '#FFE5B4',
      background: '#FFF4E6',
      backgroundAlt: '#FFE5B4',
      cardBg: 'rgba(255, 244, 230, 0.9)',
      cardBorder: 'rgba(255, 107, 53, 0.3)',
      text: '#8B4513',
      textMuted: 'rgba(139, 69, 19, 0.6)',
      accent: '#FFD700',
      glow: 'rgba(255, 107, 53, 0.4)',
      buttonText: '#FFFFFF',
    },
    gradients: {
      background: 'linear-gradient(135deg, #FFF4E6 0%, #FFE5B4 30%, #FFDAB9 70%, #FFB347 100%)',
      button: 'linear-gradient(180deg, #FF8C00 0%, #FF6B35 50%, #E65100 100%)',
      card: 'linear-gradient(135deg, rgba(255,244,230,0.95) 0%, rgba(255,229,180,0.9) 100%)',
      overlay: 'linear-gradient(180deg, rgba(255,244,230,0) 0%, rgba(255,179,71,0.3) 100%)',
    },
    effects: {
      blur: '12px',
      shadow: '0 8px 32px rgba(255, 107, 53, 0.2)',
      glow: '0 0 35px rgba(255, 215, 0, 0.5)',
    },
  },
  'midnight-blue': {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    emoji: '🌙',
    description: 'Elegant & serene',
    isDark: true,
    colors: {
      primary: '#4169E1',
      secondary: '#1A1A2E',
      background: '#0F0F1A',
      backgroundAlt: '#1A1A2E',
      cardBg: 'rgba(26, 26, 46, 0.85)',
      cardBorder: 'rgba(65, 105, 225, 0.3)',
      text: '#E8E8FF',
      textMuted: 'rgba(232, 232, 255, 0.6)',
      accent: '#87CEEB',
      glow: 'rgba(65, 105, 225, 0.5)',
      buttonText: '#FFFFFF',
    },
    gradients: {
      background: 'linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)',
      button: 'linear-gradient(180deg, #5B8DEE 0%, #4169E1 50%, #3A5FCD 100%)',
      card: 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(22,33,62,0.85) 100%)',
      overlay: 'linear-gradient(180deg, rgba(15,15,26,0) 0%, rgba(15,15,26,0.95) 100%)',
    },
    effects: {
      blur: '16px',
      shadow: '0 8px 32px rgba(65, 105, 225, 0.25)',
      glow: '0 0 40px rgba(65, 105, 225, 0.5)',
    },
  },
  'lavender-dreams': {
    id: 'lavender-dreams',
    name: 'Lavender Dreams',
    emoji: '💐',
    description: 'Soft & dreamy',
    isDark: false,
    colors: {
      primary: '#9370DB',
      secondary: '#E6E6FA',
      background: '#F5F0FF',
      backgroundAlt: '#E6E6FA',
      cardBg: 'rgba(245, 240, 255, 0.9)',
      cardBorder: 'rgba(147, 112, 219, 0.3)',
      text: '#4B0082',
      textMuted: 'rgba(75, 0, 130, 0.6)',
      accent: '#DDA0DD',
      glow: 'rgba(147, 112, 219, 0.4)',
      buttonText: '#FFFFFF',
    },
    gradients: {
      background: 'linear-gradient(135deg, #F5F0FF 0%, #E6E6FA 50%, #DCD0FF 100%)',
      button: 'linear-gradient(180deg, #9F7FEF 0%, #9370DB 50%, #8A2BE2 100%)',
      card: 'linear-gradient(135deg, rgba(245,240,255,0.95) 0%, rgba(230,230,250,0.9) 100%)',
      overlay: 'linear-gradient(180deg, rgba(245,240,255,0) 0%, rgba(230,230,250,0.8) 100%)',
    },
    effects: {
      blur: '14px',
      shadow: '0 8px 32px rgba(147, 112, 219, 0.2)',
      glow: '0 0 30px rgba(147, 112, 219, 0.4)',
    },
  },
  'sunset-kiss': {
    id: 'sunset-kiss',
    name: 'Sunset Kiss',
    emoji: '🌇',
    description: 'Passionate & warm',
    isDark: false,
    colors: {
      primary: '#FF1744',
      secondary: '#FF8A80',
      background: '#FFF0F0',
      backgroundAlt: '#FFE0E0',
      cardBg: 'rgba(255, 240, 240, 0.9)',
      cardBorder: 'rgba(255, 23, 68, 0.3)',
      text: '#B71C1C',
      textMuted: 'rgba(183, 28, 28, 0.6)',
      accent: '#FF6D00',
      glow: 'rgba(255, 23, 68, 0.4)',
      buttonText: '#FFFFFF',
    },
    gradients: {
      background: 'linear-gradient(135deg, #FFF0F0 0%, #FFE0E0 30%, #FFCCBC 70%, #FFAB91 100%)',
      button: 'linear-gradient(180deg, #FF5252 0%, #FF1744 50%, #D50000 100%)',
      card: 'linear-gradient(135deg, rgba(255,240,240,0.95) 0%, rgba(255,224,224,0.9) 100%)',
      overlay: 'linear-gradient(180deg, rgba(255,240,240,0) 0%, rgba(255,171,145,0.4) 100%)',
    },
    effects: {
      blur: '12px',
      shadow: '0 8px 32px rgba(255, 23, 68, 0.2)',
      glow: '0 0 35px rgba(255, 23, 68, 0.5)',
    },
  },
};

export const themeList = Object.values(themes);

export const getTheme = (id: ThemeId): Theme => themes[id] || themes['dreamy-pink'];

// Check if theme is dark
export const isDarkTheme = (id: ThemeId): boolean => {
  return themes[id]?.isDark ?? false;
};

// Generate CSS variables for a theme
export const getThemeCSSVariables = (theme: Theme): React.CSSProperties => ({
  '--theme-primary': theme.colors.primary,
  '--theme-secondary': theme.colors.secondary,
  '--theme-background': theme.colors.background,
  '--theme-background-alt': theme.colors.backgroundAlt,
  '--theme-card-bg': theme.colors.cardBg,
  '--theme-card-border': theme.colors.cardBorder,
  '--theme-text': theme.colors.text,
  '--theme-text-muted': theme.colors.textMuted,
  '--theme-accent': theme.colors.accent,
  '--theme-glow': theme.colors.glow,
  '--theme-button-text': theme.colors.buttonText,
  '--theme-gradient-bg': theme.gradients.background,
  '--theme-gradient-button': theme.gradients.button,
  '--theme-gradient-card': theme.gradients.card,
  '--theme-gradient-overlay': theme.gradients.overlay,
  '--theme-blur': theme.effects.blur,
  '--theme-shadow': theme.effects.shadow,
  '--theme-effect-glow': theme.effects.glow,
} as React.CSSProperties);
