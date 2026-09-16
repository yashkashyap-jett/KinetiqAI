import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Clock, Dumbbell, Info } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Badge from '../common/Badge';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function ManualWorkoutLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchWorkoutLogs();
  }, []);

  const fetchWorkoutLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/workout-logs');
      setLogs(res.data.logs || []);
    } catch (err) {
      toast.error('Failed to load recent workout logs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();

    if (!exerciseName.trim()) {
      toast.error('Please enter an exercise name');
      return;
    }

    const numWeight = parseFloat(weight);
    if (isNaN(numWeight) || numWeight <= 0) {
      toast.error('Please enter a valid positive weight');
      return;
    }

    const numReps = parseInt(reps, 10);
    if (isNaN(numReps) || numReps <= 0) {
      toast.error('Please enter a valid positive number of reps');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/workout-logs', {
        exerciseName: exerciseName.trim(),
        weight: numWeight,
        reps: numReps,
        date,
      });

      toast.success('Workout log recorded!');
      setExerciseName('');
      setWeight('');
      setReps('');
      fetchWorkoutLogs();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save workout log');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLog = async (id) => {
    if (!window.confirm('Delete this workout log?')) return;
    try {
      await api.delete(`/workout-logs/${id}`);
      toast.success('Log deleted');
      setLogs((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      toast.error('Failed to delete workout log');
    }
  };

  const formatDaysAgo = (dateStr) => {
    const logDate = new Date(dateStr);
    const today = new Date();
    // Compare date parts
    const diffTime = today.setHours(0, 0, 0, 0) - logDate.setHours(0, 0, 0, 0);
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const formatWeekday = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  // Quick suggestions for easy entry
  const quickSuggestions = [
    'Bench Press',
    'Squat',
    'Deadlift',
    'Incline Dumbbell Press',
    'Overhead Press',
    'Barbell Row',
    'Lat Pulldown',
    'Leg Press',
    'Cable Fly',
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 7-Day Retention Notice */}
      <div className="p-4 rounded-[var(--radius-md)] bg-accent-muted/20 border border-accent/30 flex items-start gap-3 text-xs">
        <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-text-primary">
            7-Day Rolling History for Session Reference
          </p>
          <p className="text-text-secondary leading-relaxed">
            Manual logs record what you lifted recently and automatically expire after 7 days.
            This gives you clean performance benchmarks for next week's session without permanent clutter.
          </p>
        </div>
      </div>

      {/* Manual Entry Form */}
      <div className="card-surface p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-accent" />
            <h2 className="text-base font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
              Log Completed Lift
            </h2>
          </div>
          <Badge variant="accent">Manual Tracking</Badge>
        </div>

        <form onSubmit={handleAddLog} className="space-y-4">
          <div>
            <Input
              label="Exercise Name"
              placeholder="e.g. Bench Press, Incline Dumbbell Press, Cable Fly..."
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              required
            />
            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-text-muted mr-1">Quick Suggestions:</span>
              {quickSuggestions.map((name) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setExerciseName(name)}
                  className="px-2 py-0.5 rounded text-[11px] bg-bg-surface-alt hover:bg-bg-surface-active text-text-secondary hover:text-text-primary border border-border transition-colors cursor-pointer"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Input
                label="Weight (kg)"
                type="number"
                step="0.5"
                min="0.5"
                placeholder="e.g. 100"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                label="Reps"
                type="number"
                step="1"
                min="1"
                placeholder="e.g. 8"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                label="Date"
                type="date"
                value={date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full sm:w-auto" loading={submitting}>
            <Plus className="w-4 h-4 mr-1" />
            Add Workout Log
          </Button>
        </form>
      </div>

      {/* Recent Logs List */}
      <div className="card-surface p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-text-muted" />
            <h2 className="text-base font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
              Recent Workout Logs (Past 7 Days)
            </h2>
          </div>
          <span className="text-xs font-mono text-text-muted">
            {logs.length} {logs.length === 1 ? 'log' : 'logs'} active
          </span>
        </div>

        {loading ? (
          <p className="text-xs text-text-muted py-6 text-center">Loading recent workout logs...</p>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center bg-bg-surface-alt rounded-[var(--radius-md)] border border-border space-y-2">
            <Clock className="w-8 h-8 text-text-muted mx-auto" />
            <p className="text-sm font-semibold text-text-primary">No recent workout logs found</p>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Use the form above to log exercises you lifted this week. Records remain available for 7 days so you know your weights for next time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log._id}
                className="p-4 bg-bg-surface-alt rounded-[var(--radius-md)] border border-border flex items-center justify-between gap-4 text-xs group hover:border-accent/30 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary text-sm">{log.exerciseName}</span>
                    <Badge variant="default">{formatDaysAgo(log.performedAt)}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-text-muted">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatWeekday(log.performedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <span className="text-base font-bold text-accent">{log.weight} kg</span>
                    <span className="text-text-muted block text-[11px]">× {log.reps} reps</span>
                  </div>

                  <button
                    onClick={() => handleDeleteLog(log._id)}
                    className="p-2 text-text-muted hover:text-error rounded hover:bg-error-muted/20 transition-colors cursor-pointer"
                    title="Delete log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
