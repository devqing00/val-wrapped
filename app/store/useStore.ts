import { create } from 'zustand';
import { ThemeId } from '../lib/themes';

export type Stage = 'landing' | 'game' | 'wrapped' | 'success';

interface AppState {
  // Current stage of the app
  stage: Stage;
  
  // Recipient name from URL param
  recipientName: string;
  
  // Sender name (the one creating the link)
  senderName: string;
  
  // Game timing
  startTime: number;
  endTime: number;
  
  // Number of YES buttons spawned (rejection attempts)
  spawnCount: number;
  
  // Theme selection
  theme: ThemeId;
  
  // Difficulty settings (dynamic)
  difficulty: number; // 1-10, affects button speed/evasion
  
  // Custom message from sender
  customMessage: string;
  
  // Actions
  setStage: (stage: Stage) => void;
  setRecipientName: (name: string) => void;
  setSenderName: (name: string) => void;
  setTheme: (theme: ThemeId) => void;
  setDifficulty: (difficulty: number) => void;
  setCustomMessage: (message: string) => void;
  startGame: () => void;
  incrementSpawn: () => void;
  finishGame: () => void;
  showWrapped: () => void;
  reset: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  stage: 'landing',
  recipientName: '',
  senderName: '',
  startTime: 0,
  endTime: 0,
  spawnCount: 0,
  theme: 'dreamy-pink',
  difficulty: 5,
  customMessage: '',
  
  setStage: (stage) => set({ stage }),
  
  setRecipientName: (name) => set({ recipientName: name }),
  
  setSenderName: (name) => set({ senderName: name }),
  
  setTheme: (theme) => set({ theme }),
  
  setDifficulty: (difficulty) => set({ difficulty: Math.max(1, Math.min(10, difficulty)) }),
  
  setCustomMessage: (message) => set({ customMessage: message }),
  
  startGame: () => set({ 
    stage: 'game', 
    startTime: Date.now(),
    spawnCount: 0 
  }),
  
  incrementSpawn: () => {
    const state = get();
    // Dynamic difficulty: increase difficulty as they try more
    const newSpawnCount = state.spawnCount + 1;
    const newDifficulty = Math.min(10, state.difficulty + (newSpawnCount > 5 ? 0.5 : 0.2));
    
    set({ 
      spawnCount: newSpawnCount,
      difficulty: newDifficulty,
    });
  },
  
  finishGame: () => set({ 
    stage: 'wrapped', // Go to wrapped slides first
    endTime: Date.now() 
  }),
  
  showWrapped: () => set({
    stage: 'wrapped',
  }),
  
  reset: () => set({
    stage: 'landing',
    startTime: 0,
    endTime: 0,
    spawnCount: 0,
    difficulty: 5,
  }),
}));

// Helper to calculate hesitation time in seconds
export const getHesitationTime = (startTime: number, endTime: number): number => {
  if (!startTime || !endTime) return 0;
  return Math.round((endTime - startTime) / 1000 * 10) / 10;
};

// Helper to get stubbornness level based on spawn count
export const getStubbornnessLevel = (spawnCount: number): string => {
  if (spawnCount === 0) return "Zero Resistance 😳";
  if (spawnCount <= 3) return "Easy Catch 💋";
  if (spawnCount <= 7) return "Bit of a Tease 😏";
  if (spawnCount <= 12) return "Made Me Sweat 🥵";
  if (spawnCount <= 20) return "Hard to Get (I Like It) 🔥";
  if (spawnCount <= 30) return "ABSOLUTELY STUBBORN 😤";
  return "UNHINGED BEHAVIOR 🫠";
};

// Helper to get price based on behavior
export const getDynamicPrice = (spawnCount: number): string => {
  if (spawnCount === 0) return "$0.00 (Priceless)";
  if (spawnCount <= 3) return "$4.99";
  if (spawnCount <= 7) return "$19.99";
  if (spawnCount <= 12) return "$99.99";
  if (spawnCount > 15) return "$999.99 (HARD TO GET TAX)";
  return "$49.99";
};
