'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

import { useStore } from '../../store/useStore';
import { NoiseOverlay } from '../../components/ui/NoiseOverlay';
import { Landing } from '../../components/landing/Landing';
import { TheQuestion } from '../../components/game/TheQuestion';
import { ReceiptCard } from '../../components/receipt/ReceiptCard';
import { WrappedSlides } from '../../components/wrapped/WrappedSlides';
import { getTheme, getThemeCSSVariables, ThemeId, themeList } from '../../lib/themes';
import { decodeParams } from '../../lib/linkEncoder';
import { AnimatedBackground } from '../../components/canvas/AnimatedBackground';

export default function TokenPage() {
  const params = useParams();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { stage, setRecipientName, setSenderName, setTheme, setStage, theme, setCustomMessage } = useStore();

  // Parse token from URL parameters
  useEffect(() => {
    const token = params?.token as string;
    if (!token) {
      setIsValid(false);
      return;
    }
    
    const decoded = decodeParams(token);
    if (!decoded) {
      setIsValid(false);
      return;
    }

    // Set values from decoded params
    if (decoded.recipient) {
      setRecipientName(decoded.recipient);
    }
    if (decoded.sender) {
      setSenderName(decoded.sender);
    }
    if (decoded.theme && themeList.find(t => t.id === decoded.theme)) {
      setTheme(decoded.theme as ThemeId);
    }
    if (decoded.message) {
      setCustomMessage(decoded.message);
    }
    
    setIsValid(true);
  }, [params, setRecipientName, setSenderName, setTheme, setCustomMessage]);

  // Get current theme
  const currentTheme = getTheme(theme);
  const themeVars = getThemeCSSVariables(currentTheme);

  // Handle wrapped completion
  const handleWrappedComplete = () => {
    setStage('success');
  };

  // Loading state
  if (isValid === null) {
    return (
      <main 
        className="min-h-dvh flex items-center justify-center"
        style={{
          ...themeVars,
          background: currentTheme.gradients.background,
        } as React.CSSProperties}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            💕
          </motion.div>
          <p style={{ color: currentTheme.colors.text }} className="text-xl font-medium">
            Loading your Valentine...
          </p>
        </motion.div>
      </main>
    );
  }

  // Invalid token
  if (!isValid) {
    notFound();
  }

  return (
    <main 
      className="min-h-dvh overflow-hidden"
      style={{
        ...themeVars,
        background: currentTheme.gradients.background,
      } as React.CSSProperties}
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Film grain overlay */}
      <NoiseOverlay />

      {/* Stage-based content with transitions */}
      <AnimatePresence mode="wait">
        {stage === 'landing' && (
          <Landing key="landing" />
        )}
        
        {stage === 'game' && (
          <TheQuestion key="game" />
        )}
        
        {stage === 'wrapped' && (
          <WrappedSlides key="wrapped" onComplete={handleWrappedComplete} />
        )}
        
        {stage === 'success' && (
          <ReceiptCard key="success" />
        )}
      </AnimatePresence>
    </main>
  );
}
