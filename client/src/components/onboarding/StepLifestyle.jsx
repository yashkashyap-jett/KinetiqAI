import { ACTIVITY_LEVELS, STRESS_LEVELS } from '../../lib/constants';

const workSchedules = [
  { value: 'morning', label: 'Morning (6am–2pm)' },
  { value: 'afternoon', label: 'Afternoon (10am–6pm)' },
  { value: 'evening', label: 'Evening (2pm–10pm)' },
  { value: 'night', label: 'Night (10pm–6am)' },
  { value: 'flexible', label: 'Flexible' },
];

export default function StepLifestyle({ data, updateData }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Lifestyle
        </h2>
        <p className="text-sm text-text-muted">
          Recovery and lifestyle factors that affect your plan
        </p>
      </div>

      {/* Sleep */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-secondary">
          Average sleep (hours)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={4}
            max={10}
            step={0.5}
            value={data.sleepDuration || 7}
            onChange={(e) => updateData({ sleepDuration: parseFloat(e.target.value) })}
            className="flex-1 accent-[var(--color-accent)]"
          />
          <span className="text-lg font-semibold w-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
            {data.sleepDuration || 7}h
          </span>
        </div>
      </div>

      {/* Daily activity */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-secondary">Daily activity level</label>
        <div className="space-y-1.5">
          {ACTIVITY_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => updateData({ dailyActivity: level.value })}
              className={`w-full flex items-center justify-between p-3 rounded-[var(--radius-md)] border text-left transition-all cursor-pointer ${
                data.dailyActivity === level.value
                  ? 'bg-accent-muted border-accent/30'
                  : 'bg-bg-surface border-border hover:border-border-hover'
              }`}
            >
              <span className={`text-sm font-medium ${
                data.dailyActivity === level.value ? 'text-text-primary' : 'text-text-secondary'
              }`}>
                {level.label}
              </span>
              <span className="text-xs text-text-muted">{level.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Work schedule */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-secondary">Work/study schedule</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {workSchedules.map((sched) => (
            <button
              key={sched.value}
              type="button"
              onClick={() => updateData({ workSchedule: sched.value })}
              className={`py-2.5 rounded-[var(--radius-md)] text-xs font-medium border transition-all cursor-pointer ${
                data.workSchedule === sched.value
                  ? 'bg-accent-muted text-accent-text border-accent/30'
                  : 'bg-bg-surface text-text-secondary border-border hover:border-border-hover'
              }`}
            >
              {sched.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stress */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-secondary">Stress level</label>
        <div className="flex gap-2">
          {STRESS_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => updateData({ stressLevel: level.value })}
              className={`flex-1 py-2.5 rounded-[var(--radius-md)] text-sm font-medium border transition-all cursor-pointer ${
                data.stressLevel === level.value
                  ? 'bg-accent-muted text-accent-text border-accent/30'
                  : 'bg-bg-surface text-text-secondary border-border hover:border-border-hover'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
