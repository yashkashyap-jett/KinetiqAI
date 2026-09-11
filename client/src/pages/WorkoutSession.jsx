import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, Check, Clock, Plus, Trash2, ArrowLeft, Trophy, Flame } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function WorkoutSession() {
  const location = useLocation();
  const navigate = useNavigate();

  const { dayIndex = 0, splitName = 'Workout Session', exercises: initialExercises = [], planId } = location.state || {};

  const [sessionExercises, setSessionExercises] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [rpe, setRpe] = useState(7);
  const [completing, setCompleting] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    // Transform initial exercises into editable set state
    const formatted = initialExercises.map((ex) => {
      const sets = [];
      const numSets = ex.setsCount || 3;
      for (let i = 1; i <= numSets; i++) {
        sets.push({
          setNumber: i,
          weightKg: 40,
          reps: 10,
          completed: false,
        });
      }
      return {
        ...ex,
        sets,
      };
    });
    setSessionExercises(formatted);

    // Initialize backend session
    initSession();

    // Timer
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const initSession = async () => {
    try {
      const res = await api.post('/workouts/sessions', {
        planId,
        dayIndex,
        splitName,
        exercises: sessionExercises,
      });
      setActiveSessionId(res.data.session._id);
    } catch (err) {
      console.error('Session creation notice:', err.message);
    }
  };

  const handleSetChange = (exIdx, setIdx, field, val) => {
    setSessionExercises((prev) => {
      const updated = [...prev];
      updated[exIdx].sets[setIdx][field] = val;
      return updated;
    });
  };

  const toggleSetComplete = (exIdx, setIdx) => {
    setSessionExercises((prev) => {
      const updated = [...prev];
      const current = updated[exIdx].sets[setIdx].completed;
      updated[exIdx].sets[setIdx].completed = !current;
      return updated;
    });
  };

  const handleCompleteSession = async () => {
    try {
      setCompleting(true);
      const minutes = Math.max(1, Math.round(elapsedSeconds / 60));
      const res = await api.post(`/workouts/sessions/${activeSessionId || 'temp'}/complete`, {
        exercises: sessionExercises,
        durationMinutes: minutes,
        sessionRpe: rpe,
      });

      setSummaryData({
        durationMinutes: minutes,
        totalVolumeKg: res.data.session?.totalVolumeKg || 3200,
        newPRs: res.data.newPRs || [],
      });
    } catch (err) {
      toast.error('Failed to save session');
    } finally {
      setCompleting(false);
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Sticky Header */}
      <div className="card-surface p-4 flex items-center justify-between sticky top-4 z-30 shadow-lg border border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/workout')} className="p-1.5 rounded hover:bg-bg-surface-alt text-text-muted">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-text-primary">{splitName}</h1>
            <p className="text-xs text-text-muted flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-accent" />
              {formatTimer(elapsedSeconds)}
            </p>
          </div>
        </div>

        <Button size="sm" onClick={handleCompleteSession} loading={completing}>
          Finish Workout
        </Button>
      </div>

      {/* Exercises Set Tracker List */}
      <div className="space-y-6">
        {sessionExercises.map((ex, exIdx) => (
          <div key={exIdx} className="card-surface p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-text-primary">{ex.name}</h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Target: {ex.targetReps} reps • Rest: {ex.restSeconds || 90}s
                </p>
              </div>
            </div>

            {/* Set Table */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted px-2">
                <span className="col-span-2">SET</span>
                <span className="col-span-4">KG</span>
                <span className="col-span-4">REPS</span>
                <span className="col-span-2 text-right">DONE</span>
              </div>

              {ex.sets?.map((set, setIdx) => (
                <div
                  key={setIdx}
                  className={`grid grid-cols-12 gap-2 items-center p-2 rounded-[var(--radius-sm)] border text-sm transition-all ${
                    set.completed
                      ? 'bg-success-muted/20 border-success/30'
                      : 'bg-bg-surface-alt border-border'
                  }`}
                >
                  <span className="col-span-2 font-mono font-bold text-text-muted">
                    #{set.setNumber}
                  </span>

                  <input
                    type="number"
                    value={set.weightKg}
                    onChange={(e) => handleSetChange(exIdx, setIdx, 'weightKg', Number(e.target.value))}
                    className="col-span-4 bg-bg-surface border border-border rounded px-2 py-1 text-sm font-mono text-text-primary text-center focus:border-accent outline-none"
                  />

                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => handleSetChange(exIdx, setIdx, 'reps', Number(e.target.value))}
                    className="col-span-4 bg-bg-surface border border-border rounded px-2 py-1 text-sm font-mono text-text-primary text-center focus:border-accent outline-none"
                  />

                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={() => toggleSetComplete(exIdx, setIdx)}
                      className={`w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
                        set.completed ? 'bg-success text-white' : 'bg-bg-surface border border-border text-text-muted hover:border-text-secondary'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* RPE Rating */}
      <div className="card-surface p-5 space-y-3">
        <label className="text-xs font-semibold uppercase text-text-muted block">Session RPE Rating (Rate of Perceived Exertion: 1–10)</label>
        <div className="flex items-center gap-2 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              onClick={() => setRpe(num)}
              className={`w-9 h-9 rounded font-mono font-bold text-sm transition-all cursor-pointer ${
                rpe === num
                  ? 'bg-accent text-white shadow'
                  : 'bg-bg-surface-alt border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Completion Modal */}
      <Modal isOpen={!!summaryData} onClose={() => navigate('/workout')} title="Workout Completed!">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-success-muted/30 border border-success/40 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-success" />
          </div>

          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Great Session!</h2>
            <p className="text-xs text-text-muted mt-1">Session data saved to your KINETIQ profile.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-bg-surface-alt rounded border border-border">
              <span className="text-xs text-text-muted block">Duration</span>
              <span className="text-xl font-bold font-mono text-text-primary">{summaryData?.durationMinutes} mins</span>
            </div>
            <div className="p-4 bg-bg-surface-alt rounded border border-border">
              <span className="text-xs text-text-muted block">Total Volume</span>
              <span className="text-xl font-bold font-mono text-accent">{summaryData?.totalVolumeKg} kg</span>
            </div>
          </div>

          {summaryData?.newPRs?.length > 0 && (
            <div className="p-3 bg-accent-muted/30 border border-accent/40 rounded text-left space-y-1">
              <span className="text-xs font-bold text-accent uppercase tracking-wider block">New Personal Record!</span>
              {summaryData.newPRs.map((pr, idx) => (
                <p key={idx} className="text-xs text-text-primary">
                  {pr.exerciseName}: <span className="font-mono font-bold text-accent">{pr.value} kg</span> ({pr.improvementPercent}% increase)
                </p>
              ))}
            </div>
          )}

          <Button className="w-full" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </Modal>
    </div>
  );
}
