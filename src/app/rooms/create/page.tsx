'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Settings,
  Shield,
  Users,
  Video,
  Globe,
  Lock,
  Sparkles,
  Bookmark,
  FileText,
  Copy,
  Check,
  Plus,
  Compass,
  AlertCircle
} from 'lucide-react';
import Card from '@/components/UI/Card';
import GlowingButton from '@/components/UI/GlowingButton';
import Link from 'next/link';

export default function CreateRoomPage() {
  const router = useRouter();

  // Form Fields State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Coding');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [isPrivate, setIsPrivate] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Focus floating input states
  const [titleFocused, setTitleFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  // Validation & Animation States
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Generate invite code helper
  const handleGenerateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setInviteCode(`STUDY-${code}`);
    setIsCopied(false);
  };

  const handleCopyLink = () => {
    if (!inviteCode) return;
    const fullLink = `${window.location.origin}/rooms/join/${inviteCode}`;
    navigator.clipboard.writeText(fullLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear errors
    const newErrors: { title?: string; description?: string } = {};
    
    // Validations
    if (!title.trim()) {
      newErrors.title = 'Room title is required.';
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Room description is required.';
    } else if (description.length < 15) {
      newErrors.description = 'Description must be at least 15 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 6000); // end shake keyframe
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Simulate API request to launch study node
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setShowToast(true);

    // Redirect to rooms/[id] after success toast display
    const mockRoomId = `node-${Math.floor(Math.random() * 10000)}`;
    setTimeout(() => {
      router.push(`/rooms/${mockRoomId}`);
    }, 1500);
  };

  // Shake Keyframes
  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    },
    default: { x: 0 }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center p-4 select-none relative overflow-hidden font-sans">
      
      {/* Cinematic animated backgrounds */}
      <div className="absolute top-[10%] left-[15%] w-[450px] h-[450px] bg-studysphere-purple/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-neon-pulse" />
      <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] bg-studysphere-blue/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-neon-pulse" style={{ animationDelay: '4s' }} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-20" />

      {/* Floating Success Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 px-6 py-4.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.2)] backdrop-blur-md z-50 flex items-center gap-3"
          >
            <CheckCircleIcon className="w-5 h-5 text-emerald-400 animate-bounce" />
            <div>
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white">Study Node Launched!</h4>
              <p className="text-[10px] text-emerald-400 font-sans mt-0.5">Syncing coordinates. Redirecting to workspace...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl"
      >
        {/* Back Link */}
        <Link href="/rooms" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-350 transition-colors mb-6">
          <ArrowLeft size={13} />
          Back to study lobbies
        </Link>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5 font-display">
            Launch Study Node
            <Sparkles size={20} className="text-studysphere-purple animate-pulse" />
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1 font-sans">
            Deploy a virtual study environment with real-time screen syncing & Pomodoro integrations.
          </p>
        </div>

        {/* Form Container */}
        <motion.div
          animate={isShaking ? 'shake' : 'default'}
          variants={shakeVariants}
        >
          <Card glowColor="purple" className="!p-8 md:!p-10 relative overflow-hidden border-white/10">
            {/* Ambient inner mesh backglow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-studysphere-purple/10 rounded-full blur-2xl pointer-events-none -z-10" />

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* 1. Room Title (Floating label input) */}
              <div className="space-y-1 relative">
                <div
                  className={`relative rounded-xl border transition-all duration-300 ${
                    errors.title
                      ? 'border-red-500 bg-red-950/5'
                      : titleFocused
                      ? 'border-studysphere-purple bg-purple-950/5 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                      : 'border-white/5 bg-[#030014]/60'
                  }`}
                >
                  <label
                    className={`absolute left-4 transition-all duration-350 pointer-events-none font-bold uppercase tracking-wider font-display ${
                      titleFocused || title
                        ? 'top-2 text-[8px] text-studysphere-purple'
                        : 'top-4.5 text-xs text-slate-500'
                    }`}
                  >
                    Room Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onFocus={() => setTitleFocused(true)}
                    onBlur={() => setTitleFocused(false)}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 pt-6 pb-2.5 bg-transparent border-0 text-xs text-slate-100 placeholder-transparent focus:outline-none focus:ring-0 font-sans"
                    placeholder="Room Title"
                  />
                </div>
                {errors.title && (
                  <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1 px-1"
                  >
                    <AlertCircle size={11} />
                    {errors.title}
                  </motion.span>
                )}
              </div>

              {/* 2. Room Description (Textarea + Char Counter) */}
              <div className="space-y-1 relative">
                <div
                  className={`relative rounded-xl border transition-all duration-300 ${
                    errors.description
                      ? 'border-red-500 bg-red-950/5'
                      : descFocused
                      ? 'border-studysphere-purple bg-purple-950/5 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                      : 'border-white/5 bg-[#030014]/60'
                  }`}
                >
                  <label
                    className={`absolute left-4 transition-all duration-350 pointer-events-none font-bold uppercase tracking-wider font-display ${
                      descFocused || description
                        ? 'top-2 text-[8px] text-studysphere-purple'
                        : 'top-4.5 text-xs text-slate-500'
                    }`}
                  >
                    Room Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onFocus={() => setDescFocused(true)}
                    onBlur={() => setDescFocused(false)}
                    onChange={(e) => {
                      if (e.target.value.length <= 250) {
                        setDescription(e.target.value);
                      }
                    }}
                    className="w-full px-4 pt-6 pb-2.5 bg-transparent border-0 text-xs text-slate-100 placeholder-transparent focus:outline-none focus:ring-0 font-sans resize-none transition-all duration-300"
                    placeholder="Room Description"
                  />
                </div>
                <div className="flex items-center justify-between mt-1 px-1">
                  {errors.description ? (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] text-red-400 font-semibold flex items-center gap-1"
                    >
                      <AlertCircle size={11} />
                      {errors.description}
                    </motion.span>
                  ) : (
                    <div />
                  )}
                  <span className="text-[9px] text-slate-650 font-mono font-bold ml-auto">
                    {description.length} / 250 CHARS
                  </span>
                </div>
              </div>

              {/* 3. Grid Fields: Category & Participants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category dropdown */}
                <div className="space-y-2">
                  <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-display flex items-center gap-1.5">
                    <Bookmark size={12} className="text-studysphere-purple" />
                    Study Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#030014]/60 border border-white/5 text-slate-300 focus:outline-none focus:border-studysphere-purple/50 text-xs transition-all font-sans appearance-none cursor-pointer"
                  >
                    <option value="Coding">💻 Coding</option>
                    <option value="Interview Prep">💼 Interview Prep</option>
                    <option value="Exams">📚 Exams</option>
                    <option value="Group Study">👥 Group Study</option>
                    <option value="Reading">📖 Reading</option>
                    <option value="Productivity">⚡ Productivity</option>
                  </select>
                </div>

                {/* Participant limit selector */}
                <div className="space-y-2">
                  <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-display flex items-center gap-1.5">
                    <Users size={12} className="text-studysphere-purple" />
                    Max Participants
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 25, 50].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setMaxParticipants(num)}
                        className={`py-2 px-1.5 rounded-xl border text-[10px] font-bold font-mono tracking-wider cursor-pointer transition-all ${
                          maxParticipants === num
                            ? 'bg-purple-500/10 border-studysphere-purple text-studysphere-purple shadow-[0_0_10px_rgba(139,92,246,0.15)]'
                            : 'bg-white/[0.01] border-white/5 text-slate-500 hover:text-slate-450'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Privacy Settings cards */}
              <div className="space-y-2">
                <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-display flex items-center gap-1.5">
                  <Shield size={12} className="text-studysphere-purple" />
                  Privacy Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Public Card */}
                  <button
                    type="button"
                    onClick={() => setIsPrivate(false)}
                    className={`p-4.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3.5 ${
                      !isPrivate
                        ? 'bg-purple-950/20 border-studysphere-purple/60 text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                        : 'bg-white/[0.01] border-white/5 text-slate-500 hover:border-white/10'
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-white/[0.02] border border-white/5 ${!isPrivate ? 'text-studysphere-purple' : 'text-slate-600'}`}>
                      <Globe size={16} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold font-display uppercase tracking-wider">Public Study Space</h4>
                      <p className="text-[9px] text-slate-550 mt-1 font-sans leading-relaxed">Visible on index search pools. Any student node can enter directly.</p>
                    </div>
                  </button>

                  {/* Private Card */}
                  <button
                    type="button"
                    onClick={() => setIsPrivate(true)}
                    className={`p-4.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3.5 ${
                      isPrivate
                        ? 'bg-purple-950/20 border-studysphere-purple/60 text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                        : 'bg-white/[0.01] border-white/5 text-slate-500 hover:border-white/10'
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-white/[0.02] border border-white/5 ${isPrivate ? 'text-studysphere-purple' : 'text-slate-600'}`}>
                      <Lock size={16} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold font-display uppercase tracking-wider">Private Study Space</h4>
                      <p className="text-[9px] text-slate-550 mt-1 font-sans leading-relaxed">Hidden from index searches. Access is restricted to invite code nodes.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 5. Invite Generator (visible if private or optional) */}
              <div className="space-y-3.5 border-t border-white/5 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-[10px] font-bold font-display uppercase tracking-wider text-slate-200">Invite Code Generator</h4>
                    <p className="text-[9px] text-slate-550 font-sans mt-0.5">Generate credentials to share with classmates.</p>
                  </div>
                  {!inviteCode ? (
                    <button
                      type="button"
                      onClick={handleGenerateCode}
                      className="px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-[9.5px] font-bold font-display uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer"
                    >
                      Generate Code
                    </button>
                  ) : (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <div className="flex-grow sm:flex-grow-0 px-3.5 py-2 rounded-xl bg-[#030014] border border-white/5 font-mono text-[10px] font-bold text-studysphere-purple flex items-center justify-center tracking-wider">
                        {inviteCode}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="p-2 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                        title="Copy link"
                      >
                        {isCopied ? <Check size={13} className="text-emerald-400 animate-pulse" /> : <Copy size={13} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 6. Submission Controls */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-end gap-4">
                <Link href="/rooms">
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded-xl border border-white/5 text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                </Link>

                <GlowingButton
                  type="submit"
                  variant="primary"
                  className="!px-7 !py-3 text-xs font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Deploying Workspace...
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Plus size={14} />
                      Create Study Room
                    </div>
                  )}
                </GlowingButton>
              </div>

            </form>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Custom checkcircle loader svg icon
function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
