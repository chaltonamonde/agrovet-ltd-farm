/**
 * AGROVET LTD — Database Initialization & Connectivity Verification
 * Usage: npm run db:init
 */

const { getConnectionString, ensureSchema, query } = require('../api/_db');

async function main() {
  const connStr = getConnectionString();
  console.log('─────────────────────────────────────────────────────────────────');
  console.log(' AGROVET LTD — PostgreSQL Connection Check & Schema Migration');
  console.log('─────────────────────────────────────────────────────────────────');

  if (!connStr) {
    console.error('❌ ERROR: No PostgreSQL connection string found in environment.');
    console.error('Please set DATABASE_URL in your .env or environment variables:');
    console.error('Example: DATABASE_URL="postgresql://user:pass@ep-cool-db.us-east-2.aws.neon.tech/agrovet?sslmode=require"\n');
    process.exit(1);
  }

  // Obfuscate credentials for safe output
  const safeUrl = connStr.replace(/:([^:@]+)@/, ':••••••••@');
  console.log(`Connecting to: ${safeUrl}...`);

  try {
    const resPing = await query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Connection Successful!');
    console.log(`   Database Time: ${resPing.rows[0].current_time}`);
    console.log(`   PostgreSQL Version: ${resPing.rows[0].pg_version.split(' ')[0]} ${resPing.rows[0].pg_version.split(' ')[1]}`);

    console.log('\nRunning Schema Verification...');
    await ensureSchema();
    console.log('✅ Table "orders" verified and indexes active.');

    const countRes = await query('SELECT count(*)::int as total_orders FROM orders');
    console.log(`   Total Orders in Database: ${countRes.rows[0].total_orders}`);

    console.log('\n─────────────────────────────────────────────────────────────────');
    console.log(' Database is 100% Ready for live order ingestion!');
    console.log('─────────────────────────────────────────────────────────────────\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection or Migration Failed:');
    console.error(err.message);
    process.exit(1);
  }
}

main();
