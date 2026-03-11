// Script temporal de migración — ejecutar: node scripts/run-migration-phase3.mjs
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Client } = pkg;

const __dirname = dirname(fileURLToPath(import.meta.url));

const DATABASE_URL = 'postgresql://postgres:M1k1sB3ll.$@db.njmqtrdvnrhrpsqmwrsd.supabase.co:5432/postgres';

async function runMigration() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  console.log('🔌 Conectando a Supabase PostgreSQL...');
  await client.connect();
  console.log('✅ Conexión exitosa.');

  const sqlPath = join(__dirname, '..', 'docs', 'sql', 'bim-rtings-phase3.sql');
  const sql = readFileSync(sqlPath, 'utf-8');

  console.log('🚀 Ejecutando migración BIM-RTINGS Fase 3 (Reviews)...');
  await client.query(sql);
  console.log('✅ Migración completada exitosamente.');

  console.log('\n📊 Verificando tabla software_reviews...');
  const tablesResult = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'software_reviews';
  `);
  console.log('Tabla presente:', tablesResult.rows.map(r => r.table_name));

  const countResult = await client.query(`SELECT COUNT(*) as total FROM software_reviews;`);
  console.log(`Registros de seed en 'software_reviews': ${countResult.rows[0].total}`);

  await client.end();
  console.log('🏁 Listo.');
}

runMigration().catch(err => {
  console.error('❌ Error durante la migración:', err.message);
  process.exit(1);
});
