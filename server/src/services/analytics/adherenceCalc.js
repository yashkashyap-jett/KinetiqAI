/**
 * Calculates Workout and Nutrition Adherence
 */
function calculateAdherence({ plannedSessionsCount = 4, completedSessionsCount = 3, mealLogs = [], targetCalories = 2200, targetProtein = 150 }) {
  // Workout adherence %
  const workoutAdherence = Math.min(1.0, completedSessionsCount / Math.max(1, plannedSessionsCount));

  // Nutrition adherence % based on macro logs
  let validMealDays = 0;
  if (mealLogs.length > 0) {
    mealLogs.forEach((log) => {
      const calDiff = Math.abs((log.totalCalories || 0) - targetCalories) / targetCalories;
      const protDiff = Math.abs((log.totalProtein || 0) - targetProtein) / targetProtein;
      if (calDiff <= 0.15 && protDiff <= 0.2) {
        validMealDays += 1;
      }
    });
  }

  const nutritionAdherence = mealLogs.length > 0 ? validMealDays / mealLogs.length : 0.75;

  return {
    workoutAdherence: parseFloat(workoutAdherence.toFixed(2)),
    nutritionAdherence: parseFloat(nutritionAdherence.toFixed(2)),
    workoutPercentage: Math.round(workoutAdherence * 100),
    nutritionPercentage: Math.round(nutritionAdherence * 100),
  };
}

module.exports = { calculateAdherence };
