const User = require('../models/User');
const Profile = require('../models/Profile');
const AppError = require('../utils/AppError');

// GET /api/profile
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    res.json({
      success: true,
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/profile/onboarding
exports.completeOnboarding = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Create or update profile
    let profile = await Profile.findOne({ userId });
    if (profile) {
      Object.assign(profile, req.body);
      await profile.save();
    } else {
      profile = await Profile.create({ userId, ...req.body });
    }

    // Mark onboarding complete
    await User.findByIdAndUpdate(userId, { onboardingComplete: true });

    res.status(201).json({
      success: true,
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    res.json({
      success: true,
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};
