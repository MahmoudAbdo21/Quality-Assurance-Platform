"use server";

import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';

export async function toggleSubscriberStatus(id: string, isActive: boolean) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  try {
    await prisma.newsletterSubscriber.update({
      where: { id },
      data: { 
        isActive,
        unsubscribedAt: isActive ? null : new Date()
      }
    });
    revalidatePath('/admin/subscribers');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ' };
  }
}

export async function deleteSubscriber(id: string) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  try {
    await prisma.newsletterSubscriber.delete({ where: { id } });
    revalidatePath('/admin/subscribers');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ' };
  }
}
