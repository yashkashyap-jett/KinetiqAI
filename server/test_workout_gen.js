const axios = require('axios');
const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb+srv://yashkashyap0120_db_user:uTcCj9XjfHOrO3YB@cluster0.tnhlgfg.mongodb.net/');
  const User = mongoose.connection.collection('users');
  const user = await User.findOne({});
  console.log("Found user:", user._id);
  
  try {
    const res = await axios.post('http://localhost:5000/api/workouts/generate', 
    {
      config: {
        goal: 'Muscle Gain', experience: 'Intermediate', daysPerWeek: 5,
        splitType: 'Custom Split',
        customSchedule: [
          { dayName: 'Monday', isRest: false, muscles: ['Chest', 'Triceps'] },
          { dayName: 'Tuesday', isRest: true, muscles: [] },
          { dayName: 'Wednesday', isRest: true, muscles: [] },
          { dayName: 'Thursday', isRest: true, muscles: [] },
          { dayName: 'Friday', isRest: true, muscles: [] },
          { dayName: 'Saturday', isRest: true, muscles: [] },
          { dayName: 'Sunday', isRest: true, muscles: [] },
        ],
        equipment: 'Gym', durationMin: 60
      }
    },
    { headers: { 'Authorization': `Bearer fake_token` } } // We need a real token, let's login first
    );
    console.log(res.data);
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
  }
}
test();
