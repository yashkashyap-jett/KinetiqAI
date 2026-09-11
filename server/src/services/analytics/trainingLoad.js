/**
 * Calculates Training Load metrics:
 * Session Load = Duration (min) * RPE (1-10)
 * Acute Load = 7-day rolling average load
 * Chronic Load = 28-day rolling average load
 * Acute:Chronic Ratio = Acute / Chronic
 */
function calculateTrainingLoad(sessions = []) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twentyEightDaysAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

  let acuteSum = 0;
  let chronicSum = 0;

  sessions.forEach((s) => {
    const sDate = new Date(s.completedAt || s.createdAt);
    const load = (s.durationMinutes || 45) * (s.sessionRpe || 7);

    if (sDate >= sevenDaysAgo) {
      acuteSum += load;
    }
    if (sDate >= twentyEightDaysAgo) {
      chronicSum += load;
    }
  });

  const acuteLoad = Math.round(acuteSum / 7);
  const chronicLoad = Math.round(chronicSum / 28) || 1; // prevent divide by zero
  const ratio = parseFloat((acuteLoad / chronicLoad).toFixed(2));

  let zone = 'Optimal';
  if (ratio < 0.8) zone = 'Undertrained';
  else if (ratio > 1.3 && ratio <= 1.5) zone = 'Overreaching Caution';
  else if (ratio > 1.5) zone = 'High Fatigue / Injury Risk';

  return {
    acuteLoad,
    chronicLoad,
    ratio,
    zone,
    total7DayLoad: Math.round(acuteSum),
    total28DayLoad: Math.round(chronicSum),
  };
}

module.exports = { calculateTrainingLoad };
