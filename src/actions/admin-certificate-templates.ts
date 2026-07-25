"use server";

import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const certificateTemplateSchema = z.object({
  id: z.string().optional(),
  courseId: z.string().min(1, "يجب اختيار الدورة التدريبية"),
  title: z.string().min(3, "عنوان الشهادة قصير جداً"),
  description: z.string().min(5, "الوصف قصير جداً"),
  certificateBody: z.string().min(5, "محتوى الشهادة قصير جداً"),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
  isSuspended: z.boolean().default(false),
  suspensionReason: z.string().optional(),
});

export async function saveCertificateTemplate(formData: FormData) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  const rawData = {
    id: formData.get('id') as string || undefined,
    courseId: formData.get('courseId') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    certificateBody: formData.get('certificateBody') as string,
    displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
    isPublished: formData.get('isPublished') === 'on' || formData.get('isPublished') === 'true',
    isSuspended: formData.get('isSuspended') === 'on' || formData.get('isSuspended') === 'true',
    suspensionReason: formData.get('suspensionReason') as string || undefined,
  };

  const validation = certificateTemplateSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    let certificateId = validation.data.id;
    let actionType = 'CREATE_CERTIFICATE_TEMPLATE';

    if (certificateId) {
      actionType = 'UPDATE_CERTIFICATE_TEMPLATE';
      await prisma.certificate.update({
        where: { id: certificateId },
        data: validation.data,
      });
    } else {
      const newCert = await prisma.certificate.create({
        data: validation.data,
      });
      certificateId = newCert.id;
    }
    
    // Audit Log
    await prisma.auditLog.create({
      data: {
        adminUserId: auth.user!.id,
        action: actionType,
        entityType: 'CERTIFICATE_TEMPLATE',
        entityId: certificateId,
        summary: `Template Title: ${validation.data.title}`
      }
    });
    
    revalidatePath('/');
    revalidatePath('/certificates');
    revalidatePath('/admin/certificates');
    
    return { success: true, certificateId };
  } catch (error: unknown) {
    return { error: 'حدث خطأ أثناء حفظ القالب' };
  }
}

export async function deleteCertificateTemplate(id: string) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  try {
    const cert = await prisma.certificate.findUnique({ 
      where: { id },
      include: { _count: { select: { issues: true } } }
    });
    if (!cert) return { error: 'القالب غير موجود' };
    
    if (cert._count.issues > 0) {
      return { error: 'لا يمكن حذف القالب لوجود شهادات صادرة مرتبطة به. قم بتعطيله بدلاً من ذلك.' };
    }

    await prisma.certificate.delete({ where: { id } });
    
    // Audit Log
    await prisma.auditLog.create({
      data: {
        adminUserId: auth.user!.id,
        action: 'DELETE_CERTIFICATE_TEMPLATE',
        entityType: 'CERTIFICATE_TEMPLATE',
        entityId: id,
        summary: `Deleted Template Title: ${cert.title}`
      }
    });

    revalidatePath('/');
    revalidatePath('/certificates');
    revalidatePath('/admin/certificates');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ أثناء حذف القالب' };
  }
}
