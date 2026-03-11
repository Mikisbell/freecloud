import { createClient } from '@supabase/supabase-js';

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

async function check() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, status, published_at, category_id, featured')
    .order('created_at', { ascending: false })
    .limit(3);

  console.log(JSON.stringify(data, null, 2));
}

check();
