import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Printer,
  Share2,
  FileText,
  ShieldCheck,
  Heart,
  Activity,
  CheckCircle2,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { VitalMetrics, UserProfile } from '../types';

interface DoctorSummaryModalProps {
  profile: UserProfile;
  vitals: VitalMetrics;
  onClose: () => void;
}

export const DoctorSummaryModal: React.FC<DoctorSummaryModalProps> = ({
  profile,
  vitals,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const reportDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleShare = () => {
    const text = `PulseBack Clip Health Report (${profile.name}, ${profile.age}y):\n• Resting HR: ${vitals.restingHeartRate} bpm\n• Est. Optical BP: ${vitals.bpSys}/${vitals.bpDia} mmHg (Wellness Estimate)\n• SpO2: ${vitals.spo2}%\n• Avg Steps: ${vitals.steps.toLocaleString()}\n• Sleep: ${vitals.sleepHours} hrs (${vitals.sleepScore}/100 efficiency)\n• CDSCO Notice: Non-diagnostic wellness estimates.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 text-slate-800 dark:text-slate-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-teal-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">
                Doctor Visit Wellness Summary
              </h2>
              <p className="text-[10px] text-teal-200">
                PulseBack Clip Optical Telemetry Log (7-Day Averages)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Printable Clinical Sheet */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 text-xs leading-relaxed">
          {/* Regulatory Compliance & Disclaimer Box (Mandatory CDSCO guidelines) */}
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-[11px] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">
                Regulatory Wellness Notice (CDSCO Compliance):
              </span>
              <span>
                All physiological readings from the PulseBack Clip are optical sensor estimates intended exclusively for personal lifestyle and fitness habit tracking. This summary is NOT intended for medical diagnosis, clinical monitoring, or prescription decisions. Cuffless blood pressure is an optical estimate and must be confirmed with an approved sphygmomanometer arm cuff.
              </span>
            </div>
          </div>

          {/* Patient / User Info Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Patient Name</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs">{profile.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Age / Sex / Frame</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {profile.age}y · {profile.sex} · {profile.weightKg}kg ({profile.heightCm}cm)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Wearable Device</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {profile.sensorName} ({profile.sensorSerial})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Report Date & Time</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{reportDate} · Today</span>
            </div>
          </div>

          {/* 7-Day Optical Vitals Matrix */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              7-Day Recorded Trend Log
            </h3>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-[11px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[10px]">
                  <tr>
                    <th className="p-2 pl-3">Day</th>
                    <th className="p-2">Steps</th>
                    <th className="p-2">Resting HR</th>
                    <th className="p-2">SpO2</th>
                    <th className="p-2">Sleep</th>
                    <th className="p-2 pr-3">Readiness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {vitals.trends7Days.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-2 pl-3 font-sans font-medium text-slate-800 dark:text-slate-200">{row.day}</td>
                      <td className="p-2 text-slate-700 dark:text-slate-300">{row.steps.toLocaleString()}</td>
                      <td className="p-2 text-rose-600 dark:text-rose-400">{row.restingHr} bpm</td>
                      <td className="p-2 text-sky-600 dark:text-sky-400">{row.spo2}%</td>
                      <td className="p-2 text-indigo-600 dark:text-indigo-400">{row.sleepHours}h</td>
                      <td className="p-2 pr-3 text-emerald-600 dark:text-emerald-400 font-bold">{row.readiness}/100</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Current Live Vitals Summary */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-medium">Resting HR & Baseline</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                {vitals.restingHeartRate} <span className="text-xs font-normal text-slate-500">bpm</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">Good endurance baseline</span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-medium">Estimated Cuffless BP</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                {vitals.bpSys}/{vitals.bpDia} <span className="text-xs font-normal text-slate-500">mmHg</span>
              </div>
              <span className="text-[10px] text-amber-600 font-medium">Optical estimate (Non-clinical)</span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-medium">Sleep Duration & Quality</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                {vitals.sleepHours} <span className="text-xs font-normal text-slate-500">hrs</span>
              </div>
              <span className="text-[10px] text-indigo-600 font-medium">Score: {vitals.sleepScore}/100</span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-medium">Blood Oxygen & HRV</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                {vitals.spo2}% · {vitals.hrv} <span className="text-xs font-normal text-slate-500">ms</span>
              </div>
              <span className="text-[10px] text-sky-600 font-medium">Normal cellular oxygenation</span>
            </div>
          </div>

          {/* Physician Notes Section */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Physician Consultation Notes:
            </span>
            <div className="h-16 border-b border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-[11px] italic">
              [Doctor clinical observations, verified cuff BP, and recommendations...]
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
              <span>Doctor's Signature: __________________</span>
              <span>Reg No: ____________</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 px-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-teal-600" />
            <span>{copied ? 'Copied Log!' : 'Copy Summary'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
