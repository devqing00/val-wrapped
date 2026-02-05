import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

export interface SentimentAnalysis {
  excitement: number; // 0-100
  hesitation: number; // 0-100
  playfulness: number; // 0-100
  romance: number; // 0-100
  overallMood: string;
  emoji: string;
  description: string;
}

export async function POST(request: NextRequest) {
  try {
    const { spawnCount, hesitationTime, clickPattern } = await request.json();

    if (!GROQ_API_KEY) {
      // Return default sentiment if no API key
      return NextResponse.json(generateDefaultSentiment(spawnCount, hesitationTime));
    }

    const prompt = `Analyze the sentiment/mood of someone playing a Valentine's "Will you be my Valentine?" game based on their behavior:

- Times they tried to click NO: ${spawnCount}
- Time taken to decide: ${hesitationTime} seconds
- Click pattern: ${clickPattern || 'normal'}

Return a JSON object with these fields:
- excitement (0-100): How excited they seem
- hesitation (0-100): How hesitant they were
- playfulness (0-100): How playful/teasing they were being
- romance (0-100): How romantic the interaction felt
- overallMood: A 2-3 word description (e.g., "Playfully Resistant", "Instantly Smitten")
- emoji: One emoji that represents their mood
- description: One fun sentence about their behavior

Only return valid JSON, no additional text.`;

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
            content: 'You are a sentiment analyzer. Return only valid JSON, no markdown or extra text.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze sentiment');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Try to parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const sentiment = JSON.parse(jsonMatch[0]) as SentimentAnalysis;
      return NextResponse.json(sentiment);
    }

    throw new Error('Invalid JSON response');
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return NextResponse.json(generateDefaultSentiment(0, 5));
  }
}

function generateDefaultSentiment(spawnCount: number, hesitationTime: number): SentimentAnalysis {
  if (spawnCount === 0 && hesitationTime < 5) {
    return {
      excitement: 95,
      hesitation: 5,
      playfulness: 30,
      romance: 90,
      overallMood: 'Instantly Smitten',
      emoji: '😍',
      description: 'You couldn\'t click YES fast enough!',
    };
  }
  
  if (spawnCount <= 3) {
    return {
      excitement: 80,
      hesitation: 25,
      playfulness: 60,
      romance: 75,
      overallMood: 'Playfully Shy',
      emoji: '🥰',
      description: 'A little hesitation, but the heart won!',
    };
  }
  
  if (spawnCount <= 7) {
    return {
      excitement: 70,
      hesitation: 45,
      playfulness: 85,
      romance: 65,
      overallMood: 'Certified Tease',
      emoji: '😏',
      description: 'You made you work for it!',
    };
  }
  
  if (spawnCount <= 12) {
    return {
      excitement: 60,
      hesitation: 65,
      playfulness: 90,
      romance: 55,
      overallMood: 'Maximum Resistance',
      emoji: '💪',
      description: 'You put up a legendary fight!',
    };
  }
  
  return {
    excitement: 50,
    hesitation: 80,
    playfulness: 95,
    romance: 45,
    overallMood: 'Unbreakable Will',
    emoji: '🔥',
    description: 'Absolute legend. The resistance was REAL.',
  };
}
