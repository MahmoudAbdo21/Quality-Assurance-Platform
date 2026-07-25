"use server";

import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const slideSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "العنوان قصير جداً"),
  content: z.string().min(5, "المحتوى قصير جداً"),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export async function saveKnowledgeSlide(formData: FormData) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  const rawData = {
    id: formData.get('id') as string || undefined,
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
    isPublished: formData.get('isPublished') === 'on',
  };

  const validation = slideSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    if (validation.data.id) {
      await prisma.knowledgeSlide.update({
        where: { id: validation.data.id },
        data: validation.data,
      });
    } else {
      await prisma.knowledgeSlide.create({
        data: validation.data,
      });
    }
    
    revalidatePath('/admin/content');
    revalidatePath('/know-more');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ أثناء الحفظ' };
  }
}

export async function deleteKnowledgeSlide(id: string) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  try {
    await prisma.knowledgeSlide.delete({ where: { id } });
    revalidatePath('/admin/content');
    revalidatePath('/know-more');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ' };
  }
}
