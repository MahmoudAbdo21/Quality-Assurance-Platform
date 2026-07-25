import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import SecurityManager from "@/components/admin/SecurityManager"

export default async function AdminSecurityPage() {
  const session = await auth()
  const currentUserId = session?.user?.id as string

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      username: true,
      displayName: true,
      role: true,
      isActive: true,
      lockedUntil: true,
      failedLoginCount: true,
      lastLoginAt: true,
      sessionVersion: true,
      createdAt: true,
      updatedAt: true,
      passwordHash: false, // Don't send password hash to client
    }
  })
  
  return (
    <div>
      {/* @ts-expect-error - React 19 form actions don't fully support all Next.js typed bindings yet */}
      <SecurityManager users={users} currentUserId={currentUserId} />
    </div>
  )
}
