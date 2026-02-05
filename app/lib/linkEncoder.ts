// URL encoding/decoding for cleaner, shorter links
// Uses abbreviated keys and base64 encoding

interface LinkParams {
  recipient: string;
  sender: string;
  theme: string;
  message?: string;
}

// Theme ID to single character mapping for shorter URLs
const THEME_MAP: Record<string, string> = {
  'dreamy-pink': 'p',
  'dark-romance': 'd',
  'retro': 'r',
  'neon': 'n',
  'golden-hour': 'g',
  'midnight-blue': 'b',
  'lavender-dreams': 'l',
  'sunset-kiss': 's',
};

const THEME_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(THEME_MAP).map(([k, v]) => [v, k])
);

// Encode params to a short, clean token
export function encodeParams(params: LinkParams): string {
  // Use short keys: r=recipient, s=sender, t=theme, m=message
  const shortObj: Record<string, string> = {
    r: params.recipient,
    s: params.sender,
    t: THEME_MAP[params.theme] || params.theme.charAt(0),
  };
  
  if (params.message) {
    shortObj.m = params.message;
  }
  
  // Create a compact string format: r|s|t|m (pipe-separated)
  const compact = params.message 
    ? `${shortObj.r}|${shortObj.s}|${shortObj.t}|${shortObj.m}`
    : `${shortObj.r}|${shortObj.s}|${shortObj.t}`;
  
  // Base64 encode
  const base64 = typeof window !== 'undefined' 
    ? btoa(unescape(encodeURIComponent(compact)))
    : Buffer.from(compact).toString('base64');
  
  // Make URL-safe and shorter
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Decode token back to params
export function decodeParams(token: string): LinkParams | null {
  try {
    // Restore base64 padding
    let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) {
      base64 += '='.repeat(4 - pad);
    }
    
    // Decode
    let decoded: string;
    if (typeof window !== 'undefined') {
      decoded = decodeURIComponent(escape(atob(base64)));
    } else {
      decoded = Buffer.from(base64, 'base64').toString();
    }
    
    // Check if it's the new compact format (pipe-separated)
    if (decoded.includes('|')) {
      const parts = decoded.split('|');
      return {
        recipient: parts[0] || '',
        sender: parts[1] || '',
        theme: THEME_REVERSE[parts[2]] || parts[2] || 'dreamy-pink',
        message: parts[3] || undefined,
      };
    }
    
    // Legacy JSON format support
    try {
      const json = decodeURIComponent(decoded);
      const legacy = JSON.parse(json) as LinkParams;
      return legacy;
    } catch {
      // Try direct JSON parse
      return JSON.parse(decoded) as LinkParams;
    }
  } catch (error) {
    console.error('Failed to decode params:', error);
    return null;
  }
}

// Generate a short link path
export function generateShortLink(params: LinkParams): string {
  const token = encodeParams(params);
  return `/v/${token}`;
}
