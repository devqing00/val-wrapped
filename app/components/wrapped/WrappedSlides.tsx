'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, getHesitationTime, getStubbornnessLevel } from '../../store/useStore';
import { getTheme } from '../../lib/themes';
import { SecretMessage } from './SecretMessage';
import { TypingText } from '../ui/TypingText';

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  stat?: string;
  statLabel?: string;
  emoji: string;
  gradient: string;
}

interface SentimentData {
  excitement: number;
  hesitation: number;
  playfulness: number;
  romance: number;
  overallMood: string;
  emoji: string;
  description: string;
}

interface WrappedSlidesProps {
  onComplete: () => void;
}

export function WrappedSlides({ onComplete }: WrappedSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [poem, setPoem] = useState<string>('');
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { recipientName, senderName, startTime, endTime, spawnCount, theme, customMessage } = useStore();
  const currentTheme = getTheme(theme);
  
  const hesitationTime = getHesitationTime(startTime, endTime);
  const stubbornnessLevel = getStubbornnessLevel(spawnCount);

  // Fetch AI-generated content with country detection
  useEffect(() => {
    const fetchAIContent = async () => {
      setIsLoading(true);
      
      try {
        // Try to get country code from timezone or IP
        let countryCode = '';
        try {
          // Use timezone to infer country (rough approximation)
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const timezoneToCountry: Record<string, string> = {
            'Africa/Lagos': 'NG', 'Africa/Accra': 'GH', 'Africa/Nairobi': 'KE',
            'Africa/Johannesburg': 'ZA', 'America/New_York': 'US', 'America/Los_Angeles': 'US',
            'America/Chicago': 'US', 'Europe/London': 'GB', 'Australia/Sydney': 'AU',
            'Asia/Kolkata': 'IN', 'Asia/Manila': 'PH', 'America/Sao_Paulo': 'BR',
          };
          countryCode = timezoneToCountry[timezone] || '';
        } catch {
          // Ignore timezone detection errors
        }

        // Fetch poem and sentiment in parallel
        const [poemRes, sentimentRes] = await Promise.all([
          fetch('/api/ai/poem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipientName,
              senderName,
              spawnCount,
              hesitationTime,
              theme,
              countryCode,
            }),
          }),
          fetch('/api/ai/sentiment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              spawnCount,
              hesitationTime,
            }),
          }),
        ]);

        const poemData = await poemRes.json();
        const sentimentData = await sentimentRes.json();
        
        setPoem(poemData.poem);
        setSentiment(sentimentData);
      } catch (error) {
        console.error('Failed to fetch AI content:', error);
        setPoem(`To ${recipientName || 'my love'},\nYou said YES and made my heart soar,\nEvery moment with you, I adore.\nForever yours 💕`);
        setSentiment({
          excitement: 80,
          hesitation: 20,
          playfulness: 60,
          romance: 85,
          overallMood: 'Lovingly Yours',
          emoji: '💕',
          description: 'Love won in the end!',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAIContent();
  }, [recipientName, senderName, spawnCount, hesitationTime, theme]);

  // Get display names
  const displayRecipient = recipientName || 'You';
  const displaySender = senderName || 'Someone special';

  // Generate slides based on user data - memoized to prevent dependency issues
  const slides: Slide[] = useMemo(() => [
    {
      id: 'intro',
      title: 'YOU SAID YES! 💕',
      subtitle: `I knew you couldn\'t resist me 😏`,
      emoji: '🎉',
      gradient: `from-[${currentTheme.colors.primary}] via-pink-500 to-rose-500`,
    },
    {
      id: 'time',
      title: 'Time Before You Folded',
      stat: `${hesitationTime}s`,
      statLabel: hesitationTime < 3 ? 'Didn\'t even try to resist 😏' : hesitationTime < 10 ? 'That was almost too easy... 💋' : hesitationTime < 20 ? 'Kept me waiting, I like that 🔥' : hesitationTime < 40 ? 'Playing hard to get? I see you... 👀' : 'The anticipation was killing me! 🥵',
      emoji: '⏱️',
      gradient: 'from-purple-500 via-pink-500 to-red-500',
    },
    {
      id: 'resistance',
      title: 'Times You Said NO',
      stat: spawnCount === 0 ? '0' : `${spawnCount}`,
      statLabel: spawnCount === 0 ? 'Surrendered immediately... I love that 😈' : spawnCount <= 3 ? 'Barely resisted. We both knew how this ends 💋' : spawnCount <= 7 ? 'Made me work for it a little. Respect. 😏' : spawnCount <= 12 ? 'Wow, you really tested me there 🔥' : spawnCount <= 20 ? 'That was... intense. Worth the chase though 🥵' : spawnCount <= 30 ? 'STUBBORN AF but you\'re mine now 😤💕' : 'You\'re absolutely UNHINGED. I\'m kinda into it 🫠',
      emoji: spawnCount > 20 ? '🛡️' : spawnCount > 10 ? '🔥' : spawnCount > 5 ? '😏' : '💋',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
    },
    {
      id: 'personality',
      title: stubbornnessLevel,
      subtitle: sentiment?.description || 'Your resistance was noted... and attractive 😘',
      emoji: sentiment?.emoji || '✨',
      gradient: 'from-cyan-500 via-purple-500 to-pink-500',
    },
    {
      id: 'sentiment',
      title: sentiment?.overallMood || 'Your Energy',
      subtitle: 'I was reading you the whole time 👀',
      emoji: '📊',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    },
    {
      id: 'poem',
      title: '💌 I Wrote This For You',
      subtitle: poem || 'Loading something special...',
      emoji: '✍️',
      gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    },
    ...(customMessage ? [{
      id: 'message',
      title: '💝 A Special Message',
      subtitle: customMessage,
      emoji: '💌',
      gradient: 'from-pink-600 via-rose-600 to-red-600',
    }] : []),
    {
      id: 'final',
      title: `${displaySender} & ${displayRecipient}`,
      subtitle: `It\'s official now. You\'re stuck with me 😘💕`,
      emoji: '💑',
      gradient: 'from-amber-500 via-rose-500 to-pink-500',
    },
  ], [displayRecipient, displaySender, hesitationTime, spawnCount, stubbornnessLevel, sentiment, poem, currentTheme.colors.primary]);

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
      
      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    } else {
      onComplete();
    }
  }, [currentSlide, slides.length, onComplete]);

  // Handle tap/click to advance
  const handleTap = () => {
    nextSlide();
  };

  if (isLoading) {
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: currentTheme.gradients.background }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center" style={{ color: currentTheme.colors.text }}>
          <motion.div
            className="text-7xl mb-6"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            💕
          </motion.div>
          <p className="text-2xl font-semibold mb-2">Creating Your Story...</p>
          <p className="text-sm opacity-70">This is gonna be good ✨</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden cursor-pointer"
      onClick={handleTap}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[currentSlide].id}
          className={`absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8 bg-gradient-to-br ${slides[currentSlide].gradient}`}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -50 }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          {/* Parallax background elements */}
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl md:text-4xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                {['💕', '✨', '💖', '🌸', '💗', '💘', '🦋'][i % 7]}
              </motion.div>
            ))}
          </motion.div>

          {/* Main content */}
          <div className="relative z-10 text-center text-white max-w-md mx-auto px-4">
            {/* Emoji */}
            <motion.div
              className="text-7xl md:text-8xl mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            >
              {slides[currentSlide].emoji}
            </motion.div>

            {/* Title */}
            <motion.h1
              className="font-heading text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg leading-tight"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {slides[currentSlide].title}
            </motion.h1>

            {/* Stat (if present) */}
            {slides[currentSlide].stat && (
              <motion.div
                className="mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.4 }}
              >
                <span className="text-7xl md:text-9xl font-black drop-shadow-xl">
                  {slides[currentSlide].stat}
                </span>
              </motion.div>
            )}

            {/* Stat label or subtitle */}
            {slides[currentSlide].id === 'message' && customMessage ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={(e) => e.stopPropagation()}
              >
                <SecretMessage message={customMessage} />
              </motion.div>
            ) : slides[currentSlide].id === 'poem' ? (
              <motion.div
                className="font-mono text-sm md:text-base lg:text-lg opacity-90 drop-shadow whitespace-pre-line leading-relaxed max-w-md mx-auto italic"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <TypingText 
                  text={slides[currentSlide].subtitle || ''} 
                  speed={25}
                  className=""
                />
              </motion.div>
            ) : (slides[currentSlide].statLabel || slides[currentSlide].subtitle) && (
              <motion.p
                className="text-lg md:text-2xl opacity-90 drop-shadow whitespace-pre-line leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {slides[currentSlide].statLabel || slides[currentSlide].subtitle}
              </motion.p>
            )}

            {/* Sentiment bars for sentiment slide */}
            {slides[currentSlide].id === 'sentiment' && sentiment && (
              <motion.div
                className="mt-8 space-y-4 w-full max-w-sm mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  { label: 'Excitement', value: sentiment.excitement, color: 'bg-yellow-400' },
                  { label: 'Romance', value: sentiment.romance, color: 'bg-red-400' },
                  { label: 'Playfulness', value: sentiment.playfulness, color: 'bg-pink-400' },
                  { label: 'Hesitation', value: sentiment.hesitation, color: 'bg-purple-400' },
                ].map((item, index) => (
                  <div key={item.label} className="text-left">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${item.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ delay: 0.8 + index * 0.15, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Progress indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <motion.div
                key={index}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: index === currentSlide ? '1.5rem' : '0.5rem',
                  backgroundColor: index <= currentSlide ? 'white' : 'rgba(255,255,255,0.4)',
                }}
                animate={{ scale: index === currentSlide ? 1.1 : 1 }}
              />
            ))}
          </div>

          {/* Tap hint */}
          <motion.p
            className="absolute bottom-16 text-white/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{ delay: 1, duration: 2, repeat: Infinity }}
          >
            Tap to continue →
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
