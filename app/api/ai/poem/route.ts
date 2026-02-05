import { NextRequest, NextResponse } from 'next/server';
import { getRandomPoem, generateHybridPoem } from '@/app/lib/poemLibrary';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

// Track API usage to avoid rate limits (simple in-memory counter)
let apiCallsThisMinute = 0;
let lastResetTime = Date.now();
const MAX_CALLS_PER_MINUTE = 20; // Conservative limit

function checkRateLimit(): boolean {
  const now = Date.now();
  if (now - lastResetTime > 60000) {
    apiCallsThisMinute = 0;
    lastResetTime = now;
  }
  return apiCallsThisMinute < MAX_CALLS_PER_MINUTE;
}

// Country-specific slang hints (subtle, not overpowering)
const COUNTRY_SLANG: Record<string, string> = {
  'NG': 'Nigerian Pidgin touch (e.g., "na you I want", "you sweet me die")',
  'GH': 'Ghanaian slang touch (e.g., "charley", "you dey make my heart beat")',
  'KE': 'Kenyan Sheng touch (e.g., "you ni mtu wangu")',
  'ZA': 'South African slang touch (e.g., "lekker", "shame")',
  'US': 'American Gen-Z slang touch (e.g., "you\'re the one fr fr")',
  'GB': 'British slang touch (e.g., "proper mint", "you\'re well fit")',
  'AU': 'Australian slang touch (e.g., "you\'re a ripper")',
  'IN': 'Indian English touch (e.g., "yaar", "you are making my heart go dhak dhak")',
  'PH': 'Filipino English touch (e.g., "grabe", "ang cute mo")',
  'BR': 'Brazilian Portuguese touch (translated to English poetically)',
};

// Behavior-based poem themes
function getThemeFromStats(spawnCount: number, hesitationTime: number): string {
  if (spawnCount === 0) {
    return 'instant surrender, love at first sight, no resistance needed';
  } else if (spawnCount <= 5) {
    return 'playful chase, slight teasing before giving in, flirty resistance';
  } else if (spawnCount <= 15) {
    return 'hard to get, worthy pursuit, making them earn it, stubborn but sweet';
  } else if (spawnCount <= 25) {
    return 'legendary resistance, unbreakable will, but love conquers all';
  } else {
    return 'absolutely unhinged resistance, chaotic energy, but surrendered to love anyway';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { recipientName, senderName, spawnCount, hesitationTime, countryCode } = await request.json();

    // Check if we should use the library instead of API
    const useLibrary = !GROQ_API_KEY || !checkRateLimit();
    
    if (useLibrary) {
      // Use pre-generated library (no API call)
      const poem = Math.random() > 0.3 
        ? getRandomPoem(spawnCount || 0, recipientName || 'babe', countryCode)
        : generateHybridPoem(spawnCount || 0, recipientName || 'babe');
      
      return NextResponse.json({ poem, source: 'library' });
    }
    
    // Increment API call counter
    apiCallsThisMinute++;

    // Get behavior theme based on stats
    const behaviorTheme = getThemeFromStats(spawnCount || 0, hesitationTime || 0);
    
    // Get country slang hint (subtle)
    const countryHint = countryCode && COUNTRY_SLANG[countryCode.toUpperCase()] 
      ? `Add a SUBTLE ${COUNTRY_SLANG[countryCode.toUpperCase()]} but keep the poem primarily in fluent romantic English.`
      : '';

    // Unique seed for each request
    const uniqueSeed = Date.now() + Math.random();

    const prompt = `Write a SHORT romantic poem (4-5 lines ONLY) for ${recipientName || 'my love'} from ${senderName || 'their admirer'}.

CONTEXT: They clicked NO ${spawnCount || 0} times before saying YES. It took them ${hesitationTime || 0} seconds.
THEME: ${behaviorTheme}
${countryHint}
UNIQUE SEED: ${uniqueSeed}

CRITICAL REQUIREMENTS:
- ONLY 4-5 lines maximum
- Must be NAUGHTY yet ROMANTIC - flirty, bold, rizz energy
- Reference their behavior subtly (how many times they resisted, how long they made you wait)
- Make it PERSONAL - mention their name if provided
- The tone should be confident, slightly possessive, playful
- Include 1 heart emoji naturally (💕, 💖, or 🔥)
- NO clichés like "roses are red"
- End with a memorable, quotable line

Example quality (but be DIFFERENT and match the context):
"You made me chase, ${spawnCount} times you said no,
But baby, we both knew how this story would go.
Now you're mine, and I won't let you forget—
This was the best 'yes' you've ever said yet. 💕"

Now write something UNIQUE, naughty, and romantic that reflects their ${spawnCount || 0} rejections:`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a flirty, confident poet with major rizz. You write short, bold romantic poems that are naughty yet heartfelt. Your poems are personal, reference specific details, and always leave them wanting more. Keep poems to 4-5 lines maximum.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.95,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate poem');
    }

    const data = await response.json();
    const poem = data.choices[0]?.message?.content || getRandomPoem(spawnCount || 0, recipientName || 'babe', countryCode);

    return NextResponse.json({ poem, source: 'ai' });
  } catch (error) {
    console.error('AI poem generation error:', error);
    // Fallback to library on any error
    const poem = getRandomPoem(0, 'babe');
    return NextResponse.json(
      { poem, source: 'library' },
      { status: 200 }
    );
  }
}

// Legacy fallback function (kept for compatibility)
function getFallbackPoem(spawnCount: number, name: string): string {
  return getRandomPoem(spawnCount, name);
}
