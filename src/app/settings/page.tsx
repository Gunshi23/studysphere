'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Volume2,
  Bell,
  Eye,
  Sliders,
  Radio,
  Share2,
  Check,
  Save,
  Music,
  Tv,
  Globe
} from 'lucide-react';
import Card from '@/components/UI/Card';
import GlowingButton from '@/components/UI/GlowingButton';

export default function SettingsPage() {
  // Volume state
  const [volInput, setVolInput] = useState(80);
  const [micSens, setMicSens] = useState(60);
  
  // Ambient Sound settings
  const [ambientSound, setAmbientSound] = useState('rain');
  const [enableAmbient, setEnableAmbient] = useState(true);

  // Notification configuration toggles
  const [notifySession, setNotifySession] = useState(true);
  const [notifyInvites, setNotifyInvites] = useState(true);
  const [notifyStreaks, setNotifyStreaks] = useState(false);

  // Appearance configuration
  const [themeMode, setThemeMode] = useState('cyber'); // cyber, classic-dark, obsidian

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSuccess(true);
    
    // Reset banner
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 select-none max-w-4xl mx-auto">
      {/* 1. Header Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
          Settings
          <span className="w-1.5 h-1.5 rounded-full bg-studysphere-blue animate-pulse" />
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1 font-sans">
          Configure notification filters, sound levels, and node layouts.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 2. Grid Panels: Media/Audio vs Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section A: Audio & Video Preferences */}
          <Card glowColor="blue" className="!p-6 space-y-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5 pb-3 border-b border-white/5">
              <Volume2 size={14} className="text-studysphere-blue" />
              Audio & Video Nodes
            </h3>

            {/* Input Slider: Output Volume */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Output Sound Volume</span>
                <span className="text-[10px] font-mono font-bold text-studysphere-blue">{volInput}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volInput}
                onChange={(e) => setVolInput(parseInt(e.target.value))}
                className="w-full h-1 bg-white/[0.04] rounded-lg appearance-none cursor-pointer accent-studysphere-blue"
              />
            </div>

            {/* Input Slider: Mic Sensitivity */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Mic Input Sensitivity</span>
                <span className="text-[10px] font-mono font-bold text-studysphere-blue">{micSens}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={micSens}
                onChange={(e) => setMicSens(parseInt(e.target.value))}
                className="w-full h-1 bg-white/[0.04] rounded-lg appearance-none cursor-pointer accent-studysphere-blue"
              />
            </div>

            {/* Ambient Sound Selector */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display flex items-center gap-1">
                  <Music size={12} className="text-studysphere-blue" />
                  Background Ambient Noise
                </span>
                
                {/* Enable toggle */}
                <button
                  type="button"
                  onClick={() => setEnableAmbient(!enableAmbient)}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${
                    enableAmbient ? 'bg-studysphere-blue' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-300 ${
                      enableAmbient ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {enableAmbient && (
                <div className="grid grid-cols-3 gap-2">
                  {['rain', 'binaural', 'white-noise'].map((sound) => (
                    <button
                      key={sound}
                      type="button"
                      onClick={() => setAmbientSound(sound)}
                      className={`py-2 rounded-xl border text-[9px] font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
                        ambientSound === sound
                          ? 'bg-blue-950/20 border-studysphere-blue text-studysphere-blue shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                          : 'bg-white/[0.01] border-white/5 text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      {sound === 'rain' ? '🌦️ RAIN' : sound === 'binaural' ? '🌀 BEATS' : '🔊 NOISE'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Section B: Notification Filters */}
          <Card glowColor="purple" className="!p-6 space-y-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5 pb-3 border-b border-white/5">
              <Bell size={14} className="text-studysphere-purple" />
              Notification Settings
            </h3>

            {/* Options Checkboxes */}
            <div className="space-y-4 font-sans text-xs">
              {/* Option 1 */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-200">Study Session Reminders</h4>
                  <p className="text-[10px] text-slate-550 mt-0.5">Alert me when a scheduled room session is starting.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifySession(!notifySession)}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${
                    notifySession ? 'bg-studysphere-purple' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-300 ${
                      notifySession ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Option 2 */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-200">Room Invites</h4>
                  <p className="text-[10px] text-slate-550 mt-0.5">Ping me immediately when I receive invites to study lobbies.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyInvites(!notifyInvites)}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${
                    notifyInvites ? 'bg-studysphere-purple' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-300 ${
                      notifyInvites ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Option 3 */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-200">Streak Milestones</h4>
                  <p className="text-[10px] text-slate-550 mt-0.5">Push notifications when my study streak is in jeopardy.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyStreaks(!notifyStreaks)}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${
                    notifyStreaks ? 'bg-studysphere-purple' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-300 ${
                      notifyStreaks ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* 3. Section C: Appearance Settings */}
        <Card glowColor="purple" className="!p-6 space-y-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5 pb-3 border-b border-white/5">
            <Eye size={14} className="text-studysphere-purple" />
            Visual Nodes Layout
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['cyber', 'classic-dark', 'obsidian'].map((mode) => {
              const borderHighlight =
                themeMode === mode ? 'border-studysphere-purple bg-purple-950/20' : 'border-white/5 bg-white/[0.01] hover:border-white/10';
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setThemeMode(mode)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-24 ${borderHighlight}`}
                >
                  <span className="text-[10px] font-bold text-white uppercase tracking-wide font-display">
                    {mode === 'cyber' ? '⚡ Cyber Glow' : mode === 'classic-dark' ? '🌌 Classic Dark' : '🌑 Obsidian'}
                  </span>
                  <p className="text-[8px] text-slate-500 font-sans leading-relaxed">
                    {mode === 'cyber'
                      ? 'Vibrant neon purple and blue grids with maximum mesh lighting.'
                      : mode === 'classic-dark'
                      ? 'Sleek standard dark mode focusing on readability and soft borders.'
                      : 'Utter black backgrounds without glows to save battery nodes.'}
                  </p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* 4. Form Actions toolbar */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-4">
          {success ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-4 py-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold flex items-center gap-1.5 font-sans"
            >
              <Check size={12} />
              All settings configuration successfully saved.
            </motion.div>
          ) : (
            <div />
          )}

          <GlowingButton
            type="submit"
            variant="primary"
            className="!px-6 !py-2.5 text-xs font-semibold"
            disabled={loading}
          >
            <Save size={13} />
            {loading ? 'Saving preferences...' : 'Apply settings'}
          </GlowingButton>
        </div>
      </form>
    </div>
  );
}
