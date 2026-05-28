"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  X,
  Send,
  User,
  AlertCircle,
  Trash2,
  Mic,
  Volume2,
  VolumeX,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

const FormatMessage = ({ text }: { text: string }) => {
  const lines = text.split("\n");
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeLanguage = "";

  const elements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    // Toggle code blocks
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${index}`}
            className="my-2 p-3 rounded-lg bg-[#090520]/90 border border-slate-800/80 font-mono text-xs text-cyan-400 overflow-x-auto select-all max-w-full"
          >
            {codeLanguage && (
              <span className="block text-[9px] text-slate-500 uppercase tracking-widest mb-1">
                {codeLanguage}
              </span>
            )}
            <code>{codeBlockContent.join("\n")}</code>
          </pre>
        );
        inCodeBlock = false;
        codeBlockContent = [];
      } else {
        inCodeBlock = true;
        codeLanguage = line.trim().substring(3) || "code";
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    // Check bullet items
    const listMatch = line.match(/^(\s*)[*\-]\s+(.*)$/);
    if (listMatch) {
      elements.push(
        <div key={`list-${index}`} className="flex items-start gap-2 my-1 pl-2 text-xs sm:text-sm text-slate-300">
          <span className="text-purple-400 select-none">•</span>
          <span>{parseInlineMarkdown(listMatch[2])}</span>
        </div>
      );
      return;
    }

    // Default paragraph
    if (line.trim() === "") {
      elements.push(<div key={`space-${index}`} className="h-2" />);
    } else {
      elements.push(
        <p key={`p-${index}`} className="my-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  });

  return <div className="space-y-0.5 max-w-full overflow-hidden break-words">{elements}</div>;
};

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const splitParts = text.split(regex);

  return splitParts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-slate-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-slate-900/60 font-mono text-[11px] text-fuchsia-400 border border-slate-800"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function cleanTextForSpeech(text: string): string {
  let clean = text;
  
  // 1. Remove markdown code blocks completely
  clean = clean.replace(/```[\s\S]*?```/g, " [code snippet omitted] ");

  // 2. Remove inline code wrapping
  clean = clean.replace(/`([^`]+)`/g, "$1");

  // 3. Remove bold/italic markup
  clean = clean.replace(/\*\*([^*]+)\*\*/g, "$1");
  clean = clean.replace(/\*([^*]+)\*/g, "$1");
  clean = clean.replace(/__([^_]+)__/g, "$1");
  clean = clean.replace(/_([^_]+)_/g, "$1");

  // 4. Clean up list symbols/hyphens
  clean = clean.replace(/^\s*[*\-]\s+/gm, "");

  // 5. Clean extra whitespace
  clean = clean.replace(/\s+/g, " ").trim();

  return clean;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-welcome",
      sender: "ai",
      text: "Hello! I'm **SphereAI**, your virtual study companion. Ready to lock in and focus? You can ask me math questions, code queries, or ask about study rooms, productivity hacks, and focus techniques. How can I help you node today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  
  // Voice integration states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Refs to always provide the latest state in event listeners without re-running effects
  const messagesRef = useRef<Message[]>(messages);
  const isVoiceEnabledRef = useRef<boolean>(isVoiceEnabled);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    isVoiceEnabledRef.current = isVoiceEnabled;
  }, [isVoiceEnabled]);

  // Load chat session history and voice options from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sphere_ai_chat");
      if (stored) {
        const parsed = JSON.parse(stored);
        const formatted = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        setMessages(formatted);
      }
      
      const storedVoice = localStorage.getItem("sphere_ai_voice_enabled");
      if (storedVoice) {
        setIsVoiceEnabled(storedVoice === "true");
      }
    } catch (e) {
      console.error("Failed to restore chat configurations:", e);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    try {
      if (messages.length > 1) {
        localStorage.setItem("sphere_ai_chat", JSON.stringify(messages));
      }
    } catch (e) {
      console.error("Failed to sync chat session:", e);
    }
  }, [messages]);

  // Speech Recognition & Synthesis initial setup (ONCE ON MOUNT)
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthesisRef.current = window.speechSynthesis;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            sendMessage(transcript);
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech Recognition Error:", event.error);
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }

    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  // Autoscroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const speakText = (text: string) => {
    if (!synthesisRef.current) return;
    
    // Interrupt existing voice playback
    synthesisRef.current.cancel();

    const cleaned = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleaned);

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    synthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleVoiceOutput = () => {
    const newVal = !isVoiceEnabled;
    setIsVoiceEnabled(newVal);
    localStorage.setItem("sphere_ai_voice_enabled", String(newVal));
    if (!newVal) {
      stopSpeaking();
    }
  };

  const toggleDictation = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopSpeaking();
      recognitionRef.current.start();
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsError(false);
    stopSpeaking();

    try {
      const history = messagesRef.current
        .filter((m) => m.id !== "initial-welcome")
        .map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          text: m.text,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to retrieve chat response");
      }

      const data = await res.json();
      const reply = data.text || "No response received.";

      const responseMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, responseMessage]);

      if (isVoiceEnabledRef.current) {
        speakText(reply);
      }
    } catch (error) {
      console.error("Failed to communicate with SphereAI:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const clearChat = () => {
    if (confirm("Reset current study chat history?")) {
      stopSpeaking();
      const reset: Message[] = [
        {
          id: "initial-welcome",
          sender: "ai",
          text: "SphereAI reset complete. Ready for a new study session. What's on your mind?",
          timestamp: new Date(),
        },
      ];
      setMessages(reset);
      localStorage.removeItem("sphere_ai_chat");
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 shadow-[0_0_20px_rgba(139,92,246,0.4)] border border-purple-400/30 text-white cursor-pointer group"
        aria-label="Toggle Study AI Companion"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-105 transition-transform" />
              <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[480px] sm:h-[520px] max-h-[75vh] flex flex-col rounded-2xl border border-slate-800/80 shadow-[0_20px_50px_rgba(3,0,20,0.85)] overflow-hidden z-50 bg-[#090520]/80 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-slate-800/80 bg-gradient-to-r from-purple-950/20 via-violet-950/20 to-transparent">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-purple-400 animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950"></span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-100 flex items-center gap-1.5 leading-none">
                    SphereAI Node
                  </h4>
                  <span className="text-[10px] text-slate-400">Voice Assistant Ready</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Voice Toggle button */}
                <button
                  onClick={toggleVoiceOutput}
                  title={isVoiceEnabled ? "Mute voice answers" : "Unmute voice answers"}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isVoiceEnabled
                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      : "hover:bg-slate-800/40 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {isVoiceEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={clearChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg hover:bg-slate-800/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800/40 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-900/45 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-slate-300 ${
                      msg.sender === "user"
                        ? "bg-indigo-500/10 border border-indigo-500/25"
                        : "bg-purple-500/10 border border-purple-500/25"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-purple-400" />
                    )}
                  </div>

                  <div
                    className={`p-3 rounded-xl border text-slate-200 shadow-sm leading-relaxed overflow-x-hidden ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-indigo-600/20 to-violet-600/10 border-indigo-500/30 rounded-tr-none"
                        : "bg-slate-900/40 border-slate-800/80 rounded-tl-none"
                    }`}
                  >
                    <FormatMessage text={msg.text} />
                    <span className="block text-[8px] text-slate-500 mt-1.5 text-right font-mono">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 max-w-[80%] mr-auto">
                  <div className="w-6 h-6 rounded-md bg-purple-500/10 border border-purple-500/25 flex items-center justify-center flex-shrink-0 text-purple-400">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 rounded-xl rounded-tl-none border bg-slate-900/40 border-slate-800/80 text-slate-200">
                    <div className="flex items-center gap-1.5 py-1 px-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}

              {isError && (
                <div className="flex gap-2.5 max-w-[85%] mr-auto">
                  <div className="w-6 h-6 rounded-md bg-rose-500/10 border border-rose-500/25 flex items-center justify-center flex-shrink-0 text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 rounded-xl rounded-tl-none border bg-rose-950/15 border-rose-900/35 text-slate-200 text-xs sm:text-sm flex flex-col gap-2">
                    <span className="text-rose-400 font-semibold">SphereAI offline</span>
                    <span>An error occurred while establishing neural connection. Let's try sending again.</span>
                    <button
                      onClick={() => {
                        setIsError(false);
                        const lastUserMsg = [...messagesRef.current].reverse().find(m => m.sender === "user");
                        if (lastUserMsg) {
                          sendMessage(lastUserMsg.text);
                        }
                      }}
                      className="mt-1 px-3 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 transition-colors text-xs font-medium cursor-pointer max-w-fit"
                    >
                      Retry Connection
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Speaking Status Panel */}
            <AnimatePresence>
              {isSpeaking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-2.5 py-2 px-4 bg-purple-500/10 border-t border-purple-500/20 text-purple-300 text-xs shrink-0 backdrop-blur-md"
                >
                  <span className="flex items-center gap-0.5">
                    <span className="w-1.5 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-4.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </span>
                  <span className="font-medium">SphereAI is speaking...</span>
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="ml-auto px-2 py-0.5 rounded bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-[10px] text-purple-200 transition-colors cursor-pointer"
                  >
                    Stop playback
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dictation Listening Overlay */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#090520]/95 flex flex-col items-center justify-center z-20"
                >
                  <div className="relative w-20 h-20 flex items-center justify-center mb-6">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping"></div>
                    <div className="absolute -inset-2 bg-purple-500/15 rounded-full animate-pulse"></div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg border border-purple-400/35 relative">
                      <Mic className="w-7 h-7 text-white animate-pulse" />
                    </div>
                  </div>
                  <h4 className="text-slate-100 font-semibold tracking-wide animate-pulse">
                    Listening for Dictation...
                  </h4>
                  <p className="text-slate-400 text-xs mt-1.5 max-w-[80%] text-center">
                    Speak clearly. We will automatically submit when you finish talking.
                  </p>
                  <button
                    type="button"
                    onClick={toggleDictation}
                    className="mt-6 px-4.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel Dictation
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2"
            >
              {/* Voice recognition mic toggle button */}
              <button
                type="button"
                onClick={toggleDictation}
                title="Start dictation"
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 border ${
                  isListening
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                    : "bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-850"
                }`}
              >
                <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                placeholder="Ask SphereAI or dictate..."
                className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors flex items-center justify-center cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
