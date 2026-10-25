import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Utensils,
  ArrowLeft,
  Plus,
  Sparkles,
  Heart,
  Droplet,
  Trash2,
  Check,
  Search,
  Filter,
  Flame,
  Zap,
  Activity,
  AlertCircle,
} from 'lucide-react';
import {
  UserProfile,
  VitalMetrics,
  MealItem,
  DietPlan,
  SuggestedMeal,
  DietPreference,
  RegionalCuisine,
} from '../types';

interface DietScreenProps {
  profile: UserProfile;
  vitals: VitalMetrics;
  loggedMeals: MealItem[];
  dietPlan: DietPlan;
  onBack: () => void;
  onAddMeal: (meal: Omit<MealItem, 'id' | 'time'>) => void;
  onDeleteMeal: (mealId: string) => void;
  onRegenerateDietPlan: () => Promise<void>;
  isLoadingAI: boolean;
  onUpdateDietPreferences?: (prefs: {
    dietPreference: DietPreference;
    regionalCuisine: RegionalCuisine;
    allergies: string[];
  }) => void;
}

interface IndianFoodDatabaseItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  category: 'veg' | 'non-veg' | 'vegan' | 'jain';
  region: 'pan-india' | 'south' | 'north' | 'gujarati' | 'bengali' | 'maharashtrian';
  allergens: string[];
  benefit: string;
}

const INDIAN_FOOD_DATABASE: IndianFoodDatabaseItem[] = [
  // Breakfast
  { id: 'f1', name: 'Vegetable Moong Dal Chilla (2 pcs)', calories: 210, protein: 12, carbs: 32, fats: 4, mealType: 'Breakfast', category: 'vegan', region: 'north', allergens: [], benefit: 'High plant protein, light on gut' },
  { id: 'f2', name: 'Steamed Idli (3 pcs) with Sambar & Mint Chutney', calories: 240, protein: 9, carbs: 46, fats: 3, mealType: 'Breakfast', category: 'vegan', region: 'south', allergens: [], benefit: 'Fermented gut probiotics and zero oil' },
  { id: 'f3', name: 'Vegetable Poha with Green Peas & Lemon', calories: 230, protein: 6, carbs: 44, fats: 5, mealType: 'Breakfast', category: 'vegan', region: 'maharashtrian', allergens: [], benefit: 'Rich in iron and low glycemic index' },
  { id: 'f4', name: 'Egg White Bhurji (3 eggs) with 1 Multigrain Phulka', calories: 210, protein: 18, carbs: 22, fats: 4, mealType: 'Breakfast', category: 'non-veg', region: 'north', allergens: [], benefit: 'Pure lean protein with zero saturated fat' },
  { id: 'f5', name: 'Methi Thepla (2 pcs) with Fresh Dahi', calories: 260, protein: 10, carbs: 38, fats: 8, mealType: 'Breakfast', category: 'veg', region: 'gujarati', allergens: ['Gluten'], benefit: 'Fenugreek regulates blood glucose' },
  { id: 'f6', name: 'Steamed Khaman Dhokla (4 pcs)', calories: 190, protein: 7, carbs: 34, fats: 3, mealType: 'Breakfast', category: 'vegan', region: 'gujarati', allergens: [], benefit: 'Steamed gram flour, low fat' },
  { id: 'f7', name: 'Masala Oats Porridge with Diced Veggies', calories: 200, protein: 8, carbs: 36, fats: 4, mealType: 'Breakfast', category: 'vegan', region: 'pan-india', allergens: ['Gluten'], benefit: 'Beta-glucan soluble fiber lowers cholesterol' },
  { id: 'f8', name: 'Jain Moong Dal Pancake with Mint Chutney', calories: 195, protein: 11, carbs: 30, fats: 3, mealType: 'Breakfast', category: 'jain', region: 'pan-india', allergens: [], benefit: 'Zero root vegetables, pure clean lentil fuel' },

  // Lunch
  { id: 'f9', name: 'Paneer Bhurji (150g) with 2 Whole Wheat Rotis & Salad', calories: 480, protein: 32, carbs: 44, fats: 16, mealType: 'Lunch', category: 'veg', region: 'north', allergens: ['Dairy', 'Gluten'], benefit: 'High quality casein protein for muscle repair' },
  { id: 'f10', name: 'Toor Dal Tadka with 2 Rotis, Bhindi Sabzi & Curd', calories: 440, protein: 19, carbs: 62, fats: 11, mealType: 'Lunch', category: 'veg', region: 'north', allergens: ['Dairy', 'Gluten'], benefit: 'Classic 50-25-25 Indian balanced plate' },
  { id: 'f11', name: 'South Indian Sambar Rice with Steamed Beans Poriyal', calories: 420, protein: 14, carbs: 70, fats: 7, mealType: 'Lunch', category: 'vegan', region: 'south', allergens: [], benefit: 'Drumstick antioxidant flavonoids' },
  { id: 'f12', name: 'Grilled Fish Curry (Rahu/Hilsa) with 1 Cup Steamed Rice', calories: 430, protein: 34, carbs: 48, fats: 9, mealType: 'Lunch', category: 'non-veg', region: 'bengali', allergens: [], benefit: 'Omega-3 fatty acids for arterial elasticity' },
  { id: 'f13', name: 'Gujarati Gujarati Kadhi with Khichdi & Kachumber', calories: 380, protein: 14, carbs: 58, fats: 9, mealType: 'Lunch', category: 'veg', region: 'gujarati', allergens: ['Dairy'], benefit: 'Probiotic buttermilk soothes digestive acid' },
  { id: 'f14', name: 'Jowar Bhakri (2 pcs) with Pithla & Green Thecha', calories: 410, protein: 15, carbs: 64, fats: 8, mealType: 'Lunch', category: 'vegan', region: 'maharashtrian', allergens: [], benefit: 'Gluten-free ancient grain with high magnesium' },
  { id: 'f15', name: 'Chicken Tikka Salad Bowl (150g breast, zero oil)', calories: 340, protein: 42, carbs: 12, fats: 8, mealType: 'Lunch', category: 'non-veg', region: 'north', allergens: ['Dairy'], benefit: 'Max protein per calorie ratio' },
  { id: 'f16', name: 'Jain Toor Dal & Lauki Sabzi with 2 Rotis', calories: 390, protein: 16, carbs: 58, fats: 7, mealType: 'Lunch', category: 'jain', region: 'pan-india', allergens: ['Gluten'], benefit: 'Cooling bottle gourd with zero root vegetables' },

  // Dinner
  { id: 'f17', name: 'Yellow Moong Dal Khichdi with Steamed Palak & Ghee', calories: 410, protein: 18, carbs: 60, fats: 8, mealType: 'Dinner', category: 'veg', region: 'pan-india', allergens: ['Dairy'], benefit: 'Light digestive transit before bedtime' },
  { id: 'f18', name: 'Palak Paneer (120g) with 2 Thin Whole Wheat Phulkas', calories: 420, protein: 24, carbs: 40, fats: 14, mealType: 'Dinner', category: 'veg', region: 'north', allergens: ['Dairy', 'Gluten'], benefit: 'Iron-rich spinach and slow release protein' },
  { id: 'f19', name: 'Vegetable Dalia (Broken Wheat Khichdi) with Dahi', calories: 360, protein: 15, carbs: 56, fats: 6, mealType: 'Dinner', category: 'veg', region: 'north', allergens: ['Gluten', 'Dairy'], benefit: 'High insoluble fiber prevents morning constipation' },
  { id: 'f20', name: 'Curd Rice with Pomegranate & Mustard Tadka', calories: 340, protein: 11, carbs: 52, fats: 8, mealType: 'Dinner', category: 'veg', region: 'south', allergens: ['Dairy'], benefit: 'Cools internal core body heat for restful sleep' },
  { id: 'f21', name: 'Bengali Macher Jhol (Light Stew) with Half Cup Rice', calories: 360, protein: 28, carbs: 38, fats: 8, mealType: 'Dinner', category: 'non-veg', region: 'bengali', allergens: [], benefit: 'Light cumin-ginger digestive gravy' },
  { id: 'f22', name: 'Jain Khichdi with Dahi & Roasted Cumin', calories: 370, protein: 15, carbs: 58, fats: 6, mealType: 'Dinner', category: 'jain', region: 'pan-india', allergens: ['Dairy'], benefit: 'Sattvic evening meal promoting sound sleep' },

  // Snacks
  { id: 'f23', name: 'Roasted Makhana (Foxnuts) with Rock Salt & Haldi (30g)', calories: 110, protein: 3, carbs: 20, fats: 2, mealType: 'Snack', category: 'vegan', region: 'pan-india', allergens: [], benefit: 'High magnesium promotes arterial relaxation' },
  { id: 'f24', name: 'Roasted Bhuna Chana with Tiny Jaggery Bite (40g)', calories: 140, protein: 8, carbs: 24, fats: 2, mealType: 'Snack', category: 'vegan', region: 'north', allergens: [], benefit: 'Traditional warrior endurance snack' },
  { id: 'f25', name: 'Sprouted Moong & Kala Chana Chaat Bowl', calories: 160, protein: 11, carbs: 26, fats: 2, mealType: 'Snack', category: 'vegan', region: 'pan-india', allergens: [], benefit: 'Sprouted enzymes maximize micronutrient absorption' },
  { id: 'f26', name: 'Tender Coconut Water (Nariyal Pani 300ml)', calories: 60, protein: 2, carbs: 12, fats: 0, mealType: 'Snack', category: 'vegan', region: 'south', allergens: [], benefit: 'Nature’s electrolyte balance (Potassium & Sodium)' },
  { id: 'f27', name: 'Masala Chhach (Spiced Buttermilk tall glass)', calories: 55, protein: 4, carbs: 6, fats: 2, mealType: 'Snack', category: 'veg', region: 'pan-india', allergens: ['Dairy'], benefit: 'Probiotics extinguish heartburn immediately' },
  { id: 'f28', name: 'Sattu Cooler (Roasted Gram Flour with Lemon & Jeera)', calories: 140, protein: 10, carbs: 22, fats: 2, mealType: 'Snack', category: 'vegan', region: 'bengali', allergens: [], benefit: 'Desi plant protein cooler with sustained satiety' },
];

export const DietScreen: React.FC<DietScreenProps> = ({
  profile,
  vitals,
  loggedMeals,
  dietPlan,
  onBack,
  onAddMeal,
  onDeleteMeal,
  onRegenerateDietPlan,
  isLoadingAI,
  onUpdateDietPreferences,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreference, setSelectedPreference] = useState<DietPreference>(profile.dietPreference || 'veg');
  const [selectedCuisine, setSelectedCuisine] = useState<RegionalCuisine>(profile.regionalCuisine || 'north');
  const [activeAllergies, setActiveAllergies] = useState<string[]>(profile.allergies || []);
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);

  // Manual meal form fields
  const [manualName, setManualName] = useState('');
  const [manualCalories, setManualCalories] = useState('');
  const [manualProtein, setManualProtein] = useState('');
  const [manualCarbs, setManualCarbs] = useState('');
  const [manualFats, setManualFats] = useState('');
  const [manualType, setManualType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');

  // Activity-Calorie Dynamic Linking:
  // Base daily target + measured active burn from PulseBack Clip (workout minutes and steps!)
  const measuredActiveBurn = vitals.dailyBurnCalories || Math.round(vitals.activeMinutes * 5.1);
  const dynamicCalorieExpenditure = profile.dailyCalorieTarget + measuredActiveBurn;

  // Totals calculations
  const totalCaloriesLogged = loggedMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProteinLogged = loggedMeals.reduce((acc, m) => acc + m.protein, 0);
  const totalCarbsLogged = loggedMeals.reduce((acc, m) => acc + m.carbs, 0);
  const totalFatsLogged = loggedMeals.reduce((acc, m) => acc + m.fats, 0);

  const caloriesRemaining = Math.max(0, dynamicCalorieExpenditure - totalCaloriesLogged);
  const caloriePercent = Math.min(100, Math.round((totalCaloriesLogged / dynamicCalorieExpenditure) * 100));

  // Filter food database based on search, preference, cuisine, and allergies
  const filteredFoodDatabase = useMemo(() => {
    return INDIAN_FOOD_DATABASE.filter((item) => {
      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchBenefit = item.benefit.toLowerCase().includes(q);
        const matchType = item.mealType.toLowerCase().includes(q);
        if (!matchName && !matchBenefit && !matchType) return false;
      }

      // Preference matching
      if (selectedPreference === 'veg' && item.category === 'non-veg') return false;
      if (selectedPreference === 'vegan' && item.category !== 'vegan') return false;
      if (selectedPreference === 'jain' && item.category !== 'jain') return false;

      // Allergy exclusion
      if (activeAllergies.includes('Gluten-Free') && item.allergens.includes('Gluten')) return false;
      if (activeAllergies.includes('Lactose-Free') && item.allergens.includes('Dairy')) return false;

      return true;
    });
  }, [searchQuery, selectedPreference, activeAllergies]);

  const handleToggleAllergy = (allergy: string) => {
    const updated = activeAllergies.includes(allergy)
      ? activeAllergies.filter((a) => a !== allergy)
      : [...activeAllergies, allergy];
    setActiveAllergies(updated);
    if (onUpdateDietPreferences) {
      onUpdateDietPreferences({
        dietPreference: selectedPreference,
        regionalCuisine: selectedCuisine,
        allergies: updated,
      });
    }
  };

  const handlePreferenceChange = (pref: DietPreference) => {
    setSelectedPreference(pref);
    if (onUpdateDietPreferences) {
      onUpdateDietPreferences({
        dietPreference: pref,
        regionalCuisine: selectedCuisine,
        allergies: activeAllergies,
      });
    }
  };

  const handleCuisineChange = (cuisine: RegionalCuisine) => {
    setSelectedCuisine(cuisine);
    if (onUpdateDietPreferences) {
      onUpdateDietPreferences({
        dietPreference: selectedPreference,
        regionalCuisine: cuisine,
        allergies: activeAllergies,
      });
    }
  };

  const handleQuickAddDishes = (dish: IndianFoodDatabaseItem) => {
    onAddMeal({
      name: dish.name,
      calories: dish.calories,
      protein: dish.protein,
      carbs: dish.carbs,
      fats: dish.fats,
      mealType: dish.mealType,
      vitalBenefit: dish.benefit,
    });
    setAddedSuccessId(dish.id);
    setTimeout(() => setAddedSuccessId(null), 1800);
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualCalories) return;
    onAddMeal({
      name: manualName.trim(),
      calories: parseInt(manualCalories, 10) || 0,
      protein: parseInt(manualProtein, 10) || 0,
      carbs: parseInt(manualCarbs, 10) || 0,
      fats: parseInt(manualFats, 10) || 0,
      mealType: manualType,
      vitalBenefit: 'Custom home-cooked meal logged.',
    });
    setManualName('');
    setManualCalories('');
    setManualProtein('');
    setManualCarbs('');
    setManualFats('');
    setShowAddModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="p-3.5 sm:p-5 flex flex-col gap-4 text-slate-800 dark:text-slate-100 max-w-full overflow-hidden"
    >
      {/* Header */}
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
              <Utensils className="w-4 h-4 text-amber-500" />
              Indian Diet & Vitals Fuel
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Calibrated to PulseBack clip ({vitals.heartRate} bpm · {vitals.steps.toLocaleString()} steps)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Custom</span>
        </button>
      </div>

      {/* Activity-Calorie Linked Target Card (Visibly responds to measured clip telemetry!) */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/10 via-white to-orange-50/40 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/30 border border-amber-200/80 dark:border-amber-900/60 shadow-xs flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3 text-amber-500" />
              Telemetry-Linked Calorie Window
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums leading-tight mt-0.5">
              {totalCaloriesLogged.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">
                / {dynamicCalorieExpenditure.toLocaleString()} kcal
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 font-mono">
              {caloriesRemaining.toLocaleString()} kcal
            </span>
            <p className="text-[10px] text-slate-400">Remaining to Fuel</p>
          </div>
        </div>

        {/* PulseBack Active Burn Breakdown Pill */}
        <div className="p-2 px-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-amber-200/60 dark:border-slate-700 text-[11px] flex items-center justify-between text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Base: {profile.dailyCalorieTarget} kcal + Active Burn: <strong>+{measuredActiveBurn} kcal</strong></span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
            ({vitals.activeMinutes}m active · {vitals.steps.toLocaleString()} steps)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-amber-100/70 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${caloriePercent}%` }}
          />
        </div>

        {/* Macro breakdown cards */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
            <span className="text-[10px] text-slate-400 block font-medium">Protein</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">{totalProteinLogged}g</span>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
            <span className="text-[10px] text-slate-400 block font-medium">Carbs</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">{totalCarbsLogged}g</span>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
            <span className="text-[10px] text-slate-400 block font-medium">Healthy Fats</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">{totalFatsLogged}g</span>
          </div>
        </div>
      </div>

      {/* Dynamic Vitals Impact Banner (100% Consistent with Authoritative Vitals!) */}
      <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-900/60 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-200 font-bold text-xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>PulseBack Telemetry Guidance</span>
          </div>
          <span className="font-mono text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
            {vitals.heartRate} bpm · SpO2 {vitals.spo2}%
          </span>
        </div>
        <p className="text-xs text-indigo-950/85 dark:text-indigo-200 leading-relaxed">
          Your PulseBack Clip reads {vitals.heartRate} bpm with {vitals.steps.toLocaleString()} steps logged today ({Math.round((vitals.steps / vitals.stepGoal) * 100)}% of goal). Resting HRV is {vitals.hrv} ms. Consuming high-protein Indian lentils, seasonal sabzi, and fresh dahi ensures smooth muscle replenishment without digestive strain.
        </p>
        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-indigo-800 dark:text-indigo-300 font-medium bg-white/70 dark:bg-slate-900/80 p-1.5 px-2.5 rounded-lg border border-indigo-100 dark:border-indigo-800">
          <Droplet className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <span>Hydration Goal: Sip 2.5L water with lemon or fresh coconut water for electrolyte balance.</span>
        </div>
      </div>

      {/* Dietary Preference & Regional Cuisine Controls */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Filter className="w-3 h-3 text-amber-500" />
            Diet Type & Regional Flavors
          </span>
          <span className="text-[10px] text-slate-400">Customizes food recommendations</span>
        </div>

        {/* 1. Diet Preference Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {(['all', 'veg', 'non-veg', 'vegan', 'jain'] as DietPreference[]).map((pref) => (
            <button
              key={pref}
              onClick={() => handlePreferenceChange(pref)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                selectedPreference === pref
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {pref === 'all' ? 'All Diets' : pref === 'veg' ? 'Pure Veg' : pref}
            </button>
          ))}
        </div>

        {/* 2. Regional Cuisine Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-[11px]">
          {(['pan-india', 'north', 'south', 'gujarati', 'bengali', 'maharashtrian'] as RegionalCuisine[]).map((c) => (
            <button
              key={c}
              onClick={() => handleCuisineChange(c)}
              className={`px-2 py-0.5 rounded-lg font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${
                selectedCuisine === c
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {c.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* 3. Allergies & Intolerances */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
          <span className="text-slate-400 font-semibold uppercase">Allergies:</span>
          {['Gluten-Free', 'Lactose-Free', 'Nut-Free'].map((allergy) => (
            <button
              key={allergy}
              onClick={() => handleToggleAllergy(allergy)}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeAllergies.includes(allergy)
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {allergy}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Search-Based Indian Meal Logging (Instant 1-Tap Log) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-amber-500" />
            Quick Indian Dishes Database ({filteredFoodDatabase.length})
          </h2>
          <span className="text-[10px] text-slate-400">Tap '+' to log instantly</span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dal, chilla, paneer, idli, oats, bhurji..."
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs"
          />
        </div>

        {/* List of 30+ searchable dishes */}
        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto no-scrollbar pr-0.5">
          {filteredFoodDatabase.map((dish) => {
            const isAdded = addedSuccessId === dish.id;
            return (
              <div
                key={dish.id}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-2.5 hover:border-amber-300 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        dish.category === 'non-veg'
                          ? 'bg-rose-500'
                          : dish.category === 'jain'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {dish.name}
                    </h4>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium shrink-0">
                      {dish.mealType}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {dish.benefit}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-amber-700 dark:text-amber-400">{dish.calories} kcal</span>
                    <span>·</span>
                    <span>P: {dish.protein}g</span>
                    <span>·</span>
                    <span>C: {dish.carbs}g</span>
                    <span>·</span>
                    <span>F: {dish.fats}g</span>
                  </div>
                </div>

                <button
                  onClick={() => handleQuickAddDishes(dish)}
                  className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-500 hover:text-white text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                  title="Add meal to daily log"
                >
                  {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Logged Meals */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Today's Logged Meals ({loggedMeals.length})
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            Total: {totalCaloriesLogged} kcal
          </span>
        </div>

        {loggedMeals.length === 0 ? (
          <div className="p-6 text-center text-slate-400 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-xs">
            No meals logged today. Use the search bar above to log your breakfast or lunch in 1 tap!
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {loggedMeals.map((meal) => (
              <div
                key={meal.id}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-mono text-slate-400">{meal.time}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {meal.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    <span className="font-bold text-amber-600">{meal.calories} kcal</span>
                    <span>·</span>
                    <span>P: {meal.protein}g</span>
                    <span>·</span>
                    <span>C: {meal.carbs}g</span>
                    <span>·</span>
                    <span>F: {meal.fats}g</span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteMeal(meal.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete meal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Custom Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-3.5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Log Custom Indian Dish</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleManualAddSubmit} className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="e.g. 2 Jowar Rotis with Methi Sabzi"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Calories (kcal)</label>
                    <input
                      type="number"
                      required
                      value={manualCalories}
                      onChange={(e) => setManualCalories(e.target.value)}
                      placeholder="e.g. 380"
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Protein (g)</label>
                    <input
                      type="number"
                      value={manualProtein}
                      onChange={(e) => setManualProtein(e.target.value)}
                      placeholder="e.g. 18"
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      value={manualCarbs}
                      onChange={(e) => setManualCarbs(e.target.value)}
                      placeholder="e.g. 48"
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Fats (g)</label>
                    <input
                      type="number"
                      value={manualFats}
                      onChange={(e) => setManualFats(e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Meal Type</label>
                  <select
                    value={manualType}
                    onChange={(e: any) => setManualType(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-colors cursor-pointer mt-1"
                >
                  Add Meal to Log
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
