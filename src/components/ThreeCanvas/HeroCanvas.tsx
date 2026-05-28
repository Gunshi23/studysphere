'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 1. Particle Field (Drifting dust/stars)
function ParticleField({ count = 200 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 15;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 15;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#8b5cf6"
        size={0.035}
        sizeAttenuation={true}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 2. Procedural Book Mesh
function BookModel({ position, color = '#8b5cf6' }: { position: [number, number, number]; color?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.15;
      // Parallax interaction with mouse
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.mouse.y * 0.3, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.3 + t * 0.15, 0.08);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[0.8, 0.8, 0.8]}>
      {/* Book Cover */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 1.2, 0.22]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.8}
        />
      </mesh>
      {/* Pages Box (indented slightly) */}
      <mesh position={[0.01, 0, 0]} castShadow>
        <boxGeometry args={[0.84, 1.14, 0.18]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
      </mesh>
      {/* Bookmark strip */}
      <mesh position={[0, -0.6, 0.05]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.08, 0.3, 0.02]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// 3. Procedural Laptop Mesh
function LaptopModel({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + 1) * 0.12;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.mouse.y * 0.25 - 0.2, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.25 + t * 0.08, 0.08);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[0.8, 0.8, 0.8]}>
      {/* Keyboard Base */}
      <mesh castShadow>
        <boxGeometry args={[1.3, 0.06, 0.9]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Screen Lid (inclined back) */}
      <group position={[0, 0.03, -0.44]} rotation={[1.9, 0, 0]}>
        {/* Lid cover */}
        <mesh castShadow>
          <boxGeometry args={[1.3, 0.04, 0.85]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Glow Screen */}
        <mesh position={[0, -0.021, 0]}>
          <planeGeometry args={[1.2, 0.75]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={1.8}
            roughness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}

// 4. Procedural Clock Mesh
function ClockModel({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const hourHandRef = useRef<THREE.Mesh>(null);
  const minuteHandRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5 + 2) * 0.18;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.mouse.y * 0.35, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.35 - t * 0.1, 0.08);
    }
    if (hourHandRef.current) {
      hourHandRef.current.rotation.z = -t * 0.1;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z = -t * 1.2;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[0.8, 0.8, 0.8]}>
      {/* Outer Case Ring */}
      <mesh castShadow>
        <torusGeometry args={[0.5, 0.08, 16, 64]} />
        <meshPhysicalMaterial
          color="#3b82f6"
          roughness={0.1}
          metalness={0.9}
          clearcoat={1.0}
        />
      </mesh>
      {/* Dial Plate */}
      <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.48, 0.04, 32]} />
        <meshStandardMaterial color="#090520" roughness={0.5} />
      </mesh>
      {/* Clock Hands Hub */}
      <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.8} />
      </mesh>
      {/* Hour Hand */}
      <group ref={hourHandRef} position={[0, 0, 0.03]}>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.03, 0.24, 0.01]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>
      {/* Minute Hand */}
      <group ref={minuteHandRef} position={[0, 0, 0.04]}>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.02, 0.36, 0.01]} />
          <meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// 5. Pulsing study energy crystal (Floating Core)
function CoreCrystal({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.x = t * 0.25;
      meshRef.current.rotation.y = t * 0.4;
      meshRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale} castShadow>
      <octahedronGeometry args={[0.45]} />
      <meshPhysicalMaterial
        color="#d946ef"
        emissive="#8b5cf6"
        emissiveIntensity={1.2}
        roughness={0.1}
        metalness={0.9}
        clearcoat={1.0}
        thickness={0.5}
      />
    </mesh>
  );
}

// 6. Rotating glowing sphere behind title
function BackgroundGlowSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -4]}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <MeshDistortMaterial
        color="#311060"
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.2}
        metalness={0.5}
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full -z-5 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1.0} color="#3b82f6" />
        <directionalLight position={[0, 5, 5]} intensity={1.2} color="#ffffff" castShadow />
        
        {/* Particle System */}
        <ParticleField count={220} />
        
        {/* Star system */}
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.5} fade speed={1} />
        
        {/* Background pulsing morph sphere */}
        <BackgroundGlowSphere />
        
        {/* Floating study assets */}
        <BookModel position={[-2.4, 1.2, 0]} color="#8b5cf6" />
        <LaptopModel position={[2.5, -0.6, 0.5]} />
        <ClockModel position={[2.2, 1.6, -0.5]} />
        <BookModel position={[-2.2, -1.2, 0.5]} color="#d946ef" />
        
        {/* Small floating study crystals */}
        <CoreCrystal position={[-1.2, 2.0, -1]} scale={0.7} />
        <CoreCrystal position={[1.4, -2.0, -0.8]} scale={0.6} />
        <CoreCrystal position={[0, 2.2, -2]} scale={0.8} />

      </Canvas>
    </div>
  );
}
