const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

async function test() {
  await mongoose.connect('mongodb+srv://yashkashyap0120_db_user:uTcCj9XjfHOrO3YB@cluster0.tnhlgfg.mongodb.net/');
  const User = mongoose.connection.collection('users');
  const user = await User.findOne({});
  console.log("Token:", jwt.sign({ id: user._id }, 'secret', { expiresIn: '30d' }));
  process.exit(0);
}
test();
