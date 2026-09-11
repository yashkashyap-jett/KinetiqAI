require('dotenv').config();
const mongoose = require('mongoose');
const MealLog = require('./src/models/MealLog');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartgym').then(async () => {
  const queryDate = new Date();
  const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));
  
  console.log('Query start:', startOfDay);
  console.log('Query end:', endOfDay);

  const logs = await MealLog.find({
    date: { $gte: startOfDay, $lte: endOfDay },
  });
  
  console.log('Logs found in range:', logs.length);
  
  const allLogs = await MealLog.find({});
  console.log('Total logs in DB:', allLogs.length);
  if (allLogs.length > 0) {
    console.log('First log date:', allLogs[0].date);
  }

  process.exit(0);
});
