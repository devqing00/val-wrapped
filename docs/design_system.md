Design System: "Digital Coquette"1. Color Palette (Tailwind Config)Add these to your tailwind.config.ts. The focus is on soft, desaturated pastels with deep crimson accents for contrast.colors: {
  'dream-pink': '#FFD1DC',   // Main background base
  'dream-red': '#FF004D',    // Call to action / Hearts
  'dream-cream': '#FDFBF7',  // Card backgrounds (warm white)
  'dream-text': '#4A0E18',   // Deep burgundy (softer than black)
  'receipt-ink': '#1A1A1A',  // Sharp black for the receipt text only
}
2. The "Dreamy" UI EffectsA. Glassmorphism Card (The Container)This is the container for the "Valentine Request" card. It should feel like a piece of frosted crystal..glass-card {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1), 
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 0 20px rgba(255, 255, 255, 0.5); /* Inner glow */
  border-radius: 24px;
}
B. The "Film Grain" OverlayTo remove the "techy" feel and add "aesthetic/retro" vibes, overlay this fixed div over the entire page.tsx.// Component: <NoiseOverlay />
<div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay">
  {/* Use a simple noise SVG pattern or base64 here */}
</div>
C. TypographyHeadings: Fraunces (Google Font). It is a "Soft Serif" that feels romantic and vintage.Usage: "Will you be my Valentine?", "Receipt".Body/UI: Geist Sans or Inter (Clean, modern).Usage: Buttons, instructional text.Receipt: Space Mono or Courier Prime.Usage: The receipt items.3. Animation Curves (Framer Motion)We strictly avoid linear animations. Everything must feel "heavy" and "syrupy" or "bouncy."// The "Jelly" effect for buttons appearing
const jellyTransition = {
  type: "spring",
  stiffness: 400,
  damping: 10
};

// The "Float" effect for the 3D hearts
const floatTransition = {
  duration: 6,
  repeat: Infinity,
  ease: "easeInOut" // Sine wave motion
};
4. Button StylesThe "Yes" Button (Pill Shape).btn-primary {
  background-color: #FF004D;
  color: white;
  border-radius: 9999px; /* Full pill */
  font-family: 'Fraunces', serif;
  font-weight: 600;
  box-shadow: 
    0 10px 15px -3px rgba(255, 0, 77, 0.3), /* Red glow */
    0 4px 6px -2px rgba(255, 0, 77, 0.1);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy hover */
}
The "Impossible No" Button (Ghost).btn-ghost {
  background-color: transparent;
  color: #4A0E18;
  border: 2px solid rgba(74, 14, 24, 0.1);
  border-radius: 12px;
}
