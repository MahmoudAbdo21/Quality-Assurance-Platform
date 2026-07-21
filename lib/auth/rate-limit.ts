import crypto from 'crypto';
import { query } from '../db';

function getFingerprintHash(ip: string, userAgent: string) {
    const secret = process.env.AUTH_SECRET || 'default-secret';
    return crypto.createHash('sha256').update(`${ip}-${userAgent}-${secret}`).digest('hex');
}

export async function checkRateLimit(ip: string, userAgent: string) {
    const hash = getFingerprintHash(ip, userAgent);
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);

    const res = await query(
        `SELECT COUNT(*) as count 
         FROM admin_login_attempts 
         WHERE fingerprint_hash = $1 
         AND was_successful = false 
         AND attempted_at > $2`,
        [hash, fifteenMinsAgo]
    );

    const attempts = parseInt(res.rows[0].count, 10);
    return attempts < 5;
}

export async function recordLoginAttempt(ip: string, userAgent: string, wasSuccessful: boolean) {
    const hash = getFingerprintHash(ip, userAgent);
    await query(
        `INSERT INTO admin_login_attempts (fingerprint_hash, was_successful)
         VALUES ($1, $2)`,
        [hash, wasSuccessful]
    );
}
