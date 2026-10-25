import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Heart,
  Activity,
  Footprints,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { VitalMetrics } from '../types';

interface GoogleHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  vitals: VitalMetrics;
  onConnectGoogleHealth: () => void;
  onDisconnectGoogleHealth: () => void;
}

export const GoogleHealthModal: React.FC<GoogleHealthModalProps> = ({
  isOpen,
  onClose,
  vitals,
  onConnectGoogleHealth,
  onDisconnectGoogleHealth,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [permissions, setPermissions] = useState({
    heartRate: true,
    bloodPressure: true,
    steps: true,
    oxygen: true,
    temperature: true,
  });

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAuthorize = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onConnectGoogleHealth();
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  const isConnected = !!vitals.googleHealthConnected;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-slate-800 dark:text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden max-h-[90vh]"
      >
        {/* Header with Google Health Connect Branding */}
        <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white font-bold">
              <Activity className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold leading-tight">Google Health Connect</h3>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[9px] font-semibold">
                  Demo
                </span>
              </div>
              <p className="text-[10px] text-emerald-100">
                PulseBack Clip Sensor Bridge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto flex flex-col gap-4 text-xs">
          {/* PulseBack Proprietary Notice */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-slate-900 dark:text-white">
                PulseMind PulseBack Clip™ Technology:
              </span>{' '}
              <span className="text-slate-600 dark:text-slate-300">
                Our proprietary optical sensor stream seamlessly synchronizes with Android's Google Health Connect framework to provide accurate medical-grade telemetry.
              </span>
            </div>
          </div>

          {/* Connection Status Card */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isConnected
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <div>
                <span className="font-bold block text-xs">
                  {isConnected ? 'Google Health Connected' : 'Google Health Ready to Pair'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isConnected
                    ? `Last synced: ${vitals.googleHealthLastSync || 'Just now'} · High frequency stream`
                    : 'Grant permission to link PulseBack Clip readings'}
                </span>
              </div>
            </div>
            {isConnected && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>

          {/* Health Data Permissions List */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider">
              <span>Android Health Connect Permissions</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold lowercase">
                encrypted on-device
              </span>
            </div>

            <div className="space-y-1.5">
              {[
                {
                  key: 'heartRate' as const,
                  label: 'Heart Rate & Resting BPM',
                  desc: `Live reading: ${vitals.heartRate} bpm`,
                  icon: Heart,
                  color: 'text-rose-500',
                },
                {
                  key: 'bloodPressure' as const,
                  label: 'Blood Pressure (Systolic / Diastolic)',
                  desc: `Live reading: ${vitals.bpSys}/${vitals.bpDia} mmHg`,
                  icon: Activity,
                  color: 'text-indigo-500',
                },
                {
                  key: 'steps' as const,
                  label: 'Daily Steps & Distance',
                  desc: `${vitals.steps.toLocaleString()} steps today`,
                  icon: Footprints,
                  color: 'text-emerald-500',
                },
                {
                  key: 'oxygen' as const,
                  label: 'Blood Oxygen (SpO2)',
                  desc: `${vitals.spo2}% oxygen saturation`,
                  icon: ShieldCheck,
                  color: 'text-sky-500',
                },
              ].map((item) => {
                const Icon = item.icon;
                const isChecked = permissions[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => togglePermission(item.key)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white leading-tight">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                        isChecked ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                          isChecked ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Privacy first: PulseBack telemetry stays on device and complies with HIPAA/GDPR health data guidelines.</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-2.5">
          {isConnected ? (
            <>
              <button
                type="button"
                onClick={onDisconnectGoogleHealth}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                Disconnect
              </button>
              <button
                type="button"
                onClick={handleAuthorize}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAuthorize}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting Google Health...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-3.5 h-3.5" />
                    <span>Connect Google Health</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
