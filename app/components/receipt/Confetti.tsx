'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
  isRound: boolean;
  rotateDir: number;
  type: 'confetti' | 'heart' | 'star';
}

interface Firework {
  id: number;
  x: number;
  y: number;
  delay: number;
  color: string;
}

// Generate MASSIVE confetti bundles
function generatePieces(): ConfettiPiece[] {
  const colors = ['#FF004D', '#FFD1DC', '#FF6B8A', '#FF8FAB', '#FDFBF7', '#FFB6C1', '#FFC0CB', '#FF69B4', '#FF1493'];
  const emojis = ['confetti', 'heart', 'star'] as const;
  
  // Generate 300 pieces for massive effect!
  return Array.from({ length: 300 }, (_, i): ConfettiPiece => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 3 + Math.random() * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 10 + Math.random() * 20, // Larger pieces
    rotation: Math.random() * 360,
    isRound: Math.random() > 0.3,
    rotateDir: Math.random() > 0.5 ? 1 : -1,
    type: emojis[Math.floor(Math.random() * emojis.length)],
  }));
}

// Generate firework bursts
function generateFireworks(): Firework[] {
  const colors = ['#FF004D', '#FFD700', '#FF69B4', '#00FFFF', '#FF1493', '#FFA500'];
  
  return Array.from({ length: 15 }, (_, i): Firework => ({
    id: i,
    x: 20 + Math.random() * 60, // Spread across screen
    y: 20 + Math.random() * 40, // Upper portion of screen
    delay: Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

export function Confetti() {
  // Use useState with initializer function to only generate once
  const [pieces] = useState<ConfettiPiece[]>(() => generatePieces());
  const [fireworks] = useState<Firework[]>(() => generateFireworks());

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {/* Massive Confetti Rain */}
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size,
            fontSize: piece.type === 'heart' ? piece.size : piece.type === 'star' ? piece.size : undefined,
          }}
          initial={{
            y: -50,
            rotate: piece.rotation,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            y: '110vh',
            rotate: piece.rotation + 720 * piece.rotateDir,
            opacity: [1, 1, 0.8, 0],
            x: [(piece.x % 2 === 0 ? -20 : 20), (piece.x % 2 === 0 ? 20 : -20)],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'linear',
          }}
        >
          {piece.type === 'heart' ? '💕' : piece.type === 'star' ? '⭐' : (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: piece.color,
                borderRadius: piece.isRound ? '50%' : '2px',
              }}
            />
          )}
        </motion.div>
      ))}

      {/* Fireworks Bursts */}
      {fireworks.map((firework) => (
        <div
          key={`firework-${firework.id}`}
          className="absolute"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
          }}
        >
          {/* Create burst effect with multiple particles */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const distance = 60 + Math.random() * 40;
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: firework.color,
                  boxShadow: `0 0 10px ${firework.color}`,
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.2,
                  delay: firework.delay,
                  ease: 'easeOut',
                }}
              />
            );
          })}
          {/* Central flash */}
          <motion.div
            className="absolute w-8 h-8 rounded-full"
            style={{
              backgroundColor: firework.color,
              boxShadow: `0 0 30px ${firework.color}`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 2, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.6,
              delay: firework.delay,
              ease: 'easeOut',
            }}
          />
        </div>
      ))}
    </div>
  );
}
