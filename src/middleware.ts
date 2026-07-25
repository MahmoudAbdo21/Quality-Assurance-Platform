import NextAuth from "next-auth"
import { NextResponse } from "next/server"

// A dummy auth config just to read the token
const { auth } = NextAuth({
  providers: [],
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" }
})

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isLoginPage = req.nextUrl.pathname.startsWith("/admin/login")

  let res = NextResponse.next()

  if (isOnAdmin && !isLoginPage) {
    if (!isLoggedIn) {
      res = NextResponse.redirect(new URL("/admin/login", req.url))
    }
  } else if (isLoginPage && isLoggedIn) {
    res = NextResponse.redirect(new URL("/admin/courses", req.url))
  }

  // Handle anonymous visitor cookie for non-admin pages
  if (!isOnAdmin) {
    let visitorId = req.cookies.get('visitor_id')?.value
    if (!visitorId) {
      visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      res.cookies.set('visitor_id', visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
      })
    }
  }

  return res
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
