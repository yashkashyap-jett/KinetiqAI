const WorkoutPlan = require('../models/WorkoutPlan');
const WorkoutSession = require('../models/WorkoutSession');
const Profile = require('../models/Profile');
const PersonalRecord = require('../models/PersonalRecord');
const { generateAIWorkoutPlan } = require('../ai/provider');
const { detectPRs } = require('../services/analytics/prDetection');
const AppError = require('../utils/AppError');

// POST /api/workouts/generate
const generatePlan = async (req, res, next) => {
  try {
    let { config } = req.body;
    let profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await Profile.create({
        userId: req.user._id,
        age: 25,
        gender: 'male',
        height: 178,
        weight: 75,
        fitnessGoal: 'recomposition',
        fitnessLevel: 'intermediate',
        workoutDaysPerWeek: 4,
        avgWorkoutDuration: 60,
        workoutLocation: 'gym',
        dailyActivity: 'moderately_active',
      });
    }

    // If config is missing (regeneration), extract it from the currently active plan
    if (!config) {
      const activePlan = await WorkoutPlan.findOne({ userId: req.user._id, isActive: true });
      if (activePlan && activePlan.config) {
        config = activePlan.config;
      } else if (activePlan) {
        config = {
          goal: profile.fitnessGoal || 'recomposition',
          experience: profile.fitnessLevel || 'intermediate',
          daysPerWeek: activePlan.weeklyFrequency || profile.workoutDaysPerWeek || 4,
          splitType: activePlan.splitType,
          durationMin: profile.avgWorkoutDuration || 60,
          equipment: profile.workoutLocation || 'Gym (Full Equipment)',
        };
      }
    }

    console.log('[Workout AI] Generating workout plan with config:', config);

    // Generate via AI FIRST so if it fails, the user keeps their existing plan
    const aiPlanData = await generateAIWorkoutPlan(profile, config);

    // Only deactivate existing plans if generation succeeded
    await WorkoutPlan.updateMany({ userId: req.user._id, isActive: true }, { isActive: false });

    const plan = await WorkoutPlan.create({
      userId: req.user._id,
      isActive: true,
      splitType: aiPlanData.splitType,
      weeklyFrequency: aiPlanData.weeklyFrequency,
      config: config || null,
      days: aiPlanData.days,
      generatedReason: config ? 'Custom Setup Builder' : 'AI Profile generation',
    });

    console.log('[Workout AI] Successfully generated and saved plan:', plan._id);

    res.status(201).json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};

// GET /api/workouts/plan
const getActivePlan = async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findOne({ userId: req.user._id, isActive: true });
    // Simply return the plan (can be null). The frontend will handle triggering the setup flow.
    res.json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};

// GET /api/workouts/today
const getTodaysWorkout = async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findOne({ userId: req.user._id, isActive: true });
    if (!plan || !plan.days || plan.days.length === 0) {
      return res.json({ success: true, todaysWorkout: null });
    }

    // Calculate day index based on current day of week (0=Sun, 1=Mon, ..., 6=Sat)
    const currentDayOfWeek = new Date().getDay();
    // Map Sunday=0 to Day 6, Mon=1 to Day 0, etc.
    const dayIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

    const todaysWorkout = plan.days.find((d) => d.dayIndex === dayIndex) || plan.days[0];

    res.json({ success: true, todaysWorkout, dayIndex });
  } catch (error) {
    next(error);
  }
};

// POST /api/workouts/sessions (Start session)
const startSession = async (req, res, next) => {
  try {
    const { planId, dayIndex, splitName, exercises } = req.body;

    const session = await WorkoutSession.create({
      userId: req.user._id,
      planId,
      dayIndex: dayIndex || 0,
      splitName: splitName || 'Workout Session',
      exercises: exercises || [],
      status: 'in_progress',
      startedAt: new Date(),
    });

    res.status(201).json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

// POST /api/workouts/sessions/:id/complete
const completeSession = async (req, res, next) => {
  try {
    const { exercises, durationMinutes, sessionRpe, notes } = req.body;

    let totalVolume = 0;
    if (exercises && Array.isArray(exercises)) {
      exercises.forEach((ex) => {
        let exVolume = 0;
        if (ex.sets) {
          ex.sets.forEach((s) => {
            if (s.completed) {
              exVolume += (s.weightKg || 0) * (s.reps || 0);
            }
          });
        }
        ex.exerciseVolume = exVolume;
        totalVolume += exVolume;
      });
    }

    const session = await WorkoutSession.findByIdAndUpdate(
      req.params.id,
      {
        exercises,
        durationMinutes: durationMinutes || 45,
        totalVolumeKg: totalVolume,
        sessionRpe: sessionRpe || 7,
        notes: notes || '',
        status: 'completed',
        completedAt: new Date(),
      },
      { new: true }
    );

    // Detect PRs
    const existingPRs = await PersonalRecord.find({ userId: req.user._id });
    const newPRs = detectPRs(exercises || [], existingPRs);

    for (const pr of newPRs) {
      await PersonalRecord.create({
        userId: req.user._id,
        exerciseName: pr.exerciseName,
        value: pr.value,
        metricType: pr.metricType,
        reps: pr.reps,
        previousValue: pr.previousValue,
        improvementPercent: pr.improvementPercent,
      });
    }

    res.json({ success: true, session, newPRs });
  } catch (error) {
    next(error);
  }
};

// GET /api/workouts/sessions (History)
const getSessionHistory = async (req, res, next) => {
  try {
    const sessions = await WorkoutSession.find({ userId: req.user._id, status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(30);

    res.json({ success: true, sessions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generatePlan,
  getActivePlan,
  getTodaysWorkout,
  startSession,
  completeSession,
  getSessionHistory,
};
