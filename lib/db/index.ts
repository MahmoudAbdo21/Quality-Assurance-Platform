import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.warn("WARNING: DATABASE_URL is not set. Database connections will fail.");
}

export const pool = new Pool({
    connectionString,
    max: 10, // Adjust according to Neon free tier limits
});

// A helper for parameterized queries
export async function query(text: string, params?: any[]) {
    return pool.query(text, params);
}
