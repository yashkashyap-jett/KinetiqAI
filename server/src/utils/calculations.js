/**
 * Fitness calculation utilities
 */

// Mifflin-St Jeor BMR calculation
function calculateBMR(weight, height, age, gender) {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

// Total Daily Energy Expenditure
const activityMultipliers = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

function calculateTDEE(bmr, activityLevel) {
  const multiplier = activityMultipliers[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
}

// Goal-based calorie adjustment
function calculateTargetCalories(tdee, goal) {
  const adjustments = {
    fat_loss: -400,
    muscle_gain: 300,
    recomposition: 0,
    strength: 200,
    endurance: 100,
    general_fitness: 0,
    athletic_performance: 200,
  };
  return Math.round(tdee + (adjustments[goal] || 0));
}

// Macro targets based on goal and bodyweight
function calculateMacroTargets(targetCalories, weight, goal) {
  let proteinPerKg, fatPercent;

  switch (goal) {
    case 'muscle_gain':
    case 'strength':
      proteinPerKg = 2.0;
      fatPercent = 0.25;
      break;
    case 'fat_loss':
      proteinPerKg = 2.2;
      fatPercent = 0.25;
      break;
    case 'recomposition':
      proteinPerKg = 2.0;
      fatPercent = 0.25;
      break;
    case 'endurance':
      proteinPerKg = 1.6;
      fatPercent = 0.20;
      break;
    default:
      proteinPerKg = 1.8;
      fatPercent = 0.25;
  }

  const protein = Math.round(weight * proteinPerKg);
  const fat = Math.round((targetCalories * fatPercent) / 9);
  const carbCalories = targetCalories - (protein * 4 + fat * 9);
  const carbs = Math.round(carbCalories / 4);

  return { protein, carbs, fat };
}

// BMI calculation
function calculateBMI(weight, heightCm) {
  const heightM = heightCm / 100;
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

// Session training load = duration × RPE
function calculateSessionLoad(durationMinutes, rpe) {
  return Math.round(durationMinutes * rpe);
}

module.exports = {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacroTargets,
  calculateBMI,
  calculateSessionLoad,
  activityMultipliers,
};

// Calculate full nutrition targets from profile
function calculateNutritionTargets(profile) {
  const bmr = calculateBMR(
    profile.weight,
    profile.height,
    profile.age,
    profile.gender || 'male'
  );
  
  const tdee = calculateTDEE(bmr, profile.dailyActivity || 'lightly_active');
  const targetCalories = calculateTargetCalories(tdee, profile.fitnessGoal || 'general_fitness');
  
  const macros = calculateMacroTargets(
    targetCalories,
    profile.weight,
    profile.fitnessGoal || 'general_fitness'
  );

  return {
    dailyCalories: targetCalories,
    macroTargets: {
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat
    }
  };
}

module.exports.calculateNutritionTargets = calculateNutritionTargets;
