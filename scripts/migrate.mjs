import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
    const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
    
    if (!connectionString) {
        console.error("Error: DATABASE_URL or DATABASE_URL_UNPOOLED must be set.");
        process.exit(1);
    }

    console.log("Connecting to the database...");
    const client = new Client({ connectionString });
    
    try {
        await client.connect();
        
        // Ensure migrations table exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

        for (const file of files) {
            const { rowCount } = await client.query('SELECT 1 FROM migrations WHERE name = $1', [file]);
            
            if (rowCount === 0) {
                console.log(`Applying migration: ${file}...`);
                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, 'utf8');
                
                await client.query('BEGIN');
                try {
                    await client.query(sql);
                    await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
                    await client.query('COMMIT');
                    console.log(`Successfully applied ${file}`);
                } catch (err) {
                    await client.query('ROLLBACK');
                    console.error(`Error applying migration ${file}:`, err);
                    throw err;
                }
            } else {
                console.log(`Migration ${file} already applied, skipping.`);
            }
        }
        
        console.log("All migrations applied successfully.");
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runMigrations();
