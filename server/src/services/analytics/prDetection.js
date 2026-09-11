/**
 * Detects Personal Records (PRs) from completed workout session exercises
 */
function detectPRs(sessionExercises = [], existingPRs = []) {
  const newPRs = [];

  const prMap = new Map();
  existingPRs.forEach((pr) => {
    prMap.set(pr.exerciseName.toLowerCase(), pr.value);
  });

  sessionExercises.forEach((ex) => {
    if (!ex.sets || ex.sets.length === 0) return;

    let maxWeight = 0;
    let maxReps = 0;

    ex.sets.forEach((set) => {
      if (set.completed && set.weightKg > maxWeight) {
        maxWeight = set.weightKg;
        maxReps = set.reps;
      }
    });

    if (maxWeight > 0) {
      const exKey = ex.name.toLowerCase();
      const currentBest = prMap.get(exKey) || 0;

      if (maxWeight > currentBest) {
        const improvement = currentBest > 0 ? parseFloat((((maxWeight - currentBest) / currentBest) * 100).toFixed(1)) : 100;

        newPRs.push({
          exerciseName: ex.name,
          value: maxWeight,
          metricType: 'weight',
          reps: maxReps,
          previousValue: currentBest,
          improvementPercent: improvement,
        });
      }
    }
  });

  return newPRs;
}

module.exports = { detectPRs };
