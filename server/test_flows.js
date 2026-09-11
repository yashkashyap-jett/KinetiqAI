const API = 'http://localhost:5000/api';

async function req(method, endpoint, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

async function run() {
  try {
    const ua = { email: `ua${Date.now()}@test.com`, password: "password123", name: "User A" };
    console.log("Registering...", ua.email);
    const regA = await req('POST', '/auth/register', ua);
    const tokenA = regA.data.token;
    
    await req('POST', '/users/profile/onboarding', { 
      age: 25, height: 180, weight: 70, fitnessGoal: 'muscle_gain', fitnessLevel: 'intermediate', 
      dailyActivity: 'very_active', workoutDaysPerWeek: 5, gender: 'male', avgWorkoutDuration: 60,
      workoutLocation: 'gym', dietaryPreference: 'other', sleepDuration: 8, workSchedule: 'flexible',
      stressLevel: 'low'
    }, tokenA);
    
    console.log("\n=== TEST A: Macro Targets ===");
    await req('PUT', '/nutrition/targets', {}, tokenA);
    const planA = await req('GET', '/nutrition/plan', null, tokenA);
    console.log("User A Targets:", planA.plan.dailyCalories, "kcal | Macros:", planA.plan.macroTargets);
    
    console.log("\n=== TEST B: Log Meal ===");
    const mealDate = new Date().toISOString();
    await req('POST', '/nutrition/log', { date: mealDate, mealType: 'breakfast', name: 'Oats', foods: [{name: 'Oats', amount: '100g', calories: 350, protein: 10, carbs: 60, fat: 5}] }, tokenA);
    const dailyLogs = await req('GET', `/nutrition/daily/${mealDate.split('T')[0]}`, null, tokenA);
    console.log("Logs fetched count:", dailyLogs.logs.length);
    console.log("First log name:", dailyLogs.logs[0]?.name);
    
    console.log("\n=== TEST C: AI Coach ===");
    const q1 = await req('POST', '/ai/coach', { question: "What should I eat with oats?" }, tokenA);
    console.log("Q1 Response:", q1.response.message);
    
    const q2 = await req('POST', '/ai/coach', { question: "How should I adjust today's workout?" }, tokenA);
    console.log("Q2 Response:", q2.response.message);
    
    const q3 = await req('POST', '/ai/coach', { question: "Why has my weight progress stalled?" }, tokenA);
    console.log("Q3 Response:", q3.response.message);
    
    console.log("\n=== TEST D: Regenerate ===");
    const wpRegen = await req('POST', '/workouts/generate', {}, tokenA);
    console.log("New Plan Exercises count:", wpRegen.plan.days[0].exercises.length);
  } catch(e) {
    console.error("TEST FAILED:", e.message);
  }
}
run();
