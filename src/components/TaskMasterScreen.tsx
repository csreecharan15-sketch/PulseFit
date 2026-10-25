import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Flame,
  Activity,
  Zap,
  Plus,
  Clock,
  Sliders,
  Check,
  Bot,
  ShieldAlert,
} from 'lucide-react';
import {
  UserProfile,
  VitalMetrics,
  TaskItem,
  TaskDifficulty,
} from '../types';

interface TaskMasterScreenProps {
  profile: UserProfile;
  vitals: VitalMetrics;
  tasks: TaskItem[];
  streakDays: number;
  activeDifficulty: TaskDifficulty;
  onBack: () => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id' | 'completed'>) => void;
  onChangeDifficulty: (difficulty: TaskDifficulty) => void;
  onLoadMoreTasks?: (difficulty: TaskDifficulty) => void;
  onRegenerateTasks?: (difficultyOverride?: TaskDifficulty) => Promise<void>;
  isLoadingAI?: boolean;
}

const DIFFICULTY_MAP: Record<number, TaskDifficulty> = {
  1: 'Easy',
  2: 'Moderate',
  3: 'Challenging',
};

const DIFFICULTY_NUM_MAP: Record<TaskDifficulty, number> = {
  Easy: 1,
  Moderate: 2,
  Challenging: 3,
};

export const TaskMasterScreen: React.FC<TaskMasterScreenProps> = ({
  profile,
  vitals,
  tasks,
  streakDays,
  activeDifficulty,
  onBack,
  onToggleTask,
  onAddTask,
  onChangeDifficulty,
  onLoadMoreTasks,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<'cardio' | 'recovery' | 'mindfulness' | 'nutrition' | 'strength'>('cardio');
  const [newMinutes, setNewMinutes] = useState('15');

  // AI Evaluation states for custom task
  const [isEvaluatingAI, setIsEvaluatingAI] = useState(false);
  const [aiEvaluatedDifficulty, setAiEvaluatedDifficulty] = useState<TaskDifficulty>('Easy');
  const [aiEvaluatedPoints, setAiEvaluatedPoints] = useState<number>(90);
  const [aiReasoning, setAiReasoning] = useState<string>('Light habit building task');

  // Visible tasks based on selected consistency tier + user-created custom tasks
  const visibleTasks = tasks.filter(
    (t) => t.difficulty === activeDifficulty || t.isCustom
  );
  const pendingTasks = visibleTasks.filter((t) => !t.completed);
  const completedTasks = visibleTasks.filter((t) => t.completed);
  const totalEarnablePoints = visibleTasks.reduce((acc, t) => acc + t.points, 0);
  const earnedPoints = completedTasks.reduce((acc, t) => acc + t.points, 0);

  // Instant synchronous evaluation logic
  const evaluateTaskLocally = (title: string, desc: string, minsStr: string) => {
    const text = `${title} ${desc}`.toLowerCase();
    const mins = parseInt(minsStr, 10) || 15;

    const isHard =
      text.includes('hiit') ||
      text.includes('sprint') ||
      text.includes('heavy') ||
      text.includes('burpee') ||
      text.includes('dand') ||
      text.includes('50 push') ||
      text.includes('10k') ||
      mins >= 40;

    const isMed =
      text.includes('jog') ||
      text.includes('workout') ||
      text.includes('squat') ||
      text.includes('pushup') ||
      text.includes('plank') ||
      text.includes('stairs') ||
      text.includes('cycle') ||
      text.includes('5k') ||
      mins >= 20;

    if (isHard) {
      return {
        diff: 'Challenging' as TaskDifficulty,
        pts: Math.min(320, 260 + Math.floor(mins * 1.5)),
        reason: 'Assessed as Challenging: High cardiovascular & muscular workload.',
      };
    } else if (isMed) {
      return {
        diff: 'Moderate' as TaskDifficulty,
        pts: Math.min(200, 160 + Math.floor(mins * 1.2)),
        reason: 'Assessed as Moderate: Solid aerobic stamina and muscle conditioning.',
      };
    } else {
      return {
        diff: 'Easy' as TaskDifficulty,
        pts: Math.min(100, 80 + Math.floor(mins * 0.8)),
        reason: 'Assessed as Easy: Light habit builder for active recovery.',
      };
    }
  };

  // Immediate synchronous evaluation whenever user types or changes fields (<1ms)
  useEffect(() => {
    if (!newTitle.trim()) {
      setAiEvaluatedDifficulty(activeDifficulty);
      setAiEvaluatedPoints(activeDifficulty === 'Easy' ? 90 : activeDifficulty === 'Moderate' ? 180 : 280);
      setAiReasoning('AI will assess difficulty and assign reward points as you type.');
      return;
    }

    // Instant local evaluation so there is 0ms delay in UI
    const instant = evaluateTaskLocally(newTitle, newDescription, newMinutes);
    setAiEvaluatedDifficulty(instant.diff);
    setAiEvaluatedPoints(instant.pts);
    setAiReasoning(instant.reason);

    // Background server refinement
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/ai/evaluate-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newTitle,
            description: newDescription,
            category: newCategory,
            targetMinutes: parseInt(newMinutes, 10) || 15,
            vitals,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.difficulty && data.points) {
            setAiEvaluatedDifficulty(data.difficulty);
            setAiEvaluatedPoints(data.points);
            setAiReasoning(data.reasoning || `AI assigned ${data.points} pts for ${data.difficulty} difficulty.`);
          }
        }
      } catch (err) {
        // Fallback already populated instantly
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [newTitle, newDescription, newCategory, newMinutes, activeDifficulty]);

  const handleTaskCheck = (taskId: string, isCurrentlyCompleted: boolean) => {
    if (isCurrentlyCompleted) return; // Tasks cannot be undone once completed
    onToggleTask(taskId);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4'],
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const newDiff = DIFFICULTY_MAP[val] || 'Easy';
    onChangeDifficulty(newDiff);
  };

  const handleCustomTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim() || 'Custom fitness mission evaluated and approved by AI.',
      targetMinutes: parseInt(newMinutes, 10) || 15,
      difficulty: aiEvaluatedDifficulty,
      points: aiEvaluatedPoints,
      vitalTriggerReason: `AI assessed: ${aiReasoning} (Pulse: ${vitals.heartRate} bpm)`,
    });

    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
  };

  const getDifficultyBadge = (diff: TaskDifficulty) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Moderate':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Challenging':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="p-4 sm:p-5 flex flex-col gap-4 text-slate-800 dark:text-slate-100"
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
              <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500" />
              Task-Master AI Planner
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Daily healthy missions tuned to PulseBack Clip
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Consistency Level & Interactive Slider Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-tr from-indigo-950 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">
                Consistency Level
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {activeDifficulty} (Level {DIFFICULTY_NUM_MAP[activeDifficulty]})
            </h2>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-amber-300 text-xs font-bold">
            <Flame className="w-4 h-4 fill-amber-300" />
            <span>{streakDays} Day Streak</span>
          </div>
        </div>

        <p className="text-xs text-indigo-200/90 leading-relaxed">
          {activeDifficulty === 'Easy' &&
            'Level 1: Gentle daily habits (15-min walk, warm lemon water, Surya Namaskar). Earn ~90 pts per task.'}
          {activeDifficulty === 'Moderate' &&
            'Level 2: Building stamina (25-min jog, squats, planks, evening walk). Earn ~175 pts per task.'}
          {activeDifficulty === 'Challenging' &&
            'Level 3: Athletic power (High intensity intervals, Hindu pushups & baithaks). Earn ~280 pts per task.'}
        </p>

        {/* Interactive Consistency Level Slider Control */}
        <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-1 font-semibold text-white">
              <Sliders className="w-3.5 h-3.5 text-teal-300" />
              Adjust Consistency Slider:
            </span>
            <span className="font-mono text-emerald-300 font-bold">
              {activeDifficulty} Tier
            </span>
          </div>

          {/* Range Slider */}
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={DIFFICULTY_NUM_MAP[activeDifficulty]}
            onChange={handleSliderChange}
            className="w-full accent-teal-400 h-2 bg-white/20 rounded-lg cursor-pointer"
          />

          {/* Quick Segmented Buttons */}
          <div className="grid grid-cols-3 gap-1.5 mt-1">
            {(['Easy', 'Moderate', 'Challenging'] as TaskDifficulty[]).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => onChangeDifficulty(diff)}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeDifficulty === diff
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md'
                    : 'bg-black/30 text-slate-300 hover:text-white hover:bg-black/40'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar of Today's Tasks */}
        <div className="flex items-center justify-between text-[11px] text-indigo-200 mt-1">
          <span>Today's Task Completion</span>
          <span className="font-mono font-bold text-emerald-300">
            {completedTasks.length} / {visibleTasks.length} ({earnedPoints} pts earned)
          </span>
        </div>
        <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{
              width: `${visibleTasks.length ? (completedTasks.length / visibleTasks.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Task List Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-indigo-500" />
            Daily Missions ({visibleTasks.length})
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800/60"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Task</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {visibleTasks.map((task) => {
            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2 ${
                  task.completed
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/40 opacity-90'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-500/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    disabled={task.completed}
                    onClick={() => handleTaskCheck(task.id, task.completed)}
                    className={`mt-0.5 shrink-0 transition-colors ${
                      task.completed
                        ? 'text-emerald-600 dark:text-emerald-400 cursor-default'
                        : 'text-slate-300 dark:text-slate-600 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer'
                    }`}
                    title={task.completed ? 'Mission Completed (locked)' : 'Mark completed'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getDifficultyBadge(task.difficulty)}`}>
                        {task.difficulty}
                      </span>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/60">
                        +{task.points} pts
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.targetMinutes} min
                      </span>
                      {task.completed && (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          Done
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-sm font-bold text-slate-900 dark:text-white ${
                        task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-normal">
                      {task.description}
                    </p>
                  </div>
                </div>

                {/* Sensor Trigger Explanation */}
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2">
                  <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span className="leading-tight">
                    <strong className="text-slate-700 dark:text-slate-200">PulseBack Clip Reason:</strong> {task.vitalTriggerReason}
                  </span>
                </div>
              </div>
            );
          })}

          {/* All Tasks Completed Celebration & Load Next Mission Set Banner */}
          {pendingTasks.length === 0 && visibleTasks.length > 0 && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-xl flex flex-col items-center text-center gap-3 my-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300">
                <Sparkles className="w-6 h-6 fill-amber-300" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  All {activeDifficulty} Tier Missions Accomplished!
                </h3>
                <p className="text-xs text-emerald-100 max-w-sm mt-0.5">
                  Shabash! You completed every task in this consistency level (+{earnedPoints} pts earned). Since you finished all of them, you can now unlock your next batch of missions!
                </p>
              </div>
              {onLoadMoreTasks && (
                <button
                  type="button"
                  onClick={() => onLoadMoreTasks(activeDifficulty)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-emerald-950 font-extrabold text-xs shadow-md hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-700 font-bold" />
                  <span>Load Next Set of Missions</span>
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Custom Task Modal: AI-Evaluated Points & Difficulty */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Add Custom Fitness Task
                    </h3>
                    <span className="text-[10px] text-slate-400">
                      Points & difficulty are evaluated by Task-Master AI
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCustomTaskSubmit} className="mt-4 flex flex-col gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 25-min outdoor jog or 30 Hindu Baithaks"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Details / Reps (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3 sets of 15 reps with steady breathing"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="cardio">Cardio / Walk</option>
                      <option value="strength">Strength / Workout</option>
                      <option value="recovery">Recovery / Yoga</option>
                      <option value="mindfulness">Pranayama / Breathing</option>
                      <option value="nutrition">Nutrition / Water</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={newMinutes}
                      onChange={(e) => setNewMinutes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                {/* AI Points & Difficulty Assessment Banner (User cannot tamper with points) */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-teal-50 dark:from-indigo-950/80 dark:via-purple-950/80 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-800/80 flex flex-col gap-1.5 mt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      AI Difficulty & Points Assessment
                    </span>
                    {isEvaluatingAI ? (
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono animate-pulse">
                        Evaluating task...
                      </span>
                    ) : (
                      <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300 font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-700 shadow-2xs">
                        +{aiEvaluatedPoints} pts
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getDifficultyBadge(aiEvaluatedDifficulty)}`}>
                      {aiEvaluatedDifficulty}
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 flex-1 leading-tight">
                      {aiReasoning}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!newTitle.trim() || isEvaluatingAI}
                  className="mt-2 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Add Mission with AI Points (+{aiEvaluatedPoints} pts)</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
