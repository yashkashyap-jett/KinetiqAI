import { useState, useEffect } from 'react';
import { Target, Plus, Check, Flame } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const res = await api.get('/habits');
      setHabits(res.data.habits);
    } catch (err) {
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await api.post(`/habits/${id}/toggle`);
      setHabits((prev) => prev.map((h) => (h._id === id ? res.data.habit : h)));
      toast.success('Habit updated!');
    } catch (err) {
      toast.error('Failed to toggle habit');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/habits', { name, category });
      toast.success('Habit created!');
      setShowAddModal(false);
      setName('');
      fetchHabits();
    } catch (err) {
      toast.error('Failed to create habit');
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Behavioral Habit Engine
          </h1>
          <p className="text-sm text-text-secondary mt-1">Daily consistency feeds into Engine 1 Readiness calculation.</p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Add Habit
        </Button>
      </div>

      <div className="space-y-4">
        {habits.map((habit) => {
          const isDone = habit.completionDates?.includes(todayStr);
          return (
            <div
              key={habit._id}
              className={`p-4 rounded-[var(--radius-md)] border flex items-center justify-between transition-all ${
                isDone ? 'bg-success-muted/20 border-success/30' : 'card-surface'
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggle(habit._id)}
                  className={`w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer ${
                    isDone ? 'bg-success text-white' : 'bg-bg-surface border border-border text-text-muted hover:border-text-secondary'
                  }`}
                >
                  <Check className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">{habit.name}</h3>
                  <p className="text-xs text-text-muted capitalize">Category: {habit.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-warning">
                  <Flame className="w-4 h-4 fill-current text-warning" />
                  {habit.currentStreak || 0} day streak
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Habit">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Habit Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. 10,000 daily steps" />
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-bg-surface border border-border rounded px-3 py-2 text-sm text-text-primary outline-none"
            >
              <option value="nutrition">Nutrition</option>
              <option value="recovery">Recovery</option>
              <option value="training">Training</option>
              <option value="mindset">Mindset</option>
              <option value="general">General</option>
            </select>
          </div>
          <Button type="submit" className="w-full" loading={submitting}>
            Save Habit
          </Button>
        </form>
      </Modal>
    </div>
  );
}
