import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
        const session = request.cookies.get('admin_session')?.value;
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        
        try {
            await jwtVerify(session, SECRET_KEY, { algorithms: ['HS256'] });
        } catch (err) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
