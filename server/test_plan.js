const mongoose = require('mongoose');
const WorkoutPlan = require('./src/models/WorkoutPlan');
const env = require('./src/config/env');
const db = require('./src/config/db');

async function run() {
  await db();
  const plan = await WorkoutPlan.findOne({ isActive: true }).sort({ createdAt: -1 });
  console.log(JSON.stringify(plan, null, 2));
  process.exit(0);
}
run();
