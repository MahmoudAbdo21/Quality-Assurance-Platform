import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export function getVisitorId() {
    const cookieStore = cookies();
    let visitorId = cookieStore.get('quality_visitor_id')?.value;

    if (!visitorId) {
        visitorId = uuidv4();
        const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
        cookieStore.set('quality_visitor_id', visitorId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            expires: expiresAt,
        });
    }

    return visitorId;
}
