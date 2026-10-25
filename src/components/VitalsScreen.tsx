import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Activity,
  Thermometer,
  Wind,
  Footprints,
  Flame,
  ArrowLeft,
  RefreshCw,
  Cpu,
  Power,
  Sparkles,
  AlertCircle,
  Moon,
  Zap,
  ShieldCheck,
  FileText,
  Phone,
  Bell,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Users,
  Compass,
} from 'lucide-react';
import { VitalMetrics, UserProfile } from '../types';

interface VitalsScreenProps {
  vitals: VitalMetrics;
  profile: UserProfile;
  onBack: () => void;
  onRefreshVitals: () => void;
  onToggleSensorConnection: () => void;
  onSimulateMode: (mode: 'Normal' | 'Active Cardio' | 'Resting Recovery') => void;
  onOpenDoctorSummary: () => void;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
}

export const VitalsScreen: React.FC<VitalsScreenProps> = ({
  vitals,
  profile,
  onBack,
  onRefreshVitals,
  onToggleSensorConnection,
  onSimulateMode,
  onOpenDoctorSummary,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'vitals' | 'trends' | 'family' | 'alerts'>('vitals');
  const [trendsRange, setTrendsRange] = useState<'7d' | '30d'>('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fallSimulating, setFallSimulating] = useState(false);
  const [fallCountdown, setFallCountdown] = useState<number | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefreshVitals();
    setTimeout(() => setIsRefreshing(false), 700);
  };

  const handleTriggerFallSimulation = () => {
    setFallSimulating(true);
    setFallCountdown(15);
    const interval = setInterval(() => {
      setFallCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setFallSimulating(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancelFall = () => {
    setFallSimulating(false);
    setFallCountdown(null);
  };

  // Status helper based on ranges
  const getHeartRateStatus = (bpm: number) => {
    if (bpm < 60)
      return {
        label: 'Athletic Resting',
        color: 'text-indigo-700 dark:text-indigo-300',
        bg: 'bg-indigo-50 dark:bg-indigo-950/60',
      };
    if (bpm <= 100)
      return {
        label: 'Wellness Baseline (Optical Estimate)',
        color: 'text-emerald-700 dark:text-emerald-300',
        bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      };
    return {
      label: 'Elevated (Workout / Movement)',
      color: 'text-rose-700 dark:text-rose-300',
      bg: 'bg-rose-50 dark:bg-rose-950/60',
    };
  };

  const hrStatus = getHeartRateStatus(vitals.heartRate);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="p-3.5 sm:p-5 flex flex-col gap-4 text-slate-800 dark:text-slate-100 max-w-full overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Return to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              PulseBack Vitals & Health
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {vitals.isConnected ? 'Synchronized Telemetry Hub' : 'Clip Offline · Showing last recorded baseline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenDoctorSummary}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold shadow-2xs hover:bg-teal-100 transition-colors cursor-pointer"
            title="Export Doctor Visit Summary"
          >
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">Doctor Export</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={!vitals.isConnected}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('vitals')}
          className={`flex-1 min-w-[75px] py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'vitals'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Live Telemetry
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`flex-1 min-w-[75px] py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 ${
            activeTab === 'trends'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-3 h-3 text-teal-500" />
          <span>Trends</span>
        </button>
        <button
          onClick={() => setActiveTab('family')}
          className={`flex-1 min-w-[75px] py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 ${
            activeTab === 'family'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3 h-3 text-indigo-500" />
          <span>Elder Care</span>
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 min-w-[75px] py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 ${
            activeTab === 'alerts'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bell className="w-3 h-3 text-rose-500" />
          <span>Alerts & SOS</span>
        </button>
      </div>

      {/* Mandatory Regulatory CDSCO Wellness Disclaimer Banner */}
      <div className="p-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-[11px] flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-tight">
          <span className="font-bold block mb-0.5">Wellness Companion Only (CDSCO Compliance):</span>
          <span>
            PulseBack Clip biosignals are optical sensor estimates for habit tracking. They are not intended for medical diagnosis, treatment, or clinical monitoring under CDSCO guidelines. Cuffless BP is an optical estimate—consult a physician for diagnostic evaluation.
          </span>
        </div>
      </div>

      {/* Fall Event Simulation Modal Banner (if active) */}
      <AnimatePresence>
        {fallSimulating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 rounded-3xl bg-rose-600 text-white shadow-xl flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300 animate-bounce" />
                <span className="font-bold text-sm">Fall Detected by PulseBack Accelerometer!</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/20 font-mono text-xs font-bold">
                {fallCountdown}s remaining
              </span>
            </div>
            <p className="text-xs text-rose-100">
              Simulating alert dispatch to emergency contact: <strong>{profile.emergencyContact.name} ({profile.emergencyContact.phone})</strong> with GPS telemetry.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCancelFall}
                className="flex-1 py-2 rounded-xl bg-white text-rose-700 font-bold text-xs hover:bg-rose-50 transition-colors cursor-pointer"
              >
                I Am Okay (Cancel SOS)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TAB 1: LIVE VITALS TELEMETRY */}
      {activeTab === 'vitals' && (
        <div className="flex flex-col gap-3.5">
          {/* Connection Status Card */}
          <div
            className={`p-3.5 rounded-3xl border shadow-xs flex items-center justify-between text-xs transition-all ${
              vitals.isConnected
                ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 dark:from-emerald-950/70 dark:via-teal-950/70 dark:to-slate-900 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-xs ${
                  vitals.isConnected ? 'bg-emerald-600' : 'bg-slate-500'
                }`}
              >
                <Cpu className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {profile.sensorName}
                  </h3>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      vitals.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {vitals.isConnected
                    ? `Live Telemetry · Battery: ${vitals.sensorBattery}%`
                    : `Clip Offline · Last synced ${vitals.lastSyncTime || '3 min ago'}`}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleSensorConnection}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0 ${
                vitals.isConnected
                  ? 'bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{vitals.isConnected ? 'Disconnect' : 'Connect'}</span>
            </button>
          </div>

          {/* Daily Readiness & Recovery Gauge Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-800 text-white shadow-md flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-300" />
                Daily Readiness & Recovery
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono">{vitals.readinessScore}</span>
                <span className="text-xs text-indigo-200">/ 100 · Optimal State</span>
              </div>
              <p className="text-[11px] text-indigo-100 max-w-[210px] sm:max-w-xs leading-tight">
                HRV is {vitals.hrv} ms (elevated vagal recovery). Your body is primed for challenging workout missions today!
              </p>
            </div>

            {/* Circular score gauge */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 border-teal-300/40 border-t-teal-300 flex flex-col items-center justify-center bg-white/10 shrink-0">
              <span className="text-xs font-extrabold font-mono">{vitals.readinessScore}%</span>
              <span className="text-[8px] text-teal-200 font-medium">Ready</span>
            </div>
          </div>

          {/* Anti-Cheat Verified Badge Card */}
          <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-emerald-950 dark:text-emerald-200 text-xs block leading-tight">
                  Anti-Cheat PPG Cadence Validated
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300">
                  Cadence / Pulse match: {vitals.stepCadenceMatch}% · Device shaking rejected
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-mono font-bold text-[10px]">
              Active
            </span>
          </div>

          {/* Core Telemetry Grid: 1. Heart Rate, 2. Cuffless BP (Estimated), 3. Sleep Tracking, 4. SpO2 */}
          <div className="flex flex-col gap-3">
            {/* 1. Heart Rate */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <Heart className={`w-5 h-5 fill-rose-500 text-rose-500 ${vitals.isConnected ? 'animate-pulse' : ''}`} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Heart Rate (Pulse)</h3>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${hrStatus.bg} ${hrStatus.color}`}>
                      {hrStatus.label}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums leading-none">
                    {vitals.heartRate}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">bpm</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Resting: {vitals.restingHeartRate} bpm
                  </span>
                </div>
              </div>

              {/* Sparkline */}
              <div className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>Today's Reading Trend</span>
                <div className="flex items-end gap-1.5 h-6">
                  {vitals.heartRateHistory.map((pt, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-0.5">
                      <div
                        className="w-1.5 rounded-full bg-rose-400 dark:bg-rose-500"
                        style={{ height: `${Math.max(6, Math.min(24, (pt.bpm - 50) * 0.45))}px` }}
                      />
                    </div>
                  ))}
                </div>
                <span>Conditioning: 74 bpm</span>
              </div>
            </div>

            {/* 2. Blood Pressure (Optical Estimate - Non-diagnostic) */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Blood Pressure</h3>
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                    Estimated (Optical Pulse Wave) · Not for medical use
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {vitals.bpSys}/{vitals.bpDia}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">mmHg</span>
                </div>
                <span className="text-[10px] text-slate-400">Optimal Range: 120/80</span>
              </div>
            </div>

            {/* 3. Sleep Tracking Card (Crucial High-Value Wearable Feature) */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Sleep Duration & Stages</h3>
                    <p className="text-[10px] text-purple-700 dark:text-purple-300 font-medium">
                      Efficiency: {vitals.sleepScore}/100 · Dip HR: {vitals.sleepRestingHr} bpm
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                    {vitals.sleepHours}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">hrs</span>
                  </div>
                  <span className="text-[10px] text-slate-400">7h 24m Total</span>
                </div>
              </div>

              {/* Sleep stage horizontal breakdown bar */}
              <div className="flex flex-col gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
                  <div
                    style={{ width: `${(vitals.sleepStages.deepMins / 444) * 100}%` }}
                    className="bg-indigo-600 h-full"
                    title={`Deep Sleep: ${vitals.sleepStages.deepMins} mins`}
                  />
                  <div
                    style={{ width: `${(vitals.sleepStages.remMins / 444) * 100}%` }}
                    className="bg-purple-500 h-full"
                    title={`REM Sleep: ${vitals.sleepStages.remMins} mins`}
                  />
                  <div
                    style={{ width: `${(vitals.sleepStages.lightMins / 444) * 100}%` }}
                    className="bg-sky-400 h-full"
                    title={`Light Sleep: ${vitals.sleepStages.lightMins} mins`}
                  />
                  <div
                    style={{ width: `${(vitals.sleepStages.awakeMins / 444) * 100}%` }}
                    className="bg-amber-400 h-full"
                    title={`Awake: ${vitals.sleepStages.awakeMins} mins`}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> Deep (1h 45m)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> REM (1h 50m)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> Light (3h 15m)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Awake (34m)
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Blood Oxygen SpO2 */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Blood Oxygen (SpO2)</h3>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Optimal Oxygen Delivery
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {vitals.spo2}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">%</span>
                </div>
                <span className="text-[10px] text-slate-400">Normal Range: 95-100%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 7-DAY & 30-DAY TRENDS */}
      {activeTab === 'trends' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              Longitudinal Health Trends
            </h2>

            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
              <button
                onClick={() => setTrendsRange('7d')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  trendsRange === '7d'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTrendsRange('30d')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  trendsRange === '30d'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          {/* Trend 1: Daily Steps with 10k Goal Line */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Daily Step Accumulation
                </span>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                  Avg 10,890 <span className="text-xs font-normal text-slate-400">steps/day</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                Goal Exceeded 6/7 Days
              </span>
            </div>

            {/* Bar Chart Representation */}
            <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-100 dark:border-slate-800 relative">
              {/* 10k Target Line */}
              <div className="absolute top-10 left-0 right-0 border-b border-dashed border-emerald-500/60 flex items-center justify-end pr-1">
                <span className="text-[8px] text-emerald-600 font-mono font-bold bg-white dark:bg-slate-900 px-1">
                  10,000 Target
                </span>
              </div>

              {vitals.trends7Days.map((pt, idx) => {
                const heightPct = Math.min(100, (pt.steps / 13000) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 z-10">
                    <span className="text-[9px] font-mono text-slate-400">{Math.round(pt.steps / 1000)}k</span>
                    <div
                      className="w-full max-w-[24px] rounded-t-lg bg-gradient-to-t from-emerald-600 to-teal-400"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{pt.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trend 2: Resting Heart Rate Stability */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Resting Heart Rate Consistency
                </span>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                  Avg 62 <span className="text-xs font-normal text-slate-400">bpm</span>
                </div>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">Stable Cardiovascular Health</span>
            </div>

            <div className="h-24 flex items-end justify-between gap-2 pt-2 px-2 border-b border-slate-100 dark:border-slate-800">
              {vitals.trends7Days.map((pt, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-mono text-rose-500 font-bold">{pt.restingHr}</span>
                  <div
                    className="w-2 rounded-full bg-rose-500"
                    style={{ height: `${Math.max(12, (pt.restingHr - 50) * 4)}px` }}
                  />
                  <span className="text-[10px] text-slate-400">{pt.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Share with Physician Button */}
          <button
            onClick={onOpenDoctorSummary}
            className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Generate & Share Doctor Visit PDF Summary</span>
          </button>
        </div>
      )}

      {/* TAB 3: ELDER CARE & FAMILY VIEW */}
      {activeTab === 'family' && (
        <div className="flex flex-col gap-3.5">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-md flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                PulseBack Elder Care Network
              </span>
              <h3 className="text-sm font-bold mt-0.5">Ramesh Sharma (Father · 62y)</h3>
              <p className="text-[11px] text-indigo-200">Watch Clip: PBC-ELD-770 · Connected</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Dad's Heart Rate</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                68 <span className="text-xs font-normal text-slate-400">bpm</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Steady Normal Range</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Fall Detection Sensor</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Armed & Safe</span>
              </div>
              <span className="text-[10px] text-slate-400">Zero falls logged</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Emergency Guardian Alert</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              If an arrhythmia (HR &gt; 140 or &lt; 45 at rest) or an impact fall is detected, an automatic WhatsApp message and SMS SOS with live coordinates will be dispatched to {profile.emergencyContact.name}.
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`tel:${profile.emergencyContact.phone}`}
                className="flex-1 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Emergency Contact</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ALERTS, FALL DETECTION & EMERGENCY */}
      {activeTab === 'alerts' && (
        <div className="flex flex-col gap-3.5">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Optical Fall Detection</h4>
                  <p className="text-[10px] text-slate-400">PulseBack 3-Axis Accelerometer</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800">
                Armed
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Detects sudden high-G impacts followed by immobility. You have a 15-second grace window to cancel before family is alerted.
            </p>
            <button
              onClick={handleTriggerFallSimulation}
              className="py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Simulate Test Fall Event (Safe Demo)
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Emergency Contact Settings</h4>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">
                  {profile.emergencyContact.name} ({profile.emergencyContact.relation})
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{profile.emergencyContact.phone}</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">SMS & Call Active</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
