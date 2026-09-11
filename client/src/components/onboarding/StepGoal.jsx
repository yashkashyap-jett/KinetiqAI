import { FITNESS_GOALS } from '../../lib/constants';
import {
  Flame, Dumbbell, RefreshCw, Zap, Heart, Activity, Trophy,
} from 'lucide-react';

const goalIcons = {
  fat_loss: Flame,
  muscle_gain: Dumbbell,
  recomposition: RefreshCw,
  strength: Zap,
  endurance: Heart,
  general_fitness: Activity,
  athletic_performance: Trophy,
};

export default function StepGoal({ data, updateData }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Your Goal
        </h2>
        <p className="text-sm text-text-muted">
          What do you want to achieve?
        </p>
      </div>

      <div className="space-y-2">
        {FITNESS_GOALS.map((goal) => {
          const Icon = goalIcons[goal.value];
          const isSelected = data.fitnessGoal === goal.value;

          return (
            <button
              key={goal.value}
              type="button"
              onClick={() => updateData({ fitnessGoal: goal.value })}
              className={`w-full flex items-center gap-4 p-4 rounded-[var(--radius-lg)] border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-accent-muted border-accent/30'
                  : 'bg-bg-surface border-border hover:border-border-hover'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-accent/20 text-accent-text' : 'bg-bg-surface-alt text-text-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-sm font-semibold ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {goal.label}
                </p>
                <p className="text-xs text-text-muted">{goal.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
