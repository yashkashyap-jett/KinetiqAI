/**
 * Calculates Progress Velocity (rate of weight change over time window)
 */
function calculateProgressVelocity(progressEntries = [], targetWeightKg, currentWeightKg) {
  if (progressEntries.length < 2) {
    return {
      ratePerWeekKg: 0,
      onTrack: true,
      projectedWeeksToGoal: 12,
      trend: 'stable',
    };
  }

  const sorted = [...progressEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
  const oldest = sorted[0];
  const newest = sorted[sorted.length - 1];

  const timeDiffDays = (new Date(newest.date) - new Date(oldest.date)) / (1000 * 60 * 60 * 24);
  if (timeDiffDays <= 0) {
    return { ratePerWeekKg: 0, onTrack: true, projectedWeeksToGoal: 12, trend: 'stable' };
  }

  const weightDiffKg = newest.weightKg - oldest.weightKg;
  const ratePerWeekKg = parseFloat(((weightDiffKg / timeDiffDays) * 7).toFixed(2));

  const distanceToGoalKg = Math.abs(currentWeightKg - targetWeightKg);
  const projectedWeeksToGoal = ratePerWeekKg !== 0 ? Math.abs(Math.round(distanceToGoalKg / ratePerWeekKg)) : 12;

  let trend = 'stable';
  if (ratePerWeekKg > 0.1) trend = 'increasing';
  else if (ratePerWeekKg < -0.1) trend = 'decreasing';

  return {
    ratePerWeekKg,
    onTrack: Math.abs(ratePerWeekKg) >= 0.2 && Math.abs(ratePerWeekKg) <= 1.0,
    projectedWeeksToGoal: Math.max(1, projectedWeeksToGoal),
    trend,
  };
}

module.exports = { calculateProgressVelocity };
