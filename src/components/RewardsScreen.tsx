import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  ArrowLeft,
  Flame,
  Gift,
  Award,
  Sparkles,
  Lock,
  Copy,
  Check,
  ShieldCheck,
  Users,
  Medal,
  Activity,
  Zap,
} from 'lucide-react';
import { RewardBadge, GiftCard, VitalMetrics } from '../types';

interface RewardsScreenProps {
  userPoints: number;
  streakDays: number;
  badges: RewardBadge[];
  giftCards: GiftCard[];
  vitals?: VitalMetrics;
  onBack: () => void;
  onRedeemGiftCard: (cardId: string) => void;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  city: string;
  steps: number;
  streak: number;
  isCurrentUser?: boolean;
}

const LEADERBOARD_DATA: LeaderboardUser[] = [
  { rank: 1, name: 'Rohan Gupta', city: 'Bengaluru', steps: 13420, streak: 14 },
  { rank: 2, name: 'Priya Sundaram', city: 'Chennai', steps: 12150, streak: 9 },
  { rank: 3, name: 'Aarav Sharma (You)', city: 'Delhi NCR', steps: 11425, streak: 7, isCurrentUser: true },
  { rank: 4, name: 'Kunal Deshmukh', city: 'Mumbai', steps: 10890, streak: 6 },
  { rank: 5, name: 'Ananya Sen', city: 'Kolkata', steps: 9850, streak: 5 },
  { rank: 6, name: 'Vikramjit Singh', city: 'Chandigarh', steps: 9400, streak: 12 },
];

export const RewardsScreen: React.FC<RewardsScreenProps> = ({
  userPoints,
  streakDays,
  badges,
  giftCards,
  vitals,
  onBack,
  onRedeemGiftCard,
}) => {
  const [activeTab, setActiveTab] = useState<'vouchers' | 'leaderboard' | 'badges'>('vouchers');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedCardToRedeem, setSelectedCardToRedeem] = useState<GiftCard | null>(null);

  const redeemedCards = giftCards.filter((c) => c.redeemed);
  const availableCards = giftCards.filter((c) => !c.redeemed);
  const unlockedBadges = badges.filter((b) => b.unlocked);

  const handleConfirmRedeem = () => {
    if (!selectedCardToRedeem) return;
    onRedeemGiftCard(selectedCardToRedeem.id);
    setSelectedCardToRedeem(null);

    // Confetti celebration
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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
              <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Rewards & Milestones
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Week-1 milestones starting from 250 pts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-mono">{userPoints.toLocaleString()} pts</span>
        </div>
      </div>

      {/* Main Points & Streak Showcase Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900 text-white shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Total PulseFit Points
            </span>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-white flex items-baseline gap-1 mt-0.5">
              {userPoints.toLocaleString()}
              <span className="text-xs font-normal text-emerald-300 font-sans">pts</span>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center gap-2 border border-white/10">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div className="flex flex-col">
              <span className="text-xs font-bold font-mono leading-none">{streakDays} Days</span>
              <span className="text-[9px] text-emerald-200">Daily Streak</span>
            </div>
          </div>
        </div>

        {/* Milestone info banner */}
        <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-xs flex items-center justify-between text-emerald-100">
          <span>First voucher unlocks at 250 pts! (You have {userPoints} pts)</span>
          <span className="text-amber-300 font-bold font-mono">Ready to Claim</span>
        </div>
      </div>

      {/* Anti-Cheat PPG Sensor Validation Card (Winning Pitch Talking Point!) */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 dark:from-emerald-950/60 dark:via-teal-950/60 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/80 shadow-2xs flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-xs text-emerald-950 dark:text-emerald-200">
              Anti-Cheat Optical PPG Cadence Lock
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-mono text-[9px] font-bold">
            98% Legitimate Match
          </span>
        </div>
        <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300 leading-relaxed">
          PulseBack dual-photodiode sensors validate your step cadence (~116 SPM) directly against optical cardiovascular pulse waves (74 BPM). Artificial device shaking or watch oscillating is detected and rejected automatically.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium">
        <button
          onClick={() => setActiveTab('vouchers')}
          className={`flex-1 py-1.5 rounded-xl text-center transition-all cursor-pointer ${
            activeTab === 'vouchers'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          INR Vouchers ({availableCards.length})
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-1.5 rounded-xl text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'leaderboard'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-500" />
          <span>Leaderboard</span>
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`flex-1 py-1.5 rounded-xl text-center transition-all cursor-pointer ${
            activeTab === 'badges'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Badges ({unlockedBadges.length}/{badges.length})
        </button>
      </div>

      {/* TAB 1: VOUCHERS */}
      {activeTab === 'vouchers' && (
        <div className="flex flex-col gap-3">
          {/* Active Redeemed Vouchers First (if any) */}
          {redeemedCards.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Your Redeemed Coupons ({redeemedCards.length})
              </span>
              {redeemedCards.map((card) => (
                <div
                  key={card.id}
                  className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">{card.brand}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{card.title}</h4>
                    <span className="text-[10px] font-mono text-slate-500">Code: {card.voucherCode}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(card.voucherCode || '')}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {copiedCode === card.voucherCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === card.voucherCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Available Vouchers with Low-Tier Milestones clearly displayed */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Available Milestone Vouchers
            </span>

            {availableCards.map((card) => {
              const canAfford = userPoints >= card.pointsRequired;
              const pointsNeeded = card.pointsRequired - userPoints;

              return (
                <div
                  key={card.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    canAfford
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/60 opacity-80'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                        {card.brand}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {card.category}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {card.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {card.description}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[10px]">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {card.pointsRequired.toLocaleString()} pts
                      </span>
                      {!canAfford && (
                        <span className="text-slate-400">
                          (Need {pointsNeeded.toLocaleString()} more pts)
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={!canAfford}
                    onClick={() => setSelectedCardToRedeem(card)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold shadow-2xs transition-all shrink-0 cursor-pointer ${
                      canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Redeem' : <Lock className="w-3.5 h-3.5 mx-auto" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LEADERBOARD & FRIEND CHALLENGE */}
      {activeTab === 'leaderboard' && (
        <div className="flex flex-col gap-3.5">
          {/* Friend Challenge Spotlight Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white shadow-md flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-300" />
                Weekend Community Clash
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-mono">
                2 Days Left
              </span>
            </div>
            <h3 className="text-sm font-bold">Delhi NCR 30k Steps Challenge</h3>
            <p className="text-xs text-indigo-200 leading-relaxed">
              You are currently <strong>#3 on the leaderboard</strong> with 11,425 steps today. Top 3 finishers win ₹250 Fast&Up Hydration Kits on Sunday night!
            </p>
          </div>

          {/* Leaderboard Table */}
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between px-2 pb-1 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
              <span>Rank & Athlete</span>
              <span>Steps Today</span>
            </div>

            {LEADERBOARD_DATA.map((user) => (
              <div
                key={user.rank}
                className={`p-2.5 px-3 rounded-xl flex items-center justify-between transition-colors ${
                  user.isCurrentUser
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      user.rank === 1
                        ? 'bg-amber-400 text-slate-950'
                        : user.rank === 2
                        ? 'bg-slate-300 text-slate-800'
                        : user.rank === 3
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400'
                    }`}
                  >
                    {user.rank}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {user.city} · {user.streak}d streak
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
                    {user.steps.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-400">steps</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BADGES */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-2 gap-2.5">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3 rounded-2xl border flex flex-col gap-1.5 transition-all ${
                b.unlocked
                  ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    b.unlocked ? 'bg-amber-100 dark:bg-amber-950 text-amber-600' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Award className="w-4 h-4" />
                </div>
                {b.unlocked ? (
                  <span className="text-[9px] font-bold text-emerald-600">Unlocked</span>
                ) : (
                  <Lock className="w-3 h-3 text-slate-400" />
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{b.name}</h4>
              <p className="text-[10px] text-slate-500 line-clamp-2">{b.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Redeem Confirmation Modal */}
      <AnimatePresence>
        {selectedCardToRedeem && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-3 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Redeem {selectedCardToRedeem.value} Voucher?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Spend {selectedCardToRedeem.pointsRequired.toLocaleString()} pts for "{selectedCardToRedeem.title}".
                </p>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setSelectedCardToRedeem(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRedeem}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Confirm & Claim
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
