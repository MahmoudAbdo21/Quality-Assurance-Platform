"use server";

import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const certificateSchema = z.object({
  id: z.string().optional(),
  courseId: z.string().min(1, "يجب اختيار الدورة التدريبية"),
  title: z.string().min(3, "عنوان الشهادة قصير جداً"),
  description: z.string().min(5, "الوصف قصير جداً"),
  certificateBody: z.string().min(5, "محتوى الشهادة قصير جداً"),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export async function saveCertificate(formData: FormData) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  const rawData = {
    id: formData.get('id') as string || undefined,
    courseId: formData.get('courseId') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    certificateBody: formData.get('certificateBody') as string,
    displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
    isPublished: formData.get('isPublished') === 'on',
  };

  const validation = certificateSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    if (validation.data.id) {
      await prisma.certificate.update({
        where: { id: validation.data.id },
        data: validation.data,
      });
    } else {
      await prisma.certificate.create({
        data: validation.data,
      });
    }
    
    revalidatePath('/admin/certificates');
    revalidatePath('/certificates');
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'هذه الدورة التدريبية لها شهادة بالفعل' };
    }
    return { error: 'حدث خطأ أثناء حفظ الشهادة' };
  }
}

export async function deleteCertificate(id: string) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  try {
    await prisma.certificate.delete({ where: { id } });
    revalidatePath('/admin/certificates');
    revalidatePath('/certificates');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ أثناء حذف الشهادة' };
  }
}
