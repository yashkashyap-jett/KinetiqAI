import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame,
  Activity,
  Dumbbell,
  Apple,
  TrendingUp,
  Brain,
  Zap,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import Button from '../components/common/Button';
import ProgressRing from '../components/common/ProgressRing';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-bg-surface-alt animate-pulse rounded" />
          <div className="h-10 w-32 bg-bg-surface-alt animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const { user, profile, engine1, activeWorkoutPlan, insights } = data || {};
  const readiness = engine1?.readiness || { score: 82, status: 'Optimal', recommendation: 'Prime state for training.' };
  const fitnessScore = engine1?.fitnessScore || { score: 78, delta: '+2' };
  const trainingLoad = engine1?.trainingLoad || { acuteLoad: 1800, chronicLoad: 1600, ratio: 1.12, zone: 'Optimal' };
  const adherence = engine1?.adherence || { workoutPercentage: 85, nutritionPercentage: 78 };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome back, {user?.name || 'Athlete'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Goal: <span className="text-text-primary font-medium capitalize">{profile?.fitnessGoal?.replace('_', ' ') || 'Recomposition'}</span> • Split: <span className="text-accent font-medium">{activeWorkoutPlan?.splitType || 'Upper/Lower'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => navigate('/ai-coach')}>
            <Brain className="w-4 h-4 text-accent" />
            Ask AI Coach
          </Button>
          <Button size="sm" onClick={() => navigate('/workout')}>
            <Dumbbell className="w-4 h-4" />
            Start Workout
          </Button>
        </div>
      </div>

      {/* Intelligence Engine Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Readiness Gauge */}
        <div className="card-surface p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Engine 1 • Readiness Score</span>
            <Badge variant={readiness.score > 75 ? 'success' : readiness.score > 50 ? 'warning' : 'error'}>
              {readiness.status}
            </Badge>
          </div>
          <div className="my-4 flex items-center gap-6">
            <ProgressRing
              progress={readiness.score}
              size={90}
              strokeWidth={8}
              color={readiness.score > 75 ? '#22C55E' : readiness.score > 50 ? '#EAB308' : '#EF4444'}
            >
              <div className="text-center">
                <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{readiness.score}</span>
                <span className="text-[10px] block text-text-muted">/100</span>
              </div>
            </ProgressRing>
            <div>
              <p className="text-xs font-medium text-text-secondary leading-relaxed">
                {readiness.recommendation}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
            <span>Sleep: {readiness.breakdown?.sleep || 21}/30</span>
            <span>Load: {readiness.breakdown?.trainingLoad || 20}/25</span>
            <span>RPE: {readiness.breakdown?.recentRpe || 16}/20</span>
          </div>
        </div>

        {/* Fitness Score Card */}
        <div className="card-surface p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Fitness Score Index</span>
            <span className="text-xs font-medium text-success bg-success-muted px-2 py-0.5 rounded">
              {fitnessScore.delta} this month
            </span>
          </div>
          <div className="my-4 flex items-baseline gap-3">
            <span className="text-5xl font-bold tracking-tight text-accent" style={{ fontFamily: 'var(--font-display)' }}>
              {fitnessScore.score}
            </span>
            <span className="text-sm text-text-muted font-medium">/ 100 Overall</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Workout Adherence</span>
              <span className="font-semibold text-text-primary">{adherence.workoutPercentage}%</span>
            </div>
            <div className="w-full bg-bg-surface-active h-1.5 rounded-full overflow-hidden">
              <div className="bg-accent h-full rounded-full" style={{ width: `${adherence.workoutPercentage}%` }} />
            </div>
          </div>
        </div>

        {/* Training Load */}
        <div className="card-surface p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Training Load Ratio</span>
            <Badge variant="accent">{trainingLoad.zone}</Badge>
          </div>
          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono">{trainingLoad.ratio}</span>
              <span className="text-xs text-text-muted">Acute:Chronic Ratio</span>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Acute Load (7d): <span className="font-mono text-text-primary">{trainingLoad.acuteLoad}</span> • Chronic Load (28d): <span className="font-mono text-text-primary">{trainingLoad.chronicLoad}</span>
            </p>
          </div>
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-text-secondary">Nutrition Adherence</span>
            <span className="font-semibold text-success">{adherence.nutritionPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Actionable Today Focus & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Focus Card (2 cols) */}
        <div className="lg:col-span-2 card-surface p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Today's Intelligence Focus
              </h2>
            </div>
            <span className="text-xs text-text-muted">Updated just now</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Workout Module */}
            <div className="p-4 bg-bg-surface-alt rounded-[var(--radius-md)] border border-border flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase text-accent">Workout Target</span>
                  <Badge variant="secondary">Day 1 Focus</Badge>
                </div>
                <h3 className="text-base font-bold text-text-primary">
                  {activeWorkoutPlan?.days?.[0]?.splitName || 'Upper Push A'}
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  {activeWorkoutPlan?.days?.[0]?.focusArea || 'Chest, Shoulders & Triceps'} • ~{activeWorkoutPlan?.days?.[0]?.estimatedDurationMin || 60} min
                </p>
              </div>
              <Button size="sm" onClick={() => navigate('/workout')}>
                View Session Exercises
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Nutrition Module */}
            <div className="p-4 bg-bg-surface-alt rounded-[var(--radius-md)] border border-border flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase text-success">Nutrition Target</span>
                  <Badge variant="success">
                    {data?.nutritionTarget?.goal ? data.nutritionTarget.goal.replace(/_/g, ' ') : 'Macro Goal'}
                  </Badge>
                </div>

                {data?.nutritionTarget ? (
                  <>
                    <h3 className="text-base font-bold text-text-primary capitalize">
                      {data.nutritionTarget.goal ? `${data.nutritionTarget.goal.replace(/_/g, ' ')} Target` : 'Daily Macro Target'}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 font-mono">
                      <span className="text-success font-semibold">{data.nutritionTarget.protein}g Protein</span> • <span className="text-accent font-semibold">{data.nutritionTarget.dailyCalories} kcal</span>
                    </p>
                    <p className="text-[11px] text-text-muted mt-1 font-mono">
                      {data.nutritionTarget.carbs}g Carbs • {data.nutritionTarget.fat}g Fat
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-semibold text-text-secondary">
                      Profile Incomplete
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      Complete your profile to calculate your nutrition targets.
                    </p>
                  </>
                )}
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate('/nutrition')}>
                Log Today's Meals
                <Apple className="w-4 h-4 text-success" />
              </Button>
            </div>
          </div>
        </div>

        {/* AI Insights Card (1 col) */}
        <div className="card-surface p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-warning" />
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                AI Contextual Insights
              </h2>
            </div>

            <div className="space-y-3">
              {insights?.map((insight, idx) => (
                <div key={idx} className="p-3 bg-bg-surface-alt rounded-[var(--radius-md)] border border-border text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-primary">{insight.title}</span>
                    <Badge variant={insight.priority === 'high' ? 'error' : 'accent'}>{insight.priority}</Badge>
                  </div>
                  <p className="text-text-secondary leading-relaxed">{insight.content}</p>
                </div>
              ))}
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={() => navigate('/weekly-intelligence')}>
            View Weekly Intelligence Report
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
