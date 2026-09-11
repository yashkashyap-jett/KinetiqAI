function getWeeklyReviewPrompt(context) {
  return `You are KINETIQ Intelligence Director.
Synthesize the past 7 days of user performance into an executive weekly intelligence review.

User Context & Performance Metrics:
${JSON.stringify(context, null, 2)}

Instructions:
1. Evaluate 4 core pillars (0-100 scores): training, nutrition, recovery, consistency.
2. Provide a 2-3 sentence executive summary.
3. List 2-3 specific improvements observed.
4. List 1-2 potential concerns/red flags (if any).
5. List 2-3 high-impact actionable recommendations for next week.
6. Return JSON with keys: scores { training, nutrition, recovery, consistency }, summary, improvements[], concerns[], recommendations[].
7. Raw JSON ONLY. No markdown wrapper.`;
}

module.exports = { getWeeklyReviewPrompt };
