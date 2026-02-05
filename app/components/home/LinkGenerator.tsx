'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { themeList, getTheme, getThemeCSSVariables, ThemeId } from '../../lib/themes';
import { generateShortLink } from '../../lib/linkEncoder';

export function LinkGenerator() {
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('dreamy-pink');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // New: Social sharing states
  const [showSendOptions, setShowSendOptions] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  const currentTheme = getTheme(selectedTheme);
  const themeVars = getThemeCSSVariables(currentTheme);

  // Generate consistent random positions on mount only
  const floatingElements = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      emoji: ['💕', '✨', '💖', '🌸', '💗', '💘'][i % 6],
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, []); // Empty dependency array ensures this only runs once

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update page theme when selected theme changes
  useEffect(() => {
    document.documentElement.style.setProperty('--theme-primary', currentTheme.colors.primary);
    document.documentElement.style.setProperty('--theme-text', currentTheme.colors.text);
  }, [currentTheme]);

  const handleGenerate = () => {
    if (!recipientName.trim() || !senderName.trim()) return;
    
    // Use env var if available, otherwise fall back to window.location.origin
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (typeof window !== 'undefined' ? window.location.origin : '');
    const shortPath = generateShortLink({
      recipient: recipientName.trim(),
      sender: senderName.trim(),
      theme: selectedTheme,
      message: customMessage.trim() || undefined,
    });
    
    setGeneratedLink(`${baseUrl}${shortPath}`);
    setStep(3);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      
      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleVisit = () => {
    if (generatedLink) {
      window.open(generatedLink, '_blank');
    }
  };

  // Send link via WhatsApp
  const handleSendWhatsApp = () => {
    if (!generatedLink) return;
    
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = recipientPhone.replace(/[\s\-\(\)]/g, '');
    const message = `Hey ${recipientName}! 💕 Someone has something special for you... Open this: ${generatedLink}`;
    
    // WhatsApp API URL
    const whatsappUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // Send link via Email
  const handleSendEmail = () => {
    if (!generatedLink) return;
    
    const subject = `💕 Hey ${recipientName}, Someone Has Something to Ask You!`;
    const body = `Hey ${recipientName}! 💕\n\n${senderName} has something special for you. Open this link to see what it is:\n\n${generatedLink}\n\n(Made with Val Wrapped 💖)`;
    
    const mailtoUrl = recipientEmail
      ? `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      : `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoUrl;
  };

  const canProceed = step === 1 
    ? recipientName.trim() && senderName.trim()
    : true;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        ...themeVars,
        background: currentTheme.gradients.background,
        color: currentTheme.colors.text,
      }}
    >
      {/* Animated background elements - only render on client */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingElements.map((element) => (
            <motion.div
              key={element.id}
              className="absolute text-3xl opacity-20"
              style={{
                left: `${element.left}%`,
                top: `${element.top}%`,
              }}
              animate={{
                y: [-10, 10],
                rotate: [0, 10],
                scale: [1, 1.1],
              }}
              transition={{
                duration: element.duration,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: element.delay,
                ease: 'easeInOut',
              }}
            >
              {element.emoji}
            </motion.div>
          ))}
        </div>
      )}

      <GlassCard 
        className="max-w-lg w-full text-center my-8 relative z-10"
        style={{
          background: currentTheme.colors.cardBg,
          borderColor: currentTheme.colors.cardBorder,
        }}
      >
        {/* Logo */}
        <motion.div
          className="text-6xl mb-4"
          animate={{
            scale: [1, 1.1],
            rotate: [0, 5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          {currentTheme.emoji}
        </motion.div>

        <h1 
          className="font-heading text-4xl md:text-5xl font-bold mb-2"
          style={{ color: currentTheme.colors.text }}
        >
          Val Wrapped
        </h1>
        <p 
          className="mb-6 text-lg"
          style={{ color: currentTheme.colors.textMuted }}
        >
          Create a personalized Valentine&apos;s invitation ✨
        </p>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: step >= s ? '2rem' : '0.5rem',
                backgroundColor: step >= s ? currentTheme.colors.primary : currentTheme.colors.textMuted,
              }}
              animate={{ opacity: step >= s ? 1 : 0.4 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Names */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
            >
              <div>
                <label 
                  className="block text-sm font-medium mb-2 text-left"
                  style={{ color: currentTheme.colors.textMuted }}
                >
                  Your Name 🫵
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-6 py-4 text-lg rounded-2xl border-2 backdrop-blur-sm focus:outline-none transition-all"
                  style={{
                    borderColor: currentTheme.colors.primary + '40',
                    backgroundColor: currentTheme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
                    color: currentTheme.colors.text,
                  }}
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2 text-left"
                  style={{ color: currentTheme.colors.textMuted }}
                >
                  Their Name 💕
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && canProceed && setStep(2)}
                  placeholder="Enter their name..."
                  className="w-full px-6 py-4 text-lg rounded-2xl border-2 backdrop-blur-sm focus:outline-none transition-all"
                  style={{
                    borderColor: currentTheme.colors.primary + '40',
                    backgroundColor: currentTheme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
                    color: currentTheme.colors.text,
                  }}
                />
              </div>

              {/* Optional message */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2 text-left"
                  style={{ color: currentTheme.colors.textMuted }}
                >
                  Secret Message (optional) 💌
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  rows={2}
                  className="w-full px-6 py-4 text-base rounded-2xl border-2 backdrop-blur-sm focus:outline-none transition-all resize-none"
                  style={{
                    borderColor: currentTheme.colors.primary + '40',
                    backgroundColor: currentTheme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
                    color: currentTheme.colors.text,
                  }}
                />
              </div>

              <motion.button
                onClick={() => setStep(2)}
                disabled={!canProceed}
                className="w-full text-lg py-4 rounded-full font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{
                  background: currentTheme.gradients.button,
                  color: currentTheme.colors.buttonText,
                  boxShadow: currentTheme.effects.glow,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Next: Choose Theme →
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Theme Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
            >
              <p 
                className="text-sm font-medium mb-3"
                style={{ color: currentTheme.colors.textMuted }}
              >
                Pick a vibe for {recipientName || 'them'} ✨
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {themeList.map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className="relative p-3 rounded-xl border-2 transition-all cursor-pointer overflow-hidden"
                    style={{
                      borderColor: selectedTheme === theme.id 
                        ? theme.colors.primary 
                        : theme.colors.cardBorder,
                      background: theme.gradients.card,
                    }}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    {/* Selection indicator */}
                    {selectedTheme === theme.id && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          boxShadow: `inset 0 0 0 3px ${theme.colors.primary}`,
                        }}
                        layoutId="themeSelector"
                      />
                    )}
                    
                    <div 
                      className="text-2xl mb-1"
                      style={{ filter: theme.isDark ? 'none' : 'none' }}
                    >
                      {theme.emoji}
                    </div>
                    <div 
                      className="text-xs font-medium truncate"
                      style={{ color: theme.colors.text }}
                    >
                      {theme.name}
                    </div>
                    <div 
                      className="text-[10px] opacity-70"
                      style={{ color: theme.colors.textMuted }}
                    >
                      {theme.description}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Preview toggle */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm underline cursor-pointer"
                style={{ color: currentTheme.colors.textMuted }}
              >
                {showPreview ? 'Hide preview' : 'Preview theme'} 👀
              </button>

              {/* Theme preview */}
              <AnimatePresence>
                {showPreview && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div 
                      className="p-4 rounded-xl"
                      style={{ 
                        background: currentTheme.gradients.background,
                        color: currentTheme.colors.text,
                      }}
                    >
                      <p className="font-heading text-lg mb-2">
                        Hey {recipientName || 'You'}! 💌
                      </p>
                      <p className="text-sm" style={{ color: currentTheme.colors.textMuted }}>
                        {senderName || 'Someone'} has something to ask...
                      </p>
                      <div 
                        className="mt-3 px-4 py-2 rounded-full text-center text-sm font-semibold inline-block"
                        style={{
                          background: currentTheme.gradients.button,
                          color: currentTheme.colors.buttonText,
                        }}
                      >
                        Open Envelope ✉️
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-full font-semibold cursor-pointer border-2 transition-all"
                  style={{
                    borderColor: currentTheme.colors.primary,
                    color: currentTheme.colors.primary,
                    backgroundColor: 'transparent',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ← Back
                </motion.button>

                <motion.button
                  onClick={handleGenerate}
                  className="flex-1 py-3 rounded-full font-semibold cursor-pointer transition-all"
                  style={{
                    background: currentTheme.gradients.button,
                    color: currentTheme.colors.buttonText,
                    boxShadow: currentTheme.effects.glow,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Generate Link 💘
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Generated Link */}
          {step === 3 && generatedLink && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5"
            >
              <motion.div
                className="text-5xl"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                🎉
              </motion.div>

              <h2 
                className="font-heading text-2xl font-bold"
                style={{ color: currentTheme.colors.text }}
              >
                Link Ready!
              </h2>

              <p 
                className="text-sm"
                style={{ color: currentTheme.colors.textMuted }}
              >
                Send this to {recipientName} and see what happens... 👀
              </p>

              {/* Clean link display */}
              <div 
                className="rounded-xl p-4 break-all text-sm font-mono"
                style={{
                  backgroundColor: currentTheme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: currentTheme.colors.text,
                }}
              >
                {generatedLink}
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  onClick={handleCopy}
                  className="flex-1 px-6 py-3 rounded-full font-semibold cursor-pointer border-2 transition-all"
                  style={{
                    borderColor: currentTheme.colors.primary,
                    backgroundColor: copied ? currentTheme.colors.primary : 'transparent',
                    color: copied ? currentTheme.colors.buttonText : currentTheme.colors.primary,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? '✓ Copied!' : '📋 Copy Link'}
                </motion.button>
                
                <motion.button
                  onClick={handleVisit}
                  className="flex-1 px-6 py-3 rounded-full font-semibold cursor-pointer transition-all"
                  style={{
                    background: currentTheme.gradients.button,
                    color: currentTheme.colors.buttonText,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  👀 Preview
                </motion.button>
              </div>

              {/* WhatsApp/Email send options */}
              <motion.button
                onClick={() => setShowSendOptions(!showSendOptions)}
                className="text-sm cursor-pointer flex items-center justify-center gap-2"
                style={{ color: currentTheme.colors.textMuted }}
              >
                {showSendOptions ? '▼' : '▶'} Send directly via WhatsApp or Email
              </motion.button>

              <AnimatePresence>
                {showSendOptions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-3"
                  >
                    {/* WhatsApp Section */}
                    <div 
                      className="p-3 rounded-xl"
                      style={{
                        backgroundColor: currentTheme.isDark ? 'rgba(37, 211, 102, 0.1)' : 'rgba(37, 211, 102, 0.1)',
                        border: '1px solid rgba(37, 211, 102, 0.3)',
                      }}
                    >
                      <div className="flex gap-2 items-center">
                        <input
                          type="tel"
                          value={recipientPhone}
                          onChange={(e) => setRecipientPhone(e.target.value)}
                          placeholder="Phone (e.g. +234...)"
                          className="flex-1 px-3 py-2 text-sm rounded-lg border focus:outline-none"
                          style={{
                            borderColor: 'rgba(37, 211, 102, 0.5)',
                            backgroundColor: currentTheme.isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                            color: currentTheme.colors.text,
                          }}
                        />
                        <motion.button
                          onClick={handleSendWhatsApp}
                          className="px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer text-white"
                          style={{ backgroundColor: '#25D366' }}
                          whileTap={{ scale: 0.95 }}
                        >
                          📱 WhatsApp
                        </motion.button>
                      </div>
                      <p className="text-xs mt-1 opacity-70" style={{ color: currentTheme.colors.textMuted }}>
                        Leave blank to choose contact manually
                      </p>
                    </div>

                    {/* Email Section */}
                    <div 
                      className="p-3 rounded-xl"
                      style={{
                        backgroundColor: currentTheme.isDark ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
                        border: '1px solid rgba(234, 67, 53, 0.3)',
                      }}
                    >
                      <div className="flex gap-2 items-center">
                        <input
                          type="email"
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          placeholder="Email address (optional)"
                          className="flex-1 px-3 py-2 text-sm rounded-lg border focus:outline-none"
                          style={{
                            borderColor: 'rgba(234, 67, 53, 0.5)',
                            backgroundColor: currentTheme.isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                            color: currentTheme.colors.text,
                          }}
                        />
                        <motion.button
                          onClick={handleSendEmail}
                          className="px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer text-white"
                          style={{ backgroundColor: '#EA4335' }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ✉️ Email
                        </motion.button>
                      </div>
                      <p className="text-xs mt-1 opacity-70" style={{ color: currentTheme.colors.textMuted }}>
                        Opens your email app with a pre-written message
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={() => {
                  setStep(1);
                  setGeneratedLink('');
                  setRecipientName('');
                  setSenderName('');
                  setCustomMessage('');
                  setShowSendOptions(false);
                  setRecipientPhone('');
                  setRecipientEmail('');
                }}
                className="text-sm underline cursor-pointer"
                style={{ color: currentTheme.colors.textMuted }}
              >
                Create another link
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <p 
          className="text-xs mt-8"
          style={{ color: currentTheme.colors.textMuted }}
        >
          Share this link with your Valentine 💕
        </p>

        {/* Branding */}
        <p 
          className="text-[10px] mt-4 opacity-50"
          style={{ color: currentTheme.colors.textMuted }}
        >
          Made with 💕 by Qing
        </p>
      </GlassCard>
    </motion.div>
  );
}
