'use client';

import { motion } from 'framer-motion';

interface QingBrandingProps {
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
}

export function QingBranding({ variant = 'auto', className = '' }: QingBrandingProps) {
  return (
    <motion.div
      className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 0.5, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <p 
        className={`text-xs font-light tracking-wider ${
          variant === 'light' 
            ? 'text-white/50' 
            : variant === 'dark' 
            ? 'text-black/40' 
            : 'text-current opacity-40'
        }`}
      >
        With love by{' '}
        <span className="font-medium">Qing</span>{' '}
        <span className="text-pink-400">💕</span>
      </p>
    </motion.div>
  );
}

/**
 * Watermark version for receipts - more subtle, positioned at bottom
 */
export function QingWatermark() {
  return (
    <div className="text-center mt-6 opacity-40">
      <p className="text-[10px] font-light tracking-wider text-gray-500">
        Made with 💕 by Qing
      </p>
    </div>
  );
}
