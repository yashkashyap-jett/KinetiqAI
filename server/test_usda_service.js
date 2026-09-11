require('dotenv').config();
const { resolveUSDAFood } = require('./src/services/usdaService');

async function run() {
  console.log('--- Testing USDA Resolution ---');
  const oats = await resolveUSDAFood('oats', 100, 'g');
  console.log('Oats:', oats);

  const milk = await resolveUSDAFood('milk', 250, 'ml');
  console.log('Milk:', milk);

  const banana = await resolveUSDAFood('banana', 2, 'piece');
  console.log('Banana:', banana);
}

run();
