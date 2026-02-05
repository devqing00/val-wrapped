'use client';

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { FallingYesButtons } from './FallingYesButtons';
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

interface SpawnedButton {
  id: number;
  x: number;
}

// Particle component for breaking hearts
const BreakingHearts = ({ x, y, heartKey }: { x: number; y: number; heartKey: number }) => {
  const hearts = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i * 45) * (Math.PI / 180),
    delay: (i * 0.02), // deterministic delay based on index
    rotateDir: i % 2 === 0 ? 360 : -360 // deterministic rotation
  })), []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {hearts.map(heart => (
        <motion.div
          key={`${heartKey}-${heart.id}`}
          className="absolute text-2xl"
          initial={{ x, y, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            x: x + Math.cos(heart.angle) * 150,
            y: y + Math.sin(heart.angle) * 150 + 100,
            opacity: 0,
            scale: 0.5,
            rotate: heart.rotateDir
          }}
          transition={{ duration: 0.8, delay: heart.delay, ease: "easeOut" }}
        >
          💔
        </motion.div>
      ))}
    </div>
  );
}

// Captcha modal
const CaptchaChallenge = ({ onSolve, onSkip }: { onSolve: () => void; onSkip: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
  >
    <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center shadow-2xl relative">
      <button
        onClick={onSkip}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
      >
        ×
      </button>
      <h3 className="text-lg font-bold text-gray-800 mb-4">🤖 Prove you&apos;re not a heartbreaker</h3>
      <div className="bg-gray-100 p-4 rounded-lg mb-4 relative overflow-hidden">
        <div className="text-2xl font-bold tracking-[0.5em] text-gray-700 
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
      <p className="text-sm text-gray-500 mb-4">Type what you see:</p>
      <button 
        onClick={onSolve}
        className="jelly-btn w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
      >
        YES ✓
      </button>
    </div>
  </motion.div>
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
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center shadow-2xl relative">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ×
        </button>
        <h3 className="text-lg font-bold text-gray-800 mb-4">🧮 Quick Math!</h3>
        <div className="text-4xl font-bold mb-2">1 + 1 = ?</div>
        <AnimatePresence>
          {showHint && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-pink-500 mb-4"
            >
              (Hint: The answer is also what you should click 😉)
            </motion.p>
          )}
        </AnimatePresence>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full px-4 py-2 border-2 border-pink-300 rounded-xl mb-4 text-center text-xl focus:outline-none focus:border-pink-500"
          placeholder="Your answer..."
          autoFocus
        />
        <button 
          onClick={handleSubmit}
          className="jelly-btn w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold"
        >
          Submit 📝
        </button>
      </div>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClick}
      className={`fixed inset-0 z-50 bg-[#0078D7] flex items-center justify-center ${canDismiss ? 'cursor-pointer' : 'cursor-wait'}`}
    >
      <div className="text-white p-8 max-w-2xl">
        <div className="text-[120px] md:text-[180px] leading-none mb-6">:(</div>
        <h2 className="text-xl md:text-2xl mb-4">Your device ran into a problem and needs to restart.</h2>
        <p className="text-base md:text-lg mb-6 opacity-90">
          We&apos;re just collecting some error info, and then we&apos;ll restart for you.
        </p>
        <div className="mb-4">
          <span className="text-lg">{Math.min(100, Math.round(progress))}% complete</span>
        </div>
        <div className="space-y-2 text-sm opacity-80">
          <p>For more information about this issue and possible fixes, visit</p>
          <p className="font-mono">https://www.justsayyes.com/stopcode</p>
        </div>
        <div className="mt-6 space-y-1 text-sm opacity-70">
          <p>If you call a support person, give them this info:</p>
          <p className="font-mono">Stop code: TOO_MANY_REJECTION_ATTEMPTS</p>
          <p className="font-mono">What failed: heart.exe</p>
        </div>
        {canDismiss && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-sm opacity-60"
          >
            Click anywhere to recover... (or just say YES 💕)
          </motion.p>
        )}
      </div>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50"
    >
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
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
        <motion.div 
          className="text-green-400 text-xs md:text-sm font-mono mb-4 opacity-80"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {stage >= 0 && "[ SYSTEM BREACH DETECTED ]"}
        </motion.div>
        
        {stage >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-500 text-sm md:text-base font-mono mb-3"
          >
            <DecryptedText 
              text="ACCESSING HEART DATABASE..."
              speed={30}
              sequential
              animateOn="view"
              className="text-green-500"
              encryptedClassName="text-green-700"
            />
          </motion.div>
        )}
        
        {stage >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-400 text-base md:text-lg font-mono mb-3"
          >
            <DecryptedText 
              text="FIREWALL BYPASSED... ✓"
              speed={25}
              sequential
              animateOn="view"
              className="text-green-400"
              encryptedClassName="text-green-600"
            />
          </motion.div>
        )}
        
        {stage >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-green-300 text-lg md:text-2xl font-mono font-bold mb-6"
          >
            <DecryptedText 
              text="[LOVE.exe INJECTED SUCCESSFULLY]"
              speed={20}
              sequential
              animateOn="view"
              className="text-green-300"
              encryptedClassName="text-green-500"
            />
          </motion.div>
        )}
        
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onDismiss}
            className="jelly-btn px-8 py-3 bg-green-500 text-black rounded-lg font-mono font-bold hover:bg-green-400 transition-colors"
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
          </motion.button>
        )}
        
        <motion.p 
          className="mt-6 text-green-600 text-xs font-mono opacity-60"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          Resistance is futile. Love always finds a way. 💚
        </motion.p>
      </div>
    </motion.div>
  );
};

// Jumpscare
const Jumpscare = ({ onDismiss }: { onDismiss: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 1500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ scale: 5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed inset-0 z-50 bg-pink-500 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div 
          className="text-[150px]"
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          💕
        </motion.div>
        <div className="text-white text-3xl font-bold">SAY YES ALREADY!</div>
      </div>
    </motion.div>
  );
};

export function TheQuestion() {
  const [spawnedButtons, setSpawnedButtons] = useState<SpawnedButton[]>([]);
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
  
  const spawnCounter = useRef(0);
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
    const id = particleCounter.current++;
    setParticles(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 1000);
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
    
    // Spawn falling button
    const vw = window.innerWidth;
    const randomX = 50 + Math.random() * (vw - 150);
    const newButton: SpawnedButton = {
      id: spawnCounter.current++,
      x: randomX
    };
    setSpawnedButtons(prev => [...prev, newButton]);
    
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

  const yesButton = (
    <motion.button
      key="yes"
      onClick={handleYesClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="jelly-btn flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold shadow-lg"
    >
      {reverseMode && !confessionMode ? "NO 💔" : "YES 💕"}
    </motion.button>
  );

  const noButton = (
    <motion.button
      key="no"
      onClick={handleNoInteraction}
      whileHover={{ scale: Math.max(0.9, noButtonScale) }}
      whileTap={{ scale: noButtonScale * 0.95 }}
      animate={{ scale: noButtonScale }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="jelly-btn flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold"
      style={{ 
        minWidth: noButtonScale < 0.5 ? '40px' : '80px',
        fontSize: noButtonScale < 0.5 ? '10px' : '14px'
      }}
    >
      {confessionMode ? "I give up 🏳️" : (reverseMode ? "YES 💕" : "NO")}
    </motion.button>
  );

  return (
    <motion.div 
      className={`min-h-screen w-full flex items-center justify-center p-4 overflow-auto ${isShaking ? 'animate-shake' : ''}`}
      animate={isShaking ? { x: [0, -10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {/* Falling YES buttons layer - mobile only */}
      <div className="md:hidden">
        <FallingYesButtons 
          buttons={spawnedButtons} 
          onYesClick={handleYesClick}
        />
      </div>

      {/* Breaking heart particles */}
      {particles.map(p => (
        <BreakingHearts key={p.id} x={p.x} y={p.y} heartKey={p.id} />
      ))}

      {/* Chaos event modals */}
      <AnimatePresence>
        {chaosEvent === 'captcha' && <CaptchaChallenge onSolve={handleChallengeComplete} onSkip={handleDismissEvent} />}
        {chaosEvent === 'math' && <MathChallenge onSolve={handleChallengeComplete} onWrong={handleChallengeFail} onSkip={handleDismissEvent} />}
        {chaosEvent === 'fake-crash' && <FakeCrash onDismiss={handleDismissEvent} />}
        {chaosEvent === 'jumpscare' && <Jumpscare onDismiss={handleDismissEvent} />}
        {chaosEvent === 'hacked' && <HackedScreen onDismiss={handleDismissEvent} />}
      </AnimatePresence>

      {/* Main card */}
      <GlassCard>
        <motion.div 
          className="text-center space-y-6"
          layout
        >
          {/* Sender status */}
          <motion.p 
            key={displaySender}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm opacity-70"
            style={{ color: currentTheme.colors.text }}
          >
            {displaySender}
          </motion.p>

          {/* Question */}
          <motion.h2 
            key={displayQuestion}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-heading text-2xl md:text-3xl font-bold"
            style={{ color: currentTheme.colors.text }}
          >
            {displayQuestion}
          </motion.h2>

          {/* Gaslight text */}
          <AnimatePresence mode="wait">
            {clickCount > 0 && (
              <motion.p
                key={noTextIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg text-pink-500"
              >
                {GASLIGHT_TEXTS[noTextIndex]}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Confession mode special text */}
          {confessionMode && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-500 italic"
            >
              Okay fine, I&apos;ll make it easy. Just click the white button 😊
            </motion.p>
          )}

          {/* Reverse mode warning */}
          {reverseMode && !confessionMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full inline-block"
            >
              ⚠️ Don't trust the labels... ⚠️
            </motion.div>
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
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="text-xs"
              style={{ color: currentTheme.colors.text }}
            >
              Clicks: {clickCount} 😅
            </motion.p>
          )}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
