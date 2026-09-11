const API = 'http://localhost:5000/api';

async function req(endpoint, body) {
  const res = await fetch(`${API}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function run() {
  console.log("=== TEST REGISTER ===");
  const email = `test${Date.now()}@test.com`;
  const reg = await req('/auth/register', { name: 'Test User', email, password: 'password123' });
  console.log("Register response:", reg.status);
  
  console.log("\n=== TEST LOGIN SUCCESS ===");
  const loginSuccess = await req('/auth/login', { email, password: 'password123' });
  console.log("Login success response:", loginSuccess.status);
  
  console.log("\n=== TEST LOGIN FAILURE ===");
  const loginFail = await req('/auth/login', { email, password: 'wrongpassword' });
  console.log("Login fail response:", loginFail.status, loginFail.data.error);

  console.log("\n=== TEST RATE LIMIT OVER 20 ===");
  let count = 0;
  for (let i = 0; i < 22; i++) {
    const res = await req('/auth/login', { email, password: 'wrongpassword' });
    if (res.status === 429) {
      console.log(`Hit 429 on attempt ${i + 1}: ${res.data.error}`);
      break;
    }
    count++;
  }
  console.log(`Allowed ${count} attempts before rate limit`);
}
run();
