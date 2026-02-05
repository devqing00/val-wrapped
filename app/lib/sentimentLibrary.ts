/**
 * Sentiment Description Library for Val Wrapped
 * Used as fallback when AI API is rate-limited or unavailable
 */

export interface SentimentData {
  excitement: number;
  hesitation: number;
  playfulness: number;
  romance: number;
  overallMood: string;
  emoji: string;
  description: string;
}

// Zero resistance (instant YES)
const ZERO_RESISTANCE_SENTIMENTS: SentimentData[] = [
  {
    excitement: 95,
    hesitation: 5,
    playfulness: 30,
    romance: 90,
    overallMood: 'Instantly Smitten',
    emoji: '😍',
    description: 'You couldn\'t click YES fast enough!',
  },
  {
    excitement: 98,
    hesitation: 2,
    playfulness: 25,
    romance: 95,
    overallMood: 'Love at First Sight',
    emoji: '💘',
    description: 'Zero hesitation, pure romance!',
  },
  {
    excitement: 92,
    hesitation: 8,
    playfulness: 35,
    romance: 88,
    overallMood: 'Immediate Surrender',
    emoji: '🥰',
    description: 'Didn\'t even think twice!',
  },
  {
    excitement: 100,
    hesitation: 0,
    playfulness: 20,
    romance: 100,
    overallMood: 'Absolutely Certain',
    emoji: '💖',
    description: 'The fastest YES in history!',
  },
  {
    excitement: 90,
    hesitation: 10,
    playfulness: 40,
    romance: 85,
    overallMood: 'Effortlessly Yours',
    emoji: '✨',
    description: 'No games, just pure vibes!',
  },
];

// Light resistance (1-5 clicks)
const LIGHT_RESISTANCE_SENTIMENTS: SentimentData[] = [
  {
    excitement: 80,
    hesitation: 25,
    playfulness: 60,
    romance: 75,
    overallMood: 'Playfully Shy',
    emoji: '🥰',
    description: 'A little hesitation, but the heart won!',
  },
  {
    excitement: 85,
    hesitation: 20,
    playfulness: 55,
    romance: 80,
    overallMood: 'Sweetly Nervous',
    emoji: '😊',
    description: 'Testing the waters, then diving in!',
  },
  {
    excitement: 82,
    hesitation: 22,
    playfulness: 58,
    romance: 78,
    overallMood: 'Cautiously Excited',
    emoji: '💕',
    description: 'Brief moment of doubt, then pure love!',
  },
  {
    excitement: 88,
    hesitation: 18,
    playfulness: 62,
    romance: 82,
    overallMood: 'Flirty & Fun',
    emoji: '😘',
    description: 'Just wanted to see you try harder!',
  },
  {
    excitement: 78,
    hesitation: 28,
    playfulness: 65,
    romance: 72,
    overallMood: 'Adorably Hesitant',
    emoji: '🙈',
    description: 'Played it cool for exactly 3 seconds!',
  },
  {
    excitement: 83,
    hesitation: 23,
    playfulness: 70,
    romance: 77,
    overallMood: 'Charmingly Coy',
    emoji: '☺️',
    description: 'A little tease never hurt anyone!',
  },
  {
    excitement: 86,
    hesitation: 19,
    playfulness: 68,
    romance: 81,
    overallMood: 'Gently Resistant',
    emoji: '💗',
    description: 'Made you earn it, just a tiny bit!',
  },
  {
    excitement: 81,
    hesitation: 24,
    playfulness: 63,
    romance: 76,
    overallMood: 'Soft Defenses',
    emoji: '🌸',
    description: 'Built a wall made of cotton candy!',
  },
];

// Moderate resistance (6-15 clicks)
const MODERATE_RESISTANCE_SENTIMENTS: SentimentData[] = [
  {
    excitement: 70,
    hesitation: 45,
    playfulness: 85,
    romance: 65,
    overallMood: 'Certified Tease',
    emoji: '😏',
    description: 'You made me work for it!',
  },
  {
    excitement: 68,
    hesitation: 48,
    playfulness: 88,
    romance: 62,
    overallMood: 'Master of Suspense',
    emoji: '😌',
    description: 'Kept me on my toes the whole time!',
  },
  {
    excitement: 72,
    hesitation: 42,
    playfulness: 90,
    romance: 68,
    overallMood: 'Strategic Player',
    emoji: '🎯',
    description: 'Every "no" was calculated!',
  },
  {
    excitement: 65,
    hesitation: 50,
    playfulness: 82,
    romance: 60,
    overallMood: 'Tough Cookie',
    emoji: '💪',
    description: 'Resistance level: Impressive!',
  },
  {
    excitement: 75,
    hesitation: 40,
    playfulness: 92,
    romance: 70,
    overallMood: 'Playful Challenger',
    emoji: '🔥',
    description: 'Testing limits like a pro!',
  },
  {
    excitement: 66,
    hesitation: 52,
    playfulness: 80,
    romance: 58,
    overallMood: 'Worth The Chase',
    emoji: '🏆',
    description: 'Made the victory extra sweet!',
  },
  {
    excitement: 73,
    hesitation: 44,
    playfulness: 86,
    romance: 66,
    overallMood: 'Selective Heart',
    emoji: '💎',
    description: 'Quality control before saying yes!',
  },
  {
    excitement: 69,
    hesitation: 47,
    playfulness: 84,
    romance: 64,
    overallMood: 'Hard To Please',
    emoji: '👑',
    description: 'Royalty doesn\'t surrender easily!',
  },
  {
    excitement: 74,
    hesitation: 41,
    playfulness: 89,
    romance: 69,
    overallMood: 'Delightfully Difficult',
    emoji: '✨',
    description: 'The chase was half the fun!',
  },
  {
    excitement: 67,
    hesitation: 49,
    playfulness: 87,
    romance: 61,
    overallMood: 'Controlled Chaos',
    emoji: '🎪',
    description: 'Every click was a mini drama!',
  },
];

// Heavy resistance (16-25 clicks)
const HEAVY_RESISTANCE_SENTIMENTS: SentimentData[] = [
  {
    excitement: 60,
    hesitation: 65,
    playfulness: 90,
    romance: 55,
    overallMood: 'Maximum Resistance',
    emoji: '💪',
    description: 'You put up a legendary fight!',
  },
  {
    excitement: 58,
    hesitation: 68,
    playfulness: 93,
    romance: 52,
    overallMood: 'Fortress Mode',
    emoji: '🛡️',
    description: 'Walls stronger than medieval castles!',
  },
  {
    excitement: 62,
    hesitation: 62,
    playfulness: 88,
    romance: 58,
    overallMood: 'Ultimate Challenger',
    emoji: '⚔️',
    description: 'Every "no" was a battle won... until the last one!',
  },
  {
    excitement: 55,
    hesitation: 70,
    playfulness: 95,
    romance: 50,
    overallMood: 'Unbreakable Spirit',
    emoji: '🔐',
    description: 'Made me EARN this victory!',
  },
  {
    excitement: 64,
    hesitation: 60,
    playfulness: 91,
    romance: 60,
    overallMood: 'Legendary Holdout',
    emoji: '👊',
    description: 'Resistance level: Hall of Fame!',
  },
  {
    excitement: 57,
    hesitation: 69,
    playfulness: 92,
    romance: 53,
    overallMood: 'Steel-Willed',
    emoji: '⛓️',
    description: 'Took a whole campaign to win you over!',
  },
  {
    excitement: 61,
    hesitation: 64,
    playfulness: 89,
    romance: 57,
    overallMood: 'Boss Battle Energy',
    emoji: '🎮',
    description: 'Final boss of dating apps!',
  },
  {
    excitement: 59,
    hesitation: 67,
    playfulness: 94,
    romance: 54,
    overallMood: 'Ironclad Defense',
    emoji: '🏰',
    description: 'Built defenses like it was your job!',
  },
  {
    excitement: 63,
    hesitation: 61,
    playfulness: 87,
    romance: 59,
    overallMood: 'Worthy Opponent',
    emoji: '🥊',
    description: 'Respect for the resistance game!',
  },
  {
    excitement: 56,
    hesitation: 71,
    playfulness: 96,
    romance: 51,
    overallMood: 'Unstoppable Force Met',
    emoji: '💥',
    description: 'People will write legends about this chase!',
  },
];

// Extreme resistance (26+ clicks)
const EXTREME_RESISTANCE_SENTIMENTS: SentimentData[] = [
  {
    excitement: 50,
    hesitation: 80,
    playfulness: 95,
    romance: 45,
    overallMood: 'Unbreakable Will',
    emoji: '🔥',
    description: 'Absolute legend. The resistance was REAL.',
  },
  {
    excitement: 48,
    hesitation: 82,
    playfulness: 98,
    romance: 42,
    overallMood: 'Chaos Incarnate',
    emoji: '🌪️',
    description: 'You\'re absolutely UNHINGED (in the best way)!',
  },
  {
    excitement: 52,
    hesitation: 78,
    playfulness: 100,
    romance: 48,
    overallMood: 'Legendary Stubbornness',
    emoji: '🗿',
    description: 'Immovable object meets unstoppable force!',
  },
  {
    excitement: 45,
    hesitation: 85,
    playfulness: 97,
    romance: 40,
    overallMood: 'Ultimate Wildcard',
    emoji: '🃏',
    description: 'No script could predict this level of chaos!',
  },
  {
    excitement: 53,
    hesitation: 77,
    playfulness: 99,
    romance: 49,
    overallMood: 'Mythic Resistance',
    emoji: '🐉',
    description: 'Dragons were easier to defeat than your defenses!',
  },
  {
    excitement: 47,
    hesitation: 83,
    playfulness: 96,
    romance: 43,
    overallMood: 'Certified Madness',
    emoji: '🤪',
    description: 'We\'re both crazy for going this far!',
  },
  {
    excitement: 51,
    hesitation: 79,
    playfulness: 101,
    romance: 47,
    overallMood: 'Epic Journey',
    emoji: '🗺️',
    description: 'This wasn\'t dating, it was an odyssey!',
  },
  {
    excitement: 49,
    hesitation: 81,
    playfulness: 94,
    romance: 46,
    overallMood: 'Maximum Chaos',
    emoji: '💫',
    description: 'The universe itself was confused!',
  },
  {
    excitement: 54,
    hesitation: 76,
    playfulness: 102,
    romance: 50,
    overallMood: 'Perfectly Unhinged',
    emoji: '🎭',
    description: 'Match made in beautiful chaos!',
  },
  {
    excitement: 46,
    hesitation: 84,
    playfulness: 103,
    romance: 44,
    overallMood: 'Historic Battle',
    emoji: '📜',
    description: 'This story deserves its own documentary!',
  },
  {
    excitement: 55,
    hesitation: 75,
    playfulness: 105,
    romance: 52,
    overallMood: 'Legendary Status',
    emoji: '⭐',
    description: 'Hall of Fame level stubbornness!',
  },
  {
    excitement: 44,
    hesitation: 86,
    playfulness: 100,
    romance: 41,
    overallMood: 'Absolute Unit',
    emoji: '💎',
    description: 'Unbreakable until the very end!',
  },
];

/**
 * Get a random sentiment from the appropriate category
 * @param spawnCount Number of NO clicks
 * @returns A SentimentData object
 */
export function getRandomSentiment(spawnCount: number = 0): SentimentData {
  let sentimentPool: SentimentData[];
  
  if (spawnCount === 0) {
    sentimentPool = ZERO_RESISTANCE_SENTIMENTS;
  } else if (spawnCount <= 5) {
    sentimentPool = LIGHT_RESISTANCE_SENTIMENTS;
  } else if (spawnCount <= 15) {
    sentimentPool = MODERATE_RESISTANCE_SENTIMENTS;
  } else if (spawnCount <= 25) {
    sentimentPool = HEAVY_RESISTANCE_SENTIMENTS;
  } else {
    sentimentPool = EXTREME_RESISTANCE_SENTIMENTS;
  }

  // Pick a random sentiment
  return sentimentPool[Math.floor(Math.random() * sentimentPool.length)];
}

export default { getRandomSentiment };
