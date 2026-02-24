import pg from 'pg';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const dbUrlMatch = envFile.match(/DATABASE_URL=(.+)/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1].trim() : null;

if (!dbUrl) {
    console.error("DATABASE_URL no encontrada en .env.local");
    process.exit(1);
}

const client = new pg.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    try {
        await client.connect();
        const sql = fs.readFileSync('supabase-cms-v2.sql', 'utf8');
        await client.query(sql);
        console.log('✅ Script SQL supabase-cms-v2.sql ejecutado correctamente!');
    } catch (error) {
        console.error('❌ Error ejecutando el SQL:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
