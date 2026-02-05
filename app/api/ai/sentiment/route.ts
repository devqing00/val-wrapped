import { NextRequest, NextResponse } from 'next/server';
import { getRandomSentiment } from '../../../lib/sentimentLibrary';

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
  let spawnCount = 0;
  
  try {
    const body = await request.json();
    spawnCount = body.spawnCount || 0;
    const hesitationTime = body.hesitationTime || 5;
    const clickPattern = body.clickPattern;

    if (!GROQ_API_KEY) {
      // Use fallback library if no API key
      return NextResponse.json(getRandomSentiment(spawnCount));
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
    // Use fallback library on error
    return NextResponse.json(getRandomSentiment(spawnCount || 0));
  }
}

// Kept for backward compatibility, but now uses library
function generateDefaultSentiment(spawnCount: number, hesitationTime: number): SentimentAnalysis {
  return getRandomSentiment(spawnCount);
}

