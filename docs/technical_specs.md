Technical Requirements Document (TRD) - Val Wrapped1. Tech StackFramework: Next.js 16+ (App Router).Styling: Tailwind CSS + clsx/tailwind-merge.3D Engine: React Three Fiber (R3F) + @react-three/drei.Animations: Framer Motion (for page transitions).Physics: Framer Motion Layout Animations (preferred over heavy physics engines like Matter.js for this use case).State Management: Zustand.Image Generation: html2canvas.2. Global State Store (useStore.ts)Using Zustand, we need to track:interface AppState {
  stage: 'landing' | 'game' | 'success';
  recipientName: string;
  startTime: number;
  spawnCount: number; // Number of extra Yes buttons
  incrementSpawn: () => void;
  setStage: (stage: 'landing' | 'game' | 'success') => void;
  setRecipientName: (name: string) => void;
  reset: () => void;
}
3. Key Component LogicA. Scene3D.tsxStandard R3F setup. Floating hearts/clouds.Optimization: Ensure canvas does not re-render unnecessarily when game state changes.B. TheQuestion.tsx (Game Container / The Swarm)State: Maintains a local array extraButtons: Array<{ id: number, x: number, y: number, rotation: number }>.Logic:Listen for the onMiss event from the ImpossibleButton.When onMiss fires:Add a new item to extraButtons.Increment global spawnCount.Play "pop" sound.Rendering: Render the main "Yes" button AND map over extraButtons to render clones.Animation: Clones should animate in from y: -100 (top of screen) to a random position (x: random, y: random) using Framer Motion springs. Giving them a slight random rotation makes the pile look more natural.C. ImpossibleButton.tsx (The Evasion Logic)Props: onMiss: () => void.Logic:Desktop: onMouseEnter -> Move button to safe random spot + call onMiss.Mobile: onTouchStart -> e.preventDefault() -> Move button to safe random spot + call onMiss.Text Array: const textOptions = ["No", "Are you sure?", "Please?", "Don't!", "I'm crying", "Srsly?", "Last chance"].Cyclical text update based on spawnCount % textOptions.length.D. ReceiptGenerator.tsxLogic:Map spawnCount to "Red Flags" or "Stubbornness" on the receipt.Dynamic Pricing: - If spawnCount === 0: "Item: Love at first sight ... $0.00"If spawnCount > 15: "Item: HARD TO GET TAX ...... $999.99"Export: Use html2canvas to capture the specific div ref.4. File Structure/src
  /app
    page.tsx
  /components
    /canvas
      Scene3D.tsx
    /game
      TheQuestion.tsx   # Manages the Swarm state
      ImpossibleBtn.tsx # Manages the evasion logic
      SwarmBtn.tsx      # Simple falling button component
    /receipt
      ReceiptCard.tsx
  /store
    useStore.ts
