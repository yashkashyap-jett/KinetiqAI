import { useState, useEffect } from 'react';
import { TrendingUp, Trophy, Plus, Moon, Zap, Activity } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function Progress() {
  const [data, setData] = useState({ entries: [], prs: [], profile: null });
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);

  const [weightKg, setWeightKg] = useState('');
  const [sleepHours, setSleepHours] = useState('8');
  const [sleepQuality, setSleepQuality] = useState('8');
  const [energyLevel, setEnergyLevel] = useState('8');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await api.get('/progress');
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgress = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/progress', {
        weightKg,
        sleepHours,
        sleepQuality,
        energyLevel,
      });
      toast.success('Progress entry logged!');
      setShowLogModal(false);
      fetchProgress();
    } catch (err) {
      toast.error('Failed to log progress');
    } finally {
      setSubmitting(false);
    }
  };

  const { entries, prs, profile } = data;
  const latestWeight = entries?.length > 0 ? entries[entries.length - 1].weightKg : profile?.weight || 75;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Progress & Performance Analytics
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Current Weight: <span className="font-mono text-accent font-semibold">{latestWeight} kg</span> • Target: <span className="font-mono text-text-primary font-semibold">{profile?.targetWeight || 75} kg</span>
          </p>
        </div>
        <Button size="sm" onClick={() => setShowLogModal(true)}>
          <Plus className="w-4 h-4" />
          Log Weight / Recovery
        </Button>
      </div>

      {/* Progress History Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weight History Timeline */}
        <div className="card-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>Body Weight Log</h2>
            <Badge variant="accent">Recent Entries</Badge>
          </div>

          <div className="space-y-3">
            {entries?.map((e, idx) => (
              <div key={idx} className="p-3 bg-bg-surface-alt rounded border border-border flex items-center justify-between text-xs">
                <span className="text-text-muted font-mono">{new Date(e.date).toLocaleDateString()}</span>
                <span className="font-mono font-bold text-accent text-sm">{e.weightKg} kg</span>
                <span className="text-text-secondary">Sleep: {e.sleepHours || 7}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* PRs Grid */}
        <div className="card-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning" />
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>Personal Records (PRs)</h2>
            </div>
            <Badge variant="warning">Detected PRs</Badge>
          </div>

          {prs?.length === 0 ? (
            <p className="text-xs text-text-muted py-4">No PRs recorded yet. Complete workout sessions to automatically detect strength PRs.</p>
          ) : (
            <div className="space-y-3">
              {prs?.map((pr, idx) => (
                <div key={idx} className="p-3 bg-bg-surface-alt rounded border border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-text-primary block">{pr.exerciseName}</span>
                    <span className="text-[10px] text-text-muted">Previous: {pr.previousValue || 0} kg</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-success text-sm block">{pr.value} kg</span>
                    <span className="text-[10px] text-success">+{pr.improvementPercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Log Modal */}
      <Modal isOpen={showLogModal} onClose={() => setShowLogModal(false)} title="Log Daily Metrics">
        <form onSubmit={handleAddProgress} className="space-y-4">
          <Input label="Today's Weight (kg)" type="number" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} required placeholder="e.g. 78.5" />
          <div className="grid grid-cols-3 gap-2">
            <Input label="Sleep (hours)" type="number" step="0.5" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} required />
            <Input label="Sleep Quality (1-10)" type="number" min="1" max="10" value={sleepQuality} onChange={(e) => setSleepQuality(e.target.value)} required />
            <Input label="Energy Level (1-10)" type="number" min="1" max="10" value={energyLevel} onChange={(e) => setEnergyLevel(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" loading={submitting}>
            Save Entry
          </Button>
        </form>
      </Modal>
    </div>
  );
}
