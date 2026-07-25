import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const { username, password } = credentials as Record<string, string>;
        
        const user = await prisma.adminUser.findUnique({
          where: { username: username.toLowerCase() }
        });

        if (!user) return null;
        if (!user.isActive) return null;

        // Check lock status
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          return null; // Locked
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
          // Increment failed attempts
          const newCount = user.failedLoginCount + 1;
          const updateData: { failedLoginCount: number; lockedUntil?: Date } = { failedLoginCount: newCount };
          
          if (newCount >= 5) {
            updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
          }
          
          await prisma.adminUser.update({
            where: { id: user.id },
            data: updateData
          });
          
          // Log failed attempt
          await prisma.auditLog.create({
            data: {
              adminUserId: user.id,
              action: 'LOGIN_FAILED',
              entityType: 'AUTH',
              summary: 'Failed login attempt',
            }
          });
          
          return null;
        }

        // Success
        await prisma.adminUser.update({
          where: { id: user.id },
          data: {
            failedLoginCount: 0,
            lockedUntil: null,
            lastLoginAt: new Date()
          }
        });
        
        await prisma.auditLog.create({
          data: {
            adminUserId: user.id,
            action: 'LOGIN_SUCCESS',
            entityType: 'AUTH',
            summary: 'Successful login',
          }
        });

        return {
          id: user.id,
          name: user.displayName,
          username: user.username,
          role: user.role,
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as typeof user & { username: string }).username;
        token.role = (user as typeof user & { role: string }).role;
        token.sessionVersion = (user as typeof user & { sessionVersion: number }).sessionVersion;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as typeof session.user & { username: string }).username = token.username as string;
        (session.user as typeof session.user & { role: string }).role = token.role as string;
        (session.user as typeof session.user & { sessionVersion: number }).sessionVersion = token.sessionVersion as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  }
})
