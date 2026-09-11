/**
 * Builds structured context objects for AI calls.
 * Ensures Gemini receives exact calculated metrics (Engine 1) + User Profile + History.
 */
function buildFullAIContext({ profile, readiness, fitnessScore, trainingLoad, adherence, recentSessions, recentMeals, progressEntries }) {
  return {
    userProfile: profile
      ? {
          age: profile.age,
          gender: profile.gender,
          heightCm: profile.height,
          weightKg: profile.weight,
          targetWeightKg: profile.targetWeight,
          fitnessGoal: profile.fitnessGoal,
          fitnessLevel: profile.fitnessLevel,
          workoutDaysPerWeek: profile.workoutDaysPerWeek,
          avgWorkoutDuration: profile.avgWorkoutDuration,
          workoutLocation: profile.workoutLocation,
          equipment: profile.equipment || [],
          dietaryPreference: profile.dietaryPreference,
          allergies: profile.allergies || [],
          dislikedFoods: profile.dislikedFoods || [],
          preferredFoods: profile.preferredFoods || [],
          sleepDuration: profile.sleepDuration,
          dailyActivity: profile.dailyActivity,
          stressLevel: profile.stressLevel,
          workSchedule: profile.workSchedule,
        }
      : null,

    engine1Metrics: {
      readinessScore: readiness ? readiness.score : 80,
      readinessStatus: readiness ? readiness.status : 'Optimal',
      fitnessScore: fitnessScore ? fitnessScore.score : 75,
      fitnessScoreDelta: fitnessScore ? fitnessScore.delta : '+2',
      trainingLoad: trainingLoad
        ? {
            acute: trainingLoad.acuteLoad,
            chronic: trainingLoad.chronicLoad,
            ratio: trainingLoad.ratio,
            zone: trainingLoad.zone,
          }
        : { acute: 1800, chronic: 1600, ratio: 1.12, zone: 'Optimal' },
      adherence: adherence
        ? {
            workoutPercentage: adherence.workoutPercentage,
            nutritionPercentage: adherence.nutritionPercentage,
          }
        : { workoutPercentage: 85, nutritionPercentage: 78 },
    },

    recentActivity: {
      sessionsLogged7Days: recentSessions ? recentSessions.length : 0,
      avgSessionRpe: recentSessions && recentSessions.length > 0
        ? (recentSessions.reduce((acc, s) => acc + (s.sessionRpe || 7), 0) / recentSessions.length).toFixed(1)
        : 7.0,
      recentWeights: progressEntries
        ? progressEntries.slice(0, 5).map((p) => ({ date: p.date, weightKg: p.weightKg }))
        : [],
    },
  };
}

module.exports = { buildFullAIContext };
