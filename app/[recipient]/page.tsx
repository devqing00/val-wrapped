'use client';

import { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

import { useStore } from '../store/useStore';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';
import { Landing } from '../components/landing/Landing';
import { TheQuestion } from '../components/game/TheQuestion';
import { ReceiptCard } from '../components/receipt/ReceiptCard';
import { WrappedSlides } from '../components/wrapped/WrappedSlides';
import { getTheme, getThemeCSSVariables, ThemeId, themeList } from '../lib/themes';
import { AnimatedBackground } from '../components/canvas/AnimatedBackground';
import { Scene3D } from '../components/canvas/Scene3D';

export default function RecipientPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { stage, setRecipientName, setTheme, setStage, theme } = useStore();

  // Parse recipient name and theme from URL parameters
  useEffect(() => {
    const name = params?.recipient as string;
    if (name) {
      setRecipientName(decodeURIComponent(name));
    }
    
    // Check for theme in query params
    const themeParam = searchParams.get('theme') as ThemeId;
    if (themeParam && themeList.find(t => t.id === themeParam)) {
      setTheme(themeParam);
    }
  }, [params, searchParams, setRecipientName, setTheme]);

  // Get current theme
  const currentTheme = getTheme(theme);
  const themeVars = getThemeCSSVariables(currentTheme);

  // Handle wrapped completion
  const handleWrappedComplete = () => {
    setStage('success');
  };

  return (
    <main 
      className="min-h-screen overflow-auto"
      style={{
        ...themeVars,
        background: currentTheme.gradients.background,
      } as React.CSSProperties}
    >
      {/* 3D Background */}
      <Scene3D />
      
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
