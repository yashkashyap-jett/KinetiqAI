import { useState, useEffect } from 'react';
import { Trophy, Award, Flame, Dumbbell, Target, Zap, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import Badge from '../components/common/Badge';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';

const BASE_ACHIEVEMENTS = [
  {
    code: 'PROFILE_READY',
    name: 'Athlete Onboarding',
    description: 'Complete athlete assessment and set up your biometric profile.',
    category: 'milestones',
    icon: Sparkles,
    target: 1,
    points: 50,
  },
  {
    code: 'FIRST_WORKOUT',
    name: 'First Blood',
    description: 'Complete and log your very first workout session.',
    category: 'workout',
    icon: Dumbbell,
    target: 1,
    points: 100,
  },
  {
    code: 'WORKOUT_5',
    name: 'Iron Discipline',
    description: 'Log 5 completed training sessions in Kinetiq.',
    category: 'workout',
    icon: Award,
    target: 5,
    points: 250,
  },
  {
    code: 'WORKOUT_10',
    name: 'Century Club',
    description: 'Log 10 completed training sessions.',
    category: 'workout',
    icon: Trophy,
    target: 10,
    points: 500,
  },
  {
    code: 'FIRST_PR',
    name: 'Plateau Breaker',
    description: 'Set a new Personal Record (PR) on any tracked lift.',
    category: 'strength',
    icon: Zap,
    target: 1,
    points: 200,
  },
  {
    code: 'HABIT_STREAK_3',
    name: 'Momentum Builder',
    description: 'Achieve a 3-day consistency streak on any daily habit.',
    category: 'consistency',
    icon: Flame,
    target: 3,
    points: 150,
  },
  {
    code: 'HABIT_STREAK_7',
    name: 'Unstoppable Habit',
    description: 'Maintain a 7-day streak on your behavioral habits.',
    category: 'consistency',
    icon: Flame,
    target: 7,
    points: 350,
  },
  {
    code: 'METRICS_LOGGED',
    name: 'Precision Bio-Tracker',
    description: 'Log recovery and body weight metrics in Progress analytics.',
    category: 'milestones',
    icon: Target,
    target: 1,
    points: 100,
  },
  {
    code: 'NUTRITION_PLAN',
    name: 'Fuel Master',
    description: 'Configure daily macro targets with Precision Nutrition Engine.',
    category: 'nutrition',
    icon: Award,
    target: 1,
    points: 150,
  },
];

export default function Achievements() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    workoutCount: 0,
    prCount: 0,
    maxHabitStreak: 0,
    progressCount: 0,
    hasNutritionTarget: false,
  });

  useEffect(() => {
    fetchAchievementData();
  }, []);

  const fetchAchievementData = async () => {
    try {
      setLoading(true);
      const [sessionsRes, progressRes, habitsRes, nutritionRes] = await Promise.allSettled([
        api.get('/workouts/sessions'),
        api.get('/progress'),
        api.get('/habits'),
        api.get('/nutrition/plan'),
      ]);

      const completedSessions =
        sessionsRes.status === 'fulfilled' && Array.isArray(sessionsRes.value.data?.sessions)
          ? sessionsRes.value.data.sessions.filter((s) => s.status === 'completed').length
          : 0;

      const prs =
        progressRes.status === 'fulfilled' && Array.isArray(progressRes.value.data?.prs)
          ? progressRes.value.data.prs.length
          : 0;

      const progressEntries =
        progressRes.status === 'fulfilled' && Array.isArray(progressRes.value.data?.entries)
          ? progressRes.value.data.entries.length
          : 0;

      const habits =
        habitsRes.status === 'fulfilled' && Array.isArray(habitsRes.value.data?.habits)
          ? habitsRes.value.data.habits
          : [];

      const maxStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak || 0), 0);

      const hasNutrition =
        nutritionRes.status === 'fulfilled' && !!nutritionRes.value.data?.plan;

      setStats({
        workoutCount: completedSessions,
        prCount: prs,
        maxHabitStreak: maxStreak,
        progressCount: progressEntries,
        hasNutritionTarget: hasNutrition,
      });
    } catch {
      // Fallbacks are safely preserved
    } finally {
      setLoading(false);
    }
  };

  const calculateAchievementProgress = (achievement) => {
    let current = 0;
    switch (achievement.code) {
      case 'PROFILE_READY':
        current = user?.onboardingComplete ? 1 : 0;
        break;
      case 'FIRST_WORKOUT':
      case 'WORKOUT_5':
      case 'WORKOUT_10':
        current = stats.workoutCount;
        break;
      case 'FIRST_PR':
        current = stats.prCount;
        break;
      case 'HABIT_STREAK_3':
      case 'HABIT_STREAK_7':
        current = stats.maxHabitStreak;
        break;
      case 'METRICS_LOGGED':
        current = stats.progressCount;
        break;
      case 'NUTRITION_PLAN':
        current = stats.hasNutritionTarget ? 1 : 0;
        break;
      default:
        current = 0;
    }
    const isUnlocked = current >= achievement.target;
    const progressPercent = Math.min(100, Math.round((current / achievement.target) * 100));
    return { current, isUnlocked, progressPercent };
  };

  const processedAchievements = BASE_ACHIEVEMENTS.map((a) => {
    const progress = calculateAchievementProgress(a);
    return { ...a, ...progress };
  });

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'workout', label: 'Workout' },
    { id: 'consistency', label: 'Consistency' },
    { id: 'strength', label: 'Strength' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'milestones', label: 'Milestones' },
  ];

  const filteredAchievements =
    selectedCategory === 'all'
      ? processedAchievements
      : processedAchievements.filter((a) => a.category === selectedCategory);

  const unlockedCount = processedAchievements.filter((a) => a.isUnlocked).length;
  const totalPoints = processedAchievements
    .filter((a) => a.isUnlocked)
    .reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Achievements & Trophies
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Unlock performance badges through athletic consistency, strength progress, and habits.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-surface p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Badges Unlocked</span>
            <span className="text-2xl font-bold font-mono text-text-primary mt-1 block">
              {unlockedCount} / {processedAchievements.length}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-accent-muted flex items-center justify-center">
            <Trophy className="w-5 h-5 text-accent" />
          </div>
        </div>

        <div className="card-surface p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Completion Rate</span>
            <span className="text-2xl font-bold font-mono text-success mt-1 block">
              {Math.round((unlockedCount / processedAchievements.length) * 100)}%
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-success-muted flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
        </div>

        <div className="card-surface p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Trophy Score</span>
            <span className="text-2xl font-bold font-mono text-warning mt-1 block">
              {totalPoints} pts
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-warning-muted flex items-center justify-center">
            <Award className="w-5 h-5 text-warning" />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-accent text-white shadow-sm'
                : 'bg-bg-surface text-text-secondary hover:text-text-primary border border-border'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.code}
              className={`p-5 rounded-[var(--radius-md)] border transition-all flex flex-col justify-between space-y-4 ${
                item.isUnlocked
                  ? 'bg-bg-surface border-accent/40 shadow-sm relative overflow-hidden'
                  : 'bg-bg-surface/50 border-border opacity-70'
              }`}
            >
              {item.isUnlocked && (
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                  <div className="bg-accent text-white text-[9px] font-bold py-0.5 text-center transform rotate-45 translate-x-4 translate-y-2 uppercase shadow-xs">
                    Unlocked
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center ${
                      item.isUnlocked ? 'bg-accent text-white' : 'bg-bg-surface-alt text-text-muted border border-border'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant={item.isUnlocked ? 'success' : 'default'}>
                    {item.isUnlocked ? (
                      <span className="flex items-center gap-1 font-mono text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> +{item.points} pts
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-mono text-[10px]">
                        <Lock className="w-3 h-3" /> {item.points} pts
                      </span>
                    )}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-text-primary">{item.name}</h3>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <div className="flex justify-between items-center text-[10px] font-mono text-text-muted">
                  <span>Progress</span>
                  <span>
                    {item.current} / {item.target}
                  </span>
                </div>
                <div className="w-full bg-bg-surface-alt h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.isUnlocked ? 'bg-success' : 'bg-accent'
                    }`}
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
