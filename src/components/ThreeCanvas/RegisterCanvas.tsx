'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// 1. Rotating Gear / Study Clock Dial
function StudyClock({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const gearRef = useRef<THREE.Mesh>(null);
  const minuteHandRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.12;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.mouse.y * 0.35, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.35 + t * 0.08, 0.08);
    }
    if (gearRef.current) {
      gearRef.current.rotation.z = t * 0.25;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z = -t * 1.5;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[0.7, 0.7, 0.7]}>
      {/* Outer Case Rim */}
      <mesh castShadow>
        <torusGeometry args={[0.7, 0.07, 16, 64]} />
        <meshPhysicalMaterial color="#3b82f6" metalness={0.9} roughness={0.1} clearcoat={1.0} />
      </mesh>
      
      {/* Clock gear mesh */}
      <mesh ref={gearRef} position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.06, 12]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.3} wireframe />
      </mesh>

      {/* Clock Center Hub */}
      <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
        <meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={0.8} />
      </mesh>

      {/* Clock Hand */}
      <group ref={minuteHandRef} position={[0, 0, 0.04]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.02, 0.5, 0.01]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// 2. Orbiting Star Badges (Octahedrons representing badges)
function AchievementBadge({ position, scale = 1, rotationOffset = 0, color = '#d946ef' }: { position: [number, number, number]; scale?: number; rotationOffset?: number; color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime() + rotationOffset;
      meshRef.current.rotation.x = t * 0.4;
      meshRef.current.rotation.y = t * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.18;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale} castShadow>
      <octahedronGeometry args={[0.4]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
        roughness={0.1}
        metalness={0.8}
        clearcoat={1.0}
      />
    </mesh>
  );
}

// 3. Orbiting neon particle ring fields
function OrbitingRing({ radius = 2.4, color = '#3b82f6', count = 120, speed = 0.3 }: { radius?: number; color?: string; count?: number; speed?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.2;
      const r = radius + (Math.random() - 0.5) * 0.25;
      temp[i * 3] = Math.cos(angle) * r;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 0.35;
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
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
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

// 4. Camera control parallax
function SceneController() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 1.2, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 1.2 + 0.5, 0.05);
    state.camera.lookAt(0, 0.2, 0);
  });
  return null;
}

export default function RegisterCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full -z-5 overflow-hidden">
      <Canvas camera={{ position: [0, 0.5, 4.2], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#d946ef" />
        <pointLight position={[-10, -10, -10]} intensity={1.0} color="#3b82f6" />
        
        {/* Star system */}
        <Stars radius={80} depth={40} count={1000} factor={4} saturation={0.5} fade speed={1} />
        
        {/* Study clock core */}
        <StudyClock position={[0, 0.2, 0]} />
        
        {/* Orbiting particles */}
        <OrbitingRing radius={2.0} color="#3b82f6" count={120} speed={0.2} />
        <OrbitingRing radius={2.4} color="#d946ef" count={90} speed={-0.15} />
        
        {/* Orbiting star badges */}
        <AchievementBadge position={[-1.6, 1.1, 0]} scale={0.7} color="#d946ef" rotationOffset={0} />
        <AchievementBadge position={[1.6, -0.8, 0.2]} scale={0.6} color="#3b82f6" rotationOffset={3} />
        <AchievementBadge position={[-1.2, -1.1, -0.4]} scale={0.5} color="#8b5cf6" rotationOffset={1.5} />

        {/* Parallax controls */}
        <SceneController />
      </Canvas>
    </div>
  );
}
