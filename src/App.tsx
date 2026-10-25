import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  UserProfile,
  VitalMetrics,
  TaskItem,
  MealItem,
  DietPlan,
  RewardBadge,
  GiftCard,
  MotivationalPost,
  ChatMessage,
  AppScreen,
  TaskDifficulty,
} from './types';
import {
  DEFAULT_PROFILE,
  DEFAULT_VITALS,
  DEFAULT_TASKS,
  DEFAULT_MEALS,
  DEFAULT_DIET_PLAN,
  DEFAULT_BADGES,
  DEFAULT_GIFT_CARDS,
  DEFAULT_POSTS,
  INITIAL_CHAT_MESSAGES,
  loadFromStorage,
  saveToStorage,
  getCachedChatResponse,
  setCachedChatResponse,
} from './services/storage';
import { ThemeProvider } from './context/ThemeContext';
import { AndroidFrame } from './components/AndroidFrame';
import { HomeScreen } from './components/HomeScreen';
import { VitalsScreen } from './components/VitalsScreen';
import { DietScreen } from './components/DietScreen';
import { TaskMasterScreen } from './components/TaskMasterScreen';
import { RewardsScreen } from './components/RewardsScreen';
import { PostsScreen } from './components/PostsScreen';
import { FitnessChatModal } from './components/FitnessChatModal';
import { ProfileModal } from './components/ProfileModal';
import { ApkModal } from './components/ApkModal';
import { GoogleHealthModal } from './components/GoogleHealthModal';

export default function App() {
  // App State initialized from persistent local storage
  const [profile, setProfile] = useState<UserProfile>(() =>
    loadFromStorage('profile', DEFAULT_PROFILE)
  );
  const [vitals, setVitals] = useState<VitalMetrics>(() =>
    loadFromStorage('vitals', DEFAULT_VITALS)
  );
  const [tasks, setTasks] = useState<TaskItem[]>(() =>
    loadFromStorage('tasks', DEFAULT_TASKS)
  );
  const [loggedMeals, setLoggedMeals] = useState<MealItem[]>(() =>
    loadFromStorage('logged_meals', DEFAULT_MEALS)
  );
  const [dietPlan, setDietPlan] = useState<DietPlan>(() =>
    loadFromStorage('diet_plan', DEFAULT_DIET_PLAN)
  );
  const [badges, setBadges] = useState<RewardBadge[]>(() =>
    loadFromStorage('badges', DEFAULT_BADGES)
  );
  const [giftCards, setGiftCards] = useState<GiftCard[]>(() =>
    loadFromStorage('gift_cards', DEFAULT_GIFT_CARDS)
  );
  const [posts, setPosts] = useState<MotivationalPost[]>(() =>
    loadFromStorage('posts', DEFAULT_POSTS)
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    loadFromStorage('chat_messages', INITIAL_CHAT_MESSAGES)
  );
  const [userPoints, setUserPoints] = useState<number>(() =>
    loadFromStorage('user_points', 1450)
  );
  const [streakDays, setStreakDays] = useState<number>(() =>
    loadFromStorage('streak_days', 7)
  );
  const [activeDifficulty, setActiveDifficulty] = useState<TaskDifficulty>(() =>
    loadFromStorage('active_difficulty', 'Easy')
  );

  // Navigation and UI state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [isFramed, setIsFramed] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);
  const [showGoogleHealthModal, setShowGoogleHealthModal] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [launchKey, setLaunchKey] = useState(1);

  // Auto-save changes to localStorage
  useEffect(() => {
    saveToStorage('profile', profile);
  }, [profile]);

  useEffect(() => {
    saveToStorage('vitals', vitals);
  }, [vitals]);

  useEffect(() => {
    saveToStorage('tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage('logged_meals', loggedMeals);
  }, [loggedMeals]);

  useEffect(() => {
    saveToStorage('diet_plan', dietPlan);
  }, [dietPlan]);

  useEffect(() => {
    saveToStorage('badges', badges);
  }, [badges]);

  useEffect(() => {
    saveToStorage('gift_cards', giftCards);
  }, [giftCards]);

  useEffect(() => {
    saveToStorage('posts', posts);
  }, [posts]);

  useEffect(() => {
    saveToStorage('chat_messages', chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    saveToStorage('user_points', userPoints);
  }, [userPoints]);

  useEffect(() => {
    saveToStorage('streak_days', streakDays);
  }, [streakDays]);

  useEffect(() => {
    saveToStorage('active_difficulty', activeDifficulty);
  }, [activeDifficulty]);

  // Periodic sensor pulse simulation (only if PulseBack Clip is connected)
  useEffect(() => {
    if (!vitals.isConnected) return;
    const pulseTimer = setInterval(() => {
      setVitals((prev) => {
        if (!prev.isConnected) return prev;
        const jitter = Math.floor(Math.random() * 3) - 1;
        const newHr = Math.max(50, Math.min(160, prev.heartRate + jitter));
        return {
          ...prev,
          heartRate: newHr,
          steps: prev.steps + Math.floor(Math.random() * 3),
        };
      });
    }, 4000);
    return () => clearInterval(pulseTimer);
  }, [vitals.isConnected]);

  // Handlers
  const handleToggleSensorConnection = () => {
    setVitals((prev) => ({
      ...prev,
      isConnected: !prev.isConnected,
      lastSyncTime: !prev.isConnected ? 'Just now' : prev.lastSyncTime,
    }));
  };

  const handleConnectGoogleHealth = () => {
    setVitals((prev) => ({
      ...prev,
      isConnected: true,
      googleHealthConnected: true,
      connectionSource: 'google_health',
      googleHealthLastSync: 'Just now',
      lastSyncTime: 'Just now',
    }));
  };

  const handleDisconnectGoogleHealth = () => {
    setVitals((prev) => ({
      ...prev,
      googleHealthConnected: false,
      connectionSource: 'direct_clip',
    }));
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          // Rule: Once a task is completed, do not allow undoing
          if (t.completed) {
            return t;
          }
          setUserPoints((pts) => pts + t.points);
          // Check Task-Master badge progression
          setBadges((badgeList) =>
            badgeList.map((b) => {
              if (b.id === 'b4') {
                const nextP = b.currentProgress + 1;
                return {
                  ...b,
                  currentProgress: nextP,
                  unlocked: nextP >= b.maxProgress ? true : b.unlocked,
                };
              }
              return b;
            })
          );
          return {
            ...t,
            completed: true,
            completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return t;
      })
    );
  };

  const handleLoadMoreTasks = (difficulty: TaskDifficulty) => {
    const timestamp = Date.now();
    const moreTasks: TaskItem[] = [
      {
        id: `task-${difficulty.toLowerCase()}-batch2-1-${timestamp}`,
        title:
          difficulty === 'Easy'
            ? 'Evening Sunset Walk & Deep Inhales'
            : difficulty === 'Moderate'
            ? 'Tempo Jog & High Knee Drills'
            : 'Sprint Tabata Intervals (All-Out)',
        category: 'cardio',
        description:
          difficulty === 'Easy'
            ? 'Walk 15 minutes in fresh air with rhythmic breathing to unwind daily stress.'
            : difficulty === 'Moderate'
            ? '25-minute steady jog interspersed with 3 sets of 30s high knees.'
            : '8 rounds of 20s maximal sprint and 10s rest to elevate anaerobic threshold.',
        targetMinutes: difficulty === 'Easy' ? 15 : difficulty === 'Moderate' ? 25 : 20,
        difficulty,
        points: difficulty === 'Easy' ? 95 : difficulty === 'Moderate' ? 185 : 295,
        vitalTriggerReason: `Bonus mission calibrated to your active heart rate (${vitals.heartRate} bpm).`,
        completed: false,
      },
      {
        id: `task-${difficulty.toLowerCase()}-batch2-2-${timestamp}`,
        title:
          difficulty === 'Easy'
            ? 'Gentle Spine & Hamstring Asanas'
            : difficulty === 'Moderate'
            ? 'Core Power Planks & Russian Twists'
            : 'Desi Akhada Dands & Baithaks (Round 2)',
        category: 'strength',
        description:
          difficulty === 'Easy'
            ? 'Hold Cobra Pose and seated forward bend for 8 relaxing minutes.'
            : difficulty === 'Moderate'
            ? '3 rounds: 45s forearm plank, 20 Russian twists, and 15 leg raises.'
            : '40 Hindu squats (Baithaks) and 25 Hindu push-ups (Dands).',
        targetMinutes: difficulty === 'Easy' ? 10 : difficulty === 'Moderate' ? 15 : 20,
        difficulty,
        points: difficulty === 'Easy' ? 90 : difficulty === 'Moderate' ? 180 : 300,
        vitalTriggerReason: `Muscular conditioning while blood pressure reads ${vitals.bpSys}/${vitals.bpDia} mmHg.`,
        completed: false,
      },
      {
        id: `task-${difficulty.toLowerCase()}-batch2-3-${timestamp}`,
        title:
          difficulty === 'Easy'
            ? 'Electrolyte Lemon Water & Relaxation'
            : difficulty === 'Moderate'
            ? 'Coconut Water Hydration (Nariyal Pani)'
            : 'Post-Workout Cool Down & Shavasana',
        category: 'recovery',
        description:
          difficulty === 'Easy'
            ? 'Drink 500ml water with a pinch of rock salt and lemon to hydrate cells.'
            : difficulty === 'Moderate'
            ? 'Drink fresh tender coconut water to restore natural potassium levels.'
            : 'Lie flat in Shavasana for 8 minutes to bring heart rate back to baseline.',
        targetMinutes: difficulty === 'Easy' ? 5 : difficulty === 'Moderate' ? 8 : 10,
        difficulty,
        points: difficulty === 'Easy' ? 80 : difficulty === 'Moderate' ? 160 : 260,
        vitalTriggerReason: `Resting recovery to help stabilize body temperature (${vitals.temperature}°C).`,
        completed: false,
      },
    ];

    setTasks((prev) => [...prev, ...moreTasks]);
  };

  const handleStartNewChat = () => {
    const remainingSteps = Math.max(0, vitals.stepGoal - vitals.steps);
    const freshGreeting: ChatMessage = {
      id: `bot-fresh-${Date.now()}`,
      role: 'assistant',
      content: `Namaste ${profile.name}! Coach Pulse here. I'm ready for our fresh session! Checking your live PulseBack telemetry: Heart Rate is ${vitals.heartRate} bpm (${vitals.currentMode}), Blood Pressure is ${vitals.bpSys}/${vitals.bpDia} mmHg, and you have logged ${vitals.steps.toLocaleString()} steps today. What fitness or Indian nutrition guidance do you need?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      structuredSections: [
        {
          heading: 'Coaching Topics Calibrated For You',
          items: [
            'Any breakfast tips for low calorie Indian meals',
            `How to complete my remaining ${remainingSteps.toLocaleString()} steps today`,
            '15-minute calisthenics routine without gym equipment',
            'Best high-protein vegetarian Indian foods for dinner',
          ],
        },
      ],
    };
    setChatMessages([freshGreeting]);
    saveToStorage('chat_messages', [freshGreeting]);
  };

  const handleAddMeal = (mealData: Omit<MealItem, 'id' | 'time'>) => {
    const newMeal: MealItem = {
      ...mealData,
      id: `m-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updatedMeals = [newMeal, ...loggedMeals];
    setLoggedMeals(updatedMeals);

    const totalCals = updatedMeals.reduce((acc, m) => acc + m.calories, 0);
    const remaining = Math.max(0, profile.dailyCalorieTarget - totalCals);
    setDietPlan((prev) => ({
      ...prev,
      recommendedCalorieWindow: {
        remaining,
        proteinGramsNeeded: Math.max(10, Math.round(remaining * 0.05)),
      },
    }));

    // Update nutrition badge
    setBadges((badgeList) =>
      badgeList.map((b) => {
        if (b.id === 'b3' && !b.unlocked) {
          const nextProg = b.currentProgress + 1;
          return {
            ...b,
            currentProgress: nextProg,
            unlocked: nextProg >= b.maxProgress,
          };
        }
        return b;
      })
    );
  };

  const handleDeleteMeal = (mealId: string) => {
    const updated = loggedMeals.filter((m) => m.id !== mealId);
    setLoggedMeals(updated);
    const totalCals = updated.reduce((acc, m) => acc + m.calories, 0);
    const remaining = Math.max(0, profile.dailyCalorieTarget - totalCals);
    setDietPlan((prev) => ({
      ...prev,
      recommendedCalorieWindow: {
        remaining,
        proteinGramsNeeded: Math.max(10, Math.round(remaining * 0.05)),
      },
    }));
  };

  const handleRedeemGiftCard = (cardId: string) => {
    const card = giftCards.find((c) => c.id === cardId);
    if (!card || userPoints < card.pointsRequired) return;

    setUserPoints((pts) => pts - card.pointsRequired);
    setGiftCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              redeemed: true,
              redeemedAt: new Date().toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              }),
            }
          : c
      )
    );
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddPost = (
    postData: Omit<MotivationalPost, 'id' | 'likesCount' | 'isLiked' | 'timeAgo'>
  ) => {
    const newPost: MotivationalPost = {
      ...postData,
      id: `post-${Date.now()}`,
      likesCount: 1,
      isLiked: true,
      timeAgo: 'Just now',
    };
    setPosts([newPost, ...posts]);
  };

  const handleSendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Check fast cache first for 0ms immediate response
    const cached = getCachedChatResponse(text);
    if (cached) {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: cached.content || 'Here is your personalized fitness guidance.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredSections: cached.structuredSections || [],
      };
      setChatMessages((prev) => [...prev, botMsg]);
      return;
    }

    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/fitness-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatMessages,
          vitals,
          profile,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Save to client cache for next time
        setCachedChatResponse(text, data);

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.content || 'Here is your personalized fitness guidance.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          structuredSections: data.structuredSections || [],
        };
        setChatMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('Chat API returned error');
      }
    } catch (err) {
      console.warn('Chat error fallback:', err);
      // Use client-side smart cache check or fallback coach response
      const cached = getCachedChatResponse(text);
      if (cached) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: cached.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          structuredSections: cached.structuredSections,
        };
        setChatMessages((prev) => [...prev, botMsg]);
      } else {
        const remainingSteps = Math.max(0, vitals.stepGoal - vitals.steps);
        const fallbackMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: `Coach Pulse here, ${profile.name}! I'm with you on every step of your health journey. Looking at "${text}" through your live PulseBack telemetry (${vitals.heartRate} bpm pulse, ${vitals.steps.toLocaleString()} steps today):`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          structuredSections: [
            {
              heading: `Coach's Action Plan for "${text}"`,
              items: [
                `Prioritize home-cooked Indian meals within your daily calorie window to fuel your metabolism cleanly.`,
                `Keep your workout pulse in the steady aerobic zone (110-135 bpm) to build stamina without fatigue.`,
                `Log the remaining ${remainingSteps.toLocaleString()} steps with a brisk 20-minute walk to keep your streak unbroken!`,
                `Drink at least 2.5 litres of water with lemon to support cellular oxygenation (SpO2: ${vitals.spo2}%).`,
              ],
            },
            {
              heading: 'PulseBack Telemetry Insight',
              items: [
                `Your biosignals reflect a stable ${vitals.currentMode.toLowerCase()} state. Your body is primed for today's health goals!`,
              ],
            },
          ],
        };
        setChatMessages((prev) => [...prev, fallbackMsg]);
      }
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleClearChatHistory = () => {
    setChatMessages(INITIAL_CHAT_MESSAGES);
    saveToStorage('chat_messages', INITIAL_CHAT_MESSAGES);
  };

  const handleSimulateVitalsMode = (
    mode: 'Normal' | 'Active Cardio' | 'Resting Recovery'
  ) => {
    let newHr = 72;
    let newBpSys = 118;
    let newBpDia = 76;
    let newTemp = 36.6;
    let newSpo2 = 98;
    let newSteps = vitals.steps;
    let newActiveMins = vitals.activeMinutes;

    if (mode === 'Active Cardio') {
      newHr = 132;
      newBpSys = 134;
      newBpDia = 84;
      newTemp = 37.2;
      newSpo2 = 97;
      newSteps += 1400;
      newActiveMins += 20;
    } else if (mode === 'Resting Recovery') {
      newHr = 58;
      newBpSys = 112;
      newBpDia = 72;
      newTemp = 36.4;
      newSpo2 = 99;
    }

    setVitals((prev) => ({
      ...prev,
      currentMode: mode,
      heartRate: newHr,
      bpSys: newBpSys,
      bpDia: newBpDia,
      temperature: newTemp,
      spo2: newSpo2,
      steps: newSteps,
      activeMinutes: newActiveMins,
      lastSyncTime: 'Just now',
    }));

    if (mode === 'Active Cardio') {
      setDietPlan((prev) => ({
        ...prev,
        vitalsImpactAnalysis:
          'PulseBack Clip recorded elevated heart rate (132 bpm) and workout activity. Drink fresh coconut water (Nariyal pani) or lemon electrolyte water to stay hydrated.',
        hydrationAdvice:
          'Drink 750ml water or coconut water over the next 2 hours.',
      }));
    } else if (mode === 'Resting Recovery') {
      setDietPlan((prev) => ({
        ...prev,
        vitalsImpactAnalysis:
          'Heart rate has relaxed to 58 bpm. Ideal window for light warm turmeric milk (Haldi doodh) or herbal jeera tea before bedtime.',
        hydrationAdvice:
          'Sip a cup of warm water or herbal infusion.',
      }));
    } else {
      setDietPlan((prev) => ({
        ...prev,
        vitalsImpactAnalysis:
          'PulseBack Clip shows a steady resting pulse of 72 bpm. Stick to home cooked dal, roti, and fresh curd for balanced daily energy.',
        hydrationAdvice:
          'Drink 500ml clean water between your meals.',
      }));
    }
  };

  const getLocalTierTasks = (tier: TaskDifficulty): TaskItem[] => {
    const timestamp = Date.now();
    if (tier === 'Easy') {
      return [
        {
          id: `task-easy-1-${timestamp}`,
          title: 'Morning 15-Minute Brisk Walk',
          category: 'cardio',
          description: 'Walk outside in the morning sunlight to warm up muscles and boost step count.',
          targetMinutes: 15,
          difficulty: 'Easy',
          points: 85,
          vitalTriggerReason: `PulseBack Clip steps at ${vitals.steps}. 15 mins adds ~1,500 steps towards 10k goal.`,
          completed: false,
        },
        {
          id: `task-easy-2-${timestamp}`,
          title: 'Surya Namaskar & Deep Breathing',
          category: 'mindfulness',
          description: 'Do 5 slow rounds of Sun Salutation and 3 minutes of peaceful Anulom Vilom breathing.',
          targetMinutes: 10,
          difficulty: 'Easy',
          points: 95,
          vitalTriggerReason: `PulseBack Clip shows normal heart rate (${vitals.heartRate} bpm). Yoga keeps blood pressure calm.`,
          completed: false,
        },
        {
          id: `task-easy-3-${timestamp}`,
          title: 'Warm Water & Lemon Hydration',
          category: 'nutrition',
          description: 'Drink a glass of warm water with lemon or jeera to aid digestion.',
          targetMinutes: 2,
          difficulty: 'Easy',
          points: 75,
          vitalTriggerReason: `Good hydration maintains clear blood oxygen (SpO2: ${vitals.spo2}%).`,
          completed: false,
        },
      ];
    } else if (tier === 'Moderate') {
      return [
        {
          id: `task-mod-1-${timestamp}`,
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
          id: `task-mod-2-${timestamp}`,
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
          id: `task-mod-3-${timestamp}`,
          title: 'Evening Walk Post-Dinner (Shatapavali)',
          category: 'recovery',
          description: '10-minute 100-step walk after dinner for smooth digestion and light sleep.',
          targetMinutes: 10,
          difficulty: 'Moderate',
          points: 150,
          vitalTriggerReason: 'Prevents blood sugar spike after evening roti or rice.',
          completed: false,
        },
      ];
    } else {
      return [
        {
          id: `task-adv-1-${timestamp}`,
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
          id: `task-adv-2-${timestamp}`,
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
          id: `task-adv-3-${timestamp}`,
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
    }
  };

  const handleRegenerateTasks = async (difficultyOverride?: TaskDifficulty) => {
    const targetDiff = difficultyOverride || activeDifficulty;
    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/ai/taskmaster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          vitals,
          currentStreak: streakDays,
          completedTasksCount: tasks.filter((t) => t.completed).length,
          activeDifficulty: targetDiff,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.tasks && Array.isArray(data.tasks) && data.tasks.length > 0) {
          const freshTasks = data.tasks.map((t: any, idx: number) => ({
            id: t.id || `task-ai-${Date.now()}-${idx}`,
            title: t.title || 'Daily Healthy Action',
            category: t.category || 'cardio',
            description: t.description || 'Task prescribed by Task-Master.',
            targetMinutes: t.targetMinutes || 15,
            difficulty: (t.difficulty as TaskDifficulty) || targetDiff,
            points: t.points || (targetDiff === 'Easy' ? 90 : targetDiff === 'Moderate' ? 175 : 270),
            vitalTriggerReason:
              t.vitalTriggerReason || `Calibrated to ${vitals.heartRate} bpm pulse.`,
            completed: false,
          }));

          // Preserve all completed tasks, all custom tasks, and tasks from other tiers!
          setTasks((prev) => {
            const preserved = prev.filter(
              (t) => t.completed || t.isCustom || t.difficulty !== targetDiff
            );
            return [...freshTasks, ...preserved];
          });
        }
      }
    } catch (err) {
      console.warn('Task regeneration notice:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleRegenerateDietPlan = async () => {
    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/ai/diet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          vitals,
          loggedMeals,
          calorieTarget: profile.dailyCalorieTarget,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.suggestedMeals || data.vitalsImpactAnalysis) {
          setDietPlan({
            vitalsImpactAnalysis:
              data.vitalsImpactAnalysis ||
              `Adaptive meal planning based on ${vitals.heartRate} bpm pulse telemetry.`,
            recommendedCalorieWindow: data.recommendedCalorieWindow || {
              remaining: 1200,
              proteinGramsNeeded: 60,
            },
            suggestedMeals: data.suggestedMeals || dietPlan.suggestedMeals,
            hydrationAdvice:
              data.hydrationAdvice ||
              'Drink 2 to 2.5 litres of water through the day.',
          });
        }
      }
    } catch (err) {
      console.warn('Diet regeneration error:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleReplayLaunchAnimation = () => {
    setCurrentScreen('home');
    setLaunchKey((k) => k + 1);
  };

  return (
    <ThemeProvider>
      <AndroidFrame
        isFramed={isFramed}
        onToggleFrame={() => setIsFramed(!isFramed)}
        onOpenApkModal={() => setShowApkModal(true)}
        onReplayLaunchAnimation={handleReplayLaunchAnimation}
      >
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <HomeScreen
              key={`home-${launchKey}`}
              launchKey={launchKey}
              profile={profile}
              vitals={vitals}
              tasks={tasks}
              loggedMeals={loggedMeals}
              userPoints={userPoints}
              streakDays={streakDays}
              onNavigate={(screen) => {
                if (screen === 'profile') {
                  setShowProfileModal(true);
                } else if (screen === 'chat') {
                  setShowChatModal(true);
                } else {
                  setCurrentScreen(screen);
                }
              }}
              onToggleTask={handleToggleTask}
              onToggleSensorConnection={handleToggleSensorConnection}
              onOpenGoogleHealthModal={() => setShowGoogleHealthModal(true)}
              onOpenChat={() => setShowChatModal(true)}
              onSimulateVitalsMode={handleSimulateVitalsMode}
            />
          )}

          {currentScreen === 'vitals' && (
            <VitalsScreen
              key="vitals"
              vitals={vitals}
              profile={profile}
              onBack={() => setCurrentScreen('home')}
              onRefreshVitals={() => {
                setVitals((v) => ({
                  ...v,
                  lastSyncTime: 'Just now',
                  heartRate: v.heartRate + (Math.random() > 0.5 ? 1 : -1),
                }));
              }}
              onToggleSensorConnection={handleToggleSensorConnection}
              onSimulateMode={handleSimulateVitalsMode}
            />
          )}

          {currentScreen === 'diet' && (
            <DietScreen
              key="diet"
              profile={profile}
              vitals={vitals}
              loggedMeals={loggedMeals}
              dietPlan={dietPlan}
              onBack={() => setCurrentScreen('home')}
              onAddMeal={handleAddMeal}
              onDeleteMeal={handleDeleteMeal}
              onRegenerateDietPlan={handleRegenerateDietPlan}
              isLoadingAI={isLoadingAI}
            />
          )}

          {currentScreen === 'taskmaster' && (
            <TaskMasterScreen
              key="taskmaster"
              profile={profile}
              vitals={vitals}
              tasks={tasks}
              streakDays={streakDays}
              activeDifficulty={activeDifficulty}
              onBack={() => setCurrentScreen('home')}
              onToggleTask={handleToggleTask}
              onLoadMoreTasks={handleLoadMoreTasks}
              onAddTask={(newTask) => {
                setTasks((prev) => [
                  { ...newTask, id: `task-${Date.now()}`, completed: false, isCustom: true },
                  ...prev,
                ]);
              }}
              onChangeDifficulty={(diff) => {
                setActiveDifficulty(diff);
              }}
            />
          )}

          {currentScreen === 'rewards' && (
            <RewardsScreen
              key="rewards"
              userPoints={userPoints}
              streakDays={streakDays}
              badges={badges}
              giftCards={giftCards}
              onBack={() => setCurrentScreen('home')}
              onRedeemGiftCard={handleRedeemGiftCard}
            />
          )}

          {currentScreen === 'posts' && (
            <PostsScreen
              key="posts"
              posts={posts}
              onBack={() => setCurrentScreen('home')}
              onLikePost={handleLikePost}
              onAddPost={handleAddPost}
            />
          )}
        </AnimatePresence>

        {/* Profile Modal */}
        <AnimatePresence>
          {showProfileModal && (
            <ProfileModal
              profile={profile}
              vitals={vitals}
              onSaveProfile={(updated) => setProfile(updated)}
              onClose={() => setShowProfileModal(false)}
            />
          )}
        </AnimatePresence>

        {/* Fitness AI Chatbot Modal */}
        <AnimatePresence>
          {showChatModal && (
            <FitnessChatModal
              messages={chatMessages}
              vitals={vitals}
              profile={profile}
              onSendMessage={handleSendChatMessage}
              onClearHistory={handleClearChatHistory}
              onStartNewChat={handleStartNewChat}
              isLoading={isChatLoading}
              onClose={() => setShowChatModal(false)}
            />
          )}
        </AnimatePresence>

        {/* Google Health Connect Demo Modal */}
        <AnimatePresence>
          {showGoogleHealthModal && (
            <GoogleHealthModal
              isOpen={showGoogleHealthModal}
              onClose={() => setShowGoogleHealthModal(false)}
              vitals={vitals}
              onConnectGoogleHealth={handleConnectGoogleHealth}
              onDisconnectGoogleHealth={handleDisconnectGoogleHealth}
            />
          )}
        </AnimatePresence>

        {/* APK & Device Installation Modal */}
        <AnimatePresence>
          {showApkModal && (
            <ApkModal onClose={() => setShowApkModal(false)} />
          )}
        </AnimatePresence>
      </AndroidFrame>
    </ThemeProvider>
  );
}
