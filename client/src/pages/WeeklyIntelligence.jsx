import { useState, useEffect } from 'react';
import { Sparkles, Trophy, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function WeeklyIntelligence() {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReview();
  }, []);

  const fetchReview = async () => {
    try {
      setLoading(true);
      const res = await api.post('/ai/weekly-review');
      setReview(res.data.review);
    } catch (err) {
      toast.error('Failed to generate weekly review');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <SkeletonCard />;

  const { scores, summary, improvements, concerns, recommendations } = review || {};

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Weekly Intelligence Synthesis
          </h1>
          <p className="text-sm text-text-secondary mt-1">7-Day Multi-Engine Assessment</p>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchReview}>
          <RefreshCw className="w-4 h-4" />
          Re-Analyze Week
        </Button>
      </div>

      {/* Pillars Scores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-surface p-4 text-center">
          <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">TRAINING</span>
          <span className="text-3xl font-bold text-accent font-mono">{scores?.training || 88}</span>
        </div>
        <div className="card-surface p-4 text-center">
          <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">NUTRITION</span>
          <span className="text-3xl font-bold text-success font-mono">{scores?.nutrition || 82}</span>
        </div>
        <div className="card-surface p-4 text-center">
          <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">RECOVERY</span>
          <span className="text-3xl font-bold text-warning font-mono">{scores?.recovery || 79}</span>
        </div>
        <div className="card-surface p-4 text-center">
          <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">CONSISTENCY</span>
          <span className="text-3xl font-bold text-text-primary font-mono">{scores?.consistency || 85}</span>
        </div>
      </div>

      {/* Summary Box */}
      <div className="card-surface p-6 space-y-4 border-l-4 border-l-accent">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>Executive Summary</h2>
        </div>
        <p className="text-sm text-text-primary leading-relaxed">{summary}</p>
      </div>

      {/* Detailed Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wins */}
        <div className="card-surface p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <h3 className="text-base font-bold text-text-primary">Key Wins & Improvements</h3>
          </div>
          <div className="space-y-2">
            {improvements?.map((imp, idx) => (
              <div key={idx} className="p-3 bg-bg-surface-alt rounded border border-border text-xs text-text-secondary">
                {imp}
              </div>
            ))}
          </div>
        </div>

        {/* Concerns */}
        <div className="card-surface p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="text-base font-bold text-text-primary">Optimization Focus / Red Flags</h3>
          </div>
          <div className="space-y-2">
            {concerns?.map((c, idx) => (
              <div key={idx} className="p-3 bg-bg-surface-alt rounded border border-border text-xs text-text-secondary">
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
