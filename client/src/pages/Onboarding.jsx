import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import api from '../lib/axios';

import StepAboutYou from '../components/onboarding/StepAboutYou';
import StepGoal from '../components/onboarding/StepGoal';
import StepExperience from '../components/onboarding/StepExperience';
import StepTraining from '../components/onboarding/StepTraining';
import StepNutrition from '../components/onboarding/StepNutrition';
import StepLifestyle from '../components/onboarding/StepLifestyle';
import BuildingProfile from '../components/onboarding/BuildingProfile';

const STEPS = [
  { key: 'about', label: 'About You', component: StepAboutYou },
  { key: 'goal', label: 'Your Goal', component: StepGoal },
  { key: 'experience', label: 'Experience', component: StepExperience },
  { key: 'training', label: 'Training', component: StepTraining },
  { key: 'nutrition', label: 'Nutrition', component: StepNutrition },
  { key: 'lifestyle', label: 'Lifestyle', component: StepLifestyle },
];

const initialData = {
  age: '',
  gender: '',
  height: '',
  weight: '',
  targetWeight: '',
  fitnessGoal: '',
  fitnessLevel: '',
  workoutDaysPerWeek: 4,
  avgWorkoutDuration: 60,
  workoutLocation: '',
  equipment: [],
  dietaryPreference: '',
  allergies: [],
  dislikedFoods: [],
  preferredFoods: [],
  mealsPerDay: 3,
  foodBudget: 'moderate',
  sleepDuration: 7,
  dailyActivity: '',
  workSchedule: '',
  stressLevel: '',
};

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [building, setBuilding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { updateUser, user } = useAuth();
  const navigate = useNavigate();

  const updateData = (updates) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.age && data.gender && data.height && data.weight;
      case 1: return data.fitnessGoal;
      case 2: return data.fitnessLevel;
      case 3: return data.workoutDaysPerWeek && data.workoutLocation;
      case 4: return data.dietaryPreference;
      case 5: return data.sleepDuration && data.dailyActivity && data.workSchedule && data.stressLevel;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setBuilding(true);
    setSubmitting(true);

    try {
      // Clean data — convert string numbers to actual numbers
      const payload = {
        ...data,
        age: Number(data.age),
        height: Number(data.height),
        weight: Number(data.weight),
        targetWeight: data.targetWeight ? Number(data.targetWeight) : Number(data.weight),
        workoutDaysPerWeek: Number(data.workoutDaysPerWeek),
        avgWorkoutDuration: Number(data.avgWorkoutDuration),
        mealsPerDay: Number(data.mealsPerDay),
        sleepDuration: Number(data.sleepDuration),
      };

      await api.post('/users/profile/onboarding', payload);

      // Update user state
      updateUser({ ...user, onboardingComplete: true });

      // Show building animation for a moment
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast.success('Your fitness profile is ready!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save profile');
      setBuilding(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (building) {
    return <BuildingProfile />;
  }

  const StepComponent = STEPS[currentStep].component;

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[var(--radius-md)] bg-accent flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              KINETIQ
            </span>
          </div>
          <span className="text-xs text-text-muted">
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-0.5 bg-border">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <StepComponent data={data} updateData={updateData} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-border px-4 sm:px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            loading={submitting}
          >
            {currentStep === STEPS.length - 1 ? (
              <>
                Build My Plan
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
