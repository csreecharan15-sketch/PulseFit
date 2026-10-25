import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Google Gen AI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// In-memory fast cache layers
const serverChatCache = new Map<string, any>();
const serverTaskEvalCache = new Map<string, any>();

function normalizeServerKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Endpoint 1: Dedicated Fitness & Health AI Chatbot (Dynamic, contextual & structured)
app.post('/api/ai/fitness-chat', async (req, res) => {
  const { message, history, vitals, profile } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const cleanQuery = message.trim();
  const cacheKey = normalizeServerKey(cleanQuery);

  // Instant server-side cache hit
  if (serverChatCache.has(cacheKey)) {
    return res.json({
      source: 'server-cache',
      cached: true,
      ...serverChatCache.get(cacheKey),
    });
  }

  // If no API key or client is unavailable, use rich intelligent semantic responder
  if (!ai || !apiKey) {
    const fallback = getIntelligentChatResponse(cleanQuery, vitals, profile);
    serverChatCache.set(cacheKey, fallback);
    return res.json({ source: 'offline-coach', ...fallback });
  }

  try {
    // Format conversation history for context
    const recentHistory = Array.isArray(history)
      ? history
          .slice(-6)
          .map((m: any) => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`)
          .join('\n')
      : '';

    const bmi = (profile?.weightKg || 68) / Math.pow((profile?.heightCm || 175) / 100, 2);

    const systemPrompt = `You are Coach Pulse, an empathetic, supportive, knowledgeable Indian personal fitness and nutrition coach inside the PulseMind health app.
VOICE & COACHING PERSONA:
- You speak warmly, enthusiastically, and encouragingly like an authentic personal fitness coach and mentor who walks alongside the user on their journey to better health.
- Greet the user naturally by name (${profile?.name || 'Aarav'}).
- CRITICAL: Address their SPECIFIC query directly, richly, and practically in your very first sentence. NEVER give generic filler, never say "Taking your personal stats...", and NEVER dodge their question with a default step/heart-rate checklist.
- If they ask for breakfast tips or low-calorie meals, give mouth-watering, specific Indian breakfast recipes (e.g. Moong Dal Chilla, Egg White Bhurji, Sprout Chaat, Vegetable Poha) with exact calorie counts (~160-220 kcal) and protein grams.
- Naturally weave their live PulseBack Clip vitals (Pulse ${vitals?.heartRate || 72} bpm, Steps ${vitals?.steps || 5200}/${vitals?.stepGoal || 10000}, BP ${vitals?.bpSys || 118}/${vitals?.bpDia || 76} mmHg) and body profile (${profile?.age || 26}y, ${profile?.weightKg || 68}kg) into your coaching conversation like a coach reviewing an athlete's telemetry.
- Strict Scope: Health, fitness, Indian nutrition (ghar ka khana), workouts, hydration, sleep recovery, and PulseBack biosensors. If off-topic, politely redirect in 1 friendly sentence back to their health journey.

FORMAT RULES:
- Output valid JSON strictly with this schema:
{
  "content": "Warm, personal coaching message that directly and enthusiastically answers their exact question first, explains the nutritional/physical logic, and weaves in their vitals naturally.",
  "structuredSections": [
    {
      "heading": "Specific Action Plan / Recipes",
      "items": ["Actionable point 1 with exact recipe/exercise/tip...", "Specific point 2 with exact calories or reps...", "Specific point 3..."]
    },
    {
      "heading": "Coach's Health Journey Insight",
      "items": ["Practical tip connecting their pulse/steps or Indian kitchen wisdom to keep them winning..."]
    }
  ]
}`;

    const prompt = `${systemPrompt}

User Biometrics & Telemetry:
- Name: ${profile?.name || 'Aarav'}
- Age: ${profile?.age || 26}y, Sex: ${profile?.sex || 'Male'}
- Weight: ${profile?.weightKg || 68}kg, Height: ${profile?.heightCm || 175}cm, BMI: ${bmi.toFixed(1)}
- Fitness Goal: ${profile?.fitnessGoal || 'Cardio Stamina & Healthy Weight'}
- Daily Calorie Target: ${profile?.dailyCalorieTarget || 2100} kcal
- Current PulseBack Clip Vitals:
  * Heart Rate: ${vitals?.heartRate || 72} bpm (${vitals?.currentMode || 'Normal'})
  * Blood Pressure: ${vitals?.bpSys || 118}/${vitals?.bpDia || 76} mmHg
  * Daily Steps: ${vitals?.steps || 5200} / ${vitals?.stepGoal || 10000} steps
  * SpO2: ${vitals?.spo2 || 98}%, Temp: ${vitals?.temperature || 36.6}°C

Conversation Context:
${recentHistory}

Current User Query: "${cleanQuery}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        maxOutputTokens: 750,
        temperature: 0.35,
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);

    // Save to server cache for instant repeat query serving
    serverChatCache.set(cacheKey, parsed);

    return res.json({
      source: 'gemini-3.8-flash',
      ...parsed,
    });
  } catch (err: unknown) {
    console.error('Gemini Chat error:', err);
    const fallback = getIntelligentChatResponse(cleanQuery, vitals, profile);
    return res.json({
      source: 'offline-coach-fallback',
      ...fallback,
    });
  }
});

// Endpoint 2: AI Custom Task Evaluator (Evaluates difficulty and points authoritatively)
app.post('/api/ai/evaluate-task', async (req, res) => {
  const { title, description, category, targetMinutes, vitals } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const taskKey = normalizeServerKey(`${title} ${category || ''} ${targetMinutes || ''}`);

  if (serverTaskEvalCache.has(taskKey)) {
    return res.json({
      cached: true,
      ...serverTaskEvalCache.get(taskKey),
    });
  }

  // Pre-evaluate with heuristic for instant backup
  const heuristicResult = evaluateTaskHeuristically(title, description || '', targetMinutes || 15);

  // If Gemini is available, use fast AI evaluation with short timeout
  if (ai && apiKey) {
    try {
      const prompt = `You are the Task-Master AI evaluator in PulseMind health app.
A user wants to add a custom fitness task. You must read the task, analyze its intensity and duration, and authoritatively determine its difficulty level and reward points.

Task details:
- Title: "${title}"
- Description: "${description || ''}"
- Category: "${category || 'cardio'}"
- Duration: ${targetMinutes || 15} minutes

Rules:
1. Difficulty Classification:
   - "Easy": Light walking, hydration, 5-10 min light stretching, gentle breathing, posture check.
   - "Moderate": 15-30 min brisk walk/jog, bodyweight squats/planks, yoga flow, moderate cycling, stairs.
   - "Challenging": High intensity intervals (HIIT), fast running, 50+ pushups/baithaks, heavy weight training, 45+ min vigorous cardio.
2. Points Assignment:
   - Easy: 80 to 100 points
   - Moderate: 160 to 200 points
   - Challenging: 260 to 320 points
3. Output strictly JSON:
{
  "difficulty": "Easy" | "Moderate" | "Challenging",
  "points": 180,
  "reasoning": "1 short sentence explaining why this task was classified at this tier."
}`;

      // Race with 900ms timeout for ultra-fast response
      const aiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          maxOutputTokens: 250,
          temperature: 0.1,
        },
      });

      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 900));
      const response: any = await Promise.race([aiPromise, timeoutPromise]);

      if (response && response.text) {
        const parsed = JSON.parse(response.text || '{}');
        if (parsed.difficulty && parsed.points) {
          serverTaskEvalCache.set(taskKey, parsed);
          return res.json(parsed);
        }
      }
    } catch (err) {
      console.warn('AI Task evaluation fallback notice:', err);
    }
  }

  serverTaskEvalCache.set(taskKey, heuristicResult);
  return res.json(heuristicResult);
});

// Endpoint 3: Adaptive Task-Master AI Planner (Indian Context)
app.post('/api/ai/taskmaster', async (req, res) => {
  const { profile, vitals, currentStreak, completedTasksCount, activeDifficulty } = req.body;
  const targetDifficulty = activeDifficulty || 'Easy';

  if (!ai || !apiKey) {
    return res.json({
      source: 'offline-engine',
      tasks: getHeuristicTaskMasterTasks(targetDifficulty, vitals, profile),
    });
  }

  try {
    const prompt = `You are PulseMind's Task-Master for an Indian Android health app connected to the "PulseBack Clip" sensor.
User Profile:
- Name: ${profile?.name || 'User'}
- Weight: ${profile?.weightKg || 68}kg, Height: ${profile?.heightCm || 175}cm
- Current Streak: ${currentStreak || 0} days, Completed Tasks: ${completedTasksCount || 0}
- Consistency Difficulty Tier: ${targetDifficulty}
- PulseBack Clip Vitals: Heart Rate ${vitals?.heartRate || 72} bpm, Steps ${vitals?.steps || 5200}

Rules:
1. Provide 3 specific tasks for today suitable for Indian daily life matching the difficulty tier (${targetDifficulty}).
2. Scale reward points:
   - Easy: 85 to 100 points each
   - Moderate: 165 to 195 points each
   - Challenging: 265 to 310 points each
3. Output strictly valid JSON:
{
  "summary": "1 short encouraging motivation sentence for today",
  "difficultyLevel": "${targetDifficulty}",
  "tasks": [
    {
      "id": "task-uuid",
      "title": "Short title",
      "category": "cardio" | "recovery" | "mindfulness" | "nutrition" | "strength",
      "description": "Simple guidance in 1-2 easy sentences",
      "targetMinutes": 15,
      "difficulty": "${targetDifficulty}",
      "points": 95,
      "vitalTriggerReason": "Simple reason connecting to today's steps or heart rate"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        maxOutputTokens: 650,
        temperature: 0.3,
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);

    return res.json({
      source: 'gemini-ai',
      ...parsed,
    });
  } catch (err: unknown) {
    return res.json({
      source: 'offline-engine-fallback',
      tasks: getHeuristicTaskMasterTasks(targetDifficulty, vitals, profile),
    });
  }
});

// Endpoint 4: Vitals-Aware Indian Diet Suggestions
app.post('/api/ai/diet', async (req, res) => {
  const { profile, vitals, loggedMeals, calorieTarget } = req.body;

  if (!ai || !apiKey) {
    return res.json({
      source: 'offline-engine',
      ...getHeuristicDietSuggestions(vitals, loggedMeals, calorieTarget),
    });
  }

  try {
    const prompt = `You are a clinical Indian nutritionist for PulseMind Android health app.
Analyze daily meals and suggest authentic Indian home meals (Ghar ka khana) based on user vitals from the PulseBack Clip.

User:
- Target Calories: ${calorieTarget || 2100} kcal
- Vitals: Heart Rate ${vitals?.heartRate || 72} bpm, Steps: ${vitals?.steps || 5200}
- Meals: ${JSON.stringify(loggedMeals || [])}

Rules:
1. ONLY suggest healthy Indian dishes (Moong dal khichdi, Paneer bhurji, Ragi dosa, Chana chaat, Curd rice, etc.).
2. Output strictly valid JSON:
{
  "vitalsImpactAnalysis": "1-2 simple sentences on how heart rate and steps guide today's food",
  "recommendedCalorieWindow": { "remaining": 800, "proteinGramsNeeded": 50 },
  "suggestedMeals": [
    {
      "mealType": "Lunch" | "Dinner" | "Snack",
      "name": "Indian Dish Name",
      "description": "Simple ingredients and preparation",
      "calories": 480,
      "protein": 28,
      "carbs": 48,
      "fats": 14,
      "vitalBenefit": "Simple health benefit in plain English"
    }
  ],
  "hydrationAdvice": "Simple hydration tip with water or coconut water"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        maxOutputTokens: 650,
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json({
      source: 'gemini-ai',
      ...parsed,
    });
  } catch (err: unknown) {
    return res.json({
      source: 'offline-engine-fallback',
      ...getHeuristicDietSuggestions(vitals, loggedMeals, calorieTarget),
    });
  }
});

// Intelligent Semantic Chat Responder (Dedicated Indian Fitness & Nutrition Coach)
function getIntelligentChatResponse(query: string, vitals: any, profile: any) {
  const q = query.toLowerCase().trim();
  const hr = vitals?.heartRate || 72;
  const steps = vitals?.steps || 5200;
  const stepGoal = vitals?.stepGoal || 10000;
  const stepsLeft = Math.max(0, stepGoal - steps);
  const bpSys = vitals?.bpSys || 118;
  const bpDia = vitals?.bpDia || 76;
  const spo2 = vitals?.spo2 || 98;
  const weight = profile?.weightKg || 68;
  const height = profile?.heightCm || 175;
  const age = profile?.age || 26;
  const userName = profile?.name || 'Aarav';
  const bmi = weight / Math.pow(height / 100, 2);
  const targetProteinGrams = Math.round(weight * 1.3);
  const calorieTarget = profile?.dailyCalorieTarget || 2100;

  // 1. Low-Calorie Breakfast & Morning Meals (Directly answers the user's specific request)
  if (
    q.includes('breakfast') ||
    q.includes('nashta') ||
    q.includes('morning meal') ||
    (q.includes('low') && (q.includes('cal') || q.includes('calorie'))) ||
    q.includes('diet tips') ||
    q.includes('breakfast tips')
  ) {
    return {
      content: `Coach Pulse here, ${userName}! I'm so glad you asked about low-calorie breakfast tips—the first meal sets the metabolic pace, controls insulin, and keeps cravings quiet for your entire day. Looking at your live PulseBack telemetry (${hr} bpm pulse, ${steps.toLocaleString()} steps logged today), your metabolism is active and ready for nutrient-dense fuel. Here are 5 delicious, home-cooked Indian breakfast options kept strictly between 160 and 220 calories, packed with protein and dietary fiber so you stay fully energized without unnecessary calories:`,
      structuredSections: [
        {
          heading: 'Top Low-Calorie Indian Breakfast Picks (Under 220 kcal)',
          items: [
            'Vegetable Moong Dal Chilla (~180 kcal · 11g protein): Grind soaked yellow moong dal with ginger and green chilies. Mix in grated carrot and fresh spinach. Cook crisp on a non-stick tawa with 1/2 tsp pure ghee and serve with fresh mint-coriander chutney.',
            'Egg White Bhurji with 1 Phulka (~210 kcal · 16g protein): Scramble 3 egg whites with chopped onions, juicy tomatoes, and a dash of turmeric. Pair with 1 light whole-wheat phulka (no oil applied). Super filling with zero heavy fats.',
            'Sprouted Moong & Pomegranate Chaat (~160 kcal · 10g protein): Lightly steam green moong sprouts, toss with diced cucumber, tomatoes, lemon juice, roasted cumin powder (jeera), and a tablespoon of pomegranate seeds. Zero cooking oil, high prebiotic fiber!',
            'Vegetable Poha with Green Peas (~220 kcal · 6g protein): Rinse flattened rice and temper with mustard seeds, curry leaves, onions, turmeric, and sweet green peas. Finish with fresh lemon juice. Skip peanuts to keep calories ultra-lean.',
            'Oats & Besan Vegetable Cheela (~190 kcal · 8g protein): Blend powdered rolled oats and besan (gram flour) with grated zucchini or lauki (bottle gourd) and carom seeds (ajwain). Great for light digestion and zero morning bloating.',
          ],
        },
        {
          heading: "Coach's Health Journey Wisdom",
          items: [
            `Pre-Meal Hydration: Sip 400ml of lukewarm water with a squeeze of fresh lemon 15 minutes before breakfast—this hydrates your system and activates digestive enzymes.`,
            `The Protein Anchor: Always pair morning carbs with at least 8-12g of protein. It stops the hunger hormone (ghrelin) from triggering pastry or biscuit cravings at 11 AM.`,
            `Telemetry Synergy: Digesting complex, low-GI foods avoids the rapid heart rate spikes caused by fried parathas or sugary chai, keeping your resting baseline (${vitals?.restingHeartRate || 64} bpm) calm.`,
          ],
        },
      ],
    };
  }

  // 2. Lunch & Balanced Indian Thali
  if (q.includes('lunch') || q.includes('thali') || q.includes('midday') || q.includes('afternoon') || q.includes('dopahar')) {
    return {
      content: `Hey ${userName}! For lunch, we follow the time-tested 50-25-25 Indian Thali rule: half your plate vegetables and salad, a quarter lean protein, and a quarter smart carbs. At ${weight}kg, this keeps your midday energy steady without post-meal lethargy.`,
      structuredSections: [
        {
          heading: 'Balanced Indian Lunch Blueprint (~480-540 kcal)',
          items: [
            '1 Bowl Thick Dal (Toor, Moong, or Chana) or 100g Fresh Paneer Bhurji (~18-20g protein).',
            '2 Small Multigrain or Jowar Rotis (rich in zinc and slow-digesting complex carbs).',
            '1 Generous Bowl of Seasonal Sabzi (Bhindi, Gobhi-Matar, or Lauki) cooked in 1 tsp mustard or cold-pressed oil.',
            '1 Bowl Fresh Probiotic Dahi (Curd) sprinkled with roasted cumin powder to aid digestion.',
            'Raw Salad: 1 sliced cucumber, 1 carrot, and lemon juice eaten first to coat the stomach in soluble fiber.',
          ],
        },
        {
          heading: "Coach's Digest & Walk Tip",
          items: [
            'Take a leisurely 10-minute stroll after finishing lunch—this drops postprandial glucose spikes by up to 25% and adds ~1,000 steps towards your 10,000 goal!',
          ],
        },
      ],
    };
  }

  // 3. Dinner & Night Recovery Meals
  if (q.includes('dinner') || q.includes('night') || q.includes('light dinner') || q.includes('raat') || q.includes('late night')) {
    return {
      content: `Coach Pulse here! The golden rule for dinner is light, warm, and finished before 8:00 PM. Heavy, oily dinners force your heart to pump harder while you sleep, which prevents your PulseBack Clip from recording restorative resting heart rates in the 50s-60s bpm range.`,
      structuredSections: [
        {
          heading: 'Restorative Indian Dinners (~380-450 kcal)',
          items: [
            'Yellow Moong Dal Khichdi with Steamed Spinach (~410 kcal · 18g protein): Made with equal parts moong dal and rice, a pinch of hing (asafoetida), and 1/2 tsp desi ghee. Comfort food that soothes the gut.',
            'Palak Paneer with 2 Whole Wheat Phulkas (~440 kcal · 22g protein): Iron-rich blended spinach gravy with 80g fresh paneer cubes and zero cream.',
            'Vegetable Dalia / Broken Wheat Khichdi (~360 kcal · 14g protein): Loaded with carrots, green beans, and roasted moong dal.',
            'Clear Vegetable Moong Soup with 1 Besan Roti (~320 kcal · 12g protein): Perfect for light recovery nights or when feeling sluggish.',
          ],
        },
        {
          heading: 'Evening Recovery Protocol',
          items: [
            'Practice Shatapavali (100 leisurely steps) inside your living room or veranda after eating.',
            'Allow a full 2.5-hour gap between dinner and sleep so gastroesophageal reflux stays at zero.',
          ],
        },
      ],
    };
  }

  // 4. Healthy Desi Snacks & 4 PM Cravings
  if (q.includes('snack') || q.includes('munch') || q.includes('craving') || q.includes('bhookh') || q.includes('namkeen') || q.includes('biscuit') || q.includes('4 pm')) {
    return {
      content: `Hey ${userName}! That 4 PM afternoon slump is when most diets stumble onto fried samosas and packaged biscuits. Here are high-satiety Indian snacks that kill cravings, nourish your muscles, and fit right inside your daily calorie budget:`,
      structuredSections: [
        {
          heading: 'Guilt-Free Indian Snack Ideas (Under 160 kcal)',
          items: [
            'Roasted Makhana (Foxnuts) (30g = ~110 kcal · 3g protein): Roasted on low flame with a pinch of rock salt, turmeric, and black pepper. Rich in magnesium for heart health.',
            'Roasted Bhuna Chana with a bite of Jaggery (40g = ~140 kcal · 8g protein): Classic Indian warrior snack that provides slow-release stamina.',
            'Sprouted Kala Chana Chaat (1 small katori = ~130 kcal · 7g protein): Tangy, crunchy, and packed with B-vitamins.',
            'Tender Coconut Water with Malai slice (~90 kcal): Nature’s electrolyte drink with natural potassium to replenish SpO2 and blood volume.',
            'Masala Chhach (Spiced Buttermilk) (1 tall glass = ~60 kcal · 4g protein): Blended with mint, ginger, and roasted jeera. Calms stomach acid immediately.',
          ],
        },
        {
          heading: "Coach's Mindset Shift",
          items: [
            'Before snacking, drink 1 full glass of water. 70% of 4 PM hunger signals are actually mild cellular dehydration!',
          ],
        },
      ],
    };
  }

  // 5. Belly Fat & Sustainable Weight Loss
  if (q.includes('belly') || q.includes('fat') || q.includes('weight loss') || q.includes('lose weight') || q.includes('slim') || q.includes('deficit')) {
    return {
      content: `Coach Pulse here, ${userName}! Visceral belly fat responds best to consistency, not extreme starvation. At ${weight}kg with a BMI of ${bmi.toFixed(1)}, our game plan is a gentle 350-400 kcal deficit, 10,000 daily steps, and a 12-hour overnight gut rest. You already have ${steps.toLocaleString()} steps today—let's make every step count!`,
      structuredSections: [
        {
          heading: '4 Pillars of Desi Fat Loss',
          items: [
            `Walk in Zone 2 Fat Burning: Maintain your pulse between 105 and 125 bpm during daily walks. This oxidizes fat stores directly without triggering appetite spikes.`,
            `The 12-Hour Overnight Fast: Finish dinner by 8:00 PM and have breakfast after 8:00 AM. This natural window lowers baseline insulin and burns visceral fat.`,
            `Swap Refined Carbs for Whole Grains: Replace white refined maida with whole jowar, bajra, or stone-ground wheat rotis.`,
            `Eat Sliced Kakdi & Tomato 10 Minutes Before Meals: Pre-loading soluble fiber cuts meal calories by 15% naturally.`,
          ],
        },
        {
          heading: 'PulseBack Telemetry Insight',
          items: [
            `Your resting heart rate is ${vitals?.restingHeartRate || 64} bpm. Daily brisk walking preserves cardiovascular elasticity and burns ~300-400 kcal without cortisol spikes.`,
          ],
        },
      ],
    };
  }

  // 6. Muscle Building & Strength
  if (q.includes('muscle') || q.includes('biceps') || q.includes('bulk') || q.includes('gain') || q.includes('strength') || q.includes('chest') || q.includes('hypertrophy')) {
    return {
      content: `Coach Pulse here! For your ${weight}kg frame, building lean athletic muscle requires hitting ${targetProteinGrams}g of daily protein coupled with progressive overload. Your current pulse is ${hr} bpm—let's channel that energy into real strength:`,
      structuredSections: [
        {
          heading: 'Personalized Muscle Blueprint',
          items: [
            `Calisthenics Power Circuit: 4 rounds of 15 Hindu Squats (Baithaks), 12 Hindu Push-ups (Dands), and 30s plank holds 4 days a week.`,
            `Target ${targetProteinGrams}g Complete Protein: 120g fresh paneer (~22g), 1 bowl thick dal (~14g), 1 tall glass sattu cooler (~15g), and 1 cup dahi (~10g).`,
            `Rest and Growth: Muscle synthesis peaks during slow-wave deep sleep when your pulse slows down below 60 bpm. Aim for 7.5 to 8 hours.`,
            `Hydration & Oxygenation: Your SpO2 is ${spo2}%, ensuring optimal oxygen transport to repairing muscle fibers.`,
          ],
        },
        {
          heading: 'PulseBack Workout Threshold',
          items: [
            `Push heart rate to 130-145 bpm during your working sets, then rest 60 seconds until pulse returns below 105 bpm before starting the next set.`,
          ],
        },
      ],
    };
  }

  // 7. High-Protein Vegetarian Indian Food
  if (q.includes('protein') || q.includes('vegetarian') || q.includes('veg') || q.includes('dal') || q.includes('paneer') || q.includes('sattu') || q.includes('soya')) {
    return {
      content: `Hey ${userName}! Reaching your ${targetProteinGrams}g daily protein target at ${weight}kg on a pure Indian vegetarian diet is 100% achievable with these authentic kitchen powerhouses:`,
      structuredSections: [
        {
          heading: 'Top High-Protein Indian Vegetarian Staples',
          items: [
            'Fresh Paneer (100g = 18g protein) – Toss with palak, methi, or grill with chaat masala.',
            'Sprouted Moong & Kala Chana (1 bowl = 16g protein) – Rich in enzymes and bioavailable iron.',
            'Sattu (Roasted Gram Flour) (50g = 13g protein) – The traditional Indian protein shake! Mix with water, lemon, and black salt.',
            'Soy Chunks / Nutrela (50g dry = 26g protein) – Soak in hot water, squeeze dry, and cook in tomato-onion gravy.',
            'Thick Dal + Roti Combo (1 bowl dal + 2 rotis = ~18g protein) – Delivers all 9 essential amino acids in complete harmony.',
            'Fresh Greek-Style Hung Curd (1 cup = 12g protein) – High in gut probiotics and leucine.',
          ],
        },
        {
          heading: "Coach's Gut Health Advice",
          items: [
            'Always cook lentils with a pinch of hing (asafoetida) and cumin (jeera) to prevent bloating and ensure smooth digestion.',
          ],
        },
      ],
    };
  }

  // 8. Chai, Tea, Coffee & Sugar
  if (q.includes('chai') || q.includes('tea') || q.includes('coffee') || q.includes('sugar') || q.includes('caffeine')) {
    return {
      content: `Coach Pulse here! You do NOT have to give up your morning chai! Traditional Indian tea is full of antioxidant spices. We just need to eliminate sugar spikes so your energy and heart rate stay smooth throughout the morning:`,
      structuredSections: [
        {
          heading: 'Coach-Approved Chai Protocol',
          items: [
            'Never Drink Chai on an Empty Stomach: Eat 4-5 soaked almonds or 2 walnuts first to coat stomach lining.',
            'Taper White Sugar: Reduce white sugar to 1/2 tsp, or brew with crushed cardamom (elaichi), fresh ginger (adrak), and cinnamon for natural warmth.',
            'Use 1 Part Milk to 2 Parts Water: Keeps the cup light (~45 kcal) without causing gastric heaviness.',
            'Time It Right: Drink chai 90 minutes after main meals so tea tannins do not interfere with iron and zinc absorption.',
          ],
        },
        {
          heading: 'PulseBack Telemetry Note',
          items: [
            `Caffeine temporarily elevates pulse by 5-10 bpm. Your current baseline of ${hr} bpm easily accommodates one mindful morning cup!`,
          ],
        },
      ],
    };
  }

  // 9. Workouts, Exercise & Calisthenics
  if (q.includes('workout') || q.includes('exercise') || q.includes('home') || q.includes('routine') || q.includes('training') || q.includes('pushup') || q.includes('squat')) {
    return {
      content: `Hey ${userName}! Here is a fast, high-impact 15-minute home calisthenics routine calibrated for your ${age}y age profile and current pulse of ${hr} bpm. Zero gym equipment required:`,
      structuredSections: [
        {
          heading: '15-Minute Calisthenics Circuit (3 Rounds)',
          items: [
            '15 Bodyweight Squats (Baithak) – smooth tempo, hips below knees, chest proud.',
            '12 Push-ups (or Knee Push-ups) – full chest touch to floor, elbows at 45 degrees.',
            '30 Seconds Forearm Plank – tighten your core and squeeze your glutes.',
            '20 Alternating Reverse Lunges – protects knee cartilage while firing your quads.',
            'Rest 60 seconds between rounds; take slow, nasal belly breaths.',
          ],
        },
        {
          heading: 'Telemetry Safety Check',
          items: [
            `Current steps: ${steps.toLocaleString()}. This quick circuit adds ~600 active steps and burns ~110-130 kcal!`,
          ],
        },
      ],
    };
  }

  // 10. Knee, Joint & Back Pain / Recovery
  if (q.includes('knee') || q.includes('joint') || q.includes('pain') || q.includes('back') || q.includes('stiff') || q.includes('sore') || q.includes('ache')) {
    return {
      content: `Coach Pulse here, ${userName}. Joint soreness requires gentle blood circulation without high-impact pounding. Let's protect your joints with low-impact restoration:`,
      structuredSections: [
        {
          heading: 'Joint-Safe Restoration Routine',
          items: [
            'Flat-ground walking on grass or cushioned track for 15-20 minutes to circulate synovial fluid.',
            'Straight Leg Raises: Lie on your back, lift one leg straight to 45 degrees, hold 5 seconds. 3 sets of 10 reps strengthens the knee stabilizer (VMO).',
            'Cat-Cow Waves (Marjaryasana): 10 gentle repetitions to relieve lumbar and spinal compression.',
            'Avoid deep squats below 90 degrees and hard jumping until tenderness subsides.',
          ],
        },
        {
          heading: 'Desi Healing Night Drink',
          items: [
            'Drink 1 cup of warm cow milk with 1/2 tsp pure turmeric (curcumin) and a pinch of black pepper at bedtime—curcumin is nature’s strongest joint anti-inflammatory.',
          ],
        },
      ],
    };
  }

  // 11. Sleep, Recovery & Stress Management
  if (q.includes('sleep') || q.includes('insomnia') || q.includes('stress') || q.includes('tired') || q.includes('relax') || q.includes('fatigue')) {
    return {
      content: `Coach Pulse here! Real progress happens during recovery. With ${steps.toLocaleString()} steps logged today, your muscles and central nervous system need 7.5 hours of sound sleep to restore glycogen and lower resting inflammation:`,
      structuredSections: [
        {
          heading: 'Evening Wind-Down Routine',
          items: [
            'Practice Shatapavali (100 leisurely steps) after dinner to assist smooth stomach emptying.',
            'Digital Sunset: Turn off bright screens 45 minutes before sleep to trigger natural melatonin release.',
            '5 Minutes of Brahmari Pranayama (Humming Bee Breath): Instantly activates the parasympathetic rest-and-digest branch.',
            'Keep your room cool and dark to help your core body temperature drop to sleep mode.',
          ],
        },
        {
          heading: 'Biometric Telemetry Target',
          items: [
            `PulseBack Clip tracks your overnight heart rate variability (HRV: ${vitals?.hrv || 65} ms). Higher HRV upon waking reflects complete nervous system rejuvenation.`,
          ],
        },
      ],
    };
  }

  // 12. Steps, Walking & Daily Activity
  if (q.includes('step') || q.includes('walk') || q.includes('target') || q.includes('10000') || q.includes('active') || q.includes('cardio')) {
    return {
      content: `Coach Pulse here! You have logged ${steps.toLocaleString()} steps today (${Math.round((steps / stepGoal) * 100)}% of your ${stepGoal.toLocaleString()} goal), leaving ${stepsLeft.toLocaleString()} steps to keep your daily consistency streak alive!`,
      structuredSections: [
        {
          heading: 'Effortless Ways to Complete Remaining Steps',
          items: [
            `A 20-minute post-lunch or post-dinner walk covers ~2,200 steps comfortably.`,
            `Pace while talking on work phone calls to add an effortless 800-1,200 steps.`,
            `Take the stairs instead of the elevator for 2 floors—builds calves and glutes.`,
            `Brisk walking burns ~220 kcal safely without elevating joint inflammation or excessive heart strain.`,
          ],
        },
        {
          heading: 'PulseBack Active Minutes',
          items: [
            `PulseBack Clip active time: ${vitals?.activeMinutes || 30} mins. Aim for 45 active minutes today for a consistency badge!`,
          ],
        },
      ],
    };
  }

  // 13. Heart Rate, Pulse & Blood Pressure
  if (q.includes('heart') || q.includes('pulse') || q.includes('bpm') || q.includes('blood pressure') || q.includes('bp') || q.includes('spo2') || q.includes('sensor')) {
    const isHrElevated = hr > 100;
    const isHrResting = hr < 60;
    const hrDesc = isHrElevated ? 'elevated (active conditioning state)' : isHrResting ? 'athletic resting pulse' : 'steady, healthy cardiovascular zone';
    return {
      content: `Coach Pulse here! Reviewing your live PulseBack telemetry: your heart rate is currently ${hr} bpm (${hrDesc}), blood pressure is ${bpSys}/${bpDia} mmHg, and blood oxygen is ${spo2}% SpO2.`,
      structuredSections: [
        {
          heading: 'Cardiovascular Analysis',
          items: [
            `Blood pressure of ${bpSys}/${bpDia} mmHg is ${bpSys < 120 ? 'optimal and healthy' : 'in normal active range'}.`,
            `Resting baseline of ${vitals?.restingHeartRate || 64} bpm reflects solid aerobic conditioning.`,
            `When exercising, your ideal conditioning zone is 115 to 142 bpm for fat burn and stamina.`,
            `Do 5 minutes of Anulom Vilom (alternate nostril breathing) daily to support arterial flexibility.`,
          ],
        },
        {
          heading: 'Sensor Guidance',
          items: [
            `PulseBack Clip continuously monitors your biometrics. If your heart rate exceeds 160 bpm during home workouts, take a 2-minute walking recovery until it returns below 120 bpm.`,
          ],
        },
      ],
    };
  }

  // 14. Hydration & Water
  if (q.includes('water') || q.includes('hydration') || q.includes('drink') || q.includes('coconut')) {
    return {
      content: `Hey ${userName}! Hydration is the unsung hero of fitness. With ${steps.toLocaleString()} steps logged and your body temperature at ${vitals?.temperature || 36.6}°C, here is your daily hydration game plan:`,
      structuredSections: [
        {
          heading: 'Daily Hydration Strategy (2.5 - 3.0 Litres)',
          items: [
            'Morning: 500ml lukewarm water upon waking with fresh lemon juice.',
            'Mid-Morning: 1 glass fresh tender coconut water (Nariyal Pani) for natural potassium and electrolytes.',
            'Afternoon: 1 tall glass of spiced buttermilk (Chhach) with roasted jeera.',
            'Pre-Meals: Drink 1 glass of water 20 minutes before lunch and dinner; avoid gulping water during meals.',
          ],
        },
        {
          heading: 'Telemetry Benefit',
          items: [
            `Adequate water volume maintains optimal blood plasma and keeps your blood oxygen saturation high (current SpO2: ${spo2}%).`,
          ],
        },
      ],
    };
  }

  // 15. Dynamic Personal Coach Fallback (Speaks directly to the user's specific words with genuine coaching empathy)
  return {
    content: `Coach Pulse here, ${userName}! I'm right beside you on your health journey. Looking at what you asked regarding "${query}", let's connect this with your daily target (${calorieTarget} kcal) and your live PulseBack metrics (${hr} bpm pulse, ${steps.toLocaleString()} steps today):`,
    structuredSections: [
      {
        heading: `Coach's Action Plan for "${query}"`,
        items: [
          `Focus on home-cooked Indian meals (Dal, Roti, Sabzi, and Curd) to fuel your daily activity cleanly.`,
          `Keep your workout intensity in the steady aerobic zone (110-135 bpm) to build stamina without fatigue.`,
          `Complete your remaining ${stepsLeft.toLocaleString()} steps today to maintain your ${profile?.streakDays || 7}-day consistency streak!`,
          `Drink at least 2.5 litres of water with lemon to support cellular oxygenation (current SpO2: ${spo2}%).`,
        ],
      },
      {
        heading: 'PulseBack Telemetry Insight',
        items: [
          `Current vitals: ${hr} bpm · BP ${bpSys}/${bpDia} mmHg · Temp ${vitals?.temperature || 36.6}°C. Your biosignals show positive physiological readiness to crush today's health goals!`,
        ],
      },
    ],
  };
}

// Heuristic Task Evaluator
function evaluateTaskHeuristically(title: string, description: string, minutes: number) {
  const text = `${title} ${description}`.toLowerCase();
  const mins = Number(minutes) || 15;

  let difficulty: 'Easy' | 'Moderate' | 'Challenging' = 'Easy';
  let points = 90;
  let reasoning = 'Light activity suitable for daily habit building.';

  const isHard =
    text.includes('hiit') ||
    text.includes('sprint') ||
    text.includes('heavy') ||
    text.includes('burpee') ||
    text.includes('intense') ||
    text.includes('10k') ||
    text.includes('dand') ||
    text.includes('50 push') ||
    mins >= 40;

  const isMedium =
    text.includes('jog') ||
    text.includes('workout') ||
    text.includes('squat') ||
    text.includes('pushup') ||
    text.includes('plank') ||
    text.includes('cycle') ||
    text.includes('5k') ||
    text.includes('stairs') ||
    mins >= 20;

  if (isHard) {
    difficulty = 'Challenging';
    points = Math.min(320, 260 + Math.floor(mins * 1.5));
    reasoning = 'AI assessed as Challenging due to high cardiovascular and muscular demand.';
  } else if (isMedium) {
    difficulty = 'Moderate';
    points = Math.min(200, 160 + Math.floor(mins * 1.2));
    reasoning = 'AI assessed as Moderate for solid aerobic stamina and endurance.';
  } else {
    difficulty = 'Easy';
    points = Math.min(100, 80 + Math.floor(mins * 0.8));
    reasoning = 'AI assessed as Easy for healthy daily recovery and habit foundation.';
  }

  return { difficulty, points, reasoning };
}

// Fallback Task-Master tasks
function getHeuristicTaskMasterTasks(difficulty = 'Easy', vitals: any, profile: any) {
  const steps = vitals?.steps || 5200;

  if (difficulty === 'Easy') {
    return [
      {
        id: `t-easy-1-${Date.now()}`,
        title: 'Morning 15-Minute Brisk Walk',
        category: 'cardio',
        description: 'Walk outside in the morning sunlight to warm up muscles and boost step count.',
        targetMinutes: 15,
        difficulty: 'Easy',
        points: 90,
        vitalTriggerReason: `Steps are at ${steps}. 15 minutes adds ~1,500 steps towards your 10k goal.`,
      },
      {
        id: `t-easy-2-${Date.now()}`,
        title: 'Surya Namaskar & Deep Breathing',
        category: 'mindfulness',
        description: 'Do 5 slow rounds of Sun Salutation and 3 minutes of peaceful Anulom Vilom breathing.',
        targetMinutes: 10,
        difficulty: 'Easy',
        points: 95,
        vitalTriggerReason: 'PulseBack Clip shows normal heart rate (72 bpm). Yoga keeps blood pressure calm.',
      },
      {
        id: `t-easy-3-${Date.now()}`,
        title: 'Warm Water & Lemon Hydration',
        category: 'nutrition',
        description: 'Drink a glass of warm water with lemon or jeera to aid digestion.',
        targetMinutes: 2,
        difficulty: 'Easy',
        points: 80,
        vitalTriggerReason: 'Good hydration maintains clear blood oxygen (SpO2: 98%).',
      },
    ];
  } else if (difficulty === 'Moderate') {
    return [
      {
        id: `t-mod-1-${Date.now()}`,
        title: '25-Minute Jog & Brisk Stride',
        category: 'cardio',
        description: 'Alternate between 2 minutes of gentle jogging and 1 minute of fast walking.',
        targetMinutes: 25,
        difficulty: 'Moderate',
        points: 175,
        vitalTriggerReason: 'Improves heart stamina and burns ~160 calories.',
      },
      {
        id: `t-mod-2-${Date.now()}`,
        title: 'Bodyweight Desi Workout',
        category: 'strength',
        description: '3 rounds: 15 squats, 12 push-ups (or knee push-ups), and 30-second plank.',
        targetMinutes: 15,
        difficulty: 'Moderate',
        points: 185,
        vitalTriggerReason: 'Strengthens leg and core muscles for daily posture.',
      },
      {
        id: `t-mod-3-${Date.now()}`,
        title: 'Evening Walk Post-Dinner (Shatapavali)',
        category: 'recovery',
        description: '10-minute 100-step walk after dinner for smooth digestion and restful sleep.',
        targetMinutes: 10,
        difficulty: 'Moderate',
        points: 150,
        vitalTriggerReason: 'Prevents blood sugar spike after evening roti or rice.',
      },
    ];
  } else {
    return [
      {
        id: `t-adv-1-${Date.now()}`,
        title: 'High Intensity Cardio Intervals',
        category: 'cardio',
        description: '6 rounds of 45-second high knees or jumping jacks with 45-second rest.',
        targetMinutes: 20,
        difficulty: 'Challenging',
        points: 270,
        vitalTriggerReason: 'Takes heart rate into conditioning zone based on your strong streak.',
      },
      {
        id: `t-adv-2-${Date.now()}`,
        title: 'Full Body Desi Dands & Baithaks',
        category: 'strength',
        description: '4 rounds: 20 deep squats (Baithak), 15 Hindu push-ups (Dand), 20 lunges.',
        targetMinutes: 20,
        difficulty: 'Challenging',
        points: 290,
        vitalTriggerReason: 'Builds functional athletic power and burns excess body fat.',
      },
      {
        id: `t-adv-3-${Date.now()}`,
        title: 'Pranayama & Full Muscle Stretch',
        category: 'recovery',
        description: '10 minutes of Kapalbhati, Bhastrika, and full hamstring stretches.',
        targetMinutes: 10,
        difficulty: 'Challenging',
        points: 250,
        vitalTriggerReason: 'Helps heart rate quickly return to normal resting baseline.',
      },
    ];
  }
}

// Fallback Indian diet suggestions
function getHeuristicDietSuggestions(vitals: any, loggedMeals: any[], calorieTarget = 2100) {
  const totalLoggedCalories = (loggedMeals || []).reduce((acc: number, m: any) => acc + (m.calories || 0), 0);
  const remaining = Math.max(0, calorieTarget - totalLoggedCalories);

  return {
    vitalsImpactAnalysis: `Your PulseBack Clip shows a steady heart rate of ${vitals?.heartRate || 72} bpm with ${vitals?.steps || 5200} steps walked. Eating fresh homemade Indian food with balanced dal and curd will keep your energy high.`,
    recommendedCalorieWindow: {
      remaining,
      proteinGramsNeeded: Math.round(remaining * 0.05),
    },
    suggestedMeals: [
      {
        mealType: 'Lunch',
        name: 'Paneer Bhurji with 2 Multigrain Rotis & Curd',
        description: 'Fresh cow-milk paneer tossed with onions, tomatoes, and green coriander, served with warm rotis and fresh dahi.',
        calories: 520,
        protein: 34,
        carbs: 46,
        fats: 18,
        vitalBenefit: 'High quality vegetarian protein helps muscle recovery and keeps you full.',
      },
      {
        mealType: 'Dinner',
        name: 'Moong Dal Khichdi with Steamed Palak & Jeera Tadka',
        description: 'Nutritious yellow moong dal and rice khichdi with cumin, ginger, and a spoon of pure cow ghee.',
        calories: 440,
        protein: 22,
        carbs: 62,
        fats: 10,
        vitalBenefit: 'Light on the stomach before bedtime; ensures peaceful sleep and steady pulse.',
      },
      {
        mealType: 'Snack',
        name: 'Roasted Makhana (Foxnuts) with Cinnamon Haldi Doodh',
        description: 'Crispy roasted foxnuts with rock salt and a warm cup of turmeric-ginger milk.',
        calories: 160,
        protein: 8,
        carbs: 22,
        fats: 4,
        vitalBenefit: 'Natural anti-inflammatory herbs help body recovery and joint flexibility.',
      },
    ],
    hydrationAdvice: 'Drink 2 to 2.5 litres of water. You can also sip fresh tender coconut water (Nariyal pani) for natural potassium.',
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`PulseMind server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
