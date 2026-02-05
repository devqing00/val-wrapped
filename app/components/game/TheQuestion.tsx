'use client';

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useStore } from '../../store/useStore';
import { DecryptedText } from '../ui/DecryptedText';
import { FaultyTerminal } from '../ui/FaultyTerminal';
import { getTheme } from '../../lib/themes';

// Gaslight texts that cycle through
const GASLIGHT_TEXTS = [
  "Wrong answer 🙈", "Oops! Try again 💕", "That's not it 🌹", "Hmm, think again 💝",
  "Are you sure? 🥺", "Really? 😢", "But why tho 💔", "Reconsider pls 🙏",
  "I saw you hesitate 👀", "Your finger slipped right? 😌", "Let me ask again... 💫",
  "The universe wants you to say YES ✨", "Cupid is disappointed 😤", "Try clicking the other one 👉",
  "Error 404: NO not found 🚫", "That button doesn't work 🔧", "Nice try 😏",
  "You're breaking my heart 💔", "Even your phone wants you to say YES 📱", "Plot twist: Say YES 🎬",
  "I believe in you 💪", "So close! Try the pink one 🎀", "Almost got it! 👆",
  "Loading better decision... ⏳", "Achievement unlocked: Stubbornness 🏆", "Bruh 😐",
  "Nah fr? 💀", "You're wildin' 😭", "Caught in 4K 📸", "Main character energy but wrong script 🎭",
  "The math ain't mathing 🧮", "This is your sign ✨", "Manifesting your YES 🔮",
  "Speak now or forever hold your peace 💒", "Love finds a way 💕", "You miss 100% of YES you don't click 🏀",
  "Even Mercury retrograde can't stop this 🪐", "Your future self will thank you 🙌",
  "Imagine telling our kids you said no 👶", "The audacity 😤", "You're doing amazing sweetie but click YES 💅",
  "I'm literally right here 🙋", "This is giving rejection 🙅", "Not the no again 😩",
  "Babe wake up new answer just dropped 💥", "Real ones say YES 👑", "Okay but have you considered... YES? 🤔",
  "This is not a drill 🚨", "Sending positive vibes ~~~ 🌊", "Trust the process 🙏",
  "Everything happens for a reason... say YES 🦋", "Plot armor says you'll say YES eventually 🛡️",
  "L + ratio + say yes 📉", "You're on thin ice bestie 🧊", "The algorithm wants you to click YES 📊",
  "This is the way 🌟", "Manifesting ✨ YES ✨ energy 🔮", "Bet you won't say YES 🎰",
  "Reverse psychology: don't click YES 🧠", "The FitnessGram Pacer Test... just kidding, say YES 🏃",
  "*sad violin noises* 🎻", "You have mass without aura rn 🙄", "Look at me... I am the captain now 🚢"
];

// Dynamic question texts based on how stubborn they are
const QUESTION_VARIANTS = [
  "Will you be my Valentine? 💕",
  "So... Valentine? 🥺",
  "Seriously though? 😅",
  "Come on now... 💔",
  "This is getting silly 🙃",
  "I'm not giving up 💪",
  "We can do this all day ⏰",
  "You know you want to 😏",
  "Just one little YES 🙏",
  "The button's RIGHT THERE 👆",
  "PLEASE 😭😭😭",
  "I'm on my knees 🧎",
  "Last chance... jk 😈",
  "Fine, I'll wait ⏳",
  "*stares intensely* 👁️👁️"
];

// Sender update messages
const SENDER_UPDATES = [
  "{name} is waiting...",
  "{name} is getting nervous...",
  "{name}'s heart is racing...",
  "{name} is sweating...",
  "{name} is questioning everything...",
  "{name}'s hope is fading...",
  "{name} is dramatically sighing...",
  "{name} needs therapy after this...",
  "{name} is writing their villain arc...",
  "{name} has entered their flop era...",
  "{name} is contemplating life choices..."
];

// Chaos events for unexpected twists
type ChaosEvent = 'none' | 'swap' | 'captcha' | 'math' | 'tiny' | 'reverse' | 'fake-crash' | 'jumpscare' | 'confession' | 'hacked';

// Simple CSS-based heart particle (no Framer Motion)
const HeartParticle = ({ x, y, id }: { x: number; y: number; id: number }) => {
  const angle = (id % 8) * 45 * (Math.PI / 180);
  const endX = x + Math.cos(angle) * 100;
  const endY = y + Math.sin(angle) * 100 + 50;
  
  return (
    <div
      className="fixed text-xl pointer-events-none animate-particle-burst"
      style={{
        left: x,
        top: y,
        '--end-x': `${endX - x}px`,
        '--end-y': `${endY - y}px`,
      } as React.CSSProperties}
    >
      💔
    </div>
  );
};

// Captcha modal
const CaptchaChallenge = ({ onSolve, onSkip }: { onSolve: () => void; onSkip: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-modal-in">
    <div className="bg-white rounded-xl p-4 max-w-xs w-full text-center shadow-2xl relative">
      <button
        onClick={onSkip}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl leading-none"
      >
        ×
      </button>
      <h3 className="text-sm font-bold text-gray-800 mb-3">🤖 Prove you&apos;re not a heartbreaker</h3>
      <div className="bg-gray-100 p-3 rounded-lg mb-3 relative overflow-hidden">
        <div className="text-xl font-bold tracking-[0.4em] text-gray-700 
          [text-shadow:2px_2px_0_#fff,-2px_-2px_0_#fff,2px_-2px_0_#fff,-2px_2px_0_#fff]
          transform skew-x-[-5deg] italic select-none"
          style={{ fontFamily: 'Comic Sans MS, cursive' }}
        >
          YE5
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            <line x1="10%" y1="30%" x2="90%" y2="70%" stroke="#888" strokeWidth="2" />
            <line x1="20%" y1="80%" x2="80%" y2="20%" stroke="#888" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-3">Type what you see:</p>
      <button 
        onClick={onSolve}
        className="jelly-btn w-full py-2 text-sm bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform"
      >
        YES ✓
      </button>
    </div>
  </div>
);

// Math problem modal
const MathChallenge = ({ onSolve, onWrong, onSkip }: { onSolve: () => void; onWrong: () => void; onSkip: () => void }) => {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (answer.toLowerCase().includes('yes') || answer === '2') {
      onSolve();
    } else {
      onWrong();
      setAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-modal-in">
      <div className="bg-white rounded-xl p-4 max-w-xs w-full text-center shadow-2xl relative">
        <button
          onClick={onSkip}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ×
        </button>
        <h3 className="text-sm font-bold text-gray-800 mb-3">🧮 Quick Math!</h3>
        <div className="text-3xl font-bold mb-2">1 + 1 = ?</div>
        {showHint && (
          <p className="text-xs text-pink-500 mb-3 animate-fade-in">
            (Hint: The answer is also what you should click 😉)
          </p>
        )}
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer('YES')}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full px-3 py-2 border-2 border-pink-300 rounded-lg mb-3 text-center text-lg focus:outline-none focus:border-pink-500"
          placeholder="Your answer..."
          autoFocus
        />
        <button 
          onClick={handleSubmit}
          className="jelly-btn w-full py-2 text-sm bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold"
        >
          Submit 📝
        </button>
      </div>
    </div>
  );
};

// Realistic Blue Screen of Death
const FakeCrash = ({ onDismiss }: { onDismiss: () => void }) => {
  const [canDismiss, setCanDismiss] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate collecting error info progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    // Allow dismiss after 3 seconds
    const timer = setTimeout(() => setCanDismiss(true), 3000);
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  const handleClick = () => {
    if (canDismiss) onDismiss();
  };

  return (
    <div
      onClick={handleClick}
      className={`fixed inset-0 z-50 bg-[#0078D7] flex items-center justify-center px-4 animate-fade-in ${canDismiss ? 'cursor-pointer' : 'cursor-wait'}`}
    >
      <div className="text-white p-6 max-w-md">
        <div className="text-[80px] md:text-[120px] leading-none mb-4">:(</div>
        <h2 className="text-lg md:text-xl mb-3">Your device ran into a problem and needs to restart.</h2>
        <p className="text-sm md:text-base mb-4 opacity-90">
          We&apos;re just collecting some error info, and then we&apos;ll restart for you.
        </p>
        <div className="mb-3">
          <span className="text-base">{Math.min(100, Math.round(progress))}% complete</span>
        </div>
        <div className="space-y-1 text-xs opacity-80">
          <p>For more information about this issue and possible fixes, visit</p>
          <p className="font-mono text-xs">https://www.justsayyes.com/stopcode</p>
        </div>
        <div className="mt-4 space-y-1 text-xs opacity-70">
          <p>If you call a support person, give them this info:</p>
          <p className="font-mono text-xs">Stop code: TOO_MANY_REJECTION_ATTEMPTS</p>
          <p className="font-mono text-xs">What failed: heart.exe</p>
        </div>
        {canDismiss && (
          <p className="mt-6 text-xs opacity-60 animate-fade-in">
            Click anywhere to recover... (or just say YES 💕)
          </p>
        )}
      </div>
    </div>
  );
};

// Hacked screen with FaultyTerminal background and DecryptedText
const HackedScreen = ({ onDismiss }: { onDismiss: () => void }) => {
  const [showButton, setShowButton] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 800),
      setTimeout(() => setStage(2), 1600),
      setTimeout(() => setStage(3), 2400),
      setTimeout(() => setShowButton(true), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* FaultyTerminal Background */}
      <div className="absolute inset-0">
        <FaultyTerminal 
          tint="#00ff00"
          brightness={0.3}
          glitchAmount={2}
          flickerAmount={1.5}
          scanlineIntensity={0.5}
          curvature={0.1}
          mouseReact={false}
        />
      </div>
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="text-green-400 text-[10px] md:text-xs font-mono mb-3 opacity-80 animate-pulse-fast">
          {stage >= 0 && "[ SYSTEM BREACH DETECTED ]"}
        </div>
        
        {stage >= 1 && (
          <div className="text-green-500 text-xs md:text-sm font-mono mb-2 animate-fade-in">
            <DecryptedText 
              text="ACCESSING HEART DATABASE..."
              speed={30}
              sequential
              animateOn="view"
              className="text-green-500"
              encryptedClassName="text-green-700"
            />
          </div>
        )}
        
        {stage >= 2 && (
          <div className="text-green-400 text-sm md:text-base font-mono mb-2 animate-fade-in">
            <DecryptedText 
              text="FIREWALL BYPASSED... ✓"
              speed={25}
              sequential
              animateOn="view"
              className="text-green-400"
              encryptedClassName="text-green-600"
            />
          </div>
        )}
        
        {stage >= 3 && (
          <div className="text-green-300 text-base md:text-xl font-mono font-bold mb-4 animate-bounce-in">
            <DecryptedText 
              text="[LOVE.exe INJECTED SUCCESSFULLY]"
              speed={20}
              sequential
              animateOn="view"
              className="text-green-300"
              encryptedClassName="text-green-500"
            />
          </div>
        )}
        
        {showButton && (
          <button
            onClick={onDismiss}
            className="jelly-btn px-6 py-2 text-sm bg-green-500 text-black rounded-lg font-mono font-bold hover:bg-green-400 transition-colors animate-fade-in"
          >
            <span className="mr-2">&gt;</span>
            <DecryptedText 
              text="ACCEPT_LOVE.bat"
              speed={40}
              sequential
              animateOn="view"
              className="text-black"
              encryptedClassName="text-green-800"
            />
          </button>
        )}
        
        <p className="mt-4 text-green-600 text-[10px] font-mono opacity-60 animate-pulse-slow">
          Resistance is futile. Love always finds a way. 💚
        </p>
      </div>
    </div>
  );
};

// Jumpscare
const Jumpscare = ({ onDismiss }: { onDismiss: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 1500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-50 bg-pink-500 flex items-center justify-center px-4 animate-jumpscare">
      <div className="text-center">
        <div className="text-[100px] animate-shake-rotate">
          💕
        </div>
        <div className="text-white text-2xl font-bold">SAY YES ALREADY!</div>
      </div>
    </div>
  );
};

export function TheQuestion() {
  const [noTextIndex, setNoTextIndex] = useState(0);
  const [noButtonScale, setNoButtonScale] = useState(1);
  const [isShaking, setIsShaking] = useState(false);
  const [buttonsSwapped, setButtonsSwapped] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [senderUpdateIndex, setSenderUpdateIndex] = useState(-1);
  const [chaosEvent, setChaosEvent] = useState<ChaosEvent>('none');
  const [particles, setParticles] = useState<{ x: number; y: number; id: number }[]>([]);
  const [reverseMode, setReverseMode] = useState(false);
  const [confessionMode, setConfessionMode] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  
  const particleCounter = useRef(0);
  
  const senderName = useStore((state) => state.senderName);
  const finishGame = useStore((state) => state.finishGame);
  const incrementSpawn = useStore((state) => state.incrementSpawn);
  const theme = useStore((state) => state.theme);
  
  const currentTheme = getTheme(theme);

  const triggerShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }, []);

  const spawnParticles = useCallback((e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    // Spawn a few particles with staggered IDs
    for (let i = 0; i < 4; i++) {
      const id = particleCounter.current++;
      setTimeout(() => {
        setParticles(prev => [...prev, { x, y, id }]);
        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== id));
        }, 600);
      }, i * 50);
    }
  }, []);

  const getChaosEventForClick = (clickNum: number): ChaosEvent => {
    // Specific chaos events at certain click thresholds
    if (clickNum === 5) return 'swap';
    if (clickNum === 8) return 'math';
    if (clickNum === 12) return 'captcha';
    if (clickNum === 15) return 'fake-crash';
    if (clickNum === 18) return 'jumpscare';
    if (clickNum === 22) return 'hacked';
    if (clickNum === 25) return 'tiny';
    if (clickNum === 30) return 'reverse';
    if (clickNum >= 35) return 'confession';
    
    // Random swaps after initial swap
    if (clickNum > 5 && clickNum % 3 === 0 && Math.random() > 0.5) {
      return 'swap';
    }
    
    return 'none';
  };

  const handleNoInteraction = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Strong vibration feedback
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    // Only in confession mode does clicking this button trigger YES
    if (confessionMode) {
      finishGame();
      return;
    }
    
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    const clicks = newClickCount;
    
    // Track resistance in store
    incrementSpawn();
    
    // Cycle gaslight text
    setNoTextIndex(prev => (prev + 1) % GASLIGHT_TEXTS.length);
    
    // Shrink button progressively
    setNoButtonScale(prev => Math.max(0.3, prev - 0.05));
    
    // Spawn particles
    spawnParticles(e);
    
    // Trigger shake on rapid clicks
    if (clicks % 3 === 0) {
      triggerShake();
    }
    
    // Update question text
    if (clicks > 3 && clicks % 4 === 0) {
      setQuestionIndex(prev => Math.min(prev + 1, QUESTION_VARIANTS.length - 1));
    }
    
    // Update sender message
    if (clicks > 2 && clicks % 3 === 0) {
      setSenderUpdateIndex(prev => Math.min(prev + 1, SENDER_UPDATES.length - 1));
    }
    
    // Check for chaos events
    const chaos = getChaosEventForClick(clicks);
    if (chaos !== 'none') {
      setChaosEvent(chaos);
      
      if (chaos === 'swap') {
        setButtonsSwapped(prev => !prev);
        setChaosEvent('none'); // Immediate effect
      } else if (chaos === 'tiny') {
        setNoButtonScale(0.15);
        setChaosEvent('none');
      } else if (chaos === 'reverse') {
        setReverseMode(true);
        setChaosEvent('none');
      } else if (chaos === 'confession') {
        setConfessionMode(true);
        setChaosEvent('none');
      }
    }
  }, [clickCount, finishGame, reverseMode, confessionMode, spawnParticles, triggerShake]);

  const handleYesClick = useCallback(() => {
    finishGame();
  }, [finishGame]);

  const handleChallengeComplete = useCallback(() => {
    setChaosEvent('none');
    finishGame();
  }, [finishGame]);

  const handleChallengeFail = useCallback(() => {
    triggerShake();
  }, [triggerShake]);

  const handleDismissEvent = useCallback(() => {
    setChaosEvent('none');
  }, []);

  const displayQuestion = QUESTION_VARIANTS[questionIndex];
  const displaySender = senderUpdateIndex >= 0 
    ? SENDER_UPDATES[senderUpdateIndex].replace('{name}', senderName)
    : `From ${senderName} 💌`;

  // CSS-based buttons (no Framer Motion overhead)
  const yesButton = (
    <button
      key="yes"
      onClick={handleYesClick}
      className="jelly-btn flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold shadow-lg 
        transition-transform duration-150 hover:scale-110 active:scale-95"
    >
      {reverseMode && !confessionMode ? "NO 💔" : "YES 💕"}
    </button>
  );

  const noButton = (
    <button
      key="no"
      onClick={handleNoInteraction}
      className="jelly-btn flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold
        transition-all duration-200 hover:scale-95 active:scale-90"
      style={{ 
        transform: `scale(${noButtonScale})`,
        minWidth: noButtonScale < 0.5 ? '40px' : '80px',
        fontSize: noButtonScale < 0.5 ? '10px' : '14px'
      }}
    >
      {confessionMode ? "I give up 🏳️" : (reverseMode ? "YES 💕" : "NO")}
    </button>
  );

  return (
    <div 
      className={`min-h-screen w-full flex items-center justify-center px-4 pt-20 pb-8 overflow-auto ${isShaking ? 'animate-shake' : ''}`}
    >
      <div className="w-full max-w-md mx-auto">
      {/* Breaking heart particles - CSS animated */}
      <div className="pointer-events-none fixed inset-0 z-50">
        {particles.map(p => (
          <HeartParticle key={p.id} x={p.x} y={p.y} id={p.id} />
        ))}
      </div>

      {/* Chaos event modals */}
      {chaosEvent === 'captcha' && <CaptchaChallenge onSolve={handleChallengeComplete} onSkip={handleDismissEvent} />}
      {chaosEvent === 'math' && <MathChallenge onSolve={handleChallengeComplete} onWrong={handleChallengeFail} onSkip={handleDismissEvent} />}
      {chaosEvent === 'fake-crash' && <FakeCrash onDismiss={handleDismissEvent} />}
      {chaosEvent === 'jumpscare' && <Jumpscare onDismiss={handleDismissEvent} />}
      {chaosEvent === 'hacked' && <HackedScreen onDismiss={handleDismissEvent} />}

      {/* Main card */}
      <GlassCard>
        <div className="text-center space-y-6">
          {/* Sender status */}
          <p 
            className="text-sm opacity-70 animate-fade-in"
            style={{ color: currentTheme.colors.text }}
          >
            {displaySender}
          </p>

          {/* Question */}
          <h2 
            className="font-heading text-2xl md:text-3xl font-bold animate-fade-in"
            style={{ color: currentTheme.colors.text }}
          >
            {displayQuestion}
          </h2>

          {/* Gaslight text */}
          {clickCount > 0 && (
            <p
              key={noTextIndex}
              className="text-lg text-pink-500 animate-fade-in"
            >
              {GASLIGHT_TEXTS[noTextIndex]}
            </p>
          )}

          {/* Confession mode special text */}
          {confessionMode && (
            <p className="text-sm text-gray-500 italic animate-fade-in">
              Okay fine, I&apos;ll make it easy. Just click the white button 😊
            </p>
          )}

          {/* Reverse mode warning */}
          {reverseMode && !confessionMode && (
            <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full inline-block animate-bounce-in">
              ⚠️ Don&apos;t trust the labels... ⚠️
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 justify-center items-center">
            {buttonsSwapped ? (
              <>
                {noButton}
                {yesButton}
              </>
            ) : (
              <>
                {yesButton}
                {noButton}
              </>
            )}
          </div>

          {/* Click counter easter egg */}
          {clickCount >= 10 && (
            <p
              className="text-xs opacity-30"
              style={{ color: currentTheme.colors.text }}
            >
              Clicks: {clickCount} 😅
            </p>
          )}
        </div>
      </GlassCard>
      </div>
    </div>
  );
}
