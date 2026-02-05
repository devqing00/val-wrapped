'use client';

import { GlassCard } from '../ui/GlassCard';
import { useStore } from '../../store/useStore';
import { audioManager } from '../../lib/audio';
import { getTheme, getThemeCSSVariables } from '../../lib/themes';

export function Landing() {
  const { startGame, recipientName, senderName, customMessage, theme } = useStore();
  const currentTheme = getTheme(theme);
  const themeVars = getThemeCSSVariables(currentTheme);

  const handleStart = () => {
    audioManager.init();
    audioManager.playWhoosh();
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    startGame();
  };

  const displayRecipient = recipientName || 'You';
  const displaySender = senderName || 'Someone special';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 animate-fade-in"
      style={themeVars}
    >
      <div
        className="glass-card p-8 max-w-md w-full text-center relative animate-landing-entry"
        style={{
          background: currentTheme.colors.cardBg,
          borderColor: currentTheme.colors.cardBorder,
        }}
      >
        {/* Envelope icon */}
        <div className="text-6xl md:text-7xl mb-6 animate-envelope-float">
          💌
        </div>

        {/* Title */}
        <h1 
          className="font-heading text-3xl md:text-4xl font-bold mb-3"
          style={{ color: currentTheme.colors.text }}
        >
          Hey {displayRecipient}! ✨
        </h1>

        {/* Sender info */}
        <p 
          className="text-lg md:text-xl mb-4"
          style={{ color: currentTheme.colors.text }}
        >
          <span className="font-semibold" style={{ color: currentTheme.colors.primary }}>
            {displaySender}
          </span>
          {' '}has something to ask you...
        </p>

        {/* CTA Button */}
        <button
          onClick={handleStart}
          className="jelly-btn text-lg px-8 py-4 rounded-full font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95"
          style={{
            background: currentTheme.gradients.button,
            color: currentTheme.colors.buttonText,
            boxShadow: currentTheme.effects.glow,
          }}
        >
          ✉️ Open Envelope
        </button>

        {/* Decorative hearts */}
        <div className="absolute -top-3 -left-3 text-2xl animate-heart-left">
          {currentTheme.emoji}
        </div>
        <div className="absolute -bottom-3 -right-3 text-2xl animate-heart-right">
          💖
        </div>
      </div>
    </div>
  );
}
