"use server";

import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import crypto from 'crypto';

const certificateSchema = z.object({
  id: z.string().optional(),
  courseId: z.string().min(1, "يجب اختيار الدورة التدريبية"),
  title: z.string().min(3, "عنوان الشهادة قصير جداً").max(180, "عنوان الشهادة طويل جداً"),
  description: z.string().max(500, "الوصف طويل جداً").optional().nullable(),
  isPublished: z.boolean().default(true),
  isSuspended: z.boolean().default(false),
  suspensionReason: z.string().max(500).optional().nullable(),
});

export async function saveCertificate(formData: FormData) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  const rawData = {
    id: formData.get('id') as string || undefined,
    courseId: formData.get('courseId') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string || null,
    isPublished: formData.get('isPublished') === 'on' || formData.get('isPublished') === 'true',
    isSuspended: formData.get('isSuspended') === 'on' || formData.get('isSuspended') === 'true',
    suspensionReason: formData.get('suspensionReason') as string || null,
  };

  const validation = certificateSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    let certificateId = validation.data.id;
    let actionType = 'CREATE_CERTIFICATE';

    if (certificateId) {
      actionType = 'UPDATE_CERTIFICATE';
      await prisma.certificate.update({
        where: { id: certificateId },
        data: validation.data,
      });
    } else {
      // Enforce one per course manually before create
      const existing = await prisma.certificate.findUnique({
        where: { courseId: validation.data.courseId }
      });
      if (existing) {
        return { error: 'هذه الدورة التدريبية لها شهادة بالفعل' };
      }

      const newCert = await prisma.certificate.create({
        data: validation.data,
      });
      certificateId = newCert.id;
    }
    
    await prisma.auditLog.create({
      data: {
        adminUserId: auth.user!.id,
        action: actionType,
        entityType: 'CERTIFICATE',
        entityId: certificateId,
        summary: `Certificate Title: ${validation.data.title}`
      }
    });
    
    revalidatePath('/');
    revalidatePath('/certificates');
    revalidatePath('/admin/certificates');
    
    return { success: true, certificateId };
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
    const cert = await prisma.certificate.findUnique({ where: { id } });
    if (!cert) return { error: 'الشهادة غير موجودة' };

    await prisma.certificate.delete({ where: { id } });
    
    await prisma.auditLog.create({
      data: {
        adminUserId: auth.user!.id,
        action: 'DELETE_CERTIFICATE',
        entityType: 'CERTIFICATE',
        entityId: id,
        summary: `Deleted Certificate Title: ${cert.title}`
      }
    });

    revalidatePath('/');
    revalidatePath('/certificates');
    revalidatePath('/admin/certificates');
    return { success: true };
  } catch (error) {
    return { error: 'لا يمكن حذف الشهادة، قد تكون مرتبطة بشهادات ممنوحة' };
  }
}

const grantSchema = z.object({
  certificateId: z.string().min(1, "يجب اختيار الشهادة"),
  recipientFullName: z.string().trim().min(3, "الاسم قصير جداً").max(180, "الاسم طويل جداً"),
  recipientDegree: z.string().max(120).optional().nullable(),
  registrationId: z.string().optional().nullable(),
  issueDate: z.date(),
});

export async function grantCertificate(formData: FormData) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  const rawData = {
    certificateId: formData.get('certificateId') as string,
    recipientFullName: formData.get('recipientFullName') as string,
    recipientDegree: formData.get('recipientDegree') as string || null,
    registrationId: formData.get('registrationId') as string || null,
    issueDate: new Date(formData.get('issueDate') as string || new Date()),
  };

  const validation = grantSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    // Generate secure token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Check certificate exists
    const cert = await prisma.certificate.findUnique({
      where: { id: validation.data.certificateId },
      include: { course: true }
    });
    
    if (!cert) return { error: 'الشهادة غير موجودة' };

    const award = await prisma.certificateAward.create({
      data: {
        certificateId: validation.data.certificateId,
        recipientFullName: validation.data.recipientFullName,
        recipientDegree: validation.data.recipientDegree,
        registrationId: validation.data.registrationId,
        issueDate: validation.data.issueDate,
        verificationToken,
      }
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: auth.user!.id,
        action: 'GRANT_CERTIFICATE',
        entityType: 'CERTIFICATE_AWARD',
        entityId: award.id,
        summary: `Granted to ${validation.data.recipientFullName}`
      }
    });

    revalidatePath('/certificates');
    revalidatePath('/admin/certificates');
    return { success: true, awardId: award.id };
  } catch (error: any) {
    return { error: 'حدث خطأ أثناء منح الشهادة' };
  }
}

export async function revokeCertificate(id: string, reason: string) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  try {
    const award = await prisma.certificateAward.update({
      where: { id },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
        revocationReason: reason,
      }
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: auth.user!.id,
        action: 'REVOKE_CERTIFICATE',
        entityType: 'CERTIFICATE_AWARD',
        entityId: id,
        summary: `Revoked award for ${award.recipientFullName}`
      }
    });

    revalidatePath('/certificates');
    revalidatePath('/admin/certificates');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ أثناء إلغاء الشهادة' };
  }
}

export async function deleteGrantedCertificate(id: string) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  try {
    await prisma.certificateAward.delete({
      where: { id }
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: auth.user!.id,
        action: 'DELETE_GRANTED_CERTIFICATE',
        entityType: 'CERTIFICATE_AWARD',
        entityId: id,
        summary: `Deleted granted certificate`
      }
    });

    revalidatePath('/certificates');
    revalidatePath('/admin/certificates');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ أثناء حذف الشهادة الممنوحة' };
  }
}
