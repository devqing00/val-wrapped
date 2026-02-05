'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Cloud, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Heart shape geometry
function HeartShape() {
  const shape = useMemo(() => {
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.35, y, x - 0.35, y + 0.35, x - 0.35, y + 0.35);
    heartShape.bezierCurveTo(x - 0.35, y + 0.55, x - 0.2, y + 0.77, x + 0.25, y + 0.95);
    heartShape.bezierCurveTo(x + 0.7, y + 0.77, x + 0.85, y + 0.55, x + 0.85, y + 0.35);
    heartShape.bezierCurveTo(x + 0.85, y + 0.35, x + 0.85, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);
    
    return heartShape;
  }, []);

  return shape;
}

// Floating heart mesh with glow effect
function FloatingHeart({ position, scale, color, rotationSpeed }: {
  position: [number, number, number];
  scale: number;
  color: string;
  rotationSpeed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const heartShape = HeartShape();

  const geometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.25,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    });
  }, [heartShape]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * rotationSpeed) * 0.4;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * rotationSpeed * 0.7) * 0.15;
      // Pulsing scale
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(scale * pulse);
    }
    if (glowRef.current) {
      const glowPulse = 1.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      glowRef.current.scale.setScalar(scale * glowPulse);
    }
  });

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.6}
      floatIntensity={1.5}
    >
      <group position={position}>
        {/* Glow effect */}
        <mesh
          ref={glowRef}
          rotation={[Math.PI, 0, 0]}
          geometry={geometry}
        >
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
          />
        </mesh>
        {/* Main heart */}
        <mesh
          ref={meshRef}
          rotation={[Math.PI, 0, 0]}
          geometry={geometry}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Floating bubble
function Bubble({ position, size }: { position: [number, number, number]; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (meshRef.current) {
      // Float upward slowly
      meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.5;
      // Gentle wobble
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.3 + position[2]) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color="#FFFFFF"
        transparent
        opacity={0.3}
        roughness={0}
        metalness={0.1}
      />
    </mesh>
  );
}

// Animated ring
function FloatingRing({ position, size, color }: { 
  position: [number, number, number]; 
  size: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={0.8} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[size, size * 0.15, 16, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

// Bubble positions (deterministic)
const BUBBLE_POSITIONS: { position: [number, number, number]; size: number }[] = [
  { position: [-3, -2, -3], size: 0.15 },
  { position: [2, 1, -4], size: 0.1 },
  { position: [-1, 3, -3.5], size: 0.12 },
  { position: [3.5, -1, -2.5], size: 0.08 },
  { position: [-2.5, 0, -4], size: 0.18 },
  { position: [1, -3, -3], size: 0.1 },
  { position: [4, 2, -3.5], size: 0.14 },
  { position: [-4, 1, -4], size: 0.09 },
];

// Ring positions (deterministic)
const RING_POSITIONS: { position: [number, number, number]; size: number; color: string }[] = [
  { position: [-3.5, 2.5, -4], size: 0.3, color: '#FF6B8A' },
  { position: [3, -2, -4.5], size: 0.25, color: '#FFB6C1' },
  { position: [0, 3.5, -5], size: 0.35, color: '#FF8FAB' },
];

// Main scene content
function SceneContent() {
  const hearts = useMemo(() => [
    { position: [-3, 2, -2] as [number, number, number], scale: 0.8, color: '#FF004D', rotationSpeed: 0.5 },
    { position: [3, 1, -3] as [number, number, number], scale: 0.6, color: '#FF6B8A', rotationSpeed: 0.7 },
    { position: [-2, -1.5, -2] as [number, number, number], scale: 0.5, color: '#FF8FAB', rotationSpeed: 0.4 },
    { position: [2.5, -2.5, -2.5] as [number, number, number], scale: 0.7, color: '#FF004D', rotationSpeed: 0.6 },
    { position: [0, 3, -4] as [number, number, number], scale: 0.9, color: '#FF6B8A', rotationSpeed: 0.3 },
    { position: [-4, 0.5, -3] as [number, number, number], scale: 0.45, color: '#FF8FAB', rotationSpeed: 0.8 },
    { position: [4, -0.5, -3.5] as [number, number, number], scale: 0.55, color: '#FF004D', rotationSpeed: 0.55 },
    { position: [-1, -3, -3] as [number, number, number], scale: 0.35, color: '#FFB6C1', rotationSpeed: 0.65 },
    { position: [1.5, 2.5, -2.5] as [number, number, number], scale: 0.4, color: '#FF6B8A', rotationSpeed: 0.45 },
  ], []);

  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#FFF5F8" />
      <pointLight position={[-5, 3, 5]} intensity={0.6} color="#FF8FAB" />
      <pointLight position={[5, -3, 3]} intensity={0.4} color="#FFB6C1" />
      
      {/* Subtle rim light */}
      <pointLight position={[0, 0, 8]} intensity={0.3} color="#FFFFFF" />

      {/* Dreamy clouds - more of them */}
      <Cloud position={[-5, 3, -6]} speed={0.2} opacity={0.6} color="#FFFFFF" />
      <Cloud position={[5, 2.5, -7]} speed={0.15} opacity={0.5} color="#FFE4E9" />
      <Cloud position={[0, -2.5, -8]} speed={0.1} opacity={0.4} color="#FFFFFF" />
      <Cloud position={[-3, -1, -6]} speed={0.12} opacity={0.35} color="#FFF0F5" />
      <Cloud position={[4, 0, -7]} speed={0.18} opacity={0.45} color="#FFE4E9" />

      {/* Sparkles particle system */}
      <Sparkles
        count={100}
        scale={12}
        size={2}
        speed={0.3}
        opacity={0.6}
        color="#FFFFFF"
      />
      
      {/* Pink sparkles */}
      <Sparkles
        count={50}
        scale={10}
        size={3}
        speed={0.2}
        opacity={0.4}
        color="#FF8FAB"
      />

      {/* Stars in background */}
      <Stars
        radius={50}
        depth={30}
        count={500}
        factor={3}
        saturation={0.5}
        fade
        speed={0.5}
      />

      {/* Floating hearts */}
      {hearts.map((heart, i) => (
        <FloatingHeart key={i} {...heart} />
      ))}

      {/* Floating bubbles */}
      {BUBBLE_POSITIONS.map((bubble, i) => (
        <Bubble key={i} position={bubble.position} size={bubble.size} />
      ))}

      {/* Floating rings */}
      {RING_POSITIONS.map((ring, i) => (
        <FloatingRing key={i} {...ring} />
      ))}

      {/* Gradient background sphere */}
      <mesh position={[0, 0, -15]} scale={30}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#FFD1DC" side={THREE.BackSide} />
      </mesh>
    </>
  );
}

// Exported Scene3D component
export function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: true // Required for html2canvas
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
