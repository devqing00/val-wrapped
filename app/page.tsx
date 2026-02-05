'use client';

import { Suspense } from 'react';
import { NoiseOverlay } from './components/ui/NoiseOverlay';
import { LinkGenerator } from './components/home/LinkGenerator';
import { AnimatedBackground } from './components/canvas/AnimatedBackground';

export default function Home() {
  return (
    <main className="min-h-dvh overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Film grain overlay */}
      <NoiseOverlay />

      {/* Link Generator */}
      <Suspense fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-dream-pink">
          <div className="text-4xl animate-pulse">💕</div>
        </div>
      }>
        <LinkGenerator />
      </Suspense>
    </main>
  );
}