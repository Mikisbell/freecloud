import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan las variables de entorno de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Verificando la tabla software_reviews...');
  
  const { data, error } = await supabase
    .from('software_reviews')
    .select('*, software:software_id(name, slug)')
    .limit(5);

  if (error) {
    console.error('❌ Error al consultar software_reviews:', error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.warn('⚠️ La tabla existe, pero no hay registros inciales (seed data).');
  } else {
    console.log(`✅ ¡Éxito! Encontré ${data.length} reseñas.`);
    data.forEach((review: any) => {
      console.log(`\n📌 Software: ${review.software?.name || 'Desconocido'}`);
      console.log(`   Score: ${review.overall_score}/10`);
      console.log(`   Veredicto: ${review.verdict?.substring(0, 50)}...`);
      console.log(`   Pros: ${review.pros?.length} items`);
      console.log(`   Cons: ${review.cons?.length} items`);
    });
  }
}

checkDatabase().catch(console.error);
