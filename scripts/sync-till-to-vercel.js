/**
 * AGROVET LTD — Sync Daraja Till Credentials to Vercel
 */

const { spawnSync } = require('child_process');

const envVars = [
  { key: 'MPESA_TILL_NUMBER', val: '1755724' },
  { key: 'DARAJA_TILL_NUMBER', val: '1755724' },
  { key: 'DARAJA_BUSINESS_SHORTCODE', val: '1755724' },
  { key: 'MPESA_SHORTCODE', val: '1755724' },
  { key: 'DARAJA_CONSUMER_KEY', val: '2oclfKAmaISAxurAYd9oWjoNPEfAvkHJ1E2q2no6QGKJVi4D' },
  { key: 'MPESA_CONSUMER_KEY', val: '2oclfKAmaISAxurAYd9oWjoNPEfAvkHJ1E2q2no6QGKJVi4D' },
  { key: 'DARAJA_CONSUMER_SECRET', val: 'FgpiWoDJp1hxapk2Jc1An0dZxapvN0PjvLx75lrgyOj4JrJsLX0HMzOLfe4zypxe' },
  { key: 'MPESA_CONSUMER_SECRET', val: 'FgpiWoDJp1hxapk2Jc1An0dZxapvN0PjvLx75lrgyOj4JrJsLX0HMzOLfe4zypxe' },
  { key: 'DARAJA_PASSKEY', val: '2905cc944f6b419c6104c10fd9fb55db0300311ea2f0b988a8f56c' },
  { key: 'MPESA_PASSKEY', val: '2905cc944f6b419c6104c10fd9fb55db0300311ea2f0b988a8f56c' },
  { key: 'DARAJA_TRANSACTION_TYPE', val: 'CustomerBuyGoodsOnline' },
  { key: 'MPESA_TRANSACTION_TYPE', val: 'CustomerBuyGoodsOnline' },
];

console.log('🔄 Syncing Daraja Till 1755724 credentials to Vercel...');

for (const item of envVars) {
  for (const targetEnv of ['production', 'preview', 'development']) {
    process.stdout.write(`Syncing ${item.key} (${targetEnv})... `);
    // Remove if previously set
    spawnSync('npx.cmd', ['vercel', 'env', 'rm', item.key, targetEnv, '-y'], {
      shell: true,
      stdio: 'ignore',
    });
    // Add variable with pipe input
    const addRes = spawnSync('npx.cmd', ['vercel', 'env', 'add', item.key, targetEnv], {
      input: item.val,
      encoding: 'utf-8',
      shell: true,
    });
    if (addRes.status === 0 || (addRes.stdout && addRes.stdout.includes('Added'))) {
      console.log('✅ Synced');
    } else {
      console.log('⚠️ ' + (addRes.stderr || addRes.stdout || '').trim().slice(0, 80));
    }
  }
}

console.log('🎉 All Daraja Till environment variables synced to Vercel!');
