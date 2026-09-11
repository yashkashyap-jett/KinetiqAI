const axios = require('axios');
const dns = require('dns');

try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore
}

const COMMON_PORTION_GRAMS = {
  banana: 118,
  egg: 50,
  apple: 182,
  orange: 130,
  bread: 35,
  slice: 35,
  cup: 240,
  tbsp: 15,
  tablespoon: 15,
  tsp: 5,
  teaspoon: 5,
  scoop: 30,
  piece: 100,
  serving: 100,
  portion: 100,
  oz: 28.35,
  ounce: 28.35,
  lb: 453.6,
  pound: 453.6,
  kg: 1000,
  g: 1,
  gram: 1,
  grams: 1,
  ml: 1,
  milliliter: 1,
  milliliters: 1,
  l: 1000,
  liter: 1000,
  liters: 1000,
};

function getUSDAApiKey() {
  return process.env.USDA_API_KEY || process.env.USDA_FDC_API_KEY || '';
}

/**
 * Searches USDA FoodData Central for a specific food item and calculates
 * nutrition based on quantity & unit.
 */
async function resolveUSDAFood(itemName, quantity = 1, unit = 'g') {
  const apiKey = getUSDAApiKey();
  if (!apiKey) {
    console.warn('[Nutrition USDA] No USDA API key configured.');
    return null;
  }

  try {
    const cleanQuery = itemName.replace(/\([^)]*\)/g, '').trim().toLowerCase();
    console.log(`[Nutrition USDA] Searching USDA for: "${cleanQuery}" (raw: "${itemName}")`);

    const res = await axios.get('https://api.nal.usda.gov/fdc/v1/foods/search', {
      params: {
        api_key: apiKey,
        query: cleanQuery,
        pageSize: 15,
      },
      timeout: 6000,
    });

    const foods = res.data?.foods;
    if (!foods || foods.length === 0) {
      console.warn(`[Nutrition USDA] No USDA search results for: "${cleanQuery}"`);
      return null;
    }

    // Filter out processed items like "chips", "dried", "candy", "oil", "powder" if the query wasn't asking for them
    let candidateFoods = foods.filter(f => {
      const desc = (f.description || '').toLowerCase();
      if (!cleanQuery.includes('chip') && desc.includes('chip')) return false;
      if (!cleanQuery.includes('dried') && !cleanQuery.includes('dehydrated') && (desc.includes('dried') || desc.includes('dehydrated') || desc.includes('powder'))) return false;
      if (!cleanQuery.includes('candy') && desc.includes('candy')) return false;
      if (!cleanQuery.includes('baby') && desc.includes('babyfood')) return false;
      if (!cleanQuery.includes('oil') && desc.includes('oil')) return false;
      if (!cleanQuery.includes('butter') && desc.includes('butter')) return false;
      if (!cleanQuery.includes('flour') && desc.includes('flour')) return false;
      return true;
    });

    if (candidateFoods.length === 0) {
      candidateFoods = foods;
    }

    // Prioritize Foundation / SR Legacy over Branded, especially matching whole/raw food description
    let bestFood = candidateFoods.find(f => (f.dataType === 'Foundation' || f.dataType === 'SR Legacy') && f.description.toLowerCase().includes(cleanQuery));
    if (!bestFood) {
      bestFood = candidateFoods.find(f => f.dataType === 'Foundation' || f.dataType === 'SR Legacy');
    }
    if (!bestFood) {
      bestFood = candidateFoods.find(f => f.dataType === 'Survey (FNDDS)');
    }
    if (!bestFood) {
      bestFood = candidateFoods[0];
    }

    console.log(`[Nutrition USDA] Selected food match: "${bestFood.description}" (${bestFood.dataType})`);

    const nutrients = bestFood.foodNutrients || [];

    let calVal = 0;
    let protVal = 0;
    let carbVal = 0;
    let fatVal = 0;
    let fiberVal = 0;

    for (const n of nutrients) {
      const name = (n.nutrientName || '').toLowerCase();
      const id = n.nutrientId;

      if ((id === 1008 || id === 208 || name.includes('energy')) && (n.unitName === 'KCAL' || !n.unitName)) {
        if (!calVal || n.unitName === 'KCAL') calVal = n.value || 0;
      } else if (id === 1003 || id === 203 || name.includes('protein')) {
        protVal = n.value || 0;
      } else if (id === 1005 || id === 205 || name.includes('carbohydrate')) {
        carbVal = n.value || 0;
      } else if (id === 1004 || id === 204 || name.includes('total lipid') || (name.includes('fat') && !name.includes('fatty'))) {
        fatVal = n.value || 0;
      } else if (id === 1079 || id === 291 || name.includes('fiber')) {
        fiberVal = n.value || 0;
      }
    }

    // Determine target total weight in grams
    const uLower = (unit || '').toLowerCase().trim();
    const nameLower = cleanQuery;

    let targetGrams = 100;
    const qty = Number(quantity) || 1;

    if (COMMON_PORTION_GRAMS[uLower]) {
      targetGrams = qty * COMMON_PORTION_GRAMS[uLower];
    } else if (COMMON_PORTION_GRAMS[nameLower]) {
      targetGrams = qty * COMMON_PORTION_GRAMS[nameLower];
    } else if (bestFood.servingSize) {
      targetGrams = qty * bestFood.servingSize;
    } else {
      targetGrams = qty * 100;
    }

    const scale = targetGrams / 100;

    const calories = Math.round(calVal * scale * 10) / 10;
    const protein = Math.round(protVal * scale * 10) / 10;
    const carbs = Math.round(carbVal * scale * 10) / 10;
    const fat = Math.round(fatVal * scale * 10) / 10;
    const fiber = Math.round(fiberVal * scale * 10) / 10;

    console.log(`[Nutrition USDA] Calculated "${cleanQuery}" (${qty} ${unit} -> ${targetGrams}g): ${calories} kcal, ${protein}g P, ${carbs}g C, ${fat}g F`);

    return {
      name: itemName,
      quantity: qty,
      unit: unit || 'g',
      calories,
      protein,
      carbs,
      fat,
      fiber,
      source: 'usda',
    };
  } catch (err) {
    console.error(`[Nutrition USDA] Error resolving "${itemName}":`, err.message);
    return null;
  }
}

module.exports = { resolveUSDAFood };
