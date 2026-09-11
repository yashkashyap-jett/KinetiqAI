require('dotenv').config();
const mongoose = require('mongoose');
const MealLog = require('./src/models/MealLog');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartgym').then(async () => {
  const logs = await MealLog.find({});
  console.log('Total logs:', logs.length);
  if (logs.length > 0) {
    console.log('Sample log:', JSON.stringify(logs[0], null, 2));
    const user = await User.findById(logs[0].userId);
    console.log('User:', user ? user.email : 'Unknown');
  }
  process.exit(0);
});
