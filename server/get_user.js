require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartgym').then(async () => {
  const users = await User.find({});
  console.log('Users in DB:');
  users.forEach(u => console.log(u.email));
  process.exit(0);
});
