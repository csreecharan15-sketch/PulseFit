import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Lightbulb,
  History,
  RotateCcw,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { ChatMessage, VitalMetrics, UserProfile } from '../types';

interface FitnessChatModalProps {
  messages: ChatMessage[];
  vitals: VitalMetrics;
  profile: UserProfile;
  onSendMessage: (text: string) => Promise<void>;
  onClearHistory: () => void;
  onStartNewChat?: () => void;
  isLoading: boolean;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  'Any breakfast tips for low calorie?',
  '15-min home workout without weights',
  'Best high-protein vegetarian Indian foods',
  'How to lose belly fat safely with Indian diet?',
  'Healthy ways to drink morning chai',
];

export const FitnessChatModal: React.FC<FitnessChatModalProps> = ({
  messages,
  vitals,
  profile,
  onSendMessage,
  onClearHistory,
  onStartNewChat,
  isLoading,
  onClose,
}) => {
  const [inputText, setInputText] = useState('');
  const [showHistoryView, setShowHistoryView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showHistoryView) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, showHistoryView]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const msg = inputText.trim();
    setInputText('');
    onSendMessage(msg);
  };

  const handlePromptClick = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  const handleNewChatClick = () => {
    if (onStartNewChat) {
      onStartNewChat();
    } else {
      onClearHistory();
    }
    setShowHistoryView(false);
  };

  // Group queries for chat history overview
  const userQueries = messages.filter((m) => m.role === 'user');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-slate-800 dark:text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="w-full max-w-lg h-[92vh] sm:h-[82vh] bg-white dark:bg-slate-900 sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-3.5 px-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-amber-300 shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-white leading-tight truncate">
                  PulseFit AI Coach
                </h2>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>
              <p className="text-[10px] text-emerald-200 truncate">
                Fitness, Indian Diet & Vitals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Start New Chat Button */}
            <button
              onClick={handleNewChatClick}
              className="p-1.5 px-2 rounded-xl text-xs font-semibold flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
              title="Start a new chat session"
            >
              <RotateCcw className="w-3.5 h-3.5 text-teal-300" />
              <span className="text-[11px] font-bold">New Chat</span>
            </button>

            {/* Chat History Switcher Button */}
            <button
              onClick={() => setShowHistoryView(!showHistoryView)}
              className={`p-1.5 px-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                showHistoryView
                  ? 'bg-white text-slate-900'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
              title="View previous chats"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showHistoryView ? 'Chat' : 'History'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Vitals Context Indicator Pill */}
        <div className="px-4 py-1.5 bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Context:</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              Pulse: {vitals.heartRate} bpm
            </span>
            <span>·</span>
            <span className="font-mono text-indigo-700 dark:text-indigo-400 font-semibold">
              BP: {vitals.bpSys}/{vitals.bpDia}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            {profile.weightKg}kg · {profile.age}y
          </span>
        </div>

        {/* Conditional View: Chat History Drawer vs Active Chat Stream */}
        {showHistoryView ? (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Previous Conversation History ({userQueries.length})
                </h3>
              </div>
              {userQueries.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear History</span>
                </button>
              )}
            </div>

            {userQueries.length === 0 ? (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
                <History className="w-8 h-8 opacity-40" />
                <p className="text-xs">No previous fitness chats stored yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {messages.map((m, idx) => {
                  if (m.role !== 'user') return null;
                  const nextAssistant = messages[idx + 1];
                  return (
                    <div
                      key={m.id}
                      onClick={() => setShowHistoryView(false)}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600/50 shadow-2xs cursor-pointer flex items-start justify-between gap-2 transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-mono text-slate-400">
                            {m.timestamp}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          "{m.content}"
                        </h4>
                        {nextAssistant && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {nextAssistant.content}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Live Chat Stream */
          <>
            {/* Quick Suggestion Chips */}
            <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar shrink-0">
              <span className="text-slate-400 font-semibold whitespace-nowrap text-[10px] uppercase">
                Quick Ask:
              </span>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:border-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-300 whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-slate-50/50 dark:bg-slate-950/50">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs shadow-2xs mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 shadow-2xs text-xs flex flex-col gap-2 ${
                        isUser
                          ? 'bg-slate-900 dark:bg-emerald-700 text-white rounded-tr-xs'
                          : 'bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-xs'
                      }`}
                    >
                      <p className="leading-relaxed font-medium">{msg.content}</p>

                      {/* Structured Sections (Clean Bulleted Points) */}
                      {msg.structuredSections && msg.structuredSections.length > 0 && (
                        <div className="flex flex-col gap-2 pt-1 border-t border-slate-100 dark:border-slate-700">
                          {msg.structuredSections.map((sec, sIdx) => {
                            const isTip =
                              sec.heading.toLowerCase().includes('tip') ||
                              sec.heading.toLowerCase().includes('clip');
                            return (
                              <div
                                key={sIdx}
                                className={`p-2.5 rounded-xl flex flex-col gap-1.5 ${
                                  isTip
                                    ? 'bg-emerald-50/80 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200'
                                    : 'bg-slate-50 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                <span className="font-bold text-[11px] flex items-center gap-1.5">
                                  {isTip ? (
                                    <Lightbulb className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  ) : (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                                  )}
                                  {sec.heading}
                                </span>
                                <ul className="flex flex-col gap-1 pl-4 list-disc text-[11px] leading-relaxed">
                                  {sec.items.map((it, iIdx) => (
                                    <li key={iIdx}>{it}</li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <span
                        className={`text-[9px] text-right ${
                          isUser ? 'text-slate-300 dark:text-emerald-200' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-xl bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 text-xs shadow-2xs mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-2.5 items-center text-xs text-slate-400">
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1 text-slate-500 dark:text-slate-400 font-medium">PulseFit AI is writing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                placeholder="Ask about fitness, exercises, Indian nutrition..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors font-medium placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};
