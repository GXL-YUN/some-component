const { createClient } = require('@supabase/supabase-js');

const url = process.env.COZE_SUPABASE_URL;
const key = process.env.COZE_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', url.substring(0, 40) + '...');
console.log('Key:', key.substring(0, 30) + '...');

const client = createClient(url, key, {
  db: { timeout: 10000 },
  auth: { autoRefreshToken: false, persistSession: false }
});

async function test() {
  try {
    console.log('Querying users table...');
    const { data, error } = await client.from('users').select('*').limit(1);
    if (error) {
      console.error('❌ Query error:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
    } else {
      console.log('✅ Connection successful!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('❌ Fetch error:', err.message);
    console.error('Error type:', err.constructor.name);
    console.error('Stack:', err.stack);
  }
}

test();
