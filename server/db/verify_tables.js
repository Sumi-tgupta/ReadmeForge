import 'dotenv/config';
import { getDb } from './connection.js';

const tables = [
  'users',
  'projects',
  'sessions',
  'generation_history',
  'repository_cache',
  'conversation_sessions',
  'user_settings'
];

async function verify() {
  console.log('Connecting to Supabase at:', process.env.SUPABASE_URL);
  const supabase = getDb();
  let successCount = 0;
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Table "${table}" error:`, error.message);
      } else {
        console.log(`✅ Table "${table}" is accessible and configured.`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Table "${table}" exception:`, err.message);
    }
  }

  console.log(`Verification completed: ${successCount}/${tables.length} tables verified.`);
  process.exit(successCount === tables.length ? 0 : 1);
}

verify();
