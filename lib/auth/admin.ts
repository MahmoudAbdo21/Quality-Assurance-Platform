import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { query } from '../db';
import crypto from 'crypto';

const SECRET_KEY = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function hashPassword(password: string) {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}

export async function createSession() {
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    const session = await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(SECRET_KEY);

    cookies().set('admin_session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
        path: '/',
    });
}

export async function getSession() {
    const session = cookies().get('admin_session')?.value;
    if (!session) return null;

    try {
        const { payload } = await jwtVerify(session, SECRET_KEY, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (err) {
        return null;
    }
}

export async function clearSession() {
    cookies().delete('admin_session');
}
