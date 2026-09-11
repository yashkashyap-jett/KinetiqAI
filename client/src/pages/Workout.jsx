import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RefreshCw, Sparkles, Settings } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import WorkoutSetup from '../components/workout/WorkoutSetup';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function Workout() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1; // Map Sunday (0) -> 6, Monday (1) -> 0
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const res = await api.get('/workouts/plan');
      setPlan(res.data.plan || null);
    } catch (err) {
      toast.error('Failed to load workout plan');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async (config) => {
    try {
      setGenerating(true);
      const res = await api.post('/workouts/generate', { config });
      setPlan(res.data.plan);
      setIsEditing(false);
      toast.success('New AI workout plan generated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate workout plan');
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setGenerating(true);
      const res = await api.post('/workouts/generate', { config: plan?.config || null });
      setPlan(res.data.plan);
      toast.success('New AI workout plan generated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Unable to generate your workout plan. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <SkeletonCard />;

  if (!plan || isEditing) {
    return <WorkoutSetup onComplete={handleGeneratePlan} loading={generating} />;
  }

  const days = plan.days || [];
  const selectedDay = days.find((d) => d.dayIndex === selectedDayIndex) || days[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Workout Intelligence Plan
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Split: <span className="text-accent font-semibold">{plan.splitType || 'PPL'}</span> • {plan.weeklyFrequency || 4} days/week
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
            <Settings className="w-4 h-4" />
            Edit Plan
          </Button>
          <Button variant="secondary" size="sm" onClick={handleRegenerate} loading={generating}>
            <RefreshCw className="w-4 h-4" />
            Regenerate AI Plan
          </Button>
        </div>
      </div>

      {/* Days Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDayIndex(day.dayIndex)}
            className={`px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 shrink-0 cursor-pointer ${
              selectedDayIndex === day.dayIndex
                ? 'bg-accent text-white shadow-md'
                : 'bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-surface-alt border border-border'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{day.dayName}</span>
              {day.isRestDay && <Badge variant="secondary">Rest</Badge>}
            </div>
            <p className="text-[11px] opacity-80 font-normal mt-0.5">{day.splitName}</p>
          </button>
        ))}
      </div>

      {/* Selected Day Workout Overview */}
      {selectedDay && (
        <div className="card-surface p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                  {selectedDay.splitName}
                </h2>
                {selectedDay.isRestDay ? (
                  <Badge variant="secondary">Rest & Recovery</Badge>
                ) : (
                  <Badge variant="accent">{selectedDay.focusArea}</Badge>
                )}
              </div>
              <p className="text-xs text-text-muted mt-1">
                Estimated Duration: ~{selectedDay.estimatedDurationMin || 60} mins • {selectedDay.exercises?.length || 0} Exercises
              </p>
            </div>

            {!selectedDay.isRestDay && (
              <Button
                onClick={() =>
                  navigate('/workout/session', {
                    state: { dayIndex: selectedDay.dayIndex, splitName: selectedDay.splitName, exercises: selectedDay.exercises, planId: plan._id },
                  })
                }
              >
                <Play className="w-4 h-4 fill-current" />
                Start Today's Workout
              </Button>
            )}
          </div>

          {/* Exercises List */}
          {selectedDay.isRestDay ? (
            <div className="p-8 text-center bg-bg-surface-alt rounded-[var(--radius-md)] border border-border">
              <Sparkles className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="text-base font-bold text-text-primary">Active Recovery Day</h3>
              <p className="text-xs text-text-muted max-w-md mx-auto mt-1">
                Take time for light stretching, hydration, and active recovery today to optimize muscle protein synthesis.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDay.exercises?.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-bg-surface-alt rounded-[var(--radius-md)] border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded bg-bg-surface-active flex items-center justify-center text-xs font-bold text-accent shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-text-primary">{ex.name}</h4>
                      <p className="text-xs text-text-muted mt-0.5">
                        Primary: <span className="text-text-secondary capitalize">{ex.primaryMuscles?.join(', ')}</span> • Equipment: <span className="text-text-secondary capitalize">{ex.equipment || 'barbell'}</span>
                      </p>
                      {ex.notes && <p className="text-[11px] text-accent mt-1">Note: {ex.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono bg-bg-surface px-3 py-2 rounded border border-border self-start sm:self-auto">
                    <div>
                      <span className="text-text-muted block text-[10px]">SETS</span>
                      <span className="font-bold text-text-primary">{ex.setsCount}</span>
                    </div>
                    <div className="h-6 w-px bg-border" />
                    <div>
                      <span className="text-text-muted block text-[10px]">REPS</span>
                      <span className="font-bold text-text-primary">{ex.targetReps}</span>
                    </div>
                    <div className="h-6 w-px bg-border" />
                    <div>
                      <span className="text-text-muted block text-[10px]">REST</span>
                      <span className="font-bold text-text-primary">{ex.restSeconds}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
