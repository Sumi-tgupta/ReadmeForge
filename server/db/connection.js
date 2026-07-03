import { createClient } from '@supabase/supabase-js';

let supabase = null;

export function initDb() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY in environment variables.');
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
}

export function getDb() {
  if (!supabase) {
    return initDb();
  }
  return supabase;
}

export default getDb;
