import { WORKOUT_LOCATIONS, EQUIPMENT_OPTIONS } from '../../lib/constants';

export default function StepTraining({ data, updateData }) {
  const toggleEquipment = (item) => {
    const current = data.equipment || [];
    if (current.includes(item)) {
      updateData({ equipment: current.filter((e) => e !== item) });
    } else {
      updateData({ equipment: [...current, item] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Training Preferences
        </h2>
        <p className="text-sm text-text-muted">
          How and where do you like to train?
        </p>
      </div>

      {/* Days per week */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-secondary">
          Days per week
        </label>
        <div className="flex gap-2">
          {[2, 3, 4, 5, 6].map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => updateData({ workoutDaysPerWeek: day })}
              className={`flex-1 py-3 rounded-[var(--radius-md)] text-sm font-semibold border transition-all cursor-pointer ${
                data.workoutDaysPerWeek === day
                  ? 'bg-accent-muted text-accent-text border-accent/30'
                  : 'bg-bg-surface text-text-secondary border-border hover:border-border-hover'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-secondary">
          Average duration (minutes)
        </label>
        <div className="flex gap-2">
          {[30, 45, 60, 75, 90].map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => updateData({ avgWorkoutDuration: min })}
              className={`flex-1 py-3 rounded-[var(--radius-md)] text-sm font-semibold border transition-all cursor-pointer ${
                data.avgWorkoutDuration === min
                  ? 'bg-accent-muted text-accent-text border-accent/30'
                  : 'bg-bg-surface text-text-secondary border-border hover:border-border-hover'
              }`}
            >
              {min}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-secondary">
          Training location
        </label>
        <div className="grid grid-cols-2 gap-2">
          {WORKOUT_LOCATIONS.map((loc) => (
            <button
              key={loc.value}
              type="button"
              onClick={() => updateData({ workoutLocation: loc.value })}
              className={`py-3 rounded-[var(--radius-md)] text-sm font-medium border transition-all cursor-pointer ${
                data.workoutLocation === loc.value
                  ? 'bg-accent-muted text-accent-text border-accent/30'
                  : 'bg-bg-surface text-text-secondary border-border hover:border-border-hover'
              }`}
            >
              {loc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-secondary">
          Available equipment
        </label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((item) => {
            const isSelected = (data.equipment || []).includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleEquipment(item)}
                className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-accent-muted text-accent-text border-accent/30'
                    : 'bg-bg-surface text-text-muted border-border hover:border-border-hover'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
