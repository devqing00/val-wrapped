'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useStore, getHesitationTime, getStubbornnessLevel, getDynamicPrice } from '../../store/useStore';
import { Confetti } from './Confetti';
import { audioManager } from '../../lib/audio';
import { getTheme, getThemeCSSVariables } from '../../lib/themes';

export function ReceiptCard() {
  const router = useRouter();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  
  const { recipientName, senderName, startTime, endTime, spawnCount, reset, theme } = useStore();
  const currentTheme = getTheme(theme);
  const themeVars = getThemeCSSVariables(currentTheme);

  const hesitationTime = getHesitationTime(startTime, endTime);
  const stubbornnessLevel = getStubbornnessLevel(spawnCount);
  const price = getDynamicPrice(spawnCount);

  const displayRecipient = recipientName || 'Someone Special';
  const displaySender = senderName || 'Your Valentine';

  // Get current date formatted
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Play success sound on mount
  useEffect(() => {
    audioManager.playSuccess();
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  }, []);

  // Close download menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showDownloadMenu && !(e.target as Element).closest('.download-menu-container')) {
        setShowDownloadMenu(false);
      }
    };

    if (showDownloadMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDownloadMenu]);

  // Download receipt as image
  const handleDownloadImage = useCallback(async () => {
    if (!receiptRef.current || isDownloading) return;
    
    setIsDownloading(true);
    setDownloadError(false);
    setShowDownloadMenu(false);

    try {
      const element = receiptRef.current;
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#FDFBF7',
        scale: 2,
        useCORS: true,
        logging: false,
        ignoreElements: (el) => {
          return el.classList?.contains('noise-overlay');
        },
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-receipt]');
          if (clonedElement) {
            (clonedElement as HTMLElement).style.backgroundColor = '#FDFBF7';
            (clonedElement as HTMLElement).style.color = '#1A1A1A';
          }
        }
      });

      const link = document.createElement('a');
      link.download = `val-wrapped-${displayRecipient.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      setDownloadError(true);
      setTimeout(() => setDownloadError(false), 3000);
    } finally {
      setIsDownloading(false);
    }
  }, [displayRecipient, isDownloading]);

  // Download receipt as PDF
  const handleDownloadPDF = useCallback(async () => {
    if (!receiptRef.current || isDownloading) return;
    
    setIsDownloading(true);
    setDownloadError(false);
    setShowDownloadMenu(false);

    try {
      const element = receiptRef.current;
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#FDFBF7',
        scale: 2,
        useCORS: true,
        logging: false,
        ignoreElements: (el) => {
          return el.classList?.contains('noise-overlay');
        },
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-receipt]');
          if (clonedElement) {
            (clonedElement as HTMLElement).style.backgroundColor = '#FDFBF7';
            (clonedElement as HTMLElement).style.color = '#1A1A1A';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`val-wrapped-${displayRecipient.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      setDownloadError(true);
      setTimeout(() => setDownloadError(false), 3000);
    } finally {
      setIsDownloading(false);
    }
  }, [displayRecipient, isDownloading]);

  // Share receipt as IMAGE using Web Share API with fallback
  const handleShare = useCallback(async () => {
    if (isSharing || !receiptRef.current) return;
    
    setIsSharing(true);
    const shareText = `${displaySender} & ${displayRecipient} are now officially Valentines! 💕`;

    try {
      // Generate the image first
      const element = receiptRef.current;
      const canvas = await html2canvas(element, {
        backgroundColor: '#FDFBF7',
        scale: 2,
        useCORS: true,
        logging: false,
        ignoreElements: (el) => {
          return el.classList?.contains('noise-overlay');
        },
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-receipt]');
          if (clonedElement) {
            (clonedElement as HTMLElement).style.backgroundColor = '#FDFBF7';
            (clonedElement as HTMLElement).style.color = '#1A1A1A';
          }
        }
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to create blob'));
        }, 'image/png', 1.0);
      });

      // Create file from blob
      const file = new File(
        [blob], 
        `val-wrapped-${displayRecipient.toLowerCase().replace(/\s+/g, '-')}.png`,
        { type: 'image/png' }
      );

      // Check if Web Share API is available
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        try {
          // Try to share with file
          if ('canShare' in navigator && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Val Wrapped 💕',
              text: shareText,
              files: [file],
            });
          } else {
            // Share without file (just text)
            await navigator.share({
              title: 'Val Wrapped 💕',
              text: shareText,
            });
          }
          
          // Haptic feedback on successful share
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
          
          setShowCopied(true);
          setTimeout(() => setShowCopied(false), 2000);
        } catch (shareError: unknown) {
          // If share fails or is cancelled, download image instead
          if (shareError instanceof Error && shareError.name !== 'AbortError') {
            console.log('Share failed, downloading instead:', shareError);
            // Download fallback
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `val-wrapped-${displayRecipient.toLowerCase().replace(/\s+/g, '-')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
            
            if ('vibrate' in navigator) {
              (navigator as Navigator & { vibrate: (pattern: number | number[]) => boolean }).vibrate(50);
            }
          }
        }
      } else {
        // No Web Share API - download the image
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `val-wrapped-${displayRecipient.toLowerCase().replace(/\s+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
        
        if ('vibrate' in navigator) {
          (navigator as Navigator & { vibrate: (pattern: number | number[]) => boolean }).vibrate(50);
        }
      }
    } catch (error: unknown) {
      console.error('Share failed:', error);
      alert('Failed to share. Please try the download option instead.');
    } finally {
      setIsSharing(false);
    }
  }, [displayRecipient, displaySender, isSharing]);

  return (
    <>
      <Confetti />
      
      <motion.div
        className="min-h-screen px-4 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={themeVars}
      >
        <div className="w-full flex flex-col items-center">
        <motion.div
          className="w-full max-w-sm"
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: 0.3,
          }}
        >
          {/* Official Banner */}
          <motion.div
            className="text-center mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span 
              className="px-6 py-2 rounded-full text-lg font-bold inline-block"
              style={{
                background: currentTheme.gradients.button,
                color: currentTheme.colors.buttonText,
                boxShadow: currentTheme.effects.glow,
              }}
            >
              💕 {displaySender} & {displayRecipient} 💕
            </span>
            <p 
              className="mt-2 font-heading text-lg"
              style={{ color: currentTheme.colors.text }}
            >
              Are now officially Valentines!
            </p>
          </motion.div>

          {/* Receipt */}
          <div
            ref={receiptRef}
            data-receipt="true"
            className="receipt mx-auto font-receipt"
            style={{ 
              backgroundColor: '#FDFBF7', 
              color: '#1A1A1A' 
            }}
          >
            {/* Receipt Header */}
            <div className="text-center border-b border-dashed pb-4 mb-4" style={{ borderColor: 'rgba(26, 26, 26, 0.3)' }}>
              <div className="text-3xl mb-2">💕</div>
              <h1 
                className="font-heading text-xl font-bold tracking-wide"
              >
                VAL WRAPPED
              </h1>
              <p className="text-xs mt-1" style={{ color: 'rgba(26, 26, 26, 0.6)' }}>OFFICIAL LOVE RECEIPT</p>
            </div>

            {/* Receipt Details */}
            <div className="space-y-2 text-sm border-b border-dashed pb-4 mb-4" style={{ borderColor: 'rgba(26, 26, 26, 0.3)' }}>
              <div className="flex justify-between">
                <span>DATE:</span>
                <span>{currentDate}</span>
              </div>
              <div className="flex justify-between">
                <span>TIME:</span>
                <span>{currentTime}</span>
              </div>
              <div className="flex justify-between">
                <span>FROM:</span>
                <span className="font-bold">{displaySender.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>TO:</span>
                <span className="font-bold">{displayRecipient.toUpperCase()}</span>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold">1x ACCEPTANCE SPEED</div>
                  <div className="text-xs ml-2" style={{ color: 'rgba(26, 26, 26, 0.6)' }}>
                    Decision time
                  </div>
                </div>
                <span>{hesitationTime}s</span>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold">1x STUBBORNNESS LVL</div>
                  <div className="text-xs ml-2" style={{ color: 'rgba(26, 26, 26, 0.6)' }}>
                    {spawnCount} escape attempts
                  </div>
                </div>
                <span className="text-right text-xs max-w-24">{stubbornnessLevel}</span>
              </div>

              {spawnCount > 10 && (
                <div className="flex justify-between items-start" style={{ color: '#FF004D' }}>
                  <div>
                    <div className="font-bold">⚠️ HARD TO GET</div>
                    <div className="text-xs ml-2">
                      But worth the chase!
                    </div>
                  </div>
                  <span>VERIFIED</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t-2 pt-4 mb-4" style={{ borderColor: '#1A1A1A' }}>
              <div className="flex justify-between text-lg font-bold">
                <span>TOTAL:</span>
                <span>FOREVER</span>
              </div>
              <div className="flex justify-between text-sm mt-1" style={{ color: 'rgba(26, 26, 26, 0.6)' }}>
                <span>Love tax:</span>
                <span>{price}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs border-t border-dashed pt-4" style={{ color: 'rgba(26, 26, 26, 0.6)', borderColor: 'rgba(26, 26, 26, 0.3)' }}>
              <p className="mb-2">━━━━━━━━━━━━━━━━━━━━</p>
              <p>THANK YOU FOR SAYING YES!</p>
              <p className="mt-1">💕 NO REFUNDS 💕</p>
              <p className="mt-3 text-[9px] opacity-60">Made with 💕 by Qing</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 justify-center relative">
            {/* Download Button with Menu */}
            <div className="relative download-menu-container">
              <motion.button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                disabled={isDownloading}
                className="flex items-center gap-2 text-sm cursor-pointer disabled:opacity-50 px-6 py-3 rounded-full font-semibold transition-all"
                style={{
                  background: currentTheme.gradients.button,
                  color: currentTheme.colors.buttonText,
                }}
                whileTap={{ scale: 0.95 }}
              >
                {isDownloading ? '⏳ Saving...' : downloadError ? '❌ Error' : '📥 Download'}
              </motion.button>

              {/* Download Format Menu */}
              {showDownloadMenu && !isDownloading && (
                <motion.div
                  className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border-2 overflow-hidden z-50 whitespace-nowrap"
                  style={{ borderColor: currentTheme.colors.primary }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <button
                    onClick={handleDownloadImage}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors text-sm font-medium"
                    style={{ color: '#1A1A1A' }}
                  >
                    📷 Save as Image (PNG)
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors text-sm font-medium border-t"
                    style={{ color: '#1A1A1A' }}
                  >
                    📄 Save as PDF
                  </button>
                </motion.div>
              )}
            </div>
            
            <motion.button
              onClick={handleShare}
              disabled={isSharing}
              className="flex items-center gap-2 text-sm cursor-pointer disabled:opacity-50 px-6 py-3 rounded-full font-semibold border-2 transition-all"
              style={{
                borderColor: currentTheme.colors.primary,
                color: showCopied ? currentTheme.colors.buttonText : currentTheme.colors.primary,
                backgroundColor: showCopied ? currentTheme.colors.primary : 'transparent',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {showCopied ? '✓ Copied!' : isSharing ? '⏳...' : '🔗 Share'}
            </motion.button>
          </div>

          {/* Try Again */}
          <motion.button
            onClick={() => {
              reset();
              router.push('/');
            }}
            className="block mx-auto mt-4 text-sm cursor-pointer underline transition-all"
            style={{ color: currentTheme.colors.textMuted }}
          >
            Create your own link?
          </motion.button>
        </motion.div>
        </div>
      </motion.div>
    </>
  );
}
