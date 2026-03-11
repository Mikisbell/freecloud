import { createClient } from '@supabase/supabase-js';

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Select error:', error);
  } else {
    console.log('Select success:', data);
  }

  // Try insert
  const { error: insertError } = await supabase
    .from('categories')
    .insert([{ name: 'Test Rest', slug: 'test-rest' }]);

  if (insertError) {
    console.error('Insert error (RLS?):', insertError.message);
  } else {
    console.log('Insert success! RLS allows anon inserts.');
  }
}

testInsert();
