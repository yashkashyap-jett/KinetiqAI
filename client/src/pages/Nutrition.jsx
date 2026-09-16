import { useState, useEffect } from 'react';
import { Plus, Droplets, Sparkles, Trash2, Edit2, X } from 'lucide-react';
import Button from '../components/common/Button';
import ProgressRing from '../components/common/ProgressRing';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import api from '../lib/axios';
import toast from 'react-hot-toast';

// Safe display formatting helpers for nutrition values
const formatMacro = (val) => {
  if (val === null || val === undefined || isNaN(Number(val))) return '0.00';
  return Number(val).toFixed(2);
};

const formatCal = (val) => {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const num = Number(val);
  return num % 1 !== 0 ? num.toFixed(2) : Math.round(num).toString();
};

export default function Nutrition() {
  const [plan, setPlan] = useState(null);
  const [dailyData, setDailyData] = useState({ logs: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0, waterMl: 0 } });
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showLogModal, setShowLogModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);

  // Form states
  const [isAILogMode, setIsAILogMode] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [foodAmount, setFoodAmount] = useState('');
  const [aiMealText, setAiMealText] = useState('');
  const [mealType, setMealType] = useState('lunch');
  
  // Analysis & Submitting states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingLogId, setEditingLogId] = useState(null);

  // Smart Swap states
  const [swapQuery, setSwapQuery] = useState('');
  const [swapResult, setSwapResult] = useState(null);
  const [swapping, setSwapping] = useState(false);

  useEffect(() => {
    fetchNutritionData();
  }, []);

  const fetchNutritionData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString();
      const [planRes, dailyRes] = await Promise.all([
        api.get('/nutrition/plan'),
        api.get(`/nutrition/daily/${today}`),
      ]);
      setPlan(planRes.data.plan);
      setDailyData(dailyRes.data);
    } catch (err) {
      toast.error('Failed to load nutrition data');
    } finally {
      setLoading(false);
    }
  };

  const resetModalState = () => {
    setFoodName('');
    setFoodAmount('');
    setAiMealText('');
    setAiAnalysisResult(null);
    setEditingLogId(null);
    setIsAILogMode(false);
  };

  const handleOpenLogModal = () => {
    resetModalState();
    setShowLogModal(true);
  };

  const handleAnalyzeMeal = async (e) => {
    e?.preventDefault();
    try {
      setIsAnalyzing(true);
      const queryText = isAILogMode 
        ? aiMealText 
        : `${foodAmount ? foodAmount + ' of ' : ''}${foodName}`;
      
      const res = await api.post('/ai/analyze-meal', { mealText: queryText }, { timeout: 90000 });
      setAiAnalysisResult(res.data.analysis);
      
      if (!isAILogMode && !res.data.analysis.mealName) {
         res.data.analysis.mealName = foodName;
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        toast.error('AI engine is taking longer than expected. Please try again.');
      } else {
        toast.error(err.response?.data?.error || 'Unable to analyze this meal right now. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveMeal = async () => {
    if (!aiAnalysisResult) return;
    try {
      setSubmitting(true);
      const payload = {
        date: new Date().toISOString(),
        mealType,
        name: aiAnalysisResult.mealName || 'Logged Meal',
        foods: aiAnalysisResult.items.map(item => ({
          name: item.name,
          quantity: item.quantity || 1,
          unit: item.unit || 'serving',
          calories: item.calories || 0,
          protein: item.protein || 0,
          carbs: item.carbs || 0,
          fat: item.fat || 0,
          fiber: item.fiber || 0,
          source: item.source || 'GEMINI_ESTIMATE'
        })),
      };

      if (editingLogId) {
        await api.put(`/nutrition/log/${editingLogId}`, payload);
        toast.success('Meal updated!');
      } else {
        await api.post('/nutrition/log', payload);
        toast.success('Meal logged!');
      }

      setShowLogModal(false);
      resetModalState();
      fetchNutritionData();
    } catch (err) {
      toast.error('Failed to save meal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMeal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meal log?')) return;
    try {
      await api.delete(`/nutrition/log/${id}`);
      toast.success('Meal deleted');
      fetchNutritionData();
    } catch (err) {
      toast.error('Failed to delete meal');
    }
  };

  const handleEditMeal = (log) => {
    resetModalState();
    setEditingLogId(log._id);
    setMealType(log.mealType);
    
    // Convert the existing log into an analysis result preview
    setAiAnalysisResult({
      mealName: log.name,
      items: log.foods,
      total: {
        calories: log.totalCalories,
        protein: log.totalProtein,
        carbs: log.totalCarbs,
        fat: log.totalFat,
      },
      confidence: 'high',
      assumptions: ['Editing an already saved meal.']
    });
    
    setShowLogModal(true);
  };

  const handleAddWater = async (amountMl) => {
    try {
      await api.post('/nutrition/log', {
        date: new Date().toISOString(),
        mealType: 'snack',
        name: 'Water Intake',
        waterMl: amountMl,
      });
      toast.success(`+${amountMl}ml water logged!`);
      fetchNutritionData();
    } catch (err) {
      toast.error('Failed to log water');
    }
  };

  const handleSmartSwap = async (e) => {
    e.preventDefault();
    try {
      setSwapping(true);
      const res = await api.post('/nutrition/swap', { originalFood: swapQuery }, { timeout: 90000 });
      setSwapResult(res.data.swapResult);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        toast.error('AI engine is taking longer than expected. Please try again.');
      } else {
        toast.error('Smart swap failed');
      }
    } finally {
      setSwapping(false);
    }
  };

  const targetCal = plan?.dailyCalories || 2200;
  const targetProt = plan?.macroTargets?.protein || 150;
  const targetCarb = plan?.macroTargets?.carbs || 220;
  const targetFat = plan?.macroTargets?.fat || 65;

  const currentCal = dailyData.totals.calories;
  const currentProt = dailyData.totals.protein;
  const currentCarb = dailyData.totals.carbs;
  const currentFat = dailyData.totals.fat;
  const currentWater = dailyData.totals.waterMl;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Precision Nutrition Engine
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Target: <span className="font-mono text-accent font-semibold">{formatCal(targetCal)} kcal</span> • Protein Target: <span className="font-mono text-success font-semibold">{formatMacro(targetProt)}g</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => setShowSwapModal(true)}>
            <Sparkles className="w-4 h-4 text-warning" />
            Smart Food Swap
          </Button>
          <Button size="sm" onClick={handleOpenLogModal}>
            <Plus className="w-4 h-4" />
            Log Food / Meal
          </Button>
        </div>
      </div>

      {/* Macro Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Calories Ring */}
        <div className="card-surface p-5 flex flex-col items-center justify-center text-center space-y-3">
          <ProgressRing progress={Math.min(100, Math.round((currentCal / targetCal) * 100))} size={100} strokeWidth={8} color="#2563EB">
            <div className="text-center">
              <span className="text-xl font-bold font-mono">{formatCal(currentCal)}</span>
              <span className="text-[10px] block text-text-muted">/ {formatCal(targetCal)} kcal</span>
            </div>
          </ProgressRing>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Calories</span>
        </div>

        {/* Protein */}
        <div className="card-surface p-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-text-muted uppercase">PROTEIN</span>
            <span className="font-mono text-success font-bold">{formatMacro(currentProt)} / {formatMacro(targetProt)}g</span>
          </div>
          <div className="w-full bg-bg-surface-active h-2 rounded-full overflow-hidden">
            <div className="bg-success h-full rounded-full" style={{ width: `${Math.min(100, (currentProt / targetProt) * 100)}%` }} />
          </div>
          <p className="text-[11px] text-text-muted">{formatMacro(Math.max(0, targetProt - currentProt))}g remaining today</p>
        </div>

        {/* Carbs */}
        <div className="card-surface p-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-text-muted uppercase">CARBS</span>
            <span className="font-mono text-accent font-bold">{formatMacro(currentCarb)} / {formatMacro(targetCarb)}g</span>
          </div>
          <div className="w-full bg-bg-surface-active h-2 rounded-full overflow-hidden">
            <div className="bg-accent h-full rounded-full" style={{ width: `${Math.min(100, (currentCarb / targetCarb) * 100)}%` }} />
          </div>
          <p className="text-[11px] text-text-muted">{formatMacro(Math.max(0, targetCarb - currentCarb))}g remaining today</p>
        </div>

        {/* Fat */}
        <div className="card-surface p-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-text-muted uppercase">FAT</span>
            <span className="font-mono text-warning font-bold">{formatMacro(currentFat)} / {formatMacro(targetFat)}g</span>
          </div>
          <div className="w-full bg-bg-surface-active h-2 rounded-full overflow-hidden">
            <div className="bg-warning h-full rounded-full" style={{ width: `${Math.min(100, (currentFat / targetFat) * 100)}%` }} />
          </div>
          <p className="text-[11px] text-text-muted">{formatMacro(Math.max(0, targetFat - currentFat))}g remaining today</p>
        </div>
      </div>

      {/* Hydration Tracker */}
      <div className="card-surface p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-muted flex items-center justify-center">
            <Droplets className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Daily Hydration Tracker</h3>
            <p className="text-xs text-text-muted font-mono">{currentWater} / 3000 ml water logged today</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => handleAddWater(250)}>+250 ml</Button>
          <Button variant="secondary" size="sm" onClick={() => handleAddWater(500)}>+500 ml</Button>
        </div>
      </div>

      {/* Today's Logged Meals */}
      <div className="card-surface p-6 space-y-4">
        <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>Today's Food Log</h2>

        {dailyData.logs?.length === 0 ? (
          <p className="text-xs text-text-muted py-4">No meals logged yet today. Click "Log Food / Meal" to track your nutrition.</p>
        ) : (
          <div className="space-y-3">
            {dailyData.logs.map((log, idx) => (
              <div key={idx} className="p-3 bg-bg-surface-alt rounded border border-border flex items-center justify-between text-xs group">
                <div>
                  <span className="font-bold text-text-primary uppercase mr-2 text-[10px] text-accent font-mono">{log.mealType}</span>
                  <span className="font-medium text-text-primary">{log.name}</span>
                </div>
                <div className="flex items-center gap-4 font-mono text-text-secondary">
                  <span>{formatCal(log.totalCalories)} kcal</span>
                  <span className="text-success font-bold">{formatMacro(log.totalProtein)}g P</span>
                  <span className="hidden sm:inline">{formatMacro(log.totalCarbs)}g C</span>
                  <span className="hidden sm:inline">{formatMacro(log.totalFat)}g F</span>
                  
                  {/* Actions */}
                  {log.name !== 'Water Intake' && (
                    <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditMeal(log)} className="p-1 text-text-muted hover:text-accent rounded transition-colors" title="Edit">
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDeleteMeal(log._id)} className="p-1 text-text-muted hover:text-error rounded transition-colors" title="Delete">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Meal Modal */}
      <Modal isOpen={showLogModal} onClose={() => setShowLogModal(false)} title={editingLogId ? "Edit Meal Log" : "Log Food or Meal"}>
        {!aiAnalysisResult && (
          <div className="flex gap-4 mb-4 border-b border-border pb-2">
            <button 
              type="button"
              className={`text-sm font-semibold pb-2 border-b-2 transition-all ${!isAILogMode ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
              onClick={() => setIsAILogMode(false)}
            >
              Food Name
            </button>
            <button 
              type="button"
              className={`text-sm font-semibold pb-2 border-b-2 transition-all flex items-center gap-1 ${isAILogMode ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
              onClick={() => setIsAILogMode(true)}
            >
              <Sparkles className="w-3 h-3" />
              Natural Language
            </button>
          </div>
        )}

        {!aiAnalysisResult ? (
          <form onSubmit={handleAnalyzeMeal} className="space-y-4">
            {isAILogMode ? (
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Describe what you ate</label>
                <textarea
                  value={aiMealText}
                  onChange={(e) => setAiMealText(e.target.value)}
                  placeholder="e.g. I had two scrambled eggs with a slice of whole wheat toast and a black coffee."
                  className="w-full bg-bg-surface border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:border-accent min-h-[100px] resize-y"
                  required
                />
              </div>
            ) : (
              <div className="space-y-4">
                <Input label="Food / Meal Name" value={foodName} onChange={(e) => setFoodName(e.target.value)} required placeholder="e.g. Grilled Chicken & Rice" />
                <Input label="Quantity (Optional)" value={foodAmount} onChange={(e) => setFoodAmount(e.target.value)} placeholder="e.g. 2 servings, 150g, 1 bowl" />
              </div>
            )}
            
            <Button type="submit" className="w-full" loading={isAnalyzing}>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze Macros
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-bg-surface-alt border border-accent/20 rounded p-4 text-xs space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-accent text-sm">AI Nutrition Estimate</span>
                {aiAnalysisResult.confidence && (
                  <span className="text-[10px] uppercase bg-bg-surface px-2 py-0.5 rounded text-text-muted">Confidence: {aiAnalysisResult.confidence}</span>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-bold text-text-primary text-[10px] uppercase border-b border-border/50 pb-1">Items</h4>
                {aiAnalysisResult.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-bg-surface rounded border border-border">
                    <div>
                      <div className="font-medium text-text-primary flex items-center gap-2 flex-wrap">
                        <span>{item.name}</span>
                        {item.source === 'usda' ? (
                          <span className="px-1.5 py-0.5 rounded bg-success/10 text-success text-[9px] font-semibold uppercase border border-success/20">USDA Verified</span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-[9px] font-semibold uppercase border border-accent/20">AI Estimate</span>
                        )}
                        {item.ambiguous && (
                          <span className="px-1.5 py-0.5 rounded bg-warning/10 text-warning text-[9px] uppercase border border-warning/20">Ambiguous Quantity</span>
                        )}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        {item.quantity || ''} {item.unit || ''}
                      </div>
                    </div>
                    <div className="text-right font-mono text-[10px]">
                      <span className="text-text-primary font-bold">{formatCal(item.calories)} kcal</span>
                      <br />
                      <span className="text-success">{formatMacro(item.protein)}g P</span>
                      <span className="text-text-muted ml-1">· {formatMacro(item.carbs)}g C · {formatMacro(item.fat)}g F</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2 text-center font-mono py-3 border-y border-border/50 bg-bg-surface rounded-lg mt-2">
                <div>
                  <span className="block text-text-muted text-[10px] uppercase mb-1">Calories</span>
                  <span className="font-bold text-sm text-text-primary">{formatCal(aiAnalysisResult.total?.calories || 0)}</span>
                </div>
                <div>
                  <span className="block text-text-muted text-[10px] uppercase mb-1">Protein</span>
                  <span className="font-bold text-sm text-success">{formatMacro(aiAnalysisResult.total?.protein || 0)}g</span>
                </div>
                <div>
                  <span className="block text-text-muted text-[10px] uppercase mb-1">Carbs</span>
                  <span className="font-bold text-sm text-accent">{formatMacro(aiAnalysisResult.total?.carbs || 0)}g</span>
                </div>
                <div>
                  <span className="block text-text-muted text-[10px] uppercase mb-1">Fat</span>
                  <span className="font-bold text-sm text-warning">{formatMacro(aiAnalysisResult.total?.fat || 0)}g</span>
                </div>
              </div>

              {aiAnalysisResult.items.some(i => i.ambiguous) && (
                <div className="p-3 bg-warning/10 text-warning text-[11px] rounded border border-warning/20 leading-relaxed">
                  <strong>Note:</strong> Some quantities were ambiguous. The AI has made its best estimate. If this seems incorrect, discard and be more specific (e.g. "200g of rice" instead of "a bowl of rice").
                </div>
              )}

              <div className="pt-2 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-semibold text-text-primary">Log as Meal Type:</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="bg-bg-surface border border-border rounded px-3 py-1.5 text-xs font-medium text-text-primary outline-none focus:border-accent w-1/2"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="pre_workout">Pre-Workout</option>
                    <option value="post_workout">Post-Workout</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setAiAnalysisResult(null)}>
                    Discard
                  </Button>
                  <Button type="button" className="flex-1" loading={submitting} onClick={handleSaveMeal}>
                    {editingLogId ? 'Update Meal' : 'Save Meal'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Smart Swap Modal */}
      <Modal isOpen={showSwapModal} onClose={() => setShowSwapModal(false)} title="AI Smart Food Swap">
        <form onSubmit={handleSmartSwap} className="space-y-4">
          <Input label="Current Food to Swap" value={swapQuery} onChange={(e) => setSwapQuery(e.target.value)} placeholder="e.g. White Rice, White Bread, Peanut Butter" required />
          <Button type="submit" className="w-full" loading={swapping}>
            Find Macro-Equivalent Swaps
          </Button>

          {swapResult && (
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="text-xs font-bold text-accent uppercase">Recommended Alternatives</h4>
              {swapResult.alternatives?.map((alt, idx) => (
                <div key={idx} className="p-3 bg-bg-surface-alt rounded border border-border text-xs space-y-1">
                  <div className="flex justify-between font-bold text-text-primary">
                    <span>{alt.name} ({alt.amount})</span>
                    <span className="font-mono text-success">{formatMacro(alt.protein)}g P • {formatCal(alt.calories)} kcal</span>
                  </div>
                  <p className="text-[11px] text-text-muted">{alt.reasoning}</p>
                </div>
              ))}
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
