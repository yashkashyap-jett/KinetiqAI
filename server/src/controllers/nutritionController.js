const MealPlan = require('../models/MealPlan');
const MealLog = require('../models/MealLog');
const Profile = require('../models/Profile');
const { generateAIMealPlan, generateAIFoodSwap } = require('../ai/provider');
const AppError = require('../utils/AppError');
const { calculateNutritionTargets } = require('../utils/calculations');

// POST /api/nutrition/generate
const generatePlan = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return next(new AppError('Profile not found', 404));
    }

    await MealPlan.updateMany({ userId: req.user._id, isActive: true }, { isActive: false });

    const aiMealPlan = await generateAIMealPlan(profile);

    const plan = await MealPlan.create({
      userId: req.user._id,
      isActive: true,
      dailyCalories: aiMealPlan.dailyCalories,
      macroTargets: aiMealPlan.macroTargets,
      hydrationTargetMl: aiMealPlan.hydrationTargetMl || 3000,
      meals: aiMealPlan.meals,
    });

    res.status(201).json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};

// GET /api/nutrition/plan
const getActivePlan = async (req, res, next) => {
  try {
    let plan = await MealPlan.findOne({ userId: req.user._id, isActive: true });
    if (!plan) {
      const profile = await Profile.findOne({ userId: req.user._id });
      if (profile) {
        const aiMealPlan = await generateAIMealPlan(profile);
        plan = await MealPlan.create({
          userId: req.user._id,
          isActive: true,
          dailyCalories: aiMealPlan.dailyCalories,
          macroTargets: aiMealPlan.macroTargets,
          hydrationTargetMl: aiMealPlan.hydrationTargetMl || 3000,
          meals: aiMealPlan.meals,
        });
      }
    }
    res.json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};

// GET /api/nutrition/daily/:date
const getDailyLogs = async (req, res, next) => {
  try {
    const queryDate = req.params.date ? new Date(req.params.date) : new Date();
    // Use UTC boundaries to avoid timezone issues when querying
    const startOfDay = new Date(Date.UTC(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate(), 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate(), 23, 59, 59, 999));

    const logs = await MealLog.find({
      userId: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // Calculate totals
    const totals = logs.reduce(
      (acc, log) => {
        acc.calories += log.totalCalories || 0;
        acc.protein += log.totalProtein || 0;
        acc.carbs += log.totalCarbs || 0;
        acc.fat += log.totalFat || 0;
        acc.fiber += log.totalFiber || 0;
        acc.waterMl += log.waterMl || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, waterMl: 0 }
    );

    res.json({ success: true, logs, totals });
  } catch (error) {
    next(error);
  }
};

// POST /api/nutrition/log
const logMeal = async (req, res, next) => {
  try {
    const { mealType, name, foods, waterMl, date } = req.body;

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    if (foods && Array.isArray(foods)) {
      foods.forEach((f) => {
        totalCalories += f.calories || 0;
        totalProtein += f.protein || 0;
        totalCarbs += f.carbs || 0;
        totalFat += f.fat || 0;
        totalFiber += f.fiber || 0;
      });
    }

    const log = await MealLog.create({
      userId: req.user._id,
      date: date ? new Date(date) : new Date(),
      mealType,
      name: name || 'Logged Meal',
      foods: foods || [],
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      waterMl: waterMl || 0,
    });

    res.status(201).json({ success: true, log });
  } catch (error) {
    next(error);
  }
};

// POST /api/nutrition/swap
const smartSwap = async (req, res, next) => {
  try {
    const { originalFood } = req.body;
    const profile = await Profile.findOne({ userId: req.user._id });

    const swapResult = await generateAIFoodSwap(originalFood, profile || {});

    res.json({ success: true, swapResult });
  } catch (error) {
    next(error);
  }
};

// PUT /api/nutrition/targets
const updateTargets = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return next(new AppError('Profile not found', 404));
    }

    const targets = calculateNutritionTargets(profile);

    let plan = await MealPlan.findOne({ userId: req.user._id, isActive: true });
    if (plan) {
      plan.dailyCalories = targets.dailyCalories;
      plan.macroTargets = targets.macroTargets;
      await plan.save();
    }

    res.json({
      success: true,
      targets,
      planUpdated: !!plan
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/nutrition/log/:id
const updateMeal = async (req, res, next) => {
  try {
    const { mealType, name, foods, waterMl } = req.body;

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    if (foods && Array.isArray(foods)) {
      foods.forEach((f) => {
        totalCalories += f.calories || 0;
        totalProtein += f.protein || 0;
        totalCarbs += f.carbs || 0;
        totalFat += f.fat || 0;
        totalFiber += f.fiber || 0;
      });
    }

    const log = await MealLog.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        mealType,
        name: name || 'Logged Meal',
        foods: foods || [],
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        totalFiber,
        waterMl: waterMl || 0,
      },
      { new: true }
    );

    if (!log) {
      return next(new AppError('Meal log not found', 404));
    }

    res.json({ success: true, log });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/nutrition/log/:id
const deleteMeal = async (req, res, next) => {
  try {
    const log = await MealLog.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!log) {
      return next(new AppError('Meal log not found', 404));
    }
    res.json({ success: true, message: 'Meal log deleted' });
  } catch (error) {
    next(error);
  }
};

// GET /api/nutrition/search
const searchFood = async (req, res, next) => {
  try {
    const { query, quantity, unit } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter is required' });
    }
    const { resolveUSDAFood } = require('../services/usdaService');
    const usdaData = await resolveUSDAFood(query, Number(quantity) || 1, unit || 'g');
    if (usdaData) {
      return res.json({ success: true, foods: [usdaData], data: [usdaData] });
    }
    res.json({ success: true, foods: [], data: [] });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generatePlan,
  getActivePlan,
  getDailyLogs,
  logMeal,
  updateMeal,
  deleteMeal,
  smartSwap,
  updateTargets,
  searchFood,
};
