"use server";

import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';

export async function markMessageRead(id: string) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { status: 'READ', readAt: new Date() }
    });
    revalidatePath('/admin/messages');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ' };
  }
}

export async function deleteMessage(id: string) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  try {
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath('/admin/messages');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ' };
  }
}
