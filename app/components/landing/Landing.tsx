'use client';

import { motion } from 'framer-motion';
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
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={themeVars}
    >
      <GlassCard
        className="max-w-md w-full text-center relative"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          delay: 0.2,
        }}
        style={{
          background: currentTheme.colors.cardBg,
          borderColor: currentTheme.colors.cardBorder,
        }}
      >
        {/* Envelope icon */}
        <motion.div
          className="text-6xl md:text-7xl mb-6"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          💌
        </motion.div>

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
        <motion.button
          onClick={handleStart}
          className="jelly-btn text-lg px-8 py-4 rounded-full font-semibold cursor-pointer transition-all"
          style={{
            background: currentTheme.gradients.button,
            color: currentTheme.colors.buttonText,
            boxShadow: currentTheme.effects.glow,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          ✉️ Open Envelope
        </motion.button>

        {/* Decorative hearts */}
        <motion.div 
          className="absolute -top-3 -left-3 text-2xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {currentTheme.emoji}
        </motion.div>
        <motion.div 
          className="absolute -bottom-3 -right-3 text-2xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          💖
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
