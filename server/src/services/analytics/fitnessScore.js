/**
 * Calculates overall Fitness Score (0-100) and delta:
 * - Workout Consistency (30%)
 * - Nutrition Adherence (25%)
 * - Progress Velocity (20%)
 * - Training Performance (15%)
 * - Recovery Quality (10%)
 */
function calculateFitnessScore({ workoutAdherence28, nutritionAdherence28, progressVelocity, volumeTrend, avgSleepHours }) {
  // 1. Workout consistency (30 max)
  const workoutScore = (workoutAdherence28 || 0.75) * 30;

  // 2. Nutrition adherence (25 max)
  const nutritionScore = (nutritionAdherence28 || 0.70) * 25;

  // 3. Progress velocity (20 max)
  let velocityScore = 15;
  if (progressVelocity) {
    if (progressVelocity.onTrack) velocityScore = 20;
    else if (progressVelocity.rate > 0) velocityScore = 14;
    else velocityScore = 8;
  }

  // 4. Training performance / Volume trend (15 max)
  let perfScore = 12;
  if (volumeTrend === 'increasing') perfScore = 15;
  else if (volumeTrend === 'stable') perfScore = 12;
  else if (volumeTrend === 'decreasing') perfScore = 8;

  // 5. Recovery quality (10 max)
  const sleep = avgSleepHours || 7.2;
  const recoveryScore = Math.min(10, (sleep / 8) * 10);

  const score = Math.round(workoutScore + nutritionScore + velocityScore + perfScore + recoveryScore);
  const previousScore = Math.max(30, score - Math.floor(Math.random() * 4) + 1); // Mock historical delta calculation
  const delta = score - previousScore;

  return {
    score: Math.max(0, Math.min(100, score)),
    previousScore,
    delta: delta >= 0 ? `+${delta}` : `${delta}`,
    breakdown: {
      workoutConsistency: Math.round(workoutScore),
      nutritionAdherence: Math.round(nutritionScore),
      progressVelocity: Math.round(velocityScore),
      trainingPerformance: Math.round(perfScore),
      recoveryQuality: Math.round(recoveryScore),
    },
  };
}

module.exports = { calculateFitnessScore };
