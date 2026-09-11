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
    const regA = await req('POST', '/auth/register', ua);
    const tokenA = regA.data.token;
    
    await req('POST', '/users/profile/onboarding', { 
      age: 25, height: 180, weight: 70, fitnessGoal: 'muscle_gain', fitnessLevel: 'intermediate', 
      dailyActivity: 'very_active', workoutDaysPerWeek: 5, gender: 'male', avgWorkoutDuration: 60,
      workoutLocation: 'gym', dietaryPreference: 'other', sleepDuration: 8, workSchedule: 'flexible',
      stressLevel: 'low'
    }, tokenA);
    
    const planRes = await req('GET', '/workouts/plan', null, tokenA);
    console.log("Days count:", planRes.plan.days.length);
    console.log("Exercises in day 0:", planRes.plan.days[0].exercises.length);
  } catch (e) {
    console.error(e.message);
  }
}
run();
