/**
 * Mobile Performance Utilities
 * Helps optimize animations and features for mobile devices
 */

/**
 * Check if the device is likely mobile based on screen width and touch capability
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth < 768;
  
  return hasTouch && isSmallScreen;
}

/**
 * Check if the device prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get optimized animation settings based on device
 */
export function getAnimationSettings() {
  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();
  
  if (reducedMotion) {
    return {
      particleCount: 0,
      bubbleCount: 0,
      orbAnimations: false,
      floatingElements: 0,
      transitionDuration: 0.1,
      springStiffness: 500,
      springDamping: 50,
    };
  }
  
  if (isMobile) {
    return {
      particleCount: 15,      // Reduced from 30
      bubbleCount: 10,        // Reduced from 20
      orbAnimations: true,
      floatingElements: 8,    // Reduced from 15
      transitionDuration: 0.3,
      springStiffness: 300,
      springDamping: 25,
    };
  }
  
  // Desktop - full animations
  return {
    particleCount: 30,
    bubbleCount: 20,
    orbAnimations: true,
    floatingElements: 15,
    transitionDuration: 0.5,
    springStiffness: 260,
    springDamping: 20,
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if we should use WebGL effects (performance consideration)
 */
export function shouldUseWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Disable WebGL on low-end devices
  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();
  
  // Check for WebGL support
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return false;
  } catch {
    return false;
  }
  
  // Disable on mobile or reduced motion
  if (reducedMotion) return false;
  if (isMobile) return false;
  
  return true;
}
