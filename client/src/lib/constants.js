export const FITNESS_GOALS = [
  { value: 'fat_loss', label: 'Fat Loss', description: 'Reduce body fat while preserving muscle' },
  { value: 'muscle_gain', label: 'Muscle Gain', description: 'Build lean muscle mass' },
  { value: 'recomposition', label: 'Body Recomposition', description: 'Lose fat and gain muscle simultaneously' },
  { value: 'strength', label: 'Strength', description: 'Increase maximal strength' },
  { value: 'endurance', label: 'Endurance', description: 'Improve cardiovascular fitness' },
  { value: 'general_fitness', label: 'General Fitness', description: 'Overall health and wellness' },
  { value: 'athletic_performance', label: 'Athletic Performance', description: 'Sport-specific conditioning' },
];

export const FITNESS_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'New to structured training' },
  { value: 'intermediate', label: 'Intermediate', description: '6 months – 2 years experience' },
  { value: 'advanced', label: 'Advanced', description: '2+ years consistent training' },
];

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', description: 'Desk job, minimal movement' },
  { value: 'lightly_active', label: 'Lightly Active', description: 'Light walks, standing desk' },
  { value: 'moderately_active', label: 'Moderately Active', description: 'Regular movement throughout day' },
  { value: 'very_active', label: 'Very Active', description: 'Physical job or very active lifestyle' },
  { value: 'extremely_active', label: 'Extremely Active', description: 'Intense physical labor or multiple daily sessions' },
];

export const DIETARY_PREFERENCES = [
  { value: 'non_vegetarian', label: 'Non-Vegetarian' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'eggetarian', label: 'Eggetarian' },
  { value: 'other', label: 'Other' },
];

export const WORKOUT_LOCATIONS = [
  { value: 'gym', label: 'Gym' },
  { value: 'home', label: 'Home' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'mixed', label: 'Mixed' },
];

export const EQUIPMENT_OPTIONS = [
  'Barbell', 'Dumbbells', 'Bench', 'Pull-up Bar', 'Cables',
  'Resistance Bands', 'Kettlebell', 'Smith Machine', 'Leg Press',
  'Treadmill', 'Stationary Bike', 'Rowing Machine', 'None',
];

export const STRESS_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' },
  { value: 'very_high', label: 'Very High' },
];

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/workout', label: 'Workout', icon: 'Dumbbell' },
  { path: '/nutrition', label: 'Nutrition', icon: 'Apple' },
  { path: '/progress', label: 'Progress', icon: 'TrendingUp' },
  { path: '/ai-coach', label: 'AI Coach', icon: 'Brain' },
];

export const NAV_ITEMS_SECONDARY = [
  { path: '/habits', label: 'Habits', icon: 'Target' },
  { path: '/achievements', label: 'Achievements', icon: 'Trophy' },
];
