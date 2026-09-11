const axios = require('axios');
require('dotenv').config();

async function test() {
  try {
    const res = await axios.get('https://api.nal.usda.gov/fdc/v1/foods/search', {
      params: {
        api_key: process.env.USDA_FDC_API_KEY,
        query: 'oats',
        pageSize: 1
      }
    });
    console.log(JSON.stringify(res.data.foods[0].foodNutrients, null, 2));
  } catch (err) {
    console.error(err.message);
  }
}
test();
