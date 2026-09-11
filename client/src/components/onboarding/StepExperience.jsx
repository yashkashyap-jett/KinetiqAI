import { FITNESS_LEVELS } from '../../lib/constants';

export default function StepExperience({ data, updateData }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Experience Level
        </h2>
        <p className="text-sm text-text-muted">
          How long have you been training?
        </p>
      </div>

      <div className="space-y-3">
        {FITNESS_LEVELS.map((level) => {
          const isSelected = data.fitnessLevel === level.value;

          return (
            <button
              key={level.value}
              type="button"
              onClick={() => updateData({ fitnessLevel: level.value })}
              className={`w-full p-5 rounded-[var(--radius-lg)] border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-accent-muted border-accent/30'
                  : 'bg-bg-surface border-border hover:border-border-hover'
              }`}
            >
              <p className={`text-base font-semibold ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                {level.label}
              </p>
              <p className="text-sm text-text-muted mt-0.5">{level.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
