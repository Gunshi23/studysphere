'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

// 1. Holographic Screen content (actual interactive React code projected in 3D)
function WorkspaceDashboard() {
  const [sessionTime, setSessionTime] = useState(1500); // 25:00
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'Session created.',
    'Desk initialized.',
  ]);

  // Pomodoro countdown timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSessionTime((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setLogs((l) => ['Session completed! 🏆', ...l.slice(0, 4)]);
            return 1500;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
    setLogs((l) => [
      isRunning ? 'Focus paused.' : 'Focus session started.',
      ...l.slice(0, 4),
    ]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSessionTime(1500);
    setLogs((l) => ['Timer reset.', ...l.slice(0, 4)]);
  };

  return (
    <div className="w-[450px] h-[300px] bg-slate-950/90 border-2 border-cyan-500/60 rounded-2xl p-4 text-white font-sans flex flex-col justify-between shadow-[0_0_40px_rgba(6,182,212,0.4)] backdrop-blur-md select-none">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">STUDYROOM_CORE_v1.0</span>
        </div>
        <div className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
          FPS: 60 | RENDER: WEBGL2
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-4 flex-grow my-3">
        {/* Left Side: Pomodoro Timer */}
        <div className="bg-slate-900/60 border border-white/5 rounded-xl p-3 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl" />
          <span className="text-slate-400 text-[10px] font-medium tracking-wide uppercase">FOCUS TIMER</span>
          <span className="text-4xl font-extrabold text-white my-1 font-mono tracking-wider drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            {formatTime(sessionTime)}
          </span>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleStartStop}
              className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors cursor-pointer"
            >
              {isRunning ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Right Side: Core Metrics & Chart */}
        <div className="bg-slate-900/60 border border-white/5 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>ACTIVITY CHART</span>
            <span className="text-cyan-400 font-bold">+18% HR</span>
          </div>
          {/* Mock mini bar chart */}
          <div className="flex items-end justify-between h-14 px-1 gap-1.5 mt-2">
            {[40, 65, 55, 80, 45, 95, 70].map((h, i) => (
              <div key={i} className="w-full bg-slate-800 rounded-sm overflow-hidden h-full flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-sm transition-all duration-500"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-white/5 pt-2 mt-2">
            <span className="flex items-center gap-1"><Award size={10} className="text-yellow-500" /> Gold Rank</span>
            <span>2.8k XP</span>
          </div>
        </div>
      </div>

      {/* Console log list */}
      <div className="bg-black/40 border border-white/5 rounded-lg p-2 font-mono text-[9px] text-cyan-300/80 h-16 overflow-y-auto scrollbar-thin">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-1">
            <span className="text-slate-500">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
            <span>&gt; {log}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Neon Desk Platform Mesh
function DeskPlatform() {
  return (
    <group position={[0, -0.6, 0]}>
      {/* Main Table Top */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.08, 2.4]} />
        <meshPhysicalMaterial
          color="#0b081a"
          roughness={0.4}
          metalness={0.9}
          clearcoat={0.3}
        />
      </mesh>
      
      {/* Pulsing neon table borders */}
      <mesh position={[0, 0, 1.205]}>
        <boxGeometry args={[4.22, 0.09, 0.01]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, 0, -1.205]}>
        <boxGeometry args={[4.22, 0.09, 0.01]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.5} />
      </mesh>

      {/* Desk legs (4 corners) */}
      {[
        [-2, -1, 1],
        [2, -1, 1],
        [-2, -1, -1],
        [2, -1, -1],
      ].map((pos, idx) => (
        <mesh key={idx} position={[pos[0], pos[1], pos[2]]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2, 8]} />
          <meshStandardMaterial color="#1e1b4b" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

// 3. Screen Structure Mesh holding the HTML dashboard
function DesktopMonitor() {
  return (
    <group position={[0, 0.5, -0.4]}>
      {/* Stand Base */}
      <mesh position={[0, -0.7, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.06, 16]} />
        <meshStandardMaterial color="#1e1b4b" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Stand Post */}
      <mesh position={[0, -0.4, -0.05]} castShadow>
        <boxGeometry args={[0.08, 0.6, 0.08]} />
        <meshStandardMaterial color="#1e1b4b" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Back Panel */}
      <mesh position={[0, 0, -0.05]} castShadow>
        <boxGeometry args={[3.2, 2.0, 0.08]} />
        <meshStandardMaterial color="#110e2e" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Screen Face holding interactive HTML Dashboard */}
      <group position={[0, 0, 0.01]}>
        <Html
          transform
          distanceFactor={3.2}
          position={[0, 0, 0]}
          occlude
        >
          <WorkspaceDashboard />
        </Html>
      </group>
    </group>
  );
}

// 4. Orbiting items (Floating rings, file nodes, light spheres)
function OrbitingProductivity() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.4;
      ring1Ref.current.rotation.y = t * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.3;
      ring2Ref.current.rotation.z = t * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.4, 0]}>
      {/* Floating Ring 1 */}
      <mesh ref={ring1Ref} castShadow>
        <torusGeometry args={[2.5, 0.02, 8, 48]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1.2} />
      </mesh>
      
      {/* Floating Ring 2 */}
      <mesh ref={ring2Ref} castShadow>
        <torusGeometry args={[2.8, 0.015, 8, 48]} />
        <meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={0.8} />
      </mesh>

      {/* Orbiting particles/notes */}
      {[
        { pos: [2.3, 0.5, 0], color: '#3b82f6', size: 0.12 },
        { pos: [-2.1, -0.4, 1.2], color: '#8b5cf6', size: 0.1 },
        { pos: [1.2, 1.8, -1.8], color: '#d946ef', size: 0.15 },
        { pos: [-1.8, 1.2, -1.0], color: '#06b6d4', size: 0.08 },
      ].map((n, i) => (
        <mesh key={i} position={n.pos as [number, number, number]} castShadow>
          <octahedronGeometry args={[n.size]} />
          <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={1.0} />
        </mesh>
      ))}
    </group>
  );
}

export default function ShowcaseCanvas() {
  return (
    <div className="w-full h-[550px] relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a0628] to-[#040118] border border-white/5 shadow-2xl">
      
      {/* Interactivity Hint HUD overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex gap-2 items-center bg-slate-950/80 border border-white/10 px-3 py-1.5 rounded-lg">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-[10px] tracking-wider text-slate-300 font-semibold uppercase">3D ROOM INTERACTIVE DEMO</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 pointer-events-none text-[9px] text-slate-500 font-mono">
        Drag to Rotate | Scroll to Zoom | Click Dashboard buttons
      </div>

      <Canvas
        camera={{ position: [0, 1.8, 4.2], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 6, 5]} intensity={1.8} color="#8b5cf6" castShadow />
        <pointLight position={[-5, 2, -5]} intensity={0.8} color="#3b82f6" />
        
        {/* Spot lighting down on monitor */}
        <spotLight
          position={[0, 4, 0]}
          angle={Math.PI / 3}
          penumbra={0.5}
          intensity={2}
          color="#06b6d4"
          castShadow
        />

        {/* Scene Components */}
        <DeskPlatform />
        <DesktopMonitor />
        <OrbitingProductivity />

        {/* Orbit Controls with restrictions to make it feel solid */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2.8}
          maxDistance={6.0}
          minPolarAngle={0.4}
          maxPolarAngle={Math.PI / 2 - 0.05} // prevent going underneath desk
        />
      </Canvas>
    </div>
  );
}
