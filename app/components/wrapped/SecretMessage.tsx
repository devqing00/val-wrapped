'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SecretMessageProps {
  message: string;
}

export function SecretMessage({ message }: SecretMessageProps) {
  const [revealProgress, setRevealProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle hover reveal (desktop)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setRevealProgress(progress);
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setRevealProgress(0);
    }
  };

  // Handle touch/drag reveal (mobile)
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const progress = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setRevealProgress(progress);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Optionally keep message revealed on mobile after full drag
    if (revealProgress < 95) {
      setRevealProgress(0);
    } else {
      setRevealProgress(100);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Instructions */}
      <motion.p
        className="text-sm text-white/70 mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {isDragging || revealProgress > 0 ? '✨' : '👆 Hover or drag across to reveal'}
      </motion.p>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Revealed message */}
        <div
          className="relative z-10"
          style={{
            clipPath: `inset(0 ${100 - revealProgress}% 0 0)`,
            transition: isDragging ? 'none' : 'clip-path 0.3s ease-out',
          }}
        >
          <p className="font-serif italic text-xl md:text-2xl lg:text-3xl text-white leading-relaxed text-center">
            &ldquo;{message}&rdquo;
          </p>
        </div>

        {/* Hidden overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            clipPath: `inset(0 0 0 ${revealProgress}%)`,
            transition: isDragging ? 'none' : 'clip-path 0.3s ease-out',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-rose-500/30 backdrop-blur-md" />
          <div className="relative z-10 flex flex-col items-center gap-4 p-8">
            <motion.div
              className="text-5xl"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💌
            </motion.div>
            <p className="text-white/80 font-serif italic text-md">
              A secret message awaits...
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-rose-400"
            style={{ width: `${revealProgress}%` }}
            transition={{ duration: isDragging ? 0 : 0.3 }}
          />
        </div>

        {/* Decorative hearts */}
        <motion.div
          className="absolute top-4 right-4 text-2xl"
          animate={{ 
            opacity: revealProgress > 50 ? 1 : 0.3,
            scale: revealProgress > 50 ? 1.2 : 1 
          }}
        >
          💕
        </motion.div>
        <motion.div
          className="absolute bottom-4 left-4 text-2xl"
          animate={{ 
            opacity: revealProgress > 50 ? 1 : 0.3,
            scale: revealProgress > 50 ? 1.2 : 1 
          }}
        >
          ✨
        </motion.div>
      </div>

      {/* Full reveal celebration */}
      {revealProgress >= 95 && (
        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-white/90 font-serif italic">
            With all my heart 💝
          </p>
        </motion.div>
      )}
    </div>
  );
}
