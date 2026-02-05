'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { audioManager } from '../../lib/audio';

const GASLIGHT_TEXTS = [
  "No", "Really?", "I have cookies 🍪", "Don't do this", "Skill issue",
  "Wow.", "Are you sure?", "Please?", "Don't!", "I'm crying 😢",
  "Srsly?", "Last chance", "Reconsider?", "Think again", "Why tho?",
  "Nope", "Not today", "Maybe later?", "I'm shy 🙈", "Wait...",
  "Hold on", "Too fast!", "Nuh uh", "Negative", "Denied",
  "Not happening", "Try harder", "I dare you", "Can't touch this", "Nice try",
  "Almost", "So close", "Oops", "Catch me! 🏃", "Nah",
  "Absolutely not", "Never", "In your dreams", "Not a chance", "I'm unavailable",
  "Commitment issues", "It's not you...", "I need space", "We should talk",
  "Let me think", "Ask again later", "404: Yes not found", "Error 403",
];

interface ImpossibleBtnProps {
  onEvade: () => void;
}

export function ImpossibleBtn({ onEvade }: ImpossibleBtnProps) {
  // Position in pixels from center approach
  const [pos, setPos] = useState({ x: 0, y: 100 });
  const [textIndex, setTextIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const lastEvadeRef = useRef(0);
  const spawnCount = useStore((state) => state.spawnCount);

  // Convert pixel offset to screen position
  const getScreenPosition = () => {
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
    const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
    return {
      left: centerX + pos.x,
      top: centerY + pos.y,
    };
  };

  // Detect mobile
  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // SUPER AGGRESSIVE magnetic repulsion - runs every frame
  useEffect(() => {
    if (isMobile) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isMoving = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animId: number;
    
    const repel = () => {
      const screenPos = getScreenPosition();
      const btnX = screenPos.left;
      const btnY = screenPos.top;

      const dx = btnX - mouseX;
      const dy = btnY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // HUGE detection radius - 400px
      const RADIUS = 400;
      
      if (distance < RADIUS && distance > 0) {
        // SUPER STRONG force - moves FAST when mouse is near
        const normalizedDist = distance / RADIUS;
        // Much higher base force (100 instead of 50) with steeper exponential curve
        const force = Math.pow(1 - normalizedDist, 2) * 120;
        
        // Direction away from mouse
        const dirX = dx / distance;
        const dirY = dy / distance;
        
        // New position pushed away - apply force immediately
        let newX = pos.x + dirX * force;
        let newY = pos.y + dirY * force;

        // Keep within screen bounds (with padding)
        const maxX = (window.innerWidth / 2) - 80;
        const maxY = (window.innerHeight / 2) - 60;
        
        newX = Math.max(-maxX, Math.min(maxX, newX));
        newY = Math.max(-maxY + 50, Math.min(maxY - 50, newY));

        // If stuck at edge and mouse is VERY close, instant teleport
        const isAtEdge = Math.abs(newX) >= maxX - 10 || Math.abs(newY) >= maxY - 60;
        if (isAtEdge && distance < 200) {
          // Teleport to random safe position far from mouse
          const angle = Math.atan2(dy, dx) + Math.PI; // Opposite direction
          const teleportDist = 300;
          newX = Math.cos(angle) * teleportDist + (Math.random() - 0.5) * 100;
          newY = Math.sin(angle) * teleportDist + (Math.random() - 0.5) * 100;
          
          // Clamp again
          newX = Math.max(-maxX, Math.min(maxX, newX));
          newY = Math.max(-maxY + 50, Math.min(maxY - 50, newY));
        }

        setPos({ x: newX, y: newY });

        // Trigger effects with throttling
        if (!isMoving) {
          isMoving = true;
          const now = Date.now();
          if (now - lastEvadeRef.current > 200) {
            lastEvadeRef.current = now;
            setTextIndex(i => (i + 1) % GASLIGHT_TEXTS.length);
            audioManager.playPop();
            onEvade();
          }
          setTimeout(() => { isMoving = false; }, 100);
        }
      }

      animId = requestAnimationFrame(repel);
    };

    animId = requestAnimationFrame(repel);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isMobile, pos, onEvade]);

  // Mobile touch handler - teleport away from touch
  const handleTouch = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Get touch position
    let touchX: number, touchY: number;
    if ('touches' in e && e.touches[0]) {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      touchX = e.clientX;
      touchY = e.clientY;
    } else {
      return;
    }

    const screenPos = getScreenPosition();
    const dx = screenPos.left - touchX;
    const dy = screenPos.top - touchY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      // Strong push away from touch
      const pushX = (dx / dist) * 150;
      const pushY = (dy / dist) * 150;

      const maxX = (window.innerWidth / 2) - 60;
      const maxY = (window.innerHeight / 2) - 40;

      let newX = Math.max(-maxX, Math.min(maxX, pos.x + pushX));
      let newY = Math.max(-maxY + 50, Math.min(maxY - 50, pos.y + pushY));

      // If near edge, teleport
      if (Math.abs(newX) >= maxX - 10 || Math.abs(newY) >= maxY - 55) {
        newX = (Math.random() - 0.5) * maxX * 1.5;
        newY = (Math.random() - 0.5) * maxY;
      }

      setPos({ x: newX, y: newY });
    }

    setTextIndex(i => (i + 1) % GASLIGHT_TEXTS.length);
    audioManager.playPop();
    onEvade();
  }, [pos, onEvade]);

  const screenPos = getScreenPosition();
  const scale = Math.max(0.75, 1 - spawnCount * 0.02);

  return (
    <button
      className="btn-ghost jelly-btn fixed text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2 whitespace-nowrap select-none"
      style={{
        left: screenPos.left,
        top: screenPos.top,
        transform: `translate(-50%, -50%) scale(${scale})`,
        zIndex: 9999,
        // CRITICAL: pointer-events none on desktop so cursor can't interact
        // but auto on mobile for touch
        pointerEvents: isMobile ? 'auto' : 'none',
        transition: 'left 0.05s linear, top 0.05s linear',
      }}
      onTouchStart={isMobile ? handleTouch : undefined}
      onClick={isMobile ? handleTouch : undefined}
    >
      {GASLIGHT_TEXTS[textIndex]}
    </button>
  );
}
