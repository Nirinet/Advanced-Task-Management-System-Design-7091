import { createClient } from '@supabase/supabase-js';

// תחליף את הערכים האלה בערכים האמיתיים שלך כשהפרויקט יחובר
const SUPABASE_URL = 'https://<PROJECT-ID>.supabase.co';
const SUPABASE_ANON_KEY = '<ANON_KEY>';

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  console.warn('Missing Supabase credentials. Please connect your Supabase project.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;