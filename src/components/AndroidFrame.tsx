import React from 'react';
import { Smartphone, Monitor, Download, Wifi, Battery, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AndroidFrameProps {
  children: React.ReactNode;
  isFramed: boolean;
  onToggleFrame: () => void;
  onOpenApkModal: () => void;
  onReplayLaunchAnimation: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isFramed,
  onToggleFrame,
  onOpenApkModal,
  onReplayLaunchAnimation,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-0 sm:p-4 selection:bg-emerald-500 selection:text-white">
      {/* Top Floating Control Bar for Development & Device Testing */}
      <header className="w-full max-w-4xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 mb-2 sm:mb-4 bg-slate-900/60 backdrop-blur-md rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">PulseMind Android OS</span>
          <span className="hidden md:inline text-slate-500">| Target SDK 35 (Android 15)</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700/60"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-medium">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] font-medium">Dark</span>
              </>
            )}
          </button>
          <button
            onClick={onReplayLaunchAnimation}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Re-run launch zoom-in animation"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Replay Zoom</span>
          </button>

          <button
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-all cursor-pointer"
            title="Download APK or test directly on physical Android device"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install / APK</span>
          </button>

          <button
            onClick={onToggleFrame}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Toggle Android Device Chassis"
          >
            {isFramed ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-sky-400" />
                <span>Full View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Device Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex justify-center items-start">
        {isFramed ? (
          /* Android Physical Device Chassis (Google Pixel 8 / Galaxy S24 aesthetic) */
          <div className="relative w-full max-w-[420px] h-[880px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-white/10 flex flex-col overflow-hidden transition-all duration-300">
            {/* Top Speaker / Sensor Bezel */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-800 rounded-full z-30" />

            {/* Inner Phone Screen */}
            <div className="relative w-full h-full bg-[#f8faf9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-[38px] overflow-hidden flex flex-col shadow-inner transition-colors duration-300">
              {/* Android Native Status Bar */}
              <div className="w-full h-8 bg-slate-900/5 dark:bg-slate-900/80 backdrop-blur-sm px-6 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 select-none z-30 shrink-0">
                <span className="font-mono tracking-tight">09:41</span>
                {/* Camera punch hole cutout */}
                <div className="w-3.5 h-3.5 bg-slate-950 rounded-full border border-slate-800/40 shadow-inner" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">5G</span>
                  <Wifi className="w-3 h-3 text-slate-700 dark:text-slate-300" />
                  <Battery className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 fill-current" />
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
                {children}
              </div>

              {/* Android Gesture Bar */}
              <div className="w-full h-5 bg-transparent flex items-center justify-center shrink-0 z-30 pointer-events-none pb-1">
                <div className="w-32 h-1 bg-slate-400/80 dark:bg-slate-600 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Responsive Edge-to-Edge Screen (Mobile Web / Tablet Full Screen) */
          <div className="w-full max-w-md bg-[#f8faf9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-[92vh] sm:rounded-3xl shadow-xl overflow-hidden flex flex-col border border-slate-800/50 transition-colors duration-300">
            {/* Minimal Mobile Status Bar */}
            <div className="w-full h-7 bg-slate-100/80 dark:bg-slate-900/90 border-b border-slate-200/60 dark:border-slate-800/80 px-5 flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300 select-none shrink-0">
              <span className="font-mono">PulseMind · India OS</span>
              <div className="flex items-center gap-2">
                <Wifi className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                <Battery className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 fill-current" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
