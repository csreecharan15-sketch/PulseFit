import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Cpu,
  Check,
  X,
} from 'lucide-react';
import { UserProfile, VitalMetrics } from '../types';

interface ProfileModalProps {
  profile: UserProfile;
  vitals: VitalMetrics;
  onSaveProfile: (updated: UserProfile) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  vitals,
  onSaveProfile,
  onClose,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // BMI Calculation
  const heightInMeters = formData.heightCm / 100;
  const bmi =
    heightInMeters > 0
      ? parseFloat((formData.weightKg / (heightInMeters * heightInMeters)).toFixed(1))
      : 22.5;

  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/60' };
    if (val <= 24.9) return { label: 'Optimal / Healthy BMI', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/60' };
    if (val <= 29.9) return { label: 'Overweight', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/60' };
    return { label: 'Obese Range', color: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-50 dark:bg-rose-950/60' };
  };

  const bmiCat = getBmiCategory(bmi);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 text-slate-800 dark:text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto text-slate-800 dark:text-slate-100 flex flex-col gap-4"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                User Health Profile
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Core Biometrics & Diagnostics
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Calculated BMI & Physiological Status Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 dark:from-emerald-950/80 dark:via-teal-950/80 dark:to-slate-950 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Calculated Body Mass Index
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {bmi}{' '}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">kg/m²</span>
            </div>
            <span className={`inline-block mt-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-md ${bmiCat.bg} ${bmiCat.color}`}>
              {bmiCat.label}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Linked Sensor</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{profile.sensorName || 'PulseBack Clip'}</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              {vitals.isConnected ? `Battery ${vitals.sensorBattery}%` : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Age
              </label>
              <input
                type="number"
                required
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Sex
              </label>
              <select
                value={formData.sex}
                onChange={(e) =>
                  setFormData({ ...formData, sex: e.target.value as any })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                required
                value={formData.heightCm}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heightCm: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                required
                value={formData.weightKg}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weightKg: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Primary Fitness & Health Goal
            </label>
            <input
              type="text"
              value={formData.fitnessGoal}
              onChange={(e) =>
                setFormData({ ...formData, fitnessGoal: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Daily Calorie Target (kcal)
              </label>
              <input
                type="number"
                value={formData.dailyCalorieTarget}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dailyCalorieTarget: parseInt(e.target.value, 10) || 2000,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Daily Steps Target
              </label>
              <input
                type="number"
                value={formData.dailyStepTarget}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dailyStepTarget: parseInt(e.target.value, 10) || 10000,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isSavedNotice ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
