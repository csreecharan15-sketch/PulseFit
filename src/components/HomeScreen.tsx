import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Utensils,
  Trophy,
  Sparkles,
  Flame,
  ArrowRight,
  User,
  Activity,
  CheckCircle2,
  Circle,
  MessageSquare,
  Power,
  Sun,
  Moon,
  ShieldCheck,
  Languages,
  Droplet,
  Footprints,
  Compass,
  Zap,
  Clock,
  ChevronRight,
  Check,
} from 'lucide-react';
import {
  UserProfile,
  VitalMetrics,
  TaskItem,
  MealItem,
  AppScreen,
  AppLanguage,
} from '../types';
import { useTheme } from '../context/ThemeContext';
import { SUPPORTED_LANGUAGES, t } from '../services/i18n';

interface HomeScreenProps {
  profile: UserProfile;
  vitals: VitalMetrics;
  tasks: TaskItem[];
  loggedMeals: MealItem[];
  userPoints: number;
  streakDays: number;
  onNavigate: (screen: AppScreen) => void;
  onToggleTask: (taskId: string) => void;
  onToggleSensorConnection: () => void;
  onOpenGoogleHealthModal?: () => void;
  onOpenChat: () => void;
  onSimulateVitalsMode: (mode: 'Normal' | 'Active Cardio' | 'Resting Recovery') => void;
  onUpdateLanguage?: (lang: AppLanguage) => void;
  onCompleteQuickReminder?: (type: 'water' | 'move') => void;
  launchKey: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  vitals,
  tasks,
  loggedMeals,
  userPoints,
  streakDays,
  onNavigate,
  onToggleTask,
  onToggleSensorConnection,
  onOpenGoogleHealthModal,
  onOpenChat,
  onSimulateVitalsMode,
  onUpdateLanguage,
  onCompleteQuickReminder,
  launchKey,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [reminderClaimed, setReminderClaimed] = useState<'water' | 'move' | null>(null);

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const totalCaloriesLogged = loggedMeals.reduce((acc, m) => acc + m.calories, 0);

  // Measured active burn dynamically added from clip telemetry
  const activeBurn = vitals.dailyBurnCalories || Math.round(vitals.activeMinutes * 5.1);
  const dynamicCalorieExpenditure = profile.dailyCalorieTarget + activeBurn;
  const caloriesRemaining = Math.max(0, dynamicCalorieExpenditure - totalCaloriesLogged);

  // Single Source of Truth Priority Action Calculation:
  const isGoalReached = vitals.steps >= vitals.stepGoal;
  const stepsRemaining = Math.max(0, vitals.stepGoal - vitals.steps);

  const handleClaimReminder = (type: 'water' | 'move') => {
    setReminderClaimed(type);
    if (onCompleteQuickReminder) {
      onCompleteQuickReminder(type);
    }
    setTimeout(() => setReminderClaimed(null), 2500);
  };

  return (
    <motion.div
      key={launchKey}
      initial={{ scale: 0.88, opacity: 0, filter: 'blur(6px)' }}
      animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
      exit={{ scale: 0.92, opacity: 0 }}
      transition={{
        type: 'spring',
        damping: 24,
        stiffness: 180,
        mass: 0.9,
      }}
      className="p-3.5 sm:p-5 flex flex-col gap-3.5 sm:gap-4 text-slate-800 dark:text-slate-100 max-w-full overflow-hidden"
    >
      {/* Top Header: User Profile on Left + App Theme Toggle + Language + PulseFit AI Coach + Streak */}
      <header className="flex items-center justify-between pb-0.5 gap-2">
        {/* Profile Button (Top-Left) */}
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all group cursor-pointer text-left shrink-0 min-w-0"
          title="Open User Profile"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">
              {profile.name}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {profile.age}y · {profile.weightKg}kg
            </span>
          </div>
        </button>

        {/* Right Header Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 relative">
          {/* Language Switcher (English, Hindi, Marathi, Tamil, etc.) */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              title="Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-[11px] uppercase">{profile.language || 'en'}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 top-10 z-50 w-36 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 flex flex-col">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      if (onUpdateLanguage) onUpdateLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${
                      profile.language === lang.code ? 'font-bold text-teal-600' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* In-App Dark / Light Mode Switch */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
            )}
          </button>

          {/* AI Fitness Coach Button */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
            title="Ask PulseFit AI Coach"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Coach</span>
          </button>

          {/* Daily Streak */}
          <button
            onClick={() => onNavigate('rewards')}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold shadow-2xs hover:bg-amber-100/70 transition-colors cursor-pointer"
            title="View Rewards & Streaks"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500" />
            <span>{streakDays}d</span>
          </button>
        </div>
      </header>

      {/* PulseBack Clip Sensor Connection Banner (Accurate Disconnection State Handling) */}
      <div
        className={`p-2.5 px-3 rounded-2xl border flex items-center justify-between text-xs transition-all gap-2 ${
          vitals.isConnected
            ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200'
            : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              vitals.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
            }`}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-[11px] leading-tight truncate">
                PulseBack Clip {vitals.isConnected ? 'Connected' : 'Offline'}
              </span>
              {vitals.googleHealthConnected && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-200/70 dark:bg-emerald-900/80 text-[9px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Google Health
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {vitals.isConnected
                ? `Battery: ${vitals.sensorBattery}% · Live Telemetry Synced`
                : `Last synced 3 min ago · Tap Connect to resume telemetry`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenGoogleHealthModal}
            className="flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-bold bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/80 shadow-2xs transition-colors cursor-pointer"
            title="Google Health Connect"
          >
            <Activity className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            <span className="hidden xs:inline">Health Connect</span>
            <span className="xs:hidden">Sync</span>
          </button>

          <button
            onClick={onToggleSensorConnection}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold shadow-2xs transition-colors cursor-pointer ${
              vitals.isConnected
                ? 'bg-white dark:bg-slate-900 hover:bg-rose-100 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Power className="w-3 h-3" />
            <span>{vitals.isConnected ? 'Off' : 'Pair'}</span>
          </button>
        </div>
      </div>

      {/* TODAY'S PRIORITY ACTION HERO CARD (Front & Center: Answers user's direct requirement!) */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-4 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-lg border border-emerald-700/60 relative overflow-hidden flex flex-col gap-2.5"
      >
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 fill-amber-300" />
            {t(profile.language, 'priorityActionTitle')}
          </span>
          <span className="text-[10px] font-mono text-emerald-200">
            {vitals.heartRate} bpm · Readiness {vitals.readinessScore}%
          </span>
        </div>

        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-white leading-tight">
            {isGoalReached
              ? 'Target Crushed: 10-Minute Recovery Stride & Breathwork'
              : `Brisk Evening Walk: Complete remaining ${stepsRemaining.toLocaleString()} steps`}
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
            {isGoalReached
              ? `You have crushed ${vitals.steps.toLocaleString()} steps today! Complete a slow 10-minute Shatapavali stroll and 5 mins of Anulom Vilom breathing to bring resting pulse into the 50s bpm for deep sleep.`
              : `Your 7-day consistency streak is on the line! A brisk 20-minute post-dinner walk will cover your remaining steps, burn 160 kcal, and keep your circadian rhythm locked in.`}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/15">
          <div className="flex items-center gap-2 text-[11px] text-emerald-200 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>Target: {isGoalReached ? '10 mins' : '20 mins'}</span>
            <span>·</span>
            <span className="text-amber-300 font-bold">+95 Pts</span>
          </div>

          <button
            onClick={() => onNavigate('taskmaster')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span>{isGoalReached ? 'Log Recovery' : 'Start Walk'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Sedentary & Hydration Interactive Reminders (Drive daily opens & healthy habits) */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Hydration Reminder */}
        <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 flex flex-col justify-between gap-1.5">
          <div className="flex items-center gap-1.5 text-sky-900 dark:text-sky-200">
            <Droplet className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
            <span className="font-bold text-[11px]">Hydration Reminder</span>
          </div>
          <p className="text-[10px] text-sky-800 dark:text-sky-300">
            Drink 250ml water now to maintain optimal blood volume (SpO2: {vitals.spo2}%)!
          </p>
          <button
            onClick={() => handleClaimReminder('water')}
            className={`py-1 px-2 rounded-lg font-bold text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1 ${
              reminderClaimed === 'water'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 border border-sky-200 hover:bg-sky-100'
            }`}
          >
            {reminderClaimed === 'water' ? <Check className="w-3 h-3" /> : null}
            <span>{reminderClaimed === 'water' ? 'Hydrated! (+15)' : 'I Drank Water (+15 pts)'}</span>
          </button>
        </div>

        {/* Sedentary Move Alert */}
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col justify-between gap-1.5">
          <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200">
            <Footprints className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold text-[11px]">Post-Desk Stride</span>
          </div>
          <p className="text-[10px] text-amber-800 dark:text-amber-300">
            Stand up and complete 200 light steps to release lower back stiffness!
          </p>
          <button
            onClick={() => handleClaimReminder('move')}
            className={`py-1 px-2 rounded-lg font-bold text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1 ${
              reminderClaimed === 'move'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            {reminderClaimed === 'move' ? <Check className="w-3 h-3" /> : null}
            <span>{reminderClaimed === 'move' ? 'Completed! (+15)' : 'I Walked (+15 pts)'}</span>
          </button>
        </div>
      </div>

      {/* Central Visual Hub (Connecting Diagram):
          Center: Task-Master
          Top-Left: Vitals (Heart)
          Top-Right: Diet (Dish)
          Bottom-Left: Motivational Posts (Posters & Slogans)
          Bottom-Right: Rewards (Trophy & Indian INR Vouchers) */}
      <section className="relative w-full h-[320px] sm:h-[350px] bg-gradient-to-b from-white via-slate-50/80 to-emerald-50/20 dark:from-slate-950 dark:via-slate-900/90 dark:to-emerald-950/20 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-2 sm:p-4 flex items-center justify-center overflow-hidden select-none">
        {/* Soft background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-72 sm:h-72 bg-emerald-200/25 dark:bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        {/* SVG Bezier Curves */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 360 360"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="curveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="curveGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="curveGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="curveGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Center to Top-Left Vitals */}
          <path d="M 180 180 C 130 150, 95 115, 70 75" stroke="url(#curveGrad1)" strokeWidth="3" strokeDasharray="4 4" fill="none" />
          {/* Center to Top-Right Diet */}
          <path d="M 180 180 C 230 150, 265 115, 290 75" stroke="url(#curveGrad2)" strokeWidth="3" strokeDasharray="4 4" fill="none" />
          {/* Center to Bottom-Left Posts */}
          <path d="M 180 180 C 130 210, 95 245, 70 285" stroke="url(#curveGrad3)" strokeWidth="3" strokeDasharray="4 4" fill="none" />
          {/* Center to Bottom-Right Rewards */}
          <path d="M 180 180 C 230 210, 265 245, 290 285" stroke="url(#curveGrad4)" strokeWidth="3" strokeDasharray="4 4" fill="none" />
        </svg>

        {/* 1. TOP-LEFT NODE: Vitals (Heart) */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => onNavigate('vitals')}
          className="absolute top-2.5 left-2.5 sm:top-5 sm:left-5 z-10 flex flex-col items-center group cursor-pointer"
        >
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/90 dark:border-rose-900/60 shadow-md group-hover:shadow-rose-200/50 flex flex-col items-center justify-center p-1.5 transition-all">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 fill-rose-500 text-rose-600 ${vitals.isConnected ? 'animate-pulse' : ''}`} />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-100 mt-0.5">Vitals</span>
          </div>
          <div className="mt-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-50/90 dark:bg-rose-950/80 border border-rose-200/60 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-[9px] sm:text-[10px] font-semibold tracking-tight shadow-2xs max-w-[85px] sm:max-w-none truncate font-mono">
            {vitals.isConnected ? `${vitals.heartRate} bpm` : 'Last: 74 bpm (Off)'}
          </div>
        </motion.button>

        {/* 2. TOP-RIGHT NODE: Diet (Indian Food Dish) */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => onNavigate('diet')}
          className="absolute top-2.5 right-2.5 sm:top-5 sm:right-5 z-10 flex flex-col items-center group cursor-pointer"
        >
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/90 dark:border-amber-900/60 shadow-md group-hover:shadow-amber-200/50 flex flex-col items-center justify-center p-1.5 transition-all">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-100 mt-0.5">Diet</span>
          </div>
          <div className="mt-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-50/90 dark:bg-amber-950/80 border border-amber-200/60 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-[9px] sm:text-[10px] font-semibold tracking-tight shadow-2xs max-w-[85px] sm:max-w-none truncate font-mono">
            {caloriesRemaining} kcal
          </div>
        </motion.button>

        {/* 3. CENTER NODE: Task-Master (AI-Driven Planner Core) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('taskmaster')}
          className="relative z-20 flex flex-col items-center cursor-pointer group"
        >
          {/* Glowing pulse rings */}
          <div className="absolute -inset-2.5 sm:-inset-3 rounded-full bg-indigo-500/15 animate-ping opacity-75 pointer-events-none" />
          <div className="absolute -inset-1.5 sm:-inset-2 rounded-full bg-gradient-to-tr from-indigo-500/20 via-emerald-500/20 to-teal-500/20 blur-sm" />

          {/* Central Hub Disc */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-indigo-900 via-indigo-700 to-teal-600 dark:from-indigo-950 dark:via-purple-900 dark:to-teal-700 text-white shadow-xl dark:shadow-[0_0_35px_rgba(99,102,241,0.35)] flex flex-col items-center justify-center p-2.5 border-2 border-indigo-300/40 dark:border-indigo-400/50 group-hover:shadow-indigo-500/40 transition-shadow">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 mb-0.5 group-hover:rotate-12 transition-transform">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-300" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold tracking-tight text-white drop-shadow-xs text-center leading-tight">
              Task-Master
            </span>
            <span className="text-[9px] sm:text-[10px] text-teal-200 font-medium">
              AI Planner
            </span>
            <div className="mt-0.5 px-2 py-0.2 rounded-full bg-white/25 text-[8px] sm:text-[9px] font-semibold text-white">
              {pendingTasks.length} pending
            </div>
          </div>
        </motion.button>

        {/* 4. BOTTOM-LEFT NODE: Motivational Inspiration (Posters & Slogans) */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => onNavigate('posts')}
          className="absolute bottom-2.5 left-2.5 sm:bottom-5 sm:left-5 z-10 flex flex-col items-center group cursor-pointer"
        >
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-slate-900 border border-sky-200/90 dark:border-sky-900/60 shadow-md group-hover:shadow-sky-200/50 flex flex-col items-center justify-center p-1.5 transition-all">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-100 mt-0.5">Inspiration</span>
          </div>
          <div className="mt-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-sky-50/90 dark:bg-sky-950/80 border border-sky-200/60 dark:border-sky-900/60 text-sky-700 dark:text-sky-300 text-[9px] sm:text-[10px] font-semibold tracking-tight shadow-2xs max-w-[85px] sm:max-w-none truncate">
            Posters & Quotes
          </div>
        </motion.button>

        {/* 5. BOTTOM-RIGHT NODE: Rewards (Trophy & Indian INR Vouchers) */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => onNavigate('rewards')}
          className="absolute bottom-2.5 right-2.5 sm:bottom-5 sm:right-5 z-10 flex flex-col items-center group cursor-pointer"
        >
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-900/60 shadow-md group-hover:shadow-emerald-200/50 flex flex-col items-center justify-center p-1.5 transition-all">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-100 mt-0.5">Rewards</span>
          </div>
          <div className="mt-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-50/90 dark:bg-emerald-950/80 border border-emerald-200/60 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[9px] sm:text-[10px] font-semibold tracking-tight shadow-2xs max-w-[85px] sm:max-w-none truncate font-mono">
            {userPoints} Pts
          </div>
        </motion.button>
      </section>

      {/* Task-Master Action Preview List */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Today's Action Missions ({completedTasks.length}/{tasks.length})
            </h3>
          </div>
          <button
            onClick={() => onNavigate('taskmaster')}
            className="text-[11px] text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {tasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                task.completed
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40 text-slate-500 dark:text-slate-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-800 dark:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    task.completed
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-700 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4
                    className={`text-xs font-bold truncate leading-tight ${
                      task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {task.vitalTriggerReason}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono">
                  +{task.points} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
