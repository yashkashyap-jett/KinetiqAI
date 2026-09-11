/**
 * Calculates Readiness Score (0-100) based on deterministic metrics:
 * - Sleep quality/duration (30%)
 * - Acute vs Chronic Training Load (25%)
 * - Recent workout RPE (20%)
 * - 7-day Workout Consistency (15%)
 * - Recovery gap / rest days (10%)
 */
function calculateReadinessScore({ lastSleepEntry, trainingLoad, recentSessions, adherence7Day }) {
  // 1. Sleep score (30 points max)
  let sleepScore = 21; // default average (7h)
  if (lastSleepEntry) {
    const hours = lastSleepEntry.sleepHours || 7;
    const quality = lastSleepEntry.sleepQuality || 7;
    const hourScore = Math.min(100, (hours / 8) * 100);
    const qualScore = quality * 10;
    sleepScore = ((hourScore * 0.6 + qualScore * 0.4) / 100) * 30;
  }

  // 2. Training load score (25 points max)
  let loadScore = 20;
  if (trainingLoad && trainingLoad.ratio) {
    const ratio = trainingLoad.ratio;
    if (ratio >= 0.8 && ratio <= 1.2) {
      loadScore = 25; // optimal window
    } else if (ratio > 1.2 && ratio <= 1.4) {
      loadScore = 18; // slightly overreaching
    } else if (ratio > 1.4) {
      loadScore = 10; // high fatigue risk
    } else {
      loadScore = 15; // undertrained / fresh
    }
  }

  // 3. Recent RPE score (20 points max)
  let rpeScore = 16;
  if (recentSessions && recentSessions.length > 0) {
    const avgRpe = recentSessions.reduce((acc, s) => acc + (s.sessionRpe || 7), 0) / recentSessions.length;
    if (avgRpe <= 7) rpeScore = 20;
    else if (avgRpe <= 8.5) rpeScore = 14;
    else rpeScore = 8; // high strain
  }

  // 4. Consistency score (15 points max)
  const consistencyScore = (adherence7Day || 0.8) * 15;

  // 5. Recovery gap score (10 points max)
  let recoveryScore = 8;
  if (recentSessions && recentSessions.length > 0) {
    const lastSession = recentSessions[0];
    const daysSince = (new Date() - new Date(lastSession.completedAt || lastSession.createdAt)) / (1000 * 60 * 60 * 24);
    if (daysSince >= 1 && daysSince <= 2) recoveryScore = 10;
    else if (daysSince < 1) recoveryScore = 6; // worked out today/recently
    else recoveryScore = 7;
  }

  const total = Math.round(sleepScore + loadScore + rpeScore + consistencyScore + recoveryScore);
  const score = Math.max(0, Math.min(100, total));

  let status = 'Optimal';
  let recommendation = 'You are prime for a heavy or high-intensity session today.';
  if (score < 50) {
    status = 'Low';
    recommendation = 'Focus on active recovery, mobility, and high protein intake today.';
  } else if (score < 75) {
    status = 'Moderate';
    recommendation = 'Moderate intensity recommended. Pay attention to warm-ups.';
  }

  return {
    score,
    status,
    recommendation,
    breakdown: {
      sleep: Math.round(sleepScore),
      trainingLoad: Math.round(loadScore),
      recentRpe: Math.round(rpeScore),
      consistency: Math.round(consistencyScore),
      recoveryGap: Math.round(recoveryScore),
    },
  };
}

module.exports = { calculateReadinessScore };
