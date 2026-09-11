const axios = require('axios');
require('dotenv').config();

async function testUSDA() {
  const apiKey = process.env.USDA_FDC_API_KEY || process.env.USDA_API_KEY;
  console.log('Testing USDA API with Key:', apiKey ? apiKey.substring(0, 8) + '...' : 'NOT FOUND');

  try {
    const res = await axios.get('https://api.nal.usda.gov/fdc/v1/foods/search', {
      params: {
        api_key: apiKey,
        query: 'oats',
        pageSize: 2
      },
      timeout: 10000
    });

    console.log('Response Status:', res.status);
    console.log('Total Hits:', res.data.totalHits);
    if (res.data.foods && res.data.foods.length > 0) {
      const food = res.data.foods[0];
      console.log('Food Description:', food.description);
      console.log('FDC ID:', food.fdcId);
      console.log('Food Category:', food.foodCategory);
      console.log('Serving Size:', food.servingSize, food.servingSizeUnit);
      console.log('Nutrients:');
      food.foodNutrients.forEach(n => {
        if (['Energy', 'Protein', 'Carbohydrate, by difference', 'Total lipid (fat)', 'Fiber, total dietary'].some(name => n.nutrientName?.includes(name))) {
          console.log(`  - ${n.nutrientName} (${n.nutrientId}): ${n.value} ${n.unitName}`);
        }
      });
    }
  } catch (err) {
    console.error('USDA API Error:', err.message);
    if (err.response) {
      console.error('Response Data:', err.response.status, err.response.data);
    }
  }
}

testUSDA();
