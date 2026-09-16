import { useState, useEffect } from 'react';
import { Trophy, Plus, Edit2, Trash2, Calendar, Award, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function PersonalRecords() {
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingPrId, setEditingPrId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchPRs();
  }, []);

  const fetchPRs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/personal-records');
      setPrs(res.data.personalRecords || res.data.prs || []);
    } catch (err) {
      toast.error('Failed to load personal records');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = (presetName = '') => {
    setEditingPrId(null);
    setExerciseName(presetName || '');
    setWeight('');
    setReps('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowModal(true);
  };

  const handleOpenEditModal = (pr) => {
    setEditingPrId(pr._id);
    setExerciseName(pr.exerciseName || '');
    setWeight(pr.weight != null ? pr.weight : pr.value != null ? pr.value : '');
    setReps(pr.reps || 1);
    setDate(
      pr.achievedAt
        ? new Date(pr.achievedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
    );
    setShowModal(true);
  };

  const handleSavePR = async (e) => {
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
      const payload = {
        exerciseName: exerciseName.trim(),
        weight: numWeight,
        reps: numReps,
        date,
      };

      if (editingPrId) {
        await api.put(`/personal-records/${editingPrId}`, payload);
        toast.success('Personal record updated!');
      } else {
        await api.post('/personal-records', payload);
        toast.success('Personal record created!');
      }

      setShowModal(false);
      fetchPRs();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save personal record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePR = async (id) => {
    if (!window.confirm('Are you sure you want to delete this personal record?')) return;
    try {
      await api.delete(`/personal-records/${id}`);
      toast.success('Personal record deleted');
      setPrs((prev) => prev.filter((pr) => pr._id !== id));
    } catch (err) {
      toast.error('Failed to delete personal record');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const commonLifts = ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Permanent PR Notice */}
      <div className="p-4 rounded-[var(--radius-md)] bg-warning-muted/20 border border-warning/30 flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-text-primary">
            Permanent Personal Records (PR)
          </p>
          <p className="text-text-secondary leading-relaxed">
            Personal records are permanent and never expire. You have complete control to manually add, edit, or delete any record at any time.
          </p>
        </div>
      </div>

      {/* Header & Add Button */}
      <div className="card-surface p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning" />
              <h2 className="text-lg font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                All-Time Personal Records
              </h2>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Track your highest single-set strength achievements across core lifts and custom movements.
            </p>
          </div>

          <Button onClick={() => handleOpenAddModal()}>
            <Plus className="w-4 h-4 mr-1" />
            Add PR
          </Button>
        </div>

        {/* Quick Add Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-text-muted">Quick Presets:</span>
          {commonLifts.map((name) => (
            <button
              key={name}
              onClick={() => handleOpenAddModal(name)}
              className="px-2.5 py-1 rounded text-xs bg-bg-surface-alt hover:bg-bg-surface-active text-text-secondary hover:text-text-primary border border-border transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-warning" />
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* PR Cards Grid */}
      {loading ? (
        <p className="text-xs text-text-muted py-6 text-center">Loading personal records...</p>
      ) : prs.length === 0 ? (
        <div className="card-surface p-8 text-center space-y-3">
          <Award className="w-10 h-10 text-warning mx-auto" />
          <h3 className="text-base font-bold text-text-primary">No Personal Records Yet</h3>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            Record your best lifts like Bench Press, Squat, and Deadlift. Click "Add PR" above to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {prs.map((pr) => {
            const displayWeight = pr.weight != null ? pr.weight : pr.value != null ? pr.value : 0;
            return (
              <div
                key={pr._id}
                className="card-surface p-5 rounded-[var(--radius-md)] border border-border hover:border-warning/40 transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-full bg-warning-muted flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-warning" />
                    </div>
                    <Badge variant="warning">PR</Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-text-primary text-base">{pr.exerciseName}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-text-muted mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(pr.achievedAt || pr.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-end justify-between">
                  <div className="font-mono">
                    <span className="text-2xl font-bold text-text-primary">{displayWeight}</span>
                    <span className="text-xs text-text-muted ml-1">kg</span>
                    <span className="text-xs text-text-secondary block mt-0.5">× {pr.reps} reps</span>
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(pr)}
                      className="p-1.5 rounded text-text-muted hover:text-accent hover:bg-bg-surface-alt transition-colors cursor-pointer"
                      title="Edit PR"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePR(pr._id)}
                      className="p-1.5 rounded text-text-muted hover:text-error hover:bg-error-muted/20 transition-colors cursor-pointer"
                      title="Delete PR"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit PR Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPrId ? 'Edit Personal Record' : 'Add Personal Record'}
      >
        <form onSubmit={handleSavePR} className="space-y-4">
          <Input
            label="Exercise Name"
            placeholder="e.g. Bench Press, Squat, Deadlift, Barbell Row..."
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
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

          <Input
            label="Date Achieved"
            type="date"
            value={date}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={submitting}>
              {editingPrId ? 'Update PR' : 'Save PR'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
