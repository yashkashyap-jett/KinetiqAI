import { useState, useEffect } from 'react';
import { User, RefreshCw, Save, Activity } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/profile');
      setProfile(res.data.profile);
    } catch (err) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRegeneratePlans = async () => {
    try {
      setRegenerating(true);
      await api.post('/workouts/generate', {}, { timeout: 90000 });
      await api.post('/nutrition/generate', {}, { timeout: 90000 });
      toast.success('AI Workout & Meal Plans regenerated successfully!');
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        toast.error('AI engine is taking longer than expected. Please try again.');
      } else {
        toast.error('Regeneration failed');
      }
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Athlete Profile & Intelligence Configuration
          </h1>
          <p className="text-sm text-text-secondary mt-1">Manage physical metrics & AI engine parameters</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleRegeneratePlans} loading={regenerating}>
          <RefreshCw className="w-4 h-4" />
          Regenerate All AI Plans
        </Button>
      </div>

      {/* Account Info */}
      <div className="card-surface p-6 space-y-6">
        <h2 className="text-lg font-bold border-b border-border pb-3" style={{ fontFamily: 'var(--font-display)' }}>
          User Account
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-text-muted block">Full Name</span>
            <span className="text-sm font-semibold text-text-primary">{user?.name}</span>
          </div>
          <div>
            <span className="text-xs text-text-muted block">Email Address</span>
            <span className="text-sm font-semibold text-text-primary">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Physical & Fitness Settings */}
      {profile && (
        <div className="card-surface p-6 space-y-6">
          <h2 className="text-lg font-bold border-b border-border pb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Physical & Training Profile
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-bg-surface-alt rounded border border-border">
              <span className="text-[10px] uppercase font-semibold text-text-muted block">AGE</span>
              <span className="text-base font-bold font-mono text-text-primary">{profile.age} years</span>
            </div>
            <div className="p-3 bg-bg-surface-alt rounded border border-border">
              <span className="text-[10px] uppercase font-semibold text-text-muted block">HEIGHT</span>
              <span className="text-base font-bold font-mono text-text-primary">{profile.height} cm</span>
            </div>
            <div className="p-3 bg-bg-surface-alt rounded border border-border">
              <span className="text-[10px] uppercase font-semibold text-text-muted block">WEIGHT</span>
              <span className="text-base font-bold font-mono text-accent">{profile.weight} kg</span>
            </div>
            <div className="p-3 bg-bg-surface-alt rounded border border-border">
              <span className="text-[10px] uppercase font-semibold text-text-muted block">TARGET WEIGHT</span>
              <span className="text-base font-bold font-mono text-success">{profile.targetWeight} kg</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-bg-surface-alt rounded border border-border space-y-1">
              <span className="font-semibold text-text-muted uppercase block">Fitness Goal</span>
              <span className="text-sm font-bold text-text-primary capitalize">{profile.fitnessGoal?.replace('_', ' ')}</span>
            </div>
            <div className="p-4 bg-bg-surface-alt rounded border border-border space-y-1">
              <span className="font-semibold text-text-muted uppercase block">Training Level</span>
              <span className="text-sm font-bold text-accent capitalize">{profile.fitnessLevel}</span>
            </div>
            <div className="p-4 bg-bg-surface-alt rounded border border-border space-y-1">
              <span className="font-semibold text-text-muted uppercase block">Dietary Preference</span>
              <span className="text-sm font-bold text-text-primary capitalize">{profile.dietaryPreference}</span>
            </div>
            <div className="p-4 bg-bg-surface-alt rounded border border-border space-y-1">
              <span className="font-semibold text-text-muted uppercase block">Weekly Training Frequency</span>
              <span className="text-sm font-bold text-text-primary">{profile.workoutDaysPerWeek} days / week</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
