"use server";

import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const courseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "عنوان الدورة قصير جداً"),
  slug: z.string().min(3, "الرابط قصير جداً").regex(/^[a-z0-9-]+$/, "الرابط يجب أن يحتوي على أحرف وأرقام إنجليزية وشرطات فقط"),
  summary: z.string().min(10, "الملخص قصير جداً"),
  description: z.string().min(10, "الوصف قصير جداً"),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export async function saveCourse(formData: FormData) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  const rawData = {
    id: formData.get('id') as string || undefined,
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    summary: formData.get('summary') as string,
    description: formData.get('description') as string,
    displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
    isPublished: formData.get('isPublished') === 'on',
  };

  const validation = courseSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    if (validation.data.id) {
      await prisma.course.update({
        where: { id: validation.data.id },
        data: validation.data,
      });
    } else {
      await prisma.course.create({
        data: validation.data,
      });
    }
    
    revalidatePath('/admin/courses');
    revalidatePath('/courses');
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as {code?: string}).code === 'P2002') {
      return { error: 'هذه الدورة التدريبية مسجلة بالفعل' };
    }
    return { error: 'حدث خطأ أثناء حفظ الدورة' };
  }
}

export async function deleteCourse(id: string) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  try {
    await prisma.course.delete({ where: { id } });
    revalidatePath('/admin/courses');
    revalidatePath('/courses');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ أثناء حذف الدورة' };
  }
}
