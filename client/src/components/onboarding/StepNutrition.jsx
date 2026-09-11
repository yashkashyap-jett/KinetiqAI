import { useState } from 'react';
import { DIETARY_PREFERENCES } from '../../lib/constants';
import { X, Plus } from 'lucide-react';

export default function StepNutrition({ data, updateData }) {
  const [allergyInput, setAllergyInput] = useState('');
  const [dislikedInput, setDislikedInput] = useState('');
  const [preferredInput, setPreferredInput] = useState('');

  const addToList = (field, value, setter) => {
    if (value.trim() && !data[field].includes(value.trim())) {
      updateData({ [field]: [...data[field], value.trim()] });
      setter('');
    }
  };

  const removeFromList = (field, item) => {
    updateData({ [field]: data[field].filter((i) => i !== item) });
  };

  const TagInput = ({ label, field, value, setter, placeholder }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-secondary">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setter(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(field, value, setter))}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-[var(--radius-md)] bg-bg-surface border border-border text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={() => addToList(field, value, setter)}
          className="px-3 py-2 rounded-[var(--radius-md)] bg-bg-surface-alt border border-border text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {data[field].length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data[field].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] bg-bg-surface-alt text-xs text-text-secondary border border-border"
            >
              {item}
              <button
                type="button"
                onClick={() => removeFromList(field, item)}
                className="text-text-muted hover:text-error transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Nutrition
        </h2>
        <p className="text-sm text-text-muted">
          Your dietary preferences help us build the right meal plan
        </p>
      </div>

      {/* Dietary preference */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-secondary">Dietary preference</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DIETARY_PREFERENCES.map((pref) => (
            <button
              key={pref.value}
              type="button"
              onClick={() => updateData({ dietaryPreference: pref.value })}
              className={`py-2.5 rounded-[var(--radius-md)] text-sm font-medium border transition-all cursor-pointer ${
                data.dietaryPreference === pref.value
                  ? 'bg-accent-muted text-accent-text border-accent/30'
                  : 'bg-bg-surface text-text-secondary border-border hover:border-border-hover'
              }`}
            >
              {pref.label}
            </button>
          ))}
        </div>
      </div>

      {/* Meals per day */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-secondary">Meals per day</label>
        <div className="flex gap-2">
          {[2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => updateData({ mealsPerDay: n })}
              className={`flex-1 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold border transition-all cursor-pointer ${
                data.mealsPerDay === n
                  ? 'bg-accent-muted text-accent-text border-accent/30'
                  : 'bg-bg-surface text-text-secondary border-border hover:border-border-hover'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-secondary">Food budget</label>
        <div className="flex gap-2">
          {[
            { value: 'low', label: 'Budget' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'high', label: 'Flexible' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateData({ foodBudget: opt.value })}
              className={`flex-1 py-2.5 rounded-[var(--radius-md)] text-sm font-medium border transition-all cursor-pointer ${
                data.foodBudget === opt.value
                  ? 'bg-accent-muted text-accent-text border-accent/30'
                  : 'bg-bg-surface text-text-secondary border-border hover:border-border-hover'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <TagInput
        label="Allergies"
        field="allergies"
        value={allergyInput}
        setter={setAllergyInput}
        placeholder="e.g., peanuts, shellfish"
      />

      <TagInput
        label="Foods you dislike"
        field="dislikedFoods"
        value={dislikedInput}
        setter={setDislikedInput}
        placeholder="e.g., broccoli, tofu"
      />

      <TagInput
        label="Foods you prefer"
        field="preferredFoods"
        value={preferredInput}
        setter={setPreferredInput}
        placeholder="e.g., chicken, rice, eggs"
      />
    </div>
  );
}
