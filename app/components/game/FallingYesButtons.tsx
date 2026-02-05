'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { useStore } from '../../store/useStore';
import { getTheme } from '../../lib/themes';

interface FallingYesButtonsProps {
  buttons: Array<{ id: number; x: number }>;
  onYesClick: () => void;
}

interface ButtonPosition {
  x: number;
  y: number;
  angle: number;
}

export function FallingYesButtons({ buttons, onYesClick }: FallingYesButtonsProps) {
  const [positions, setPositions] = useState<Map<number, ButtonPosition>>(new Map());
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodyMapRef = useRef<Map<number, Matter.Body>>(new Map());
  const addedButtonsRef = useRef<Set<number>>(new Set());
  const theme = useStore((state) => state.theme);
  const currentTheme = getTheme(theme);

  // Handle click - just call the parent handler
  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onYesClick();
  }, [onYesClick]);

  // Initialize physics engine
  useEffect(() => {
    const { Engine, World, Bodies, Runner, Events } = Matter;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create engine
    const engine = Engine.create();
    engine.gravity.y = 1;
    engineRef.current = engine;

    // Create walls
    const wallOptions = { isStatic: true, friction: 0.5, restitution: 0.3 };
    
    const floor = Bodies.rectangle(width / 2, height + 30, width + 100, 60, wallOptions);
    const leftWall = Bodies.rectangle(-30, height / 2, 60, height + 100, wallOptions);
    const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height + 100, wallOptions);

    World.add(engine.world, [floor, leftWall, rightWall]);

    // Create runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Update positions on each physics tick
    Events.on(engine, 'afterUpdate', () => {
      const newPositions = new Map<number, ButtonPosition>();
      bodyMapRef.current.forEach((body, id) => {
        newPositions.set(id, {
          x: body.position.x,
          y: body.position.y,
          angle: body.angle,
        });
      });
      setPositions(newPositions);
    });

    return () => {
      Events.off(engine, 'afterUpdate');
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  // Add buttons to physics world
  useEffect(() => {
    if (!engineRef.current) return;

    const width = window.innerWidth;

    buttons.forEach(button => {
      if (addedButtonsRef.current.has(button.id)) return;
      addedButtonsRef.current.add(button.id);

      const x = (button.x / 100) * width;
      const y = -50;

      const body = Matter.Bodies.rectangle(x, y, 85, 38, {
        restitution: 0.4,
        friction: 0.2,
        frictionAir: 0.005,
        density: 0.001,
      });

      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 4,
        y: Math.random() * 2 + 1,
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);

      Matter.World.add(engineRef.current!.world, body);
      bodyMapRef.current.set(button.id, body);
    });
  }, [buttons]);

  return (
    <div 
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 40, pointerEvents: 'none' }}
    >
      {buttons.map(button => {
        const pos = positions.get(button.id);
        if (!pos) return null;
        
        return (
          <button
            key={button.id}
            onClick={handleClick}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchEnd={handleClick}
            className="jelly-btn absolute text-sm md:text-base px-4 py-2 rounded-full font-semibold"
            style={{
              transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) rotate(${pos.angle}rad)`,
              left: 0,
              top: 0,
              background: currentTheme.gradients.button,
              color: currentTheme.colors.buttonText,
              boxShadow: currentTheme.effects.glow,
              pointerEvents: 'auto',
              cursor: 'pointer',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
              touchAction: 'manipulation',
            }}
          >
            YES 💕
          </button>
        );
      })}
    </div>
  );
}
