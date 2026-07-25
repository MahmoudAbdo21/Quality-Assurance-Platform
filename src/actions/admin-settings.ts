"use server";

import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function saveSiteSettings(formData: FormData) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  try {
    const rawData = Object.fromEntries(formData.entries());
    const id = rawData.id as string;
    
    // Remove id before update
    delete rawData.id;

    if (id) {
      await prisma.siteSettings.update({
        where: { id },
        data: rawData as Record<string, string>
      });
    } else {
      await prisma.siteSettings.create({
        data: rawData as Record<string, string>
      });
    }
    
    revalidatePath('/', 'layout'); // Revalidate everything
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ أثناء حفظ الإعدادات' };
  }
}
