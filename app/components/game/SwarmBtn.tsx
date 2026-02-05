'use client';

import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { audioManager } from '../../lib/audio';

interface SwarmBtnProps {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

export function SwarmBtn({ x, rotation }: SwarmBtnProps) {
  const finishGame = useStore((state) => state.finishGame);

  const handleClick = () => {
    audioManager.playSuccess();
    finishGame();
  };

  return (
    <motion.button
      onClick={handleClick}
      className="btn-primary jelly-btn absolute text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2 cursor-pointer select-none touch-none pointer-events-auto"
      style={{ left: `${x}%`, bottom: 0, transformOrigin: 'bottom center' }}
      initial={{ 
        y: -200, 
        opacity: 0, 
        scale: 0.3,
        rotate: rotation - 10
      }}
      animate={{ 
        y: 0, 
        opacity: 1,
        scale: 1,
        rotate: rotation
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        mass: 0.8,
        delay: Math.random() * 0.2,
      }}
    >
      YES 💕
    </motion.button>
  );
}
