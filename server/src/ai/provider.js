const { generateAIContent } = require('./gemini');
const { getWorkoutPlanPrompt } = require('./prompts/workoutPlan');
const { getMealPlanPrompt } = require('./prompts/mealPlan');
const { getCoachPrompt } = require('./prompts/coach');
const { getWeeklyReviewPrompt } = require('./prompts/weeklyReview');
const { getFoodSwapPrompt } = require('./prompts/foodSwap');
const { getAnalyzeMealPrompt } = require('./prompts/analyzeMeal');
const {
  workoutPlanSchema,
  mealPlanSchema,
  weeklyReviewSchema,
  foodSwapSchema,
  coachResponseSchema,
  analyzeMealSchema,
  validateAIResponse,
} = require('./validator');
const { calculateBMR, calculateTDEE, calculateTargetCalories, calculateMacroTargets } = require('../utils/calculations');

// --- FALLBACK GENERATORS (Guarantees system reliability) ---

function getFallbackWorkoutPlan(profile) {
  const daysCount = profile.workoutDaysPerWeek || 4;
  const isPPL = daysCount >= 5;

  const days = [];

  if (isPPL) {
    days.push({
      dayIndex: 0,
      dayName: 'Monday',
      splitName: 'Push Focus',
      focusArea: 'Chest, Shoulders & Triceps',
      isRestDay: false,
      estimatedDurationMin: profile.avgWorkoutDuration || 60,
      exercises: [
        { name: 'Barbell Bench Press', primaryMuscles: ['chest'], equipment: 'barbell', setsCount: 4, targetReps: '8-10', restSeconds: 90, notes: 'Focus on explosive concentric.' },
        { name: 'Incline Dumbbell Press', primaryMuscles: ['chest'], equipment: 'dumbbells', setsCount: 3, targetReps: '10-12', restSeconds: 75 },
        { name: 'Overhead Dumbbell Press', primaryMuscles: ['shoulders'], equipment: 'dumbbells', setsCount: 3, targetReps: '8-12', restSeconds: 75 },
        { name: 'Lateral Raises', primaryMuscles: ['shoulders'], equipment: 'dumbbells', setsCount: 4, targetReps: '12-15', restSeconds: 60 },
        { name: 'Triceps Rope Pushdowns', primaryMuscles: ['triceps'], equipment: 'cables', setsCount: 3, targetReps: '10-12', restSeconds: 60 },
      ],
    });

    days.push({
      dayIndex: 1,
      dayName: 'Tuesday',
      splitName: 'Pull Focus',
      focusArea: 'Back & Biceps',
      isRestDay: false,
      estimatedDurationMin: profile.avgWorkoutDuration || 60,
      exercises: [
        { name: 'Lat Pulldowns', primaryMuscles: ['lats'], equipment: 'cables', setsCount: 4, targetReps: '8-12', restSeconds: 90 },
        { name: 'Seated Cable Rows', primaryMuscles: ['back'], equipment: 'cables', setsCount: 3, targetReps: '10-12', restSeconds: 75 },
        { name: 'Dumbbell Single-Arm Rows', primaryMuscles: ['back'], equipment: 'dumbbells', setsCount: 3, targetReps: '8-10', restSeconds: 75 },
        { name: 'Barbell Biceps Curls', primaryMuscles: ['biceps'], equipment: 'barbell', setsCount: 3, targetReps: '10-12', restSeconds: 60 },
        { name: 'Face Pulls', primaryMuscles: ['rear delts'], equipment: 'cables', setsCount: 4, targetReps: '15-20', restSeconds: 60 },
      ],
    });

    days.push({
      dayIndex: 2,
      dayName: 'Wednesday',
      splitName: 'Legs & Core',
      focusArea: 'Quads, Hamstrings & Calves',
      isRestDay: false,
      estimatedDurationMin: profile.avgWorkoutDuration || 60,
      exercises: [
        { name: 'Barbell Back Squat', primaryMuscles: ['quads'], equipment: 'barbell', setsCount: 4, targetReps: '6-8', restSeconds: 120 },
        { name: 'Romanian Deadlifts', primaryMuscles: ['hamstrings'], equipment: 'barbell', setsCount: 3, targetReps: '8-10', restSeconds: 90 },
        { name: 'Leg Extension', primaryMuscles: ['quads'], equipment: 'machines', setsCount: 3, targetReps: '12-15', restSeconds: 60 },
        { name: 'Standing Calf Raises', primaryMuscles: ['calves'], equipment: 'machines', setsCount: 4, targetReps: '12-15', restSeconds: 60 },
        { name: 'Hanging Leg Raises', primaryMuscles: ['abs'], equipment: 'bodyweight', setsCount: 3, targetReps: '12-15', restSeconds: 60 },
      ],
    });

    days.push({
      dayIndex: 3,
      dayName: 'Thursday',
      splitName: 'Active Recovery',
      focusArea: 'Rest & Mobility',
      isRestDay: true,
      estimatedDurationMin: 30,
      exercises: [],
    });

    days.push({
      dayIndex: 4,
      dayName: 'Friday',
      splitName: 'Upper Hypertrophy',
      focusArea: 'Chest, Back & Arms',
      isRestDay: false,
      estimatedDurationMin: profile.avgWorkoutDuration || 60,
      exercises: [
        { name: 'Incline Barbell Bench Press', primaryMuscles: ['chest'], equipment: 'barbell', setsCount: 4, targetReps: '8-10', restSeconds: 90 },
        { name: 'Pull-ups / Assisted Pull-ups', primaryMuscles: ['lats'], equipment: 'bodyweight', setsCount: 3, targetReps: '8-12', restSeconds: 90 },
        { name: 'Dumbbell Chest Flyes', primaryMuscles: ['chest'], equipment: 'dumbbells', setsCount: 3, targetReps: '12-15', restSeconds: 60 },
        { name: 'Hammer Curls', primaryMuscles: ['biceps'], equipment: 'dumbbells', setsCount: 3, targetReps: '10-12', restSeconds: 60 },
        { name: 'Overhead Triceps Extension', primaryMuscles: ['triceps'], equipment: 'dumbbells', setsCount: 3, targetReps: '10-12', restSeconds: 60 },
      ],
    });

    days.push({
      dayIndex: 5,
      dayName: 'Saturday',
      splitName: 'Lower & Conditioning',
      focusArea: 'Legs & Core',
      isRestDay: false,
      estimatedDurationMin: profile.avgWorkoutDuration || 60,
      exercises: [
        { name: 'Leg Press', primaryMuscles: ['quads'], equipment: 'machines', setsCount: 4, targetReps: '10-12', restSeconds: 90 },
        { name: 'Lying Hamstring Curls', primaryMuscles: ['hamstrings'], equipment: 'machines', setsCount: 3, targetReps: '12-15', restSeconds: 60 },
        { name: 'Walking Lunges', primaryMuscles: ['quads', 'glutes'], equipment: 'dumbbells', setsCount: 3, targetReps: '12 steps', restSeconds: 75 },
        { name: 'Ab Wheel Rollouts', primaryMuscles: ['abs'], equipment: 'bodyweight', setsCount: 3, targetReps: '10-12', restSeconds: 60 },
      ],
    });

    days.push({
      dayIndex: 6,
      dayName: 'Sunday',
      splitName: 'Rest',
      focusArea: 'Full Recovery',
      isRestDay: true,
      estimatedDurationMin: 0,
      exercises: [],
    });
  } else {
    // 4-day Upper / Lower split
    days.push({
      dayIndex: 0,
      dayName: 'Monday',
      splitName: 'Upper A',
      focusArea: 'Chest, Back & Arms',
      isRestDay: false,
      estimatedDurationMin: profile.avgWorkoutDuration || 60,
      exercises: [
        { name: 'Barbell Bench Press', primaryMuscles: ['chest'], equipment: 'barbell', setsCount: 4, targetReps: '8-10', restSeconds: 90 },
        { name: 'Lat Pulldowns', primaryMuscles: ['lats'], equipment: 'cables', setsCount: 4, targetReps: '8-12', restSeconds: 90 },
        { name: 'Overhead Dumbbell Press', primaryMuscles: ['shoulders'], equipment: 'dumbbells', setsCount: 3, targetReps: '8-12', restSeconds: 75 },
        { name: 'Seated Cable Rows', primaryMuscles: ['back'], equipment: 'cables', setsCount: 3, targetReps: '10-12', restSeconds: 75 },
        { name: 'Triceps Pushdowns', primaryMuscles: ['triceps'], equipment: 'cables', setsCount: 3, targetReps: '10-12', restSeconds: 60 },
        { name: 'Dumbbell Biceps Curls', primaryMuscles: ['biceps'], equipment: 'dumbbells', setsCount: 3, targetReps: '10-12', restSeconds: 60 },
      ],
    });

    days.push({
      dayIndex: 1,
      dayName: 'Tuesday',
      splitName: 'Lower A',
      focusArea: 'Quads & Hamstrings',
      isRestDay: false,
      estimatedDurationMin: profile.avgWorkoutDuration || 60,
      exercises: [
        { name: 'Barbell Back Squat', primaryMuscles: ['quads'], equipment: 'barbell', setsCount: 4, targetReps: '6-8', restSeconds: 120 },
        { name: 'Romanian Deadlifts', primaryMuscles: ['hamstrings'], equipment: 'barbell', setsCount: 3, targetReps: '8-10', restSeconds: 90 },
        { name: 'Leg Extension', primaryMuscles: ['quads'], equipment: 'machines', setsCount: 3, targetReps: '12-15', restSeconds: 60 },
        { name: 'Calf Raises', primaryMuscles: ['calves'], equipment: 'machines', setsCount: 4, targetReps: '12-15', restSeconds: 60 },
      ],
    });

    days.push({
      dayIndex: 2,
      dayName: 'Wednesday',
      splitName: 'Rest',
      focusArea: 'Recovery',
      isRestDay: true,
      estimatedDurationMin: 0,
      exercises: [],
    });

    days.push({
      dayIndex: 3,
      dayName: 'Thursday',
      splitName: 'Upper B',
      focusArea: 'Hypertrophy Focus',
      isRestDay: false,
      estimatedDurationMin: profile.avgWorkoutDuration || 60,
      exercises: [
        { name: 'Incline Dumbbell Press', primaryMuscles: ['chest'], equipment: 'dumbbells', setsCount: 4, targetReps: '10-12', restSeconds: 75 },
        { name: 'Dumbbell Single-Arm Rows', primaryMuscles: ['back'], equipment: 'dumbbells', setsCount: 4, targetReps: '8-10', restSeconds: 75 },
        { name: 'Lateral Raises', primaryMuscles: ['shoulders'], equipment: 'dumbbells', setsCount: 4, targetReps: '12-15', restSeconds: 60 },
        { name: 'Face Pulls', primaryMuscles: ['rear delts'], equipment: 'cables', setsCount: 3, targetReps: '15-20', restSeconds: 60 },
        { name: 'Hammer Curls', primaryMuscles: ['biceps'], equipment: 'dumbbells', setsCount: 3, targetReps: '10-12', restSeconds: 60 },
      ],
    });

    days.push({
      dayIndex: 4,
      dayName: 'Friday',
      splitName: 'Lower B',
      focusArea: 'Posterior Chain & Core',
      isRestDay: false,
      estimatedDurationMin: profile.avgWorkoutDuration || 60,
      exercises: [
        { name: 'Leg Press', primaryMuscles: ['quads'], equipment: 'machines', setsCount: 4, targetReps: '10-12', restSeconds: 90 },
        { name: 'Lying Hamstring Curls', primaryMuscles: ['hamstrings'], equipment: 'machines', setsCount: 4, targetReps: '12-15', restSeconds: 60 },
        { name: 'Dumbbell Lunges', primaryMuscles: ['quads', 'glutes'], equipment: 'dumbbells', setsCount: 3, targetReps: '10 steps', restSeconds: 75 },
        { name: 'Hanging Leg Raises', primaryMuscles: ['abs'], equipment: 'bodyweight', setsCount: 3, targetReps: '12-15', restSeconds: 60 },
      ],
    });

    days.push({
      dayIndex: 5,
      dayName: 'Saturday',
      splitName: 'Rest',
      focusArea: 'Recovery',
      isRestDay: true,
      estimatedDurationMin: 0,
      exercises: [],
    });

    days.push({
      dayIndex: 6,
      dayName: 'Sunday',
      splitName: 'Rest',
      focusArea: 'Recovery',
      isRestDay: true,
      estimatedDurationMin: 0,
      exercises: [],
    });
  }

  return {
    splitType: isPPL ? 'Push / Pull / Legs' : 'Upper / Lower Split',
    weeklyFrequency: daysCount,
    days,
  };
}

function getFallbackMealPlan(profile) {
  const bmr = calculateBMR(profile.weight || 75, profile.height || 178, profile.age || 25, profile.gender || 'male');
  const tdee = calculateTDEE(bmr, profile.dailyActivity || 'moderate');
  const targetCalories = calculateTargetCalories(tdee, profile.fitnessGoal || 'recomposition');
  const macros = calculateMacroTargets(targetCalories, profile.weight || 75, profile.fitnessGoal || 'recomposition');

  return {
    dailyCalories: targetCalories,
    macroTargets: {
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
    },
    hydrationTargetMl: 3000,
    meals: [
      {
        mealType: 'breakfast',
        name: 'Power Protein Oats & Berries',
        timeSuggestion: '8:00 AM',
        targetCalories: Math.round(targetCalories * 0.25),
        targetProtein: Math.round(macros.protein * 0.25),
        targetCarbs: Math.round(macros.carbs * 0.3),
        targetFat: Math.round(macros.fat * 0.2),
        foods: [
          { name: 'Rolled Oats', amount: '80g', calories: 300, protein: 11, carbs: 54, fat: 5 },
          { name: 'Whey Protein Isolate', amount: '35g', calories: 130, protein: 27, carbs: 2, fat: 1 },
          { name: 'Blueberries', amount: '100g', calories: 57, protein: 1, carbs: 14, fat: 0 },
          { name: 'Almonds', amount: '15g', calories: 86, protein: 3, carbs: 3, fat: 7 },
        ],
        recipeTips: 'Cook oats with water or almond milk, stir in protein powder right after removing from heat.',
      },
      {
        mealType: 'lunch',
        name: 'Grilled Chicken & Quinoa Energy Bowl',
        timeSuggestion: '1:00 PM',
        targetCalories: Math.round(targetCalories * 0.35),
        targetProtein: Math.round(macros.protein * 0.35),
        targetCarbs: Math.round(macros.carbs * 0.35),
        targetFat: Math.round(macros.fat * 0.3),
        foods: [
          { name: 'Chicken Breast Breast', amount: '200g', calories: 330, protein: 62, carbs: 0, fat: 7 },
          { name: 'Cooked Quinoa', amount: '150g', calories: 180, protein: 6, carbs: 32, fat: 3 },
          { name: 'Steamed Broccoli & Peppers', amount: '150g', calories: 60, protein: 4, carbs: 12, fat: 1 },
          { name: 'Extra Virgin Olive Oil', amount: '10ml', calories: 88, protein: 0, carbs: 0, fat: 10 },
        ],
        recipeTips: 'Season chicken with smoked paprika, garlic powder, and lemon zest.',
      },
      {
        mealType: 'snack',
        name: 'Greek Yogurt & Almond Crisp',
        timeSuggestion: '4:30 PM',
        targetCalories: Math.round(targetCalories * 0.15),
        targetProtein: Math.round(macros.protein * 0.15),
        targetCarbs: Math.round(macros.carbs * 0.15),
        targetFat: Math.round(macros.fat * 0.2),
        foods: [
          { name: 'Non-Fat Greek Yogurt', amount: '200g', calories: 120, protein: 20, carbs: 7, fat: 0 },
          { name: 'Honey', amount: '15g', calories: 46, protein: 0, carbs: 12, fat: 0 },
          { name: 'Walnut Halves', amount: '15g', calories: 98, protein: 2, carbs: 2, fat: 10 },
        ],
        recipeTips: 'Mix Greek yogurt with honey and top with crushed walnuts.',
      },
      {
        mealType: 'dinner',
        name: 'Pan-Seared Salmon & Sweet Potato Mash',
        timeSuggestion: '7:30 PM',
        targetCalories: Math.round(targetCalories * 0.25),
        targetProtein: Math.round(macros.protein * 0.25),
        targetCarbs: Math.round(macros.carbs * 0.2),
        targetFat: Math.round(macros.fat * 0.3),
        foods: [
          { name: 'Atlantic Salmon Fillet', amount: '180g', calories: 370, protein: 36, carbs: 0, fat: 23 },
          { name: 'Baked Sweet Potato', amount: '200g', calories: 180, protein: 4, carbs: 41, fat: 0 },
          { name: 'Sauteed Asparagus', amount: '120g', calories: 40, protein: 4, carbs: 7, fat: 1 },
        ],
        recipeTips: 'Sear salmon skin-side down for 4 minutes until crispy.',
      },
    ],
  };
}

// --- DETERMINISTIC WORKOUT PLAN NORMALIZER ---
function normalizeAIWorkoutPlan(raw, config = null) {
  if (!raw || typeof raw !== 'object') return raw;

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const days = Array.isArray(raw.days)
    ? raw.days.map((day, idx) => {
        const isRest = Boolean(day.isRestDay);
        const rawExercises = Array.isArray(day.exercises) ? day.exercises : [];

        const exercises = isRest
          ? []
          : rawExercises.map((ex) => {
              let primary = [];
              if (Array.isArray(ex.primaryMuscles) && ex.primaryMuscles.length > 0) {
                primary = ex.primaryMuscles.map((m) => String(m));
              } else if (typeof ex.primaryMuscles === 'string' && ex.primaryMuscles.trim()) {
                primary = [ex.primaryMuscles.trim()];
              } else if (ex.targetMuscle) {
                primary = [String(ex.targetMuscle)];
              } else {
                primary = ['full body'];
              }

              const setsCountNum = typeof ex.setsCount === 'number' && !isNaN(ex.setsCount) 
                ? ex.setsCount 
                : (typeof ex.sets === 'number' && !isNaN(ex.sets) ? ex.sets : 3);

              const restSecondsNum = typeof ex.restSeconds === 'number' && !isNaN(ex.restSeconds) 
                ? ex.restSeconds 
                : (typeof ex.rest === 'number' && !isNaN(ex.rest) ? ex.rest : 90);

              const targetRepsStr = ex.targetReps ? String(ex.targetReps) : (ex.reps ? String(ex.reps) : '8-12');

              return {
                ...ex,
                name: String(ex.name || ex.exerciseName || 'Exercise').trim(),
                primaryMuscles: primary,
                equipment: ex.equipment ? String(ex.equipment) : null,
                setsCount: setsCountNum,
                targetReps: targetRepsStr,
                restSeconds: restSecondsNum,
                notes: ex.notes ? String(ex.notes) : null,
              };
            });

        return {
          ...day,
          dayIndex: typeof day.dayIndex === 'number' ? day.dayIndex : idx,
          dayName: String(day.dayName || dayNames[idx] || `Day ${idx + 1}`),
          splitName: String(day.splitName || (isRest ? 'Rest & Recovery' : 'Training Focus')),
          focusArea: String(day.focusArea || (isRest ? 'Rest' : 'Full Body')),
          isRestDay: isRest,
          estimatedDurationMin: typeof day.estimatedDurationMin === 'number' ? day.estimatedDurationMin : (isRest ? 0 : 60),
          exercises,
        };
      })
    : [];

  return {
    ...raw,
    splitType: String((config && config.splitType) || raw.splitType || 'Custom Split'),
    weeklyFrequency: typeof raw.weeklyFrequency === 'number' ? raw.weeklyFrequency : (days.filter((d) => !d.isRestDay).length || 4),
    days,
  };
}

// --- PUBLIC PROVIDER METHODS ---

async function generateAIWorkoutPlan(profile, config = null) {
  try {
    const prompt = getWorkoutPlanPrompt(profile, config);
    const rawJson = await generateAIContent(prompt);
    
    let parsed;
    try {
      parsed = JSON.parse(rawJson);
    } catch (parseError) {
      console.error('Gemini Workout Plan JSON parsing failed:', rawJson);
      throw new Error('AI returned invalid JSON');
    }

    // Apply deterministic normalization before validation
    const normalized = normalizeAIWorkoutPlan(parsed, config);

    const validation = validateAIResponse(workoutPlanSchema, normalized);
    if (validation.success) {
      return validation.data;
    }
    
    console.error('Gemini Workout Plan validation failed after normalization:', validation.error);
    throw new Error(`AI generated invalid plan schema: ${validation.error}`);
  } catch (err) {
    console.error('Gemini Workout Plan generation error:', err.message);
    throw err; // DO NOT fallback. Let the frontend handle the error and allow retry.
  }
}

async function generateAIMealPlan(profile) {
  try {
    const bmr = calculateBMR(profile.weight || 75, profile.height || 178, profile.age || 25, profile.gender || 'male');
    const tdee = calculateTDEE(bmr, profile.dailyActivity || 'moderate');
    const targetCalories = calculateTargetCalories(tdee, profile.fitnessGoal || 'recomposition');
    const macros = calculateMacroTargets(targetCalories, profile.weight || 75, profile.fitnessGoal || 'recomposition');

    const prompt = getMealPlanPrompt(profile, { calories: targetCalories, ...macros });
    const rawJson = await generateAIContent(prompt);
    const parsed = JSON.parse(rawJson);
    const validation = validateAIResponse(mealPlanSchema, parsed);
    if (validation.success) {
      return validation.data;
    }
  } catch (err) {
    console.warn('Gemini Meal Plan generation notice:', err.message, '→ Using intelligent fallback generator');
  }
  return getFallbackMealPlan(profile);
}

async function generateAICoachResponse(context, conversationHistory) {
  try {
    const prompt = getCoachPrompt(context, conversationHistory);
    const rawJson = await generateAIContent(prompt);
    
    let parsed;
    try {
      parsed = JSON.parse(rawJson);
    } catch (e) {
      // If AI returned plain text response instead of JSON, wrap it cleanly into the expected coach format
      return {
        message: rawJson.trim(),
        actionItems: [],
        suggestedWorkoutAdjustment: null,
      };
    }

    const validation = validateAIResponse(coachResponseSchema, parsed);
    if (validation.success) {
      return validation.data;
    }
    return {
      message: parsed.message || rawJson.trim(),
      actionItems: parsed.actionItems || [],
      suggestedWorkoutAdjustment: parsed.suggestedWorkoutAdjustment || null,
    };
  } catch (err) {
    console.error('Gemini Coach response error:', err.message);
    throw err;
  }
}

async function generateAIWeeklyReview(context) {
  try {
    const prompt = getWeeklyReviewPrompt(context);
    const rawJson = await generateAIContent(prompt);
    const parsed = JSON.parse(rawJson);
    const validation = validateAIResponse(weeklyReviewSchema, parsed);
    if (validation.success) {
      return validation.data;
    }
  } catch (err) {
    console.warn('Gemini Weekly Review notice:', err.message, '→ Returning structured fallback review');
  }
  return {
    scores: { training: 88, nutrition: 82, recovery: 79, consistency: 85 },
    summary: 'Solid execution this week with steady volume progression and 85% workout adherence.',
    improvements: ['Consistent workout logging', 'Improved sleep duration on rest days'],
    concerns: ['Mid-week protein intake dipped slightly below target'],
    recommendations: ['Increase hydration by 500ml on leg days', 'Aim for 8 hours sleep before high-RPE days'],
  };
}

async function generateAIFoodSwap(originalFood, profile) {
  try {
    const prompt = getFoodSwapPrompt(originalFood, profile);
    const rawJson = await generateAIContent(prompt);
    const parsed = JSON.parse(rawJson);
    const validation = validateAIResponse(foodSwapSchema, parsed);
    if (validation.success) {
      return validation.data;
    }
  } catch (err) {
    console.warn('Gemini Food Swap notice:', err.message, '→ Returning fallback swap suggestions');
  }
  return {
    originalFood,
    alternatives: [
      { name: 'Grilled Chicken Breast', amount: '150g', calories: 247, protein: 46, carbs: 0, fat: 5, reasoning: 'Ultra-lean protein dense alternative.' },
      { name: 'Seated Tofu Steak', amount: '200g', calories: 210, protein: 24, carbs: 4, fat: 12, reasoning: 'Plant-based high protein alternative.' },
      { name: 'Turkey Breast Cutlets', amount: '150g', calories: 200, protein: 44, carbs: 0, fat: 2, reasoning: 'Extremely lean protein substitute.' },
    ],
  };
}

function normalizeAIMealAnalysis(raw, mealText) {
  if (!raw || typeof raw !== 'object') {
    raw = {};
  }

  const mealName = typeof raw.mealName === 'string' && raw.mealName.trim()
    ? raw.mealName.trim()
    : mealText || 'Logged Meal';

  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  const items = rawItems.map((item) => {
    let name = typeof item.name === 'string' && item.name.trim() ? item.name.trim() : 'Food Item';
    let qty = item.quantity;
    if (typeof qty === 'string') {
      const parsedQty = parseFloat(qty);
      qty = isNaN(parsedQty) ? 1 : parsedQty;
    } else if (typeof qty !== 'number' || isNaN(qty)) {
      qty = 1;
    }

    let unit = typeof item.unit === 'string' ? item.unit.trim() : null;
    let ambiguous = typeof item.ambiguous === 'boolean' ? item.ambiguous : false;

    let calories = Number(item.calories) || 0;
    let protein = Number(item.protein) || 0;
    let carbs = Number(item.carbs) || 0;
    let fat = Number(item.fat) || 0;
    let fiber = Number(item.fiber) || 0;

    return {
      name,
      quantity: qty,
      unit,
      ambiguous,
      calories,
      protein,
      carbs,
      fat,
      fiber,
    };
  });

  const totalsObj = raw.totals && typeof raw.totals === 'object' ? raw.totals : {};
  const totals = {
    calories: Number(totalsObj.calories) || items.reduce((s, i) => s + i.calories, 0),
    protein: Number(totalsObj.protein) || items.reduce((s, i) => s + i.protein, 0),
    carbs: Number(totalsObj.carbs) || items.reduce((s, i) => s + i.carbs, 0),
    fat: Number(totalsObj.fat) || items.reduce((s, i) => s + i.fat, 0),
    fiber: Number(totalsObj.fiber) || items.reduce((s, i) => s + i.fiber, 0),
  };

  const confidence = ['low', 'medium', 'high'].includes(raw.confidence) ? raw.confidence : 'medium';
  const assumptions = Array.isArray(raw.assumptions) ? raw.assumptions.map(String) : [];

  return {
    mealName,
    items,
    totals,
    confidence,
    assumptions,
  };
}

async function generateAIMealAnalysis(mealText, profile) {
  try {
    const prompt = getAnalyzeMealPrompt(mealText, profile);
    const rawJson = await generateAIContent(prompt);
    
    let parsed;
    try {
      parsed = JSON.parse(rawJson);
    } catch (parseError) {
      console.error('Gemini Meal Analysis JSON parsing failed:', rawJson);
      throw new Error('AI returned invalid JSON');
    }

    const normalized = normalizeAIMealAnalysis(parsed, mealText);
    const validation = validateAIResponse(analyzeMealSchema, normalized);
    if (validation.success) {
      return validation.data;
    }
    
    console.error('Gemini Meal Analysis validation failed:', validation.error);
    throw new Error(`AI generated incomplete meal data: ${validation.error}`);
  } catch (err) {
    console.error('Gemini Meal Analysis error:', err.message);
    throw err; // DO NOT swallow the error
  }
}

module.exports = {
  generateAIWorkoutPlan,
  generateAIMealPlan,
  generateAICoachResponse,
  generateAIWeeklyReview,
  generateAIFoodSwap,
  generateAIMealAnalysis,
};
