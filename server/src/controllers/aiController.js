const Profile = require('../models/Profile');
const WorkoutSession = require('../models/WorkoutSession');
const MealLog = require('../models/MealLog');
const ProgressEntry = require('../models/ProgressEntry');
const AIInsight = require('../models/AIInsight');
const { generateAICoachResponse, generateAIWeeklyReview } = require('../ai/provider');
const { buildFullAIContext } = require('../ai/contextBuilder');
const { calculateReadinessScore } = require('../services/analytics/readinessScore');
const { calculateFitnessScore } = require('../services/analytics/fitnessScore');
const { calculateTrainingLoad } = require('../services/analytics/trainingLoad');
const { calculateAdherence } = require('../services/analytics/adherenceCalc');
const { resolveUSDAFood } = require('../services/usdaService');

// POST /api/ai/coach
const askCoach = async (req, res, next) => {
  try {
    const { history, question } = req.body;
    const userId = req.user._id;

    // Support fallback to just 'question' if older client
    const conversationHistory = history || (question ? [{ sender: 'user', content: question }] : []);
    
    if (conversationHistory.length === 0) {
      return res.status(400).json({ success: false, error: 'No message provided' });
    }

    const profile = await Profile.findOne({ userId });
    const recentSessions = await WorkoutSession.find({ userId, status: 'completed' }).sort({ completedAt: -1 }).limit(14);
    const recentMeals = await MealLog.find({ userId }).sort({ date: -1 }).limit(14);
    const progressEntries = await ProgressEntry.find({ userId }).sort({ date: -1 }).limit(5);

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

    const fitnessScore = calculateFitnessScore({
      workoutAdherence28: adherence.workoutAdherence,
      nutritionAdherence28: adherence.nutritionAdherence,
      progressVelocity: null,
      volumeTrend: 'stable',
      avgSleepHours: progressEntries[0]?.sleepHours || 7.5,
    });

    const context = buildFullAIContext({
      profile,
      readiness,
      fitnessScore,
      trainingLoad,
      adherence,
      recentSessions,
      recentMeals,
      progressEntries,
    });

    const coachResponse = await generateAICoachResponse(context, conversationHistory);

    res.json({ success: true, response: coachResponse });
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/weekly-review
const getWeeklyReview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ userId });
    const recentSessions = await WorkoutSession.find({ userId, status: 'completed' }).sort({ completedAt: -1 }).limit(7);
    const recentMeals = await MealLog.find({ userId }).sort({ date: -1 }).limit(7);
    const progressEntries = await ProgressEntry.find({ userId }).sort({ date: -1 }).limit(5);

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

    const context = buildFullAIContext({
      profile,
      readiness,
      fitnessScore: { score: 80, delta: '+3' },
      trainingLoad,
      adherence,
      recentSessions,
      recentMeals,
      progressEntries,
    });

    const review = await generateAIWeeklyReview(context);

    res.json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// GET /api/ai/insights
const getInsights = async (req, res, next) => {
  try {
    const insights = await AIInsight.find({ userId: req.user._id, dismissed: false }).sort({ createdAt: -1 });
    res.json({ success: true, insights });
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/analyze-meal
const analyzeMeal = async (req, res, next) => {
  try {
    const { mealText } = req.body;
    if (!mealText) {
      return res.status(400).json({ success: false, error: 'Meal text is required' });
    }

    const userId = req.user._id;
    const profile = await Profile.findOne({ userId });

    console.log(`[Nutrition NL] Request received for: "${mealText}"`);

    // 1. Get parsed food items & baseline estimates from Gemini
    const analysis = await require('../ai/provider').generateAIMealAnalysis(mealText, profile || {});
    console.log(`[Nutrition NL] Gemini identified ${analysis.items?.length || 0} items:`, analysis.items?.map(i => `${i.quantity} ${i.unit} ${i.name}`));

    // 2. Resolve each item via USDA with fallback to Gemini estimate
    const resolvedItems = await Promise.all(
      (analysis.items || []).map(async (item) => {
        const qty = item.quantity || 1;
        const u = item.unit || 'g';
        
        try {
          const usdaData = await resolveUSDAFood(item.name, qty, u);
          if (usdaData && (usdaData.calories > 0 || usdaData.protein > 0 || usdaData.carbs > 0)) {
            return {
              name: item.name || usdaData.name,
              quantity: qty,
              unit: u,
              ambiguous: item.ambiguous || false,
              calories: usdaData.calories,
              protein: usdaData.protein,
              carbs: usdaData.carbs,
              fat: usdaData.fat,
              fiber: usdaData.fiber || item.fiber || 0,
              source: 'usda',
            };
          }
        } catch (usdaErr) {
          console.warn(`[Nutrition NL] USDA resolution skipped for "${item.name}":`, usdaErr.message);
        }

        // Fallback to Gemini estimate if USDA fails for this item
        return {
          name: item.name || 'Unknown Item',
          quantity: qty,
          unit: u,
          ambiguous: item.ambiguous || false,
          calories: item.calories || 0,
          protein: item.protein || 0,
          carbs: item.carbs || 0,
          fat: item.fat || 0,
          fiber: item.fiber || 0,
          source: 'gemini_estimate',
        };
      })
    );

    // 3. Recalculate totals across resolved items
    const totals = resolvedItems.reduce(
      (acc, item) => ({
        calories: Math.round((acc.calories + (item.calories || 0)) * 10) / 10,
        protein: Math.round((acc.protein + (item.protein || 0)) * 10) / 10,
        carbs: Math.round((acc.carbs + (item.carbs || 0)) * 10) / 10,
        fat: Math.round((acc.fat + (item.fat || 0)) * 10) / 10,
        fiber: Math.round((acc.fiber + (item.fiber || 0)) * 10) / 10,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );

    console.log('[Nutrition NL] Final itemized nutrition totals:', totals);

    res.json({ 
      success: true, 
      analysis: {
        mealName: analysis.mealName || mealText,
        items: resolvedItems,
        total: totals,
        confidence: analysis.confidence || 'medium',
        assumptions: analysis.assumptions || []
      } 
    });
  } catch (error) {
    console.error('[Nutrition NL] Error analyzing meal:', error.message);
    res.status(500).json({
      success: false,
      error: 'Unable to analyze this meal right now. Please try again.',
    });
  }
};

module.exports = { askCoach, getWeeklyReview, getInsights, analyzeMeal };
