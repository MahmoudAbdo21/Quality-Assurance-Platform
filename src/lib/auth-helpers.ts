import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.user.id }
  });

  if (!user || !user.isActive || user.role !== 'SUPER_ADMIN') {
    redirect("/admin/login");
  }

  // Check if session version matches (invalidates old sessions after password change)
  if (user.sessionVersion !== (session.user as typeof session.user & { sessionVersion: number }).sessionVersion) {
    redirect("/admin/login");
  }

  return user;
}

export async function requireAdminApi() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: 'غير مصرح' };
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.user.id }
  });

  if (!user || !user.isActive || user.role !== 'SUPER_ADMIN') {
    return { error: 'غير مصرح' };
  }

  if (user.sessionVersion !== (session.user as typeof session.user & { sessionVersion: number }).sessionVersion) {
    return { error: 'الجلسة منتهية، يرجى تسجيل الدخول مجدداً' };
  }

  return { user };
}
