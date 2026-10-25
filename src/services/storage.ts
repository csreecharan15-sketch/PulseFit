import {
  UserProfile,
  VitalMetrics,
  TaskItem,
  MealItem,
  RewardBadge,
  GiftCard,
  DietPlan,
  MotivationalPost,
  ChatMessage,
} from '../types';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Aarav Sharma',
  age: 26,
  sex: 'Male',
  heightCm: 175,
  weightKg: 68,
  fitnessGoal: 'Cardio Stamina & Healthy Weight',
  dailyCalorieTarget: 2100,
  dailyStepTarget: 10000,
  sensorName: 'PulseBack Clip',
  sensorSerial: 'PBC-IND-2026-X1',
  language: 'en',
  dietPreference: 'veg',
  regionalCuisine: 'north',
  allergies: [],
  emergencyContact: {
    name: 'Kavita Sharma',
    relation: 'Sister',
    phone: '+91 98765 43210',
    notifyOnAlert: true,
  },
  isElderFamilyView: false,
};

export const DEFAULT_VITALS: VitalMetrics = {
  heartRate: 74,
  restingHeartRate: 62,
  bpSys: 118,
  bpDia: 76,
  temperature: 36.6,
  spo2: 98,
  steps: 11425,
  stepGoal: 10000,
  activeMinutes: 94,
  dailyBurnCalories: 480,
  sleepHours: 7.4,
  sleepScore: 88,
  sleepStages: {
    deepMins: 105,
    remMins: 110,
    lightMins: 195,
    awakeMins: 34,
  },
  sleepRestingHr: 54,
  hrv: 68,
  readinessScore: 86,
  stressIndex: 22,
  antiCheatVerified: true,
  stepCadenceMatch: 98,
  sensorBattery: 92,
  isConnected: true,
  lastSyncTime: 'Just now',
  currentMode: 'Active Cardio',
  fallDetected: false,
  fallAlertActive: false,
  sedentaryReminderDue: false,
  hydrationReminderDue: true,
  heartRateHistory: [
    { time: '08:00', bpm: 64 },
    { time: '09:00', bpm: 72 },
    { time: '10:00', bpm: 78 },
    { time: '11:00', bpm: 82 },
    { time: '12:00', bpm: 74 },
    { time: '13:00', bpm: 70 },
    { time: '14:00', bpm: 74 },
  ],
  trends7Days: [
    { day: 'Mon', steps: 9840, restingHr: 63, spo2: 98, sleepHours: 7.1, readiness: 82 },
    { day: 'Tue', steps: 10250, restingHr: 62, spo2: 98, sleepHours: 7.5, readiness: 85 },
    { day: 'Wed', steps: 11200, restingHr: 64, spo2: 97, sleepHours: 6.8, readiness: 79 },
    { day: 'Thu', steps: 10890, restingHr: 61, spo2: 99, sleepHours: 7.6, readiness: 88 },
    { day: 'Fri', steps: 10540, restingHr: 62, spo2: 98, sleepHours: 7.2, readiness: 84 },
    { day: 'Sat', steps: 12100, restingHr: 63, spo2: 98, sleepHours: 7.8, readiness: 89 },
    { day: 'Sun', steps: 11425, restingHr: 62, spo2: 98, sleepHours: 7.4, readiness: 86 },
  ],
  trends30Days: [
    { day: 'Wk 1', steps: 10120, restingHr: 64, spo2: 98, sleepHours: 7.0, readiness: 81 },
    { day: 'Wk 2', steps: 10650, restingHr: 63, spo2: 98, sleepHours: 7.3, readiness: 84 },
    { day: 'Wk 3', steps: 10980, restingHr: 62, spo2: 98, sleepHours: 7.4, readiness: 86 },
    { day: 'Wk 4', steps: 11240, restingHr: 62, spo2: 99, sleepHours: 7.5, readiness: 87 },
  ],
};

export const DEFAULT_TASKS: TaskItem[] = [
  // Easy Tier
  {
    id: 't-easy-1',
    title: 'Morning Brisk Walk in Sunlight',
    category: 'cardio',
    description: 'Walk for 15 minutes at a steady pace to wake up your body and get fresh air.',
    targetMinutes: 15,
    difficulty: 'Easy',
    points: 85,
    vitalTriggerReason: 'Steps are currently 5,240. 15 mins adds ~1,500 steps towards your 10k goal.',
    completed: true,
    completedAt: '08:30 AM',
  },
  {
    id: 't-easy-2',
    title: 'Surya Namaskar & Deep Breathing',
    category: 'mindfulness',
    description: 'Practice 5 slow rounds of Sun Salutation followed by 3 minutes of Anulom Vilom breathwork.',
    targetMinutes: 10,
    difficulty: 'Easy',
    points: 95,
    vitalTriggerReason: 'Heart rate is normal (72 bpm). Gentle yoga keeps your blood pressure steady.',
    completed: false,
  },
  {
    id: 't-easy-3',
    title: 'Warm Water & Lemon Hydration',
    category: 'nutrition',
    description: 'Drink a glass of warm water with lemon or jeera to help digestion and stay fresh.',
    targetMinutes: 2,
    difficulty: 'Easy',
    points: 75,
    vitalTriggerReason: 'Good hydration keeps your blood oxygen (SpO2: 98%) high all day.',
    completed: false,
  },
  // Moderate Tier
  {
    id: 't-mod-1',
    title: '25-Minute Jog & Brisk Stride',
    category: 'cardio',
    description: 'Alternate between 2 minutes of gentle jogging and 1 minute of fast walking.',
    targetMinutes: 25,
    difficulty: 'Moderate',
    points: 175,
    vitalTriggerReason: 'Improves heart stamina and burns ~160 calories.',
    completed: false,
  },
  {
    id: 't-mod-2',
    title: 'Bodyweight Desi Workout (Squats & Planks)',
    category: 'strength',
    description: '3 rounds: 15 squats, 12 push-ups (or knee push-ups), and 30-second plank.',
    targetMinutes: 15,
    difficulty: 'Moderate',
    points: 185,
    vitalTriggerReason: 'Strengthens leg and core muscles for daily posture.',
    completed: false,
  },
  {
    id: 't-mod-3',
    title: 'Post-Dinner Walk (Shatapavali)',
    category: 'recovery',
    description: '10-minute 100-step walk after dinner for smooth digestion and light sleep.',
    targetMinutes: 10,
    difficulty: 'Moderate',
    points: 150,
    vitalTriggerReason: 'Prevents blood sugar spike after evening roti or rice.',
    completed: false,
  },
  // Challenging Tier
  {
    id: 't-adv-1',
    title: 'High Intensity Cardio Intervals',
    category: 'cardio',
    description: '6 rounds of 45-second high knees or jumping jacks with 45-second rest.',
    targetMinutes: 20,
    difficulty: 'Challenging',
    points: 270,
    vitalTriggerReason: 'Takes heart rate into conditioning zone based on your strong streak.',
    completed: false,
  },
  {
    id: 't-adv-2',
    title: 'Full Body Desi Dands & Baithaks',
    category: 'strength',
    description: '4 rounds: 20 deep squats (Baithak), 15 Hindu push-ups (Dand), 20 lunges.',
    targetMinutes: 20,
    difficulty: 'Challenging',
    points: 290,
    vitalTriggerReason: 'Builds functional athletic power and burns excess body fat.',
    completed: false,
  },
  {
    id: 't-adv-3',
    title: 'Pranayama & Full Muscle Stretch',
    category: 'recovery',
    description: '10 minutes of Kapalbhati, Bhastrika, and full hamstring stretches.',
    targetMinutes: 10,
    difficulty: 'Challenging',
    points: 250,
    vitalTriggerReason: 'Helps heart rate quickly return to normal resting baseline.',
    completed: false,
  },
];

export const DEFAULT_MEALS: MealItem[] = [
  {
    id: 'm1',
    name: 'Ragi Dosa with Coconut & Mint Chutney',
    mealType: 'Breakfast',
    calories: 360,
    protein: 12,
    carbs: 52,
    fats: 11,
    time: '08:45 AM',
    vitalBenefit: 'High calcium and dietary fiber give sustained energy without sudden sugar spikes.',
  },
  {
    id: 'm2',
    name: 'Sprouted Moong & Kala Chana Chaat',
    mealType: 'Snack',
    calories: 210,
    protein: 16,
    carbs: 28,
    fats: 3,
    time: '11:30 AM',
    vitalBenefit: 'Light vegetable protein that helps muscles recover after morning steps.',
  },
];

export const DEFAULT_DIET_PLAN: DietPlan = {
  vitalsImpactAnalysis: 'PulseBack Clip reads 74 bpm with 11,425 steps logged (114% of 10k goal). Active burn is +480 kcal from 94 active minutes. Focus on high-fiber lentils, seasonal greens, and probiotic curd for muscle recovery.',
  recommendedCalorieWindow: {
    remaining: 1530,
    proteinGramsNeeded: 65,
  },
  suggestedMeals: [
    {
      mealType: 'Lunch',
      name: 'Paneer Bhurji with 2 Multigrain Rotis & Curd',
      description: 'Fresh cow-milk paneer tossed with onions, tomatoes, coriander, served with warm jowar/wheat rotis and fresh probiotic curd.',
      calories: 520,
      protein: 34,
      carbs: 46,
      fats: 18,
      vitalBenefit: 'High quality vegetarian protein and gut-friendly probiotics support clean digestion.',
    },
    {
      mealType: 'Dinner',
      name: 'Yellow Moong Dal Khichdi with Steamed Palak',
      description: 'Comforting moong dal and rice khichdi with a dash of pure desi ghee, cumin tadka, and spinach.',
      calories: 440,
      protein: 22,
      carbs: 62,
      fats: 10,
      vitalBenefit: 'Easy to digest before sleep, helps maintain stable nighttime heart rate.',
    },
    {
      mealType: 'Snack',
      name: 'Roasted Makhana (Foxnuts) with Turmeric Tea',
      description: 'Crunchy roasted foxnuts seasoned with rock salt and a warm cup of haldi-ginger milk.',
      calories: 160,
      protein: 8,
      carbs: 22,
      fats: 4,
      vitalBenefit: 'Anti-inflammatory curcumin helps muscle relaxation and sound sleep.',
    },
  ],
  hydrationAdvice: 'Drink 2 to 2.5 litres of water today. Try drinking warm water after meals for better gut health.',
};

export const DEFAULT_BADGES: RewardBadge[] = [
  {
    id: 'b1',
    name: '7-Day Unbroken Streak',
    category: 'Daily Streak',
    description: 'Kept PulseBack Clip connected and completed daily tasks for 7 consecutive days.',
    unlocked: true,
    unlockedAt: 'Today',
    currentProgress: 7,
    maxProgress: 7,
    iconName: 'Flame',
  },
  {
    id: 'b2',
    name: 'Desi Fitness Hero',
    category: 'Activity',
    description: 'Complete 10,000 steps on 5 days in a week.',
    unlocked: true,
    unlockedAt: 'Yesterday',
    currentProgress: 5,
    maxProgress: 5,
    iconName: 'Footprints',
  },
  {
    id: 'b3',
    name: 'Ghar Ka Khana Master',
    category: 'Diet',
    description: 'Log clean homemade Indian meals for 5 full days.',
    unlocked: false,
    currentProgress: 3,
    maxProgress: 5,
    iconName: 'Utensils',
  },
  {
    id: 'b4',
    name: 'Task-Master Champion',
    category: 'Discipline',
    description: 'Finish 20 personalized missions prescribed by Task-Master.',
    unlocked: false,
    currentProgress: 14,
    maxProgress: 20,
    iconName: 'Zap',
  },
];

export const DEFAULT_GIFT_CARDS: GiftCard[] = [
  // Early Low-Tier Milestone Rewards (Week 1 Wins!)
  {
    id: 'gc-coconut',
    brand: 'Nariyal Pani / Fresh Mart',
    title: '₹50 Tender Coconut / Fresh Fruit Vendor Token',
    category: 'Daily Hydration',
    pointsRequired: 250,
    value: '₹50',
    description: 'Instant redemption for fresh tender coconut or seasonal amla/papaya juice. Reachable in your first 2 days!',
    voucherCode: 'COCONUT-NARIYAL-50',
    redeemed: false,
    accentColor: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'gc-zepto-100',
    brand: 'Zepto / Blinkit Fresh',
    title: '₹100 Fresh Indian Vegetables & Herbs Coupon',
    category: 'Clean Grocery',
    pointsRequired: 500,
    value: '₹100',
    description: 'Valid on farm-fresh palak, methi, tomatoes, cucumber, and ginger. Your Week 1 milestone victory!',
    voucherCode: 'ZEPTO-FIT-100',
    redeemed: false,
    accentColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 'gc-cult-live',
    brand: 'Cult.fit Live',
    title: '₹200 1-Month Cult.fit Live Home Workout Pass',
    category: 'Gym & Yoga Pass',
    pointsRequired: 800,
    value: '₹200',
    description: 'Access 200+ guided morning yoga, desi calisthenics, and cardio live sessions on mobile.',
    voucherCode: 'CULT-LIVE-MONTH-PASS',
    redeemed: false,
    accentColor: 'from-indigo-600 to-purple-700',
  },
  {
    id: 'gc-fastup-150',
    brand: 'Fast&Up India',
    title: '₹150 Electrolyte & Hydration Discount Voucher',
    category: 'Hydration & Health',
    pointsRequired: 1200,
    value: '₹150',
    description: 'Redeemable on effervescent electrolyte tablets, plant protein, and multivitamins.',
    voucherCode: 'FASTUP-SAVE-150',
    redeemed: false,
    accentColor: 'from-teal-600 to-cyan-700',
  },
  // Mid & High-Tier Milestone Rewards
  {
    id: 'gc-swiggy',
    brand: 'Swiggy Instamart / Zepto',
    title: '₹250 Fresh Fruits & Dry Fruits Coupon',
    category: 'Clean Grocery',
    pointsRequired: 1800,
    value: '₹250',
    description: 'Valid on almonds, walnuts, chia seeds, and organic vegetables.',
    voucherCode: 'HEALTH-MART-250',
    redeemed: false,
    accentColor: 'from-amber-600 to-rose-700',
  },
  {
    id: 'gc-fastup',
    brand: 'Fast&Up India',
    title: '₹300 Electrolyte & Nutrition Voucher',
    category: 'Hydration & Health',
    pointsRequired: 2400,
    value: '₹300',
    description: 'Great for Reload effervescent hydration tablets, plant protein, and multivitamins.',
    voucherCode: 'FASTUP-IND-300',
    redeemed: false,
    accentColor: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'gc-boat',
    brand: 'boAt / Noise Lifestyle',
    title: '₹400 Smart Fitness Accessories Voucher',
    category: 'Wearables',
    pointsRequired: 3200,
    value: '₹400',
    description: 'Redeemable on sports earphones and fitness accessories.',
    voucherCode: 'BOAT-PULSE-400',
    redeemed: false,
    accentColor: 'from-slate-800 to-zinc-900',
  },
  {
    id: 'gc-decathlon',
    brand: 'Decathlon India',
    title: '₹400 Sports & Fitness Gear Card',
    category: 'Sports & Shoes',
    pointsRequired: 3500,
    value: '₹400',
    description: 'Use at any Decathlon store or online for running shoes, workout mats, and activewear.',
    voucherCode: 'DECA-FIT-400-IN',
    redeemed: false,
    accentColor: 'from-blue-600 to-sky-700',
  },
  {
    id: 'gc-cult',
    brand: 'Cult.fit',
    title: '₹500 Cultpass ELITE / Live Voucher',
    category: 'Gym & Yoga Pass',
    pointsRequired: 4500,
    value: '₹500',
    description: 'Valid for gym workouts, yoga, boxing, and group dance fitness classes across India.',
    voucherCode: 'CULT-PULSE-500',
    redeemed: false,
    accentColor: 'from-orange-600 to-amber-700',
  },
];

export const DEFAULT_POSTS: MotivationalPost[] = [
  // AUTHENTIC INDIAN ATHLETIC & WARRIOR DISCIPLINE POSTERS (Original & Licensed)
  {
    id: 'poster-neeraj',
    author: 'Subedar Neeraj Chopra',
    authorRole: 'World & Olympic Javelin Champion',
    avatarBg: 'bg-amber-600',
    title: 'The Unshakable Morning Discipline',
    slogan: 'Medals are forged in the quiet morning discipline, long before the stadium roars.',
    content: 'Throw every doubt out of your mind. When you lace up before dawn and repeat the fundamentals a thousand times with sweat and precision, destiny has no choice but to reward your consistency.',
    category: 'Motivational Posters',
    likesCount: 1420,
    isLiked: true,
    timeAgo: 'Just now',
    gradient: 'from-amber-950 via-slate-900 to-orange-950',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=900&auto=format&fit=crop',
    imageAlt: 'Subedar Neeraj Chopra: Morning discipline builds champions',
  },
  {
    id: 'poster-marykom',
    author: 'MC Mary Kom',
    authorRole: '6-Time World Boxing Champion & Olympic Medallist',
    avatarBg: 'bg-rose-600',
    title: 'Rise and Fight For Your Dreams',
    slogan: 'Do not let anyone tell you that your background limits your potential.',
    content: 'When your body aches and fatigue screams at you to drop your hands, your spirit must take the lead. You are the architect of your own stamina. Keep throwing combinations until obstacles fall.',
    category: 'Motivational Posters',
    likesCount: 1280,
    isLiked: true,
    timeAgo: '1 hr ago',
    gradient: 'from-rose-950 via-neutral-900 to-red-950',
    imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=900&auto=format&fit=crop',
    imageAlt: 'Mary Kom: Rise and fight for your dreams',
  },
  {
    id: 'poster-pushups',
    author: 'Coach Vikram (Desi Calisthenics)',
    authorRole: 'Strength & Form Specialist',
    avatarBg: 'bg-emerald-600',
    title: 'Complete Push-Up Anatomy Guide',
    slogan: 'Different push-ups, different focus, stronger you.',
    content: 'Master your bodyweight with correct form: Standard for overall chest, Wide grip for outer pecs, Close & Diamond grip for triceps, Incline for lower chest, and Decline for upper shoulders.',
    category: 'Motivational Posters',
    likesCount: 745,
    isLiked: true,
    timeAgo: '2 hrs ago',
    gradient: 'from-zinc-900 via-slate-850 to-slate-950',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=900&auto=format&fit=crop',
    imageAlt: 'Push-up variations guide with muscle targeting diagrams',
  },
  {
    id: 'poster-pehlwan',
    author: 'Ustad Shamsher Singh',
    authorRole: 'Desi Akhada Pehlwan & Wrestling Master',
    avatarBg: 'bg-orange-700',
    title: 'Earth Beneath Your Feet, Fire in Your Lungs',
    slogan: 'Dands, Baithaks, and pure Mitti (earth) build an unbreakable human frame.',
    content: 'The Akhada does not lie. When you practice 50 Hindu pushups (Dands) and 100 deep Hindu squats (Baithaks), you lubricate every tendon and teach your pulse to remain serene under intense load.',
    category: 'Motivational Posters',
    likesCount: 965,
    isLiked: false,
    timeAgo: '3 hrs ago',
    gradient: 'from-amber-950 via-stone-900 to-yellow-950',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=900&auto=format&fit=crop',
    imageAlt: 'Desi Akhada Pehlwan training: Earth beneath your feet',
  },
  {
    id: 'poster-soman',
    author: 'Milind Soman',
    authorRole: 'Ultramarathon Legend & Barefoot Runner',
    avatarBg: 'bg-cyan-700',
    title: 'Age is a Number; Movement is Life',
    slogan: 'You do not stop moving because you grow old; you grow old because you stop moving.',
    content: 'Take off the unnecessary mental friction. Breathe through your nose, keep your cadence light, and let your daily steps accumulate without pressure. The human body is engineered for daily endurance.',
    category: 'Motivational Posters',
    likesCount: 890,
    isLiked: false,
    timeAgo: '4 hrs ago',
    gradient: 'from-cyan-950 via-slate-950 to-blue-950',
    imageUrl: 'https://images.unsplash.com/photo-1483721074573-586540da5703?q=80&w=900&auto=format&fit=crop',
    imageAlt: 'Milind Soman: Movement is Life marathon endurance',
  },
  {
    id: 'poster-chhetri',
    author: 'Captain Sunil Chhetri',
    authorRole: 'Indian Football Legend & Record Goalscorer',
    avatarBg: 'bg-blue-600',
    title: 'Consistency Beats Talent Every Single Day',
    slogan: 'Eat clean, sleep 8 hours, show up on the pitch, repeat. No magic, just discipline.',
    content: 'People ask about secret diets and special routines. There is none. Home-cooked meals, 10,000 steps, high recovery sleep, and relentless daily showing up. That is how champions outlast everyone.',
    category: 'Motivational Posters',
    likesCount: 1540,
    isLiked: true,
    timeAgo: '5 hrs ago',
    gradient: 'from-blue-950 via-slate-950 to-indigo-950',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=900&auto=format&fit=crop',
    imageAlt: 'Sunil Chhetri: Discipline and consistency beat talent',
  },
  {
    id: 'poster-iyengar',
    author: 'Yogacharya B.K.S. Iyengar',
    authorRole: 'Master of Yoga, Breath & Alignment',
    avatarBg: 'bg-indigo-700',
    title: 'Light on Life & Master of the Breath',
    slogan: 'Yoga teaches us to cure what need not be endured and endure what cannot be cured.',
    content: 'When you synchronize your breath with each spinal alignment, your heart rate drops into restorative peace. Breath is the vehicle of consciousness on earth; treat it with reverence.',
    category: 'Motivational Posters',
    likesCount: 1120,
    isLiked: false,
    timeAgo: '7 hrs ago',
    gradient: 'from-indigo-950 via-purple-950 to-slate-950',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=900&auto=format&fit=crop',
    imageAlt: 'BKS Iyengar: Light on Life and breath alignment',
  },

  // DAILY SLOGANS
  {
    id: 'p1',
    author: 'Coach Rajesh Verma',
    authorRole: 'Certified Indian Athletics Coach',
    avatarBg: 'bg-emerald-600',
    title: 'Swasth Raho, Mast Raho',
    slogan: 'Consistency is greater than intensity. 20 minutes every day beats 2 hours once a week.',
    content: 'Do not wait for motivation to strike. Put on your shoes, step out in the morning breeze, and complete your first 2,000 steps. Small daily wins create a healthy body for life.',
    category: 'Daily Slogans',
    likesCount: 142,
    isLiked: false,
    timeAgo: '6 hrs ago',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
  },
  {
    id: 'p-slogan-2',
    author: 'Captain Abhimanyu',
    authorRole: 'Military Physical Training Instructor',
    avatarBg: 'bg-amber-700',
    title: 'Conquer The First 5 Minutes',
    slogan: 'The heaviest weight in any room is the front door. Step through it and win.',
    content: 'Your mind will offer ten reasons to stay in bed. Do not negotiate. Lace up your shoes without thinking. Once your feet hit the pavement, momentum takes over.',
    category: 'Daily Slogans',
    likesCount: 320,
    isLiked: true,
    timeAgo: '7 hrs ago',
    gradient: 'from-amber-600 via-orange-600 to-slate-800',
  },
  {
    id: 'p-slogan-3',
    author: 'Devika Sharma',
    authorRole: 'Marathoner & Wellness Speaker',
    avatarBg: 'bg-indigo-600',
    title: '2 Percent of Your Day',
    slogan: 'A 30-minute workout is only 2% of your entire day. No excuses.',
    content: 'You have time to scroll; you have time to move. Invest 30 minutes in your heart, your posture, and your mental clarity today.',
    category: 'Daily Slogans',
    likesCount: 412,
    isLiked: false,
    timeAgo: '9 hrs ago',
    gradient: 'from-indigo-600 via-purple-600 to-slate-900',
  },
  {
    id: 'p-slogan-4',
    author: 'Coach Kunal',
    authorRole: 'Desi Strength Mentor',
    avatarBg: 'bg-rose-600',
    title: 'The Weight of Regret',
    slogan: 'Discipline weighs ounces. Regret weighs tons.',
    content: 'The temporary burn of a tough mission disappears by evening. But the quiet pride of staying true to your commitment lasts forever.',
    category: 'Daily Slogans',
    likesCount: 295,
    isLiked: false,
    timeAgo: '11 hrs ago',
    gradient: 'from-rose-600 via-red-600 to-amber-700',
  },

  // FITNESS HABITS
  {
    id: 'p4',
    author: 'Sneha Patel',
    authorRole: 'Community Fitness Leader',
    avatarBg: 'bg-rose-600',
    title: 'Step by Step to 10k',
    slogan: 'Your body is your only permanent home. Treat it with care and respect.',
    content: 'Take the stairs instead of the lift. Walk while talking on the phone. Walk after your lunch for 10 minutes. By night, you will easily hit your 10,000 steps target without feeling exhausted!',
    category: 'Fitness Habits',
    likesCount: 312,
    isLiked: false,
    timeAgo: 'Yesterday',
    gradient: 'from-rose-600 via-red-600 to-amber-700',
  },
  {
    id: 'p-habit-2',
    author: 'Dr. Vikram Sen',
    authorRole: 'Sports Medicine Researcher',
    avatarBg: 'bg-teal-600',
    title: 'The Unbreakable Two-Day Rule',
    slogan: 'Never skip your workout two days in a row.',
    content: 'Life happens and one missed workout is completely fine. But never miss two consecutive days. The two-day rule stops a slip from turning into a habit.',
    category: 'Fitness Habits',
    likesCount: 468,
    isLiked: true,
    timeAgo: 'Yesterday',
    gradient: 'from-teal-600 via-emerald-600 to-cyan-800',
  },
  {
    id: 'p-habit-3',
    author: 'Meera Rao',
    authorRole: 'Hydration & Lifestyle Coach',
    avatarBg: 'bg-sky-600',
    title: 'Morning Water Architecture',
    slogan: 'Drink 500ml water first thing: wake up your organs and metabolism.',
    content: 'After 8 hours without water, your blood is thick and your resting heart rate works harder. A glass of lukewarm water restores cellular volume and immediately spikes daytime energy.',
    category: 'Fitness Habits',
    likesCount: 247,
    isLiked: false,
    timeAgo: '2 days ago',
    gradient: 'from-sky-600 via-blue-600 to-indigo-800',
  },
  {
    id: 'p-habit-4',
    author: 'Aniket Joshi',
    authorRole: 'Rest & Recovery Specialist',
    avatarBg: 'bg-purple-600',
    title: 'Sleep Builds Champions',
    slogan: 'You do not grow in the gym; you grow in deep sleep.',
    content: 'Keep your room dark and cool. When your PulseBack Clip records resting heart rates in the 50s-60s during deep slow-wave sleep, muscle micro-tears knit back stronger.',
    category: 'Fitness Habits',
    likesCount: 384,
    isLiked: false,
    timeAgo: '2 days ago',
    gradient: 'from-purple-600 via-indigo-700 to-slate-900',
  },

  // INDIAN NUTRITION
  {
    id: 'p2',
    author: 'Dr. Ananya Joshi',
    authorRole: 'Clinical Nutritionist (Mumbai)',
    avatarBg: 'bg-amber-600',
    title: 'Traditional Indian Wisdom',
    slogan: 'Eat simple homemade food: Dal, Roti, Sabzi, and Dahi. Your stomach will thank you.',
    content: 'You do not need expensive imported berries to stay fit. Our Indian kitchens are packed with superfoods: Moong dal, Amla, Curd, roasted Chana, and seasonal fruits. Keep dinner light and eat before 8:30 PM.',
    category: 'Indian Nutrition',
    likesCount: 285,
    isLiked: true,
    timeAgo: '8 hrs ago',
    gradient: 'from-amber-600 via-orange-600 to-rose-700',
  },
  {
    id: 'p-nutri-2',
    author: 'Vaidya Harish',
    authorRole: 'Ayurvedic Sports Nutritionist',
    avatarBg: 'bg-yellow-700',
    title: 'Desi Akhada Superfoods',
    slogan: 'Sattu, roasted chana, and curd built warrior physiques for centuries.',
    content: 'Sattu (roasted gram flour) contains 20g of plant protein per 100g, cools the stomach, and provides sustained low-glycemic stamina. Mix 2 spoons with chilled water, lemon, and roasted cumin for a natural post-workout nectar.',
    category: 'Indian Nutrition',
    likesCount: 520,
    isLiked: true,
    timeAgo: '10 hrs ago',
    gradient: 'from-yellow-600 via-amber-600 to-stone-800',
  },
  {
    id: 'p-nutri-3',
    author: 'Pooja Singhania',
    authorRole: 'Registered Dietitian (Delhi)',
    avatarBg: 'bg-emerald-600',
    title: 'The 50-25-25 Indian Thali Rule',
    slogan: 'Balance your plate: 50% fiber, 25% protein, 25% smart carbs.',
    content: 'Fill half your thali with seasonal subzi or raw cucumber-kakdi salad. One quarter with protein (paneer bhurji, moong dal, or sprouts). The remaining quarter with 2 whole wheat rotis. Balanced blood sugar is guaranteed!',
    category: 'Indian Nutrition',
    likesCount: 376,
    isLiked: false,
    timeAgo: 'Yesterday',
    gradient: 'from-emerald-600 via-green-600 to-teal-800',
  },
  {
    id: 'p-nutri-4',
    author: 'Dr. Arvind Swamy',
    authorRole: 'Herbal Medicine Researcher',
    avatarBg: 'bg-amber-800',
    title: 'Golden Milk & Muscle Recovery',
    slogan: 'Haldi doodh is not folklore; it is nature’s strongest anti-inflammatory.',
    content: 'Boiling pure turmeric with warm milk and a pinch of black pepper boosts curcumin absorption by 2000%. Sip a warm cup 30 minutes before bed to ease joint stiffness after high-intensity missions.',
    category: 'Indian Nutrition',
    likesCount: 440,
    isLiked: false,
    timeAgo: '2 days ago',
    gradient: 'from-amber-700 via-orange-700 to-rose-900',
  },

  // YOGA & MIND
  {
    id: 'p3',
    author: 'Yogi Devendra',
    authorRole: 'Hatha Yoga Teacher (Rishikesh)',
    avatarBg: 'bg-indigo-600',
    title: 'Morning Breath of Life',
    slogan: 'Calm breath, calm mind, steady heart rate.',
    content: 'Whenever your PulseBack Clip shows elevated stress, stop for 3 minutes. Take 10 deep belly breaths (Pranayama). It lowers blood pressure and sharpens your focus for the whole day.',
    category: 'Yoga & Mind',
    likesCount: 198,
    isLiked: false,
    timeAgo: '10 hrs ago',
    gradient: 'from-indigo-600 via-purple-600 to-pink-700',
  },
  {
    id: 'p-yoga-2',
    author: 'Yogini Tara',
    authorRole: 'Ashtanga Yoga Master',
    avatarBg: 'bg-violet-600',
    title: 'Surya Namaskar: The Warrior Salutation',
    slogan: '12 sacred postures synchronizing spine, breath, and inner fire.',
    content: '5 rounds of Sun Salutation at sunrise awaken the sympathetic nervous system naturally, open tight hip flexors from sitting, and lubricate every spinal vertebra.',
    category: 'Yoga & Mind',
    likesCount: 390,
    isLiked: true,
    timeAgo: 'Yesterday',
    gradient: 'from-violet-600 via-purple-600 to-indigo-800',
  },
  {
    id: 'p-yoga-3',
    author: 'Dr. Manoj Kulkarni',
    authorRole: 'Neuro-Physiologist & Meditator',
    avatarBg: 'bg-teal-700',
    title: 'Pranayama as Instant Biofeedback',
    slogan: 'Control your breath, control your pulse, control your focus.',
    content: 'By prolonging your exhalation to twice the length of your inhalation (4 seconds in, 8 seconds out), you stimulate the vagus nerve. Within 120 seconds, your PulseBack Clip records a 15-20 bpm drop in elevated heart rate.',
    category: 'Yoga & Mind',
    likesCount: 462,
    isLiked: false,
    timeAgo: 'Yesterday',
    gradient: 'from-teal-600 via-cyan-700 to-slate-900',
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: "Namaste! I'm Coach Pulse, your dedicated personal fitness & nutrition coach. Whether you're looking for delicious low-calorie Indian meals, a 15-minute home workout, or guidance on your PulseBack Clip vitals, I'm right here with you on your health journey. What can we work on together today?",
    timestamp: 'Just now',
    structuredSections: [
      {
        heading: 'Popular Quick Coaching Questions',
        items: [
          'Any breakfast tips for low calorie?',
          'Give me a 15-minute home workout without equipment',
          'What are high-protein vegetarian Indian foods?',
          'Healthy ways to drink morning chai without sugar spikes',
          'How to lose belly fat safely with ghar ka khana',
        ],
      },
    ],
  },
];

// Pre-cached instant responses for common fitness queries to ensure 0ms latency
export const PRECACHED_CHAT_RESPONSES: Record<string, { content: string; structuredSections: { heading: string; items: string[] }[] }> = {
  'any breakfast tips for low calorie': {
    content: "Coach Pulse here! I love that you're focusing on a low-calorie breakfast—the first meal sets your metabolic rhythm, keeps insulin smooth, and stops late-morning cravings before they start. Here are 5 delicious, home-cooked Indian breakfast ideas kept strictly between 160 and 220 calories, packed with vegetarian protein and soluble fiber to fuel your journey:",
    structuredSections: [
      {
        heading: 'Top Low-Calorie Indian Breakfast Picks (Under 220 kcal)',
        items: [
          'Vegetable Moong Dal Chilla (~180 kcal · 11g protein): Soak yellow moong dal, grind with ginger and green chilies, and fold in grated carrot and spinach. Cook crisp with 1/2 tsp ghee on a non-stick tawa. Serve with fresh mint-coriander chutney.',
          'Egg White Bhurji with 1 Phulka (~210 kcal · 16g protein): Scramble 3 egg whites with diced onions, tomatoes, and fresh coriander. Pair with 1 small whole-wheat phulka (no oil). Pure lean protein with zero saturated fat.',
          'Sprouted Moong & Pomegranate Chaat (~160 kcal · 10g protein): Lightly steamed green sprouts tossed with cucumber, tomatoes, lemon juice, roasted cumin (jeera), and a spoon of pomegranate seeds. Zero oil, high gut fiber!',
          'Vegetable Poha with Green Peas (~220 kcal · 6g protein): Steamed flattened rice tempered with mustard seeds, curry leaves, onions, turmeric, and sweet green peas. Drizzle fresh lemon juice and skip peanuts to keep calories minimal.',
          'Oats & Besan Vegetable Cheela (~190 kcal · 8g protein): Whisk rolled oat flour and besan with grated bottle gourd (lauki) and carom seeds (ajwain). Light on digestion, prevents all morning bloating.',
        ],
      },
      {
        heading: "Coach's Health Journey Wisdom",
        items: [
          'Pre-Breakfast Water: Drink 400ml of lukewarm water with lemon 15 minutes before eating to activate gastric enzymes.',
          'The Protein Rule: Always ensure 8-12g of protein in your breakfast—it keeps the hunger hormone (ghrelin) suppressed until lunch.',
          'Telemetry Synergy: Clean, low-glycemic breakfasts prevent the rapid heart rate and blood sugar spikes common after fried parathas or sugary chai.',
        ],
      },
    ],
  },
  'low calorie breakfast tips': {
    content: "Coach Pulse here! Low-calorie breakfast is all about volume, fiber, and lean protein so you stay energized for hours without heavy digestion:",
    structuredSections: [
      {
        heading: 'Low-Calorie Indian Breakfast Options (160-220 kcal)',
        items: [
          'Vegetable Moong Dal Chilla (~180 kcal · 11g protein) with mint chutney.',
          'Egg White Bhurji + 1 whole wheat phulka (~210 kcal · 16g protein).',
          'Sprouted Moong & Kala Chana Chaat (~160 kcal · 10g protein) with lemon & jeera.',
          'Vegetable Poha with Green Peas (~220 kcal · 6g protein) cooked with minimal oil.',
          'Besan & Grated Lauki Chilla (~175 kcal · 8g protein) with fresh curd.',
        ],
      },
      {
        heading: 'Coach Guidance',
        items: [
          'Pair with a cup of adrak-elaichi chai brewed with 1 part milk to 2 parts water without white sugar.',
        ],
      },
    ],
  },
  '15 min home workout without weights': {
    content: 'Coach Pulse here! Here is a high-energy 15-minute home calisthenics routine requiring zero equipment. It builds functional strength, burns calories, and gets your heart into a healthy conditioning zone.',
    structuredSections: [
      {
        heading: '3 Rounds Circuit (45s work, 15s rest)',
        items: [
          'Bodyweight Squats (Baithak) – 15 reps for leg strength and mobility.',
          'Standard or Knee Push-Ups – 12 reps for chest, arms, and core stability.',
          'Glute Bridges – 15 reps to counter prolonged desk sitting.',
          'Plank Hold – 30 to 45 seconds keeping your core and glutes engaged.',
        ],
      },
      {
        heading: 'PulseBack Safety Tip',
        items: [
          'Monitor your pulse on your PulseBack Clip. Keep it between 110-145 bpm during intervals and sip water between rounds.',
        ],
      },
    ],
  },
  'high protein vegetarian indian foods': {
    content: 'Traditional Indian vegetarian foods offer fantastic protein options for muscle recovery and fat loss when combined thoughtfully.',
    structuredSections: [
      {
        heading: 'Top High-Protein Desi Sources',
        items: [
          'Paneer / Low-Fat Chenna – ~18g protein per 100g. Have it grilled or in bhurji.',
          'Sprouted Moong & Kala Chana – ~15-20g protein per cooked cup with high fiber.',
          'Fresh Curd / Greek Yogurt (Dahi) – ~10-14g protein per cup with natural probiotics.',
          'Soy Chunks (Nutrela) – ~52g protein per 100g dry. Extremely budget-friendly.',
          'Dal + Rice/Roti combination – Completes all 9 essential amino acids.',
        ],
      },
      {
        heading: 'Digestive Advice',
        items: [
          'Add a pinch of hing (asafoetida) and jeera to your dals to prevent bloating.',
        ],
      },
    ],
  },
  'lose belly fat safely with indian diet': {
    content: 'Belly fat reduction happens through a consistent moderate calorie deficit, high daily steps, and smart meal timings rather than starving yourself.',
    structuredSections: [
      {
        heading: 'Core Rules for Sustainable Fat Loss',
        items: [
          'Finish your dinner by 8:00 PM – this gives your gut 12 hours of natural fasting overnight.',
          'Replace refined white bread and fried namkeens with roasted makhana, chana, or sprouts.',
          'Fill half your plate with vegetables (sabzi/salad), 1/4th with protein (dal/paneer/curd), and 1/4th with roti/rice.',
          'Aim for 8,000 to 10,000 steps daily – walking burns visceral belly fat safely.',
        ],
      },
      {
        heading: 'Morning Routine',
        items: [
          'Drink warm water with cinnamon or lemon upon waking up to jumpstart metabolism.',
        ],
      },
    ],
  },
  'healthy ways to drink morning chai': {
    content: 'You do not need to give up your beloved morning chai! A few simple adjustments make it healthier and gentler on your stomach.',
    structuredSections: [
      {
        heading: 'Smart Chai Hacks',
        items: [
          'Never drink chai on an empty stomach – have 4-5 soaked almonds or walnuts first.',
          'Cut white sugar down to 1/2 spoon or swap with small jaggery (gud) added after boiling.',
          'Use 1/3 milk and 2/3 water to keep it light and easy to digest.',
          'Infuse fresh crushed ginger (adrak), cardamom (elaichi), and holy basil (tulsi) for immunity.',
        ],
      },
    ],
  },
  'joint friendly workout for knee or back stiffness': {
    content: 'Low-impact movement lubricates stiff joints, strengthens supporting muscles, and releases tension without painful pounding.',
    structuredSections: [
      {
        heading: 'Gentle Joint Relieving Routine',
        items: [
          '15-minute flat brisk walking on grass or smooth surface.',
          'Cat-Cow Stretch (Marjaryasana) – 10 slow rounds to loosen spinal stiffness.',
          'Wall Squats (quarter depth) – strengthens quadriceps without overloading knee caps.',
          'Bridge Pose (Setu Bandhasana) – strengthens lower back and glutes.',
        ],
      },
      {
        heading: 'Recovery Tip',
        items: [
          'Drink warm turmeric milk (Haldi doodh) at night; curcumin reduces joint inflammation naturally.',
        ],
      },
    ],
  },
};

export function normalizeQueryKey(q: string): string {
  return q.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function getCachedChatResponse(query: string) {
  const norm = normalizeQueryKey(query);
  if (!norm) return null;

  // Direct semantic matching for breakfast / low calorie queries
  if (
    norm.includes('breakfast') ||
    (norm.includes('low') && (norm.includes('cal') || norm.includes('calorie'))) ||
    norm.includes('nashta')
  ) {
    return PRECACHED_CHAT_RESPONSES['any breakfast tips for low calorie'];
  }

  // 1. Check pre-cached responses
  for (const [key, val] of Object.entries(PRECACHED_CHAT_RESPONSES)) {
    const normKey = normalizeQueryKey(key);
    if (norm.includes(normKey) || normKey.includes(norm)) {
      return val;
    }
  }

  // 2. Check local storage runtime cache
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('pulsemind_chat_cache');
      if (raw) {
        const cache = JSON.parse(raw);
        if (cache[norm]) return cache[norm];
        // Partial keyword search
        for (const [k, v] of Object.entries(cache)) {
          if (norm.includes(k) || k.includes(norm)) return v;
        }
      }
    } catch {}
  }

  return null;
}

export function setCachedChatResponse(query: string, data: any) {
  if (typeof window === 'undefined') return;
  try {
    const norm = normalizeQueryKey(query);
    if (!norm) return;
    const raw = localStorage.getItem('pulsemind_chat_cache');
    const cache = raw ? JSON.parse(raw) : {};
    cache[norm] = data;
    const keys = Object.keys(cache);
    if (keys.length > 60) {
      delete cache[keys[0]];
    }
    localStorage.setItem('pulsemind_chat_cache', JSON.stringify(cache));
  } catch {}
}

const STORAGE_VERSION = '3.6.0-single-source-truth-and-sleep-tracking';

// Run migration immediately on module load
(function runStorageMigration() {
  if (typeof window === 'undefined') return;
  try {
    const currentVersion = localStorage.getItem('pulsemind_version');
    if (currentVersion !== STORAGE_VERSION) {
      // Purge old cached posts and chat messages to ensure new motivational items and fresh coach greeting load
      localStorage.removeItem('pulsemind_posts');
      localStorage.removeItem('pulsemind_vitals');
      localStorage.removeItem('pulsemind_gift_cards');
      localStorage.removeItem('pulsemind_chat_cache');
      localStorage.setItem('pulsemind_version', STORAGE_VERSION);
    }
  } catch (e) {
    console.warn('Storage migration notice:', e);
  }
})();

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`pulsemind_${key}`);
    if (!item) return defaultValue;

    const parsed = JSON.parse(item);

    // Sanity check: Ensure gift cards NEVER contain '$'
    if (key === 'gift_cards' && Array.isArray(parsed)) {
      const hasUSD = parsed.some((c: any) => c.value && String(c.value).includes('$'));
      if (hasUSD) {
        localStorage.setItem(`pulsemind_${key}`, JSON.stringify(defaultValue));
        return defaultValue;
      }
    }

    // Sanity check: Ensure logged meals are Indian
    if (key === 'logged_meals' && Array.isArray(parsed)) {
      const hasForeign = parsed.some((m: any) => m.name && m.name.toLowerCase().includes('sourdough'));
      if (hasForeign) {
        localStorage.setItem(`pulsemind_${key}`, JSON.stringify(defaultValue));
        return defaultValue;
      }
    }

    // Sanity check: Ensure posts contain the authentic Indian athlete posters
    if (key === 'posts' && Array.isArray(parsed)) {
      const hasNeeraj = parsed.some((p: any) => p.id === 'poster-neeraj');
      if (!hasNeeraj) {
        localStorage.setItem(`pulsemind_${key}`, JSON.stringify(defaultValue));
        return defaultValue;
      }
    }

    return parsed;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`pulsemind_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err);
  }
}

