'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 1. Morphing glowing core study timer orb
function TimerOrb() {
  const orbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (orbRef.current) {
      const t = state.clock.getElapsedTime();
      orbRef.current.rotation.y = t * 0.2;
      orbRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <mesh ref={orbRef} position={[0, 0.2, 0]} castShadow>
      <sphereGeometry args={[1.0, 64, 64]} />
      <MeshDistortMaterial
        color="#8b5cf6"
        emissive="#d946ef"
        emissiveIntensity={1.8}
        distort={0.4}
        speed={2.2}
        roughness={0.1}
        metalness={0.9}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

// 2. Orbiting particles/nodes around the orb
function OrbitingRing({ radius = 2.0, color = '#3b82f6', count = 100, speed = 0.25 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.25;
      const r = radius + (Math.random() - 0.5) * 0.2;
      temp[i * 3] = Math.cos(angle) * r;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      temp[i * 3 + 2] = Math.sin(angle) * r;
    }
    return temp;
  }, [count, radius]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * speed;
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
        color={color}
        size={0.03}
        sizeAttenuation={true}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 3. Floating study book models
function FloatingBook({ position, color = '#8b5cf6', rotationOffset = 0 }: { position: [number, number, number]; color?: string; rotationOffset?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime() + rotationOffset;
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.15;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.mouse.y * 0.4, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.4 + t * 0.1, 0.08);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[0.65, 0.65, 0.65]}>
      {/* Book Cover */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 1.2, 0.2]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.8}
        />
      </mesh>
      {/* Pages Box */}
      <mesh position={[0.01, 0, 0]} castShadow>
        <boxGeometry args={[0.84, 1.14, 0.16]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
      </mesh>
    </group>
  );
}

// 4. Camera mouse-parallax controller
function SceneController() {
  useFrame((state) => {
    // Camera drift with mouse coordinates
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 1.2, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 1.2 + 0.5, 0.05);
    state.camera.lookAt(0, 0.2, 0);
  });
  return null;
}

export default function LoginCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full -z-5 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0.5, 4.2], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" />
        <pointLight position={[-10, -10, -10]} intensity={1.0} color="#3b82f6" />
        
        {/* Background stars */}
        <Stars radius={80} depth={40} count={1000} factor={4} saturation={0.5} fade speed={1} />
        
        {/* Core distorted morphing timer orb */}
        <TimerOrb />
        
        {/* Orbiting particle fields */}
        <OrbitingRing radius={2.0} color="#3b82f6" count={120} speed={0.2} />
        <OrbitingRing radius={2.4} color="#d946ef" count={90} speed={-0.15} />
        
        {/* Floating study models */}
        <FloatingBook position={[-1.6, 1.0, 0]} color="#8b5cf6" rotationOffset={0} />
        <FloatingBook position={[1.6, -0.8, 0.2]} color="#3b82f6" rotationOffset={2.5} />
        
        {/* Camera interaction */}
        <SceneController />
      </Canvas>
    </div>
  );
}
