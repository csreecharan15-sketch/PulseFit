export type AppLanguage = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn' | 'gu';
export type DietPreference = 'all' | 'veg' | 'non-veg' | 'vegan' | 'jain';
export type RegionalCuisine = 'pan-india' | 'south' | 'north' | 'gujarati' | 'bengali' | 'maharashtrian';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
  notifyOnAlert: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  heightCm: number;
  weightKg: number;
  fitnessGoal: string;
  dailyCalorieTarget: number;
  dailyStepTarget: number;
  sensorName: string; // "PulseBack Clip"
  sensorSerial: string;
  language: AppLanguage;
  dietPreference: DietPreference;
  regionalCuisine: RegionalCuisine;
  allergies: string[]; // e.g. ['Gluten-Free', 'Nut-Free', 'Lactose-Free']
  emergencyContact: EmergencyContact;
  isElderFamilyView?: boolean;
}

export interface DailyTrendPoint {
  day: string;
  steps: number;
  restingHr: number;
  spo2: number;
  sleepHours: number;
  readiness: number;
}

export interface VitalMetrics {
  heartRate: number; // bpm
  restingHeartRate: number; // bpm
  bpSys: number; // mmHg (Estimated optical pulse wave)
  bpDia: number; // mmHg (Estimated optical pulse wave)
  temperature: number; // °C
  spo2: number; // %
  steps: number;
  stepGoal: number;
  activeMinutes: number;
  sleepHours: number;
  sleepScore: number; // 0-100
  sleepStages: {
    deepMins: number;
    remMins: number;
    lightMins: number;
    awakeMins: number;
  };
  sleepRestingHr: number; // bpm during deep sleep
  hrv: number; // ms rMSSD
  readinessScore: number; // 0-100
  stressIndex: number; // 0-100
  dailyBurnCalories: number; // active calories burned calculated from clip
  antiCheatVerified: boolean;
  stepCadenceMatch: number; // percentage match between step cadence & PPG pulse
  sensorBattery: number; // %
  isConnected: boolean; // PulseBack Clip connection status
  connectionSource?: 'direct_clip' | 'google_health';
  googleHealthConnected?: boolean;
  googleHealthLastSync?: string;
  lastSyncTime: string;
  heartRateHistory: { time: string; bpm: number }[];
  currentMode: 'Normal' | 'Active Cardio' | 'Resting Recovery';
  fallDetected: boolean;
  fallAlertActive: boolean;
  sedentaryReminderDue: boolean;
  hydrationReminderDue: boolean;
  trends7Days: DailyTrendPoint[];
  trends30Days: DailyTrendPoint[];
}

export type TaskDifficulty = 'Easy' | 'Moderate' | 'Challenging';

export interface TaskItem {
  id: string;
  title: string;
  category: 'cardio' | 'recovery' | 'mindfulness' | 'nutrition' | 'strength';
  description: string;
  targetMinutes: number;
  difficulty: TaskDifficulty;
  points: number;
  vitalTriggerReason: string;
  completed: boolean;
  completedAt?: string;
  isCustom?: boolean;
}

export interface MealItem {
  id: string;
  name: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
  vitalBenefit?: string;
}

export interface SuggestedMeal {
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  vitalBenefit: string;
}

export interface DietPlan {
  vitalsImpactAnalysis: string;
  recommendedCalorieWindow: {
    remaining: number;
    proteinGramsNeeded: number;
  };
  suggestedMeals: SuggestedMeal[];
  hydrationAdvice: string;
}

export interface RewardBadge {
  id: string;
  name: string;
  category: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  currentProgress: number;
  maxProgress: number;
  iconName: string;
}

export interface GiftCard {
  id: string;
  brand: string;
  title: string;
  category: string;
  pointsRequired: number;
  value: string; // e.g. "₹500"
  description: string;
  voucherCode?: string;
  redeemed: boolean;
  redeemedAt?: string;
  accentColor: string;
}

export interface MotivationalPost {
  id: string;
  author: string;
  authorRole: string;
  avatarBg: string;
  title: string;
  slogan: string;
  content: string;
  category: 'Daily Slogans' | 'Fitness Habits' | 'Indian Nutrition' | 'Yoga & Mind' | 'Motivational Posters';
  likesCount: number;
  isLiked: boolean;
  timeAgo: string;
  gradient: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  structuredSections?: {
    heading: string;
    items: string[];
  }[];
}

export type AppScreen =
  | 'home'
  | 'vitals'
  | 'diet'
  | 'taskmaster'
  | 'rewards'
  | 'posts'
  | 'chat'
  | 'profile'
  | 'apk';
