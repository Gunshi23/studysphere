'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Plus,
  Trash2,
  FileText,
  Clock,
  Compass,
  Trophy,
  Coffee,
  Brain
} from 'lucide-react';
import Card from '@/components/UI/Card';
import GlowingButton from '@/components/UI/GlowingButton';
import Link from 'next/link';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function FocusSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  // Pomodoro States
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [initialTime] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [completedSessions, setCompletedSessions] = useState(0);

  // Todo checklist states
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Structure mathematical proofs', completed: true },
    { id: '2', text: 'Solve integrals in section 3.4', completed: false },
    { id: '3', text: 'Prepare documentation slides', completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  // Notepad State
  const [notes, setNotes] = useState('');

  // Timer Tick Hook
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      if (timerMode === 'focus') {
        setCompletedSessions((prev) => prev + 1);
        setTimerMode('break');
        setTimeLeft(5 * 60);
      } else {
        setTimerMode('focus');
        setTimeLeft(25 * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft, timerMode]);

  // Formatter helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(timerMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  // SVG circular radius metrics
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / (timerMode === 'focus' ? 25 * 60 : 5 * 60);
  const strokeDashoffset = circumference - progress * circumference;

  // Task Actions
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-8 select-none max-w-6xl mx-auto">
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-slate-500 hover:text-slate-300">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-white font-display flex items-center gap-2">
              Focus Workspace
              <span className="w-1.5 h-1.5 rounded-full bg-studysphere-purple animate-pulse" />
            </h1>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase">
              SESSION STATE: ACTIVE • NODE NODE: SOLO
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono px-3 py-1.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
          <Trophy size={13} className="text-studysphere-purple" />
          {completedSessions} focus node intervals completed
        </div>
      </div>

      {/* 2. Three-Section Focus Center Workspace Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Circular Pomodoro Clock Panel (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-center items-center">
          <Card glowColor="purple" className="w-full flex flex-col items-center justify-center p-8 relative">
            
            {/* Title Node label */}
            <span className="text-[9px] px-2 py-0.5 rounded-md bg-purple-950 border border-purple-500/20 text-purple-300 font-mono font-bold tracking-widest uppercase mb-6">
              {timerMode === 'focus' ? 'Focus Interval' : 'Rest Node Interval'}
            </span>

            {/* SVG Circular Dial */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="112"
                  cy="112"
                  r={radius}
                  className="stroke-slate-800/20"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress Ring */}
                <motion.circle
                  cx="112"
                  cy="112"
                  r={radius}
                  className="stroke-studysphere-purple"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transition={{ strokeDashoffset: { duration: 0.3 } }}
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))'
                  }}
                />
              </svg>

              {/* Central Clock Display */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold text-white font-mono tracking-wider drop-shadow-md">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-1">
                  {timerActive ? 'DEEP FLOW' : 'PAUSED'}
                </span>
              </div>
            </div>

            {/* Dial controls bar */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => setTimerActive(!timerActive)}
                className="p-3.5 rounded-2xl bg-studysphere-purple hover:bg-studysphere-purple/80 text-white cursor-pointer transition-all shadow-[0_0_15px_rgba(139,92,246,0.25)] flex items-center justify-center"
              >
                {timerActive ? <Pause size={18} /> : <Play size={18} className="fill-white" />}
              </button>
              <button
                onClick={resetTimer}
                className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white cursor-pointer transition-all"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Quick action options */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setTimerMode('focus');
                  setTimeLeft(25 * 60);
                  setTimerActive(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold font-mono tracking-wide uppercase border transition-all cursor-pointer ${
                  timerMode === 'focus'
                    ? 'bg-purple-950/20 border-studysphere-purple text-purple-300'
                    : 'bg-white/[0.01] border-white/5 text-slate-500'
                }`}
              >
                <Brain size={11} className="inline mr-1" />
                POMODORO
              </button>
              <button
                onClick={() => {
                  setTimerMode('break');
                  setTimeLeft(5 * 60);
                  setTimerActive(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold font-mono tracking-wide uppercase border transition-all cursor-pointer ${
                  timerMode === 'break'
                    ? 'bg-purple-950/20 border-studysphere-purple text-purple-300'
                    : 'bg-white/[0.01] border-white/5 text-slate-500'
                }`}
              >
                <Coffee size={11} className="inline mr-1" />
                SHORT BREAK
              </button>
            </div>
          </Card>
        </div>

        {/* Center/Right side: Tasks and Scratch Notepad (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section A: Checklist Task Manager */}
          <Card glowColor="purple" className="flex flex-col h-[280px]">
            <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                <CheckCircle size={14} className="text-studysphere-purple" />
                Sprint Checklist
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                {tasks.filter((t) => t.completed).length}/{tasks.length} Done
              </span>
            </div>

            {/* Tasks list */}
            <div className="flex-grow overflow-y-auto py-3 space-y-2.5 scrollbar-none">
              <AnimatePresence initial={false}>
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5 group hover:border-white/10 transition-all"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-3 text-left cursor-pointer flex-grow"
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-purple-950/40 border-studysphere-purple text-studysphere-purple'
                            : 'border-slate-700'
                        }`}
                      >
                        {task.completed && <div className="w-1.5 h-1.5 rounded-sm bg-studysphere-purple" />}
                      </div>
                      <span
                        className={`text-xs font-sans transition-all ${
                          task.completed ? 'text-slate-500 line-through' : 'text-slate-300'
                        }`}
                      >
                        {task.text}
                      </span>
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 rounded text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add task bar */}
            <form onSubmit={handleAddTask} className="border-t border-white/5 pt-3.5 flex gap-2">
              <input
                type="text"
                placeholder="Queue up a focus milestone..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-grow px-3.5 py-2.5 rounded-xl bg-[#030014]/60 border border-white/5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-studysphere-purple/50 text-xs transition-all font-sans"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-studysphere-purple hover:bg-studysphere-purple/80 text-white cursor-pointer transition-colors"
              >
                <Plus size={14} />
              </button>
            </form>
          </Card>

          {/* Section B: Notepad */}
          <Card glowColor="purple" className="flex flex-col h-[220px]">
            <div className="flex items-center gap-1.5 pb-3.5 border-b border-white/5">
              <FileText size={14} className="text-studysphere-purple" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                Session Notepad
              </h3>
            </div>

            {/* Note text field */}
            <textarea
              placeholder="Dump quick thoughts, scratch equations, or resources links here. Saved locally..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex-grow w-full h-full py-3 resize-none bg-transparent text-xs text-slate-300 placeholder:text-slate-650 focus:outline-none scrollbar-none font-sans leading-relaxed"
            />
          </Card>
        </div>

      </div>
    </div>
  );
}
