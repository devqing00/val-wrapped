'use client';

import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { getTheme } from '../../lib/themes';
import { getAnimationSettings, prefersReducedMotion } from '../../lib/mobileOptimization';

// Deterministic random for consistent positions
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
  delay: number;
  duration: number;
}

export function AnimatedBackground() {
  const theme = useStore((state) => state.theme);
  const currentTheme = getTheme(theme);
  const [animSettings, setAnimSettings] = useState(getAnimationSettings());

  // Update animation settings on mount (client-side only)
  useEffect(() => {
    setAnimSettings(getAnimationSettings());
  }, []);

  // Generate floating elements (respects mobile optimization)
  const elements = useMemo(() => {
    const items: FloatingElement[] = [];
    const emojis = ['💕', '💖', '✨', '💗', '💘', '🦋', '🌸', '💝', '🎀', '💫'];
    const count = animSettings.particleCount;
    
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        x: seededRandom(i * 7) * 100,
        y: seededRandom(i * 11) * 100,
        size: 16 + seededRandom(i * 13) * 24,
        emoji: emojis[i % emojis.length],
        delay: seededRandom(i * 17) * 5,
        duration: 4 + seededRandom(i * 19) * 6,
      });
    }
    return items;
  }, [animSettings.particleCount]);

  // Bubble elements (respects mobile optimization)
  const bubbles = useMemo(() => {
    return Array.from({ length: animSettings.bubbleCount }, (_, i) => ({
      id: i,
      x: seededRandom(i * 23) * 100,
      size: 4 + seededRandom(i * 29) * 12,
      delay: seededRandom(i * 31) * 8,
      duration: 8 + seededRandom(i * 37) * 12,
    }));
  }, [animSettings.bubbleCount]);

  // Sparkle count (reduced on mobile)
  const sparkleCount = prefersReducedMotion() ? 0 : (animSettings.particleCount > 15 ? 50 : 20);

  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: currentTheme.gradients.background }}
    >
      {/* Gradient orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
        style={{ 
          background: `radial-gradient(circle, ${currentTheme.colors.primary}40, transparent)`,
          top: '-10%',
          left: '-10%',
        }}
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-25 blur-3xl"
        style={{ 
          background: `radial-gradient(circle, ${currentTheme.colors.accent}50, transparent)`,
          bottom: '-15%',
          right: '-10%',
        }}
        animate={{
          x: [0, -80, -40, 0],
          y: [0, -60, -120, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-3xl"
        style={{ 
          background: `radial-gradient(circle, #FF6B8A50, transparent)`,
          top: '40%',
          left: '30%',
        }}
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating emojis */}
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.size}px`,
          }}
          animate={{
            y: [0, -20, 0, 20, 0],
            x: [0, 10, 0, -10, 0],
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.1, 1, 0.95, 1],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: 'easeInOut',
          }}
        >
          {el.emoji}
        </motion.div>
      ))}

      {/* Rising bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={`bubble-${bubble.id}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${bubble.x}%`,
            bottom: '-5%',
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.2))`,
            border: '1px solid rgba(255,255,255,0.4)',
          }}
          animate={{
            y: [0, '-120vh'],
            x: [0, Math.sin(bubble.id) * 50, 0],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: 'linear',
          }}
        />
      ))}

      {/* Sparkle layer */}
      <div className="absolute inset-0">
        {Array.from({ length: sparkleCount }, (_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-white pointer-events-none"
            style={{
              left: `${seededRandom(i * 41) * 100}%`,
              top: `${seededRandom(i * 43) * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + seededRandom(i * 47) * 2,
              repeat: Infinity,
              delay: seededRandom(i * 53) * 5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
