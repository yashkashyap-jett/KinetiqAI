const Profile = require('../models/Profile');
const WorkoutSession = require('../models/WorkoutSession');
const MealLog = require('../models/MealLog');
const ProgressEntry = require('../models/ProgressEntry');
const AIInsight = require('../models/AIInsight');
const WorkoutPlan = require('../models/WorkoutPlan');
const { calculateReadinessScore } = require('../services/analytics/readinessScore');
const { calculateFitnessScore } = require('../services/analytics/fitnessScore');
const { calculateTrainingLoad } = require('../services/analytics/trainingLoad');
const { calculateAdherence } = require('../services/analytics/adherenceCalc');
const { calculateProgressVelocity } = require('../services/analytics/progressVelocity');

// GET /api/dashboard
const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch user profile
    const profile = await Profile.findOne({ userId });

    // Fetch recent 28 days of sessions
    const recentSessions = await WorkoutSession.find({ userId, status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(30);

    // Fetch recent meal logs
    const recentMeals = await MealLog.find({ userId }).sort({ date: -1 }).limit(30);

    // Fetch recent progress entries
    const progressEntries = await ProgressEntry.find({ userId }).sort({ date: -1 }).limit(10);

    // Fetch active workout plan
    const activeWorkoutPlan = await WorkoutPlan.findOne({ userId, isActive: true });

    // Engine 1 Calculations
    const trainingLoad = calculateTrainingLoad(recentSessions);
    const adherence = calculateAdherence({
      plannedSessionsCount: profile ? profile.workoutDaysPerWeek : 4,
      completedSessionsCount: recentSessions.length,
      mealLogs: recentMeals,
    });
    const readiness = calculateReadinessScore({
      lastSleepEntry: progressEntries[0] || null,
      trainingLoad,
      recentSessions,
      adherence7Day: adherence.workoutAdherence,
    });

    const velocity = profile
      ? calculateProgressVelocity(progressEntries, profile.targetWeight, profile.weight)
      : { ratePerWeekKg: 0, onTrack: true };

    const fitnessScore = calculateFitnessScore({
      workoutAdherence28: adherence.workoutAdherence,
      nutritionAdherence28: adherence.nutritionAdherence,
      progressVelocity: velocity,
      volumeTrend: 'stable',
      avgSleepHours: progressEntries[0]?.sleepHours || 7.5,
    });

    // Recent AI insights
    let insights = await AIInsight.find({ userId, dismissed: false }).sort({ createdAt: -1 }).limit(3);
    if (insights.length === 0) {
      // Seed default actionable insight
      insights = [
        {
          _id: 'default-1',
          type: 'readiness',
          title: 'Prime Recovery Status',
          content: `Your Readiness Score is ${readiness.score}/100. ${readiness.recommendation}`,
          priority: 'high',
          actionable: true,
          actionText: 'View Today Workout',
        },
      ];
    }

    // Dynamic Nutrition Target calculation from active MealPlan or Profile
    let nutritionTarget = null;
    const MealPlan = require('../models/MealPlan');
    const { calculateNutritionTargets } = require('../utils/calculations');

    const activeMealPlan = await MealPlan.findOne({ userId, isActive: true });
    if (activeMealPlan && activeMealPlan.dailyCalories && activeMealPlan.macroTargets) {
      nutritionTarget = {
        dailyCalories: activeMealPlan.dailyCalories,
        protein: activeMealPlan.macroTargets.protein,
        carbs: activeMealPlan.macroTargets.carbs,
        fat: activeMealPlan.macroTargets.fat,
        goal: profile?.fitnessGoal || 'general_fitness',
        source: 'meal_plan',
      };
    } else if (profile && profile.weight && profile.height && profile.age) {
      const calculated = calculateNutritionTargets(profile);
      nutritionTarget = {
        dailyCalories: calculated.dailyCalories,
        protein: calculated.macroTargets.protein,
        carbs: calculated.macroTargets.carbs,
        fat: calculated.macroTargets.fat,
        goal: profile.fitnessGoal || 'general_fitness',
        source: 'calculated',
      };
    }

    res.json({
      success: true,
      user: {
        name: req.user.name,
        email: req.user.email,
        onboardingComplete: req.user.onboardingComplete,
      },
      profile,
      nutritionTarget,
      engine1: {
        readiness,
        fitnessScore,
        trainingLoad,
        adherence,
        velocity,
      },
      activeWorkoutPlan,
      insights,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardData };
