import React, { useState } from 'react';
import { Dumbbell, Activity, Calendar, Clock, ArrowRight, Check } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function WorkoutSetup({ onComplete, loading }) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    goal: 'Muscle Gain',
    experience: 'Intermediate',
    daysPerWeek: 5,
    splitType: 'Push / Pull / Legs',
    equipment: 'Gym (Full Equipment)',
    durationMin: 60,
    customSchedule: [
      { dayName: 'Monday', isRest: false, muscles: [] },
      { dayName: 'Tuesday', isRest: false, muscles: [] },
      { dayName: 'Wednesday', isRest: false, muscles: [] },
      { dayName: 'Thursday', isRest: false, muscles: [] },
      { dayName: 'Friday', isRest: false, muscles: [] },
      { dayName: 'Saturday', isRest: true, muscles: [] },
      { dayName: 'Sunday', isRest: true, muscles: [] },
    ]
  });

  const updateConfig = (key, value) => setConfig({ ...config, [key]: value });

  const syncCustomScheduleWithDays = (schedule, targetDays) => {
    const currentSchedule = schedule && schedule.length === 7
      ? schedule.map(d => ({ ...d, muscles: [...(d.muscles || [])] }))
      : [
          { dayName: 'Monday', isRest: false, muscles: [] },
          { dayName: 'Tuesday', isRest: false, muscles: [] },
          { dayName: 'Wednesday', isRest: false, muscles: [] },
          { dayName: 'Thursday', isRest: false, muscles: [] },
          { dayName: 'Friday', isRest: false, muscles: [] },
          { dayName: 'Saturday', isRest: true, muscles: [] },
          { dayName: 'Sunday', isRest: true, muscles: [] },
        ];

    const hasCustomMuscles = currentSchedule.some(d => d.muscles && d.muscles.length > 0);

    if (!hasCustomMuscles) {
      return currentSchedule.map((d, idx) => ({
        ...d,
        isRest: idx >= targetDays,
        muscles: [],
      }));
    }

    let currentWorkoutCount = currentSchedule.filter(d => !d.isRest).length;

    if (currentWorkoutCount < targetDays) {
      for (let i = 0; i < currentSchedule.length && currentWorkoutCount < targetDays; i++) {
        if (currentSchedule[i].isRest) {
          currentSchedule[i].isRest = false;
          currentWorkoutCount++;
        }
      }
    } else if (currentWorkoutCount > targetDays) {
      for (let i = currentSchedule.length - 1; i >= 0 && currentWorkoutCount > targetDays; i--) {
        if (!currentSchedule[i].isRest) {
          currentSchedule[i].isRest = true;
          currentSchedule[i].muscles = [];
          currentWorkoutCount--;
        }
      }
    }

    return currentSchedule;
  };

  const handleDaysPerWeekChange = (d) => {
    setConfig(prev => ({
      ...prev,
      daysPerWeek: d,
      customSchedule: syncCustomScheduleWithDays(prev.customSchedule, d),
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-display">What is your primary goal?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {['Muscle Gain', 'Fat Loss', 'Strength', 'General Fitness', 'Endurance', 'Recomposition'].map(g => (
          <button
            key={g}
            onClick={() => updateConfig('goal', g)}
            className={`p-4 rounded-[var(--radius-md)] border text-left transition-all ${
              config.goal === g ? 'border-accent bg-accent/10' : 'border-border bg-bg-surface hover:border-accent/50'
            }`}
          >
            <span className="font-semibold text-text-primary">{g}</span>
          </button>
        ))}
      </div>
      <Button onClick={nextStep} className="w-full">Continue <ArrowRight className="w-4 h-4" /></Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-display">What is your experience level?</h3>
      <div className="grid grid-cols-1 gap-3">
        {['Beginner', 'Intermediate', 'Advanced'].map(e => (
          <button
            key={e}
            onClick={() => updateConfig('experience', e)}
            className={`p-4 rounded-[var(--radius-md)] border text-left transition-all ${
              config.experience === e ? 'border-accent bg-accent/10' : 'border-border bg-bg-surface hover:border-accent/50'
            }`}
          >
            <span className="font-semibold text-text-primary">{e}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} className="flex-1">Continue <ArrowRight className="w-4 h-4" /></Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-display">How many days per week?</h3>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5, 6, 7].map(d => (
          <button
            key={d}
            onClick={() => handleDaysPerWeekChange(d)}
            className={`p-4 rounded-[var(--radius-md)] border text-center transition-all ${
              config.daysPerWeek === d ? 'border-accent bg-accent/10' : 'border-border bg-bg-surface hover:border-accent/50'
            }`}
          >
            <span className="font-bold text-xl text-text-primary">{d}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} className="flex-1">Continue <ArrowRight className="w-4 h-4" /></Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-display">Preferred Workout Split?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {['Push / Pull / Legs', 'Upper / Lower', 'Full Body', 'Bro Split / Single Muscle', 'Upper / Lower / Push / Pull', 'Custom Split'].map(s => (
          <button
            key={s}
            onClick={() => updateConfig('splitType', s)}
            className={`p-4 rounded-[var(--radius-md)] border text-left transition-all ${
              config.splitType === s ? 'border-accent bg-accent/10' : 'border-border bg-bg-surface hover:border-accent/50'
            }`}
          >
            <span className="font-semibold text-text-primary">{s}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={prevStep}>Back</Button>
        <Button onClick={() => {
          if (config.splitType === 'Custom Split') {
            const synced = syncCustomScheduleWithDays(config.customSchedule, config.daysPerWeek);
            setConfig(prev => ({ ...prev, customSchedule: synced }));
            setStep(4.5);
          } else {
            setStep(5);
          }
        }} className="flex-1">Continue <ArrowRight className="w-4 h-4" /></Button>
      </div>
    </div>
  );

  const toggleCustomDayRest = (idx) => {
    const newSchedule = [...config.customSchedule];
    newSchedule[idx].isRest = !newSchedule[idx].isRest;
    newSchedule[idx].muscles = [];
    updateConfig('customSchedule', newSchedule);
  };

  const toggleMuscle = (dayIdx, muscle) => {
    const newSchedule = [...config.customSchedule];
    if (newSchedule[dayIdx].muscles.includes(muscle)) {
      newSchedule[dayIdx].muscles = newSchedule[dayIdx].muscles.filter(m => m !== muscle);
    } else {
      newSchedule[dayIdx].muscles.push(muscle);
    }
    updateConfig('customSchedule', newSchedule);
  };

  const allMuscles = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Full Body', 'Cardio'];

  const renderStep4_5 = () => {
    const workoutDaysCount = config.customSchedule.filter(d => !d.isRest).length;
    const warning = workoutDaysCount !== config.daysPerWeek;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold font-display">Custom Schedule Builder</h3>
          <p className="text-sm text-text-secondary">Assign muscles to {config.daysPerWeek} workout days.</p>
          {warning && (
            <p className="text-xs text-warning mt-2">
              You selected {config.daysPerWeek} days/week, but mapped {workoutDaysCount} days.
            </p>
          )}
        </div>

        <div className="space-y-4">
          {config.customSchedule.map((day, idx) => (
            <div key={day.dayName} className="p-4 bg-bg-surface-alt border border-border rounded-[var(--radius-md)]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold">{day.dayName}</span>
                <button 
                  onClick={() => toggleCustomDayRest(idx)}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition-all ${day.isRest ? 'bg-bg-surface text-text-muted border border-border' : 'bg-accent/20 text-accent border border-accent/50'}`}
                >
                  {day.isRest ? 'Rest' : 'Workout'}
                </button>
              </div>

              {!day.isRest && (
                <div className="flex flex-wrap gap-2">
                  {allMuscles.map(m => (
                    <button
                      key={m}
                      onClick={() => toggleMuscle(idx, m)}
                      className={`text-[11px] px-2 py-1 rounded transition-all ${
                        day.muscles.includes(m) ? 'bg-success text-white' : 'bg-bg-surface text-text-secondary border border-border'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                  {day.muscles.length === 0 && (
                    <span className="text-[11px] text-warning">Select at least one muscle group</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex gap-3 mt-4">
          <Button variant="secondary" onClick={() => setStep(4)}>Back</Button>
          <Button onClick={() => setStep(5)} className="flex-1" disabled={warning}>Continue <ArrowRight className="w-4 h-4" /></Button>
        </div>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-display">Where do you train & for how long?</h3>
      
      <div>
        <label className="text-sm font-semibold text-text-secondary mb-2 block">Equipment Availability</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Gym (Full Equipment)', 'Home (Dumbbells/Bands)', 'Minimal Equipment', 'Bodyweight Only'].map(eq => (
            <button
              key={eq}
              onClick={() => updateConfig('equipment', eq)}
              className={`p-3 rounded-[var(--radius-md)] border text-left text-sm transition-all ${
                config.equipment === eq ? 'border-accent bg-accent/10' : 'border-border bg-bg-surface hover:border-accent/50'
              }`}
            >
              <span className="font-semibold text-text-primary">{eq}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <label className="text-sm font-semibold text-text-secondary mb-2 block">Workout Duration</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[30, 45, 60, 75, 90].map(dur => (
            <button
              key={dur}
              onClick={() => updateConfig('durationMin', dur)}
              className={`p-3 rounded-[var(--radius-md)] border text-center transition-all ${
                config.durationMin === dur ? 'border-accent bg-accent/10' : 'border-border bg-bg-surface hover:border-accent/50'
              }`}
            >
              <span className="font-bold text-text-primary">{dur} min</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="secondary" onClick={() => config.splitType === 'Custom Split' ? setStep(4.5) : setStep(4)}>Back</Button>
        <Button onClick={() => onComplete(config)} className="flex-1" loading={loading}>
          Generate AI Plan <Check className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8 space-y-2">
        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Dumbbell className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display">Let's build your workout plan</h2>
        <p className="text-text-muted text-sm">Our AI will generate a highly personalized plan based on your preferences.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${Math.floor(step) >= i ? 'bg-accent' : 'bg-bg-surface-active'}`} />
        ))}
      </div>

      <div className="card-surface p-6 sm:p-8">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 4.5 && renderStep4_5()}
        {step === 5 && renderStep5()}
      </div>
    </div>
  );
}
