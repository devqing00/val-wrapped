'use client';

import { useStore } from '../../store/useStore';
import { getTheme } from '../../lib/themes';

/**
 * Simplified static background - no animations for performance
 */
export function AnimatedBackground() {
  const theme = useStore((state) => state.theme);
  const currentTheme = getTheme(theme);

  return (
    <div 
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: currentTheme.gradients.background }}
    />
  );
}
