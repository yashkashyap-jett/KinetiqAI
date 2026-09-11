import Input from '../common/Input';

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export default function StepAboutYou({ data, updateData }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          About You
        </h2>
        <p className="text-sm text-text-muted">
          Basic information to personalize your fitness plan
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Age"
          type="number"
          placeholder="25"
          value={data.age}
          onChange={(e) => updateData({ age: e.target.value })}
          min={13}
          max={100}
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Gender</label>
          <div className="flex gap-2">
            {genderOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateData({ gender: opt.value })}
                className={`flex-1 py-2.5 rounded-[var(--radius-md)] text-sm font-medium border transition-all cursor-pointer ${
                  data.gender === opt.value
                    ? 'bg-accent-muted text-accent-text border-accent/30'
                    : 'bg-bg-surface text-text-secondary border-border hover:border-border-hover'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Height (cm)"
          type="number"
          placeholder="175"
          value={data.height}
          onChange={(e) => updateData({ height: e.target.value })}
          min={100}
          max={250}
        />
        <Input
          label="Weight (kg)"
          type="number"
          placeholder="75"
          value={data.weight}
          onChange={(e) => updateData({ weight: e.target.value })}
          min={30}
          max={300}
        />
      </div>

      <Input
        label="Target Weight (kg) — optional"
        type="number"
        placeholder="70"
        value={data.targetWeight}
        onChange={(e) => updateData({ targetWeight: e.target.value })}
        min={30}
        max={300}
      />
    </div>
  );
}
