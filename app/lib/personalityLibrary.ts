/**
 * Personality Description Library for Val Wrapped
 * Replaces AI-generated personality descriptions
 */

// Zero resistance (0 clicks = instant YES)
const ZERO_RESISTANCE_PERSONALITIES = [
  "Your resistance? Non-existent. You saw what you wanted and claimed it immediately!",
  "Zero hesitation energy! You know a good thing when you see it.",
  "Instant decision-maker vibes. No overthinking, just pure conviction!",
  "You didn't come here to play games - straight to the point!",
  "Confident and decisive. That's hot ngl.",
  "No resistance, just pure chemistry from the start!",
  "You said YES faster than I could blink. Respect.",
  "Zero chill, maximum romance. I love it!",
];

// Easy catch (1-3 clicks)
const EASY_CATCH_PERSONALITIES = [
  "A little playful resistance, but your heart knew the answer all along!",
  "Tested the waters for exactly 2.5 seconds before diving in!",
  "Adorably cautious, but we both knew how this would end.",
  "Brief moment of 'should I?' then immediate 'yeah I should'!",
  "You played it cool for like... 3 whole seconds. Iconic.",
  "Flirty resistance detected. Made it fun without making me work too hard!",
  "Just enough hesitation to be cute, not enough to be annoying!",
  "You wanted to seem chill but I saw through it immediately.",
  "Soft resistance game. Your heart was already mine!",
  "Slightly guarded but ultimately a romantic at heart!",
];

// Teaser (4-7 clicks)
const TEASER_PERSONALITIES = [
  "Certified tease! You made me work for it and I respect that.",
  "Master of the chase. Every 'no' was strategic!",
  "Playful resistance is your love language apparently!",
  "You enjoy watching me try, don't you? Fair enough.",
  "Testing my dedication levels - smart move honestly.",
  "Flirty and fun! You knew exactly what you were doing.",
  "Made me sweat a little. Worth it though!",
  "Your resistance game? Mid-tier but entertaining!",
  "You enjoyed the pursuit. Can't even be mad about it.",
  "Strategic player vibes. Every click was calculated!",
  "Bit of a tease but that's what makes you interesting!",
  "You like keeping people on their toes. Noted.",
];

// Hard to get (8-12 clicks)
const HARD_TO_GET_PERSONALITIES = [
  "Hard to get is an understatement. You made me WORK!",
  "You put up a legendary fight! Respect the dedication.",
  "Maximum resistance energy. But love won in the end!",
  "You tested every ounce of my patience. Worth it!",
  "Stubborn? Maybe. Worth the chase? Absolutely.",
  "You made me earn this victory. I'll never forget it!",
  "Boss level resistance. Finally defeated!",
  "You really made me prove myself huh? Fair.",
  "Hard shell, soft center. Got there eventually!",
  "You're tough to crack but that makes you valuable!",
  "Selective heart. I passed the test apparently!",
  "You don't surrender easily. I like that about you.",
  "Quality control before committing - smart strategy!",
  "You made me work harder than I've ever worked!",
];

// Very stubborn (13-20 clicks)
const VERY_STUBBORN_PERSONALITIES = [
  "STUBBORN AS HELL but I'm into it honestly.",
  "You fought like your life depended on it!",
  "Iron will detected. Respect the determination!",
  "You really said 'make me' and I did!",
  "Fortress mode activated. Breached successfully!",
  "You're ridiculously stubborn and I love it?",
  "Walls of steel. Took forever to get through!",
  "You deserve an award for resistance levels!",
  "I should've quit but your stubbornness intrigued me!",
  "You really tested my limits. Mission accomplished!",
  "Unbreakable will... until now!",
  "You made this a whole EVENT. Dramatic much?",
  "Resistance level: Hall of Fame worthy!",
  "You fought tooth and nail. Admirable honestly!",
  "Stubborn royalty. I literally had to siege your heart!",
];

// Absolutely unhinged (21+ clicks)
const ABSOLUTELY_UNHINGED_PERSONALITIES = [
  "ABSOLUTELY UNHINGED and I'm here for it!",
  "You're chaotic and I'm obsessed???",
  "We're both crazy for going this far. Perfect match!",
  "Legendary stubbornness. You're a whole mood!",
  "This wasn't dating, this was psychological warfare!",
  "You're absolutely WILD and honestly? Same.",
  "Maximum chaos energy. We deserve each other!",
  "You made this harder than it needed to be... respect!",
  "Unbreakable will meets unstoppable force. Here we are!",
  "Your resistance was INSANE. Worth every click!",
  "You're beautifully unhinged and I'm obsessed!",
  "This battle will be studied by future generations!",
  "Chaos incarnate. You're perfect actually.",
  "You really said 'not today Satan' 30 times!",
  "Historic levels of stubbornness. Legendary!",
  "You fought like a final boss. Defeated!",
  "Absolute UNIT of resistance. Still won though!",
  "You're wonderfully chaotic and I love that!",
  "This took FOREVER. Worth it? Debatable. Memorable? Absolutely!",
  "You're certifiably unhinged. So am I. Match made in chaos!",
];

/**
 * Get a random personality description based on resistance level
 * @param spawnCount Number of NO clicks
 * @returns A personality description string
 */
export function getRandomPersonality(spawnCount: number = 0): string {
  let personalityPool: string[];
  
  if (spawnCount === 0) {
    personalityPool = ZERO_RESISTANCE_PERSONALITIES;
  } else if (spawnCount <= 3) {
    personalityPool = EASY_CATCH_PERSONALITIES;
  } else if (spawnCount <= 7) {
    personalityPool = TEASER_PERSONALITIES;
  } else if (spawnCount <= 12) {
    personalityPool = HARD_TO_GET_PERSONALITIES;
  } else if (spawnCount <= 20) {
    personalityPool = VERY_STUBBORN_PERSONALITIES;
  } else {
    personalityPool = ABSOLUTELY_UNHINGED_PERSONALITIES;
  }

  // Pick a random personality
  return personalityPool[Math.floor(Math.random() * personalityPool.length)];
}

export default { getRandomPersonality };
