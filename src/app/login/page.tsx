'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import LoginCanvas from '@/components/ThreeCanvas/LoginCanvas';
import ClientOnly from '@/components/ClientOnly';
import { useAuth } from '@/providers/AuthProvider';

// 1. Customized Glassmorphic input field with floating label
interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  togglePassword?: () => void;
  showPassword?: boolean;
}

function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  error,
  icon,
  togglePassword,
  showPassword,
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-5 w-full">
      <div
        className={`relative flex items-center border rounded-xl transition-all duration-300 bg-black/40 backdrop-blur-md ${
          error
            ? 'border-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
            : isFocused
            ? 'border-studysphere-purple shadow-[0_0_12px_rgba(139,92,246,0.25)]'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        {/* Left Side Icon */}
        {icon && <span className="pl-3.5 text-slate-500">{icon}</span>}

        {/* Input tag */}
        <input
          id={id}
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-3.5 bg-transparent text-white text-xs md:text-sm outline-none placeholder-transparent pt-5 pb-2.5 ${
            icon ? 'pl-2' : ''
          }`}
        />

        {/* Floating animated label */}
        <label
          htmlFor={id}
          className={`absolute left-3.5 transition-all duration-200 pointer-events-none text-xs ${
            isFocused || value
              ? 'top-1.5 text-[9px] md:text-[10px] text-studysphere-purple font-semibold'
              : 'top-1/2 -translate-y-1/2 text-slate-400 text-xs md:text-sm'
          } ${icon ? 'pl-7' : ''}`}
        >
          {label}
        </label>

        {/* Password Eye toggle controls */}
        {togglePassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="pr-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {/* Floating Error Message block */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[10px] text-red-500 mt-1 pl-2 font-medium flex items-center gap-1"
          >
            <ShieldAlert size={10} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  // Interaction states
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validate form inputs
  const validate = () => {
    const tempErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      tempErrors.email = 'Email address is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Invalid email address format.';
      isValid = false;
    }

    if (!password) {
      tempErrors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || success) return;

    if (validate()) {
      setLoading(true);
      try {
        await login(email);
        setSuccess(true);
      } catch (err) {
        setShakeCard(true);
        setTimeout(() => setShakeCard(false), 500);
      } finally {
        setLoading(false);
      }
    } else {
      // Trigger card shake feedback on error
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 500);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#030014] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* LEFT COLUMN: 3D Scene Banner (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#030014] items-center justify-center border-r border-white/5">
        
        {/* Dynamic 3D canvas */}
        <ClientOnly fallback={<div className="absolute inset-0 bg-[#030014]/80 -z-10" />}>
          <LoginCanvas />
        </ClientOnly>

        {/* Ambient overlay blur meshes */}
        <div className="absolute top-[20%] left-[20%] w-[35vw] h-[35vw] bg-studysphere-purple/10 rounded-full blur-[110px] pointer-events-none animate-neon-pulse" />
        
        {/* Holographic Text HUD */}
        <div className="relative z-10 text-center px-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-studysphere-purple animate-pulse" />
            <span className="text-[10px] tracking-widest text-slate-300 font-bold uppercase">FOCUS NODE ACTIVE</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight"
          >
            Welcome Back to Your
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-studysphere-purple via-studysphere-fuchsia to-studysphere-blue font-display">
              Study Space.
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm text-slate-400 font-light leading-relaxed"
          >
            Re-enter your private lounge, connect with friends, and continue building your focused flow routine.
          </motion.p>
        </div>

        {/* Bottom footer credit */}
        <div className="absolute bottom-6 left-6 text-[10px] text-slate-500 font-mono">
          SECURE CONNECTION | SSL v3.0
        </div>
      </div>

      {/* RIGHT COLUMN: Glassmorphic Login Form */}
      <div className="w-full lg:w-1/2 min-h-screen relative flex items-center justify-center p-6 bg-gradient-to-b from-[#030014] to-[#070222]">
        
        {/* Ambient moving background grid & glowing blobs */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40 -z-10" />
        <div className="absolute top-[30%] right-[10%] w-[350px] h-[350px] bg-studysphere-blue/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-neon-pulse" />
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-studysphere-purple/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-neon-pulse" style={{ animationDelay: '3s' }} />

        {/* Login form Card Container (Framer motion managed) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            x: shakeCard ? [-10, 10, -10, 10, -5, 5, -2, 2, 0] : 0,
          }}
          transition={{
            duration: shakeCard ? 0.5 : 0.8,
            ease: 'easeOut',
          }}
          className="glass-card w-full max-w-md p-8 md:p-10 rounded-3xl relative overflow-hidden"
        >
          {/* Logo element */}
          <div className="flex items-center gap-2 mb-8 justify-center cursor-pointer">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-studysphere-purple to-studysphere-blue flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] text-sm font-display">
                S
              </div>
              <span className="font-extrabold text-sm tracking-wider text-white font-display">
                StudySphere
              </span>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header text */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">Sign In</h1>
                  <p className="text-xs text-slate-400 font-light mt-1.5">
                    Continue your focused study journey.
                  </p>
                </div>

                {/* Form tags */}
                <form onSubmit={handleLoginSubmit} noValidate>
                  {/* Inputs */}
                  <FormInput
                    label="Email Address"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    icon={<Mail size={16} />}
                  />
                  <FormInput
                    label="Password"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    icon={<Lock size={16} />}
                    togglePassword={() => setShowPassword(!showPassword)}
                    showPassword={showPassword}
                  />

                  {/* Actions Row */}
                  <div className="flex items-center justify-between text-xs mb-6">
                    <label
                      onClick={() => setRememberMe(!rememberMe)}
                      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer select-none"
                    >
                      <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                        rememberMe ? 'bg-studysphere-purple border-studysphere-purple text-white' : 'border-white/10 bg-black/40'
                      }`}>
                        {rememberMe && <span className="text-[10px]">✓</span>}
                      </div>
                      Remember me
                    </label>
                    <a href="#" className="text-studysphere-purple hover:underline font-medium">
                      Forgot Password?
                    </a>
                  </div>

                  {/* Submit Button with loader */}
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full relative px-6 py-3.5 bg-gradient-to-r from-studysphere-purple to-studysphere-blue text-white rounded-xl font-semibold tracking-wider text-xs md:text-sm hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> Authenticating...
                      </>
                    ) : (
                      <>
                        Enter StudySphere <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                {/* Or divider */}
                <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-white/5" />
                  <span className="flex-shrink mx-4 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                    OR CONTINUE WITH
                  </span>
                  <div className="flex-grow border-t border-white/5" />
                </div>

                {/* Social Login options */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all text-xs font-semibold cursor-pointer text-slate-300 hover:text-white disabled:opacity-50"
                  >
                    {/* Google SVG */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all text-xs font-semibold cursor-pointer text-slate-300 hover:text-white disabled:opacity-50"
                  >
                    {/* GitHub SVG */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                    GitHub
                  </button>
                </div>

                {/* Create Account link footer */}
                <p className="text-center text-xs text-slate-400 mt-8 font-light">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="text-studysphere-purple hover:underline font-medium">
                    Create Account
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="login-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0.6 }}
                  animate={{ scale: [0.6, 1.1, 1] }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 mb-6 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                >
                  <CheckCircle2 size={36} />
                </motion.div>
                
                <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">Access Granted</h2>
                <p className="text-xs text-slate-400 font-light leading-relaxed max-w-xs">
                  Synchronizing study node environment. Welcome to the elite productivity sphere.
                </p>

                {/* Fake loading bar redirect simulation */}
                <div className="w-full max-w-[200px] h-1.5 bg-slate-900 rounded-full overflow-hidden mt-8 border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    onAnimationComplete={() => {
                      // Redirect back home after success loader finishes
                      window.location.href = '/dashboard';
                    }}
                    className="h-full bg-gradient-to-r from-studysphere-purple to-studysphere-blue rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
