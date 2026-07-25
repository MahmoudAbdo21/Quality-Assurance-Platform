"use server";

import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import crypto from 'crypto';

const issueSchema = z.object({
  id: z.string().optional(),
  certificateId: z.string().min(1, "يجب اختيار قالب الشهادة"),
  registrationId: z.string().optional().nullable(),
  recipientFullName: z.string().min(3, "الاسم قصير جداً").max(180, "الاسم طويل جداً").trim(),
  recipientTitle: z.string().max(120).optional().nullable(),
  recipientFaculty: z.string().max(180).optional().nullable(),
  recipientDepartment: z.string().max(180).optional().nullable(),
  recipientOrganization: z.string().max(180).optional().nullable(),
  recipientEmail: z.union([z.string().email("بريد إلكتروني غير صالح"), z.string().length(0)]).optional().nullable(),
  recipientReference: z.string().max(100).optional().nullable(),
  issueDate: z.string().min(1, "تاريخ الإصدار مطلوب"),
  completionDate: z.string().optional().nullable(),
  trainingHours: z.string().optional().nullable(),
  grade: z.string().max(100).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export async function issueCertificate(formData: FormData) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  const rawData = {
    certificateId: formData.get('certificateId') as string,
    registrationId: formData.get('registrationId') as string || null,
    recipientFullName: formData.get('recipientFullName') as string,
    recipientTitle: formData.get('recipientTitle') as string || null,
    recipientFaculty: formData.get('recipientFaculty') as string || null,
    recipientDepartment: formData.get('recipientDepartment') as string || null,
    recipientOrganization: formData.get('recipientOrganization') as string || null,
    recipientEmail: formData.get('recipientEmail') as string || null,
    recipientReference: formData.get('recipientReference') as string || null,
    issueDate: formData.get('issueDate') as string,
    completionDate: formData.get('completionDate') as string || null,
    trainingHours: formData.get('trainingHours') as string || null,
    grade: formData.get('grade') as string || null,
    notes: formData.get('notes') as string || null,
  };

  const validation = issueSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    const template = await prisma.certificate.findUnique({
      where: { id: validation.data.certificateId },
      include: { 
        course: true,
        logoAsset: true,
        sealAsset: true,
        firstSignatureAsset: true,
        secondSignatureAsset: true
      }
    });

    if (!template) return { error: 'قالب الشهادة غير موجود' };
    if (!template.course) return { error: 'الدورة المرتبطة غير موجودة' };
    
    // Check suspension unless super admin overriding (we'll just check suspension for now)
    if (template.isSuspended) {
      return { error: 'قالب الشهادة معلق ولا يمكن الإصدار منه' };
    }

    if (validation.data.registrationId) {
      const reg = await prisma.courseRegistration.findUnique({ where: { id: validation.data.registrationId } });
      if (!reg) return { error: 'التسجيل غير موجود' };
      if (reg.courseId !== template.courseId) return { error: 'التسجيل لا ينتمي لنفس الدورة' };
    }

    const filesToUpload: { field: string, file: File | null }[] = [
      { field: 'sealFile', file: formData.get('sealFile') as File | null },
      { field: 'firstSignatureFile', file: formData.get('firstSignatureFile') as File | null },
      { field: 'secondSignatureFile', file: formData.get('secondSignatureFile') as File | null },
    ];

    const overrideAssets: Record<string, string | null> = {
      sealAssetIdSnapshot: template.sealAsset?.relativePath || null,
      firstSignatureAssetIdSnapshot: template.firstSignatureAsset?.relativePath || null,
      secondSignatureAssetIdSnapshot: template.secondSignatureAsset?.relativePath || null,
    };

    const fs = await import('fs/promises');
    const path = await import('path');

    for (const { field, file } of filesToUpload) {
      if (file && file.size > 0 && typeof file !== 'string') {
        const ext = path.extname(file.name) || '.png';
        const fileName = `${crypto.randomBytes(16).toString('hex')}${ext}`;
        const relativePath = `/uploads/certificates/${fileName}`;
        const absolutePath = path.join(process.cwd(), 'public', 'uploads', 'certificates');
        
        await fs.mkdir(absolutePath, { recursive: true });
        
        const arrayBuffer = await file.arrayBuffer();
        await fs.writeFile(path.join(absolutePath, fileName), Buffer.from(arrayBuffer));
        
        const mediaAsset = await prisma.mediaAsset.create({
          data: {
            originalName: file.name,
            storedName: fileName,
            mimeType: file.type || 'image/png',
            sizeBytes: file.size,
            relativePath,
          }
        });

        if (field === 'sealFile') overrideAssets.sealAssetIdSnapshot = mediaAsset.relativePath;
        if (field === 'firstSignatureFile') overrideAssets.firstSignatureAssetIdSnapshot = mediaAsset.relativePath;
        if (field === 'secondSignatureFile') overrideAssets.secondSignatureAssetIdSnapshot = mediaAsset.relativePath;
      }
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const serialNumber = `AZQ-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const parsedHours = validation.data.trainingHours ? parseInt(validation.data.trainingHours) : null;

    const newIssue = await prisma.$transaction(async (tx) => {
      const issue = await tx.certificateIssue.create({
        data: {
          certificateId: validation.data.certificateId,
          registrationId: validation.data.registrationId,
          recipientFullName: validation.data.recipientFullName,
          recipientTitle: validation.data.recipientTitle,
          recipientFaculty: validation.data.recipientFaculty,
          recipientDepartment: validation.data.recipientDepartment,
          recipientOrganization: validation.data.recipientOrganization,
          recipientEmail: validation.data.recipientEmail,
          recipientReference: validation.data.recipientReference,
          issueDate: new Date(validation.data.issueDate),
          completionDate: validation.data.completionDate ? new Date(validation.data.completionDate) : null,
          trainingHours: parsedHours && !isNaN(parsedHours) ? parsedHours : null,
          grade: validation.data.grade,
          notes: validation.data.notes,
          
          serialNumber,
          verificationToken,
          status: 'ISSUED',
          
          certificateTitleSnapshot: template.title,
          certificateBodySnapshot: template.certificateBody,
          certificateOpeningTextSnapshot: template.certificateOpeningText,
          certificateClosingTextSnapshot: template.certificateClosingText,
          courseTitleSnapshot: template.course.title,
          
          issuerNameSnapshot: template.issuerName,
          universityNameSnapshot: template.universityName,
          platformNameSnapshot: template.platformName,
          
          logoAssetIdSnapshot: template.logoAsset?.relativePath || null,
          sealAssetIdSnapshot: overrideAssets.sealAssetIdSnapshot,
          firstSignatureAssetIdSnapshot: overrideAssets.firstSignatureAssetIdSnapshot,
          secondSignatureAssetIdSnapshot: overrideAssets.secondSignatureAssetIdSnapshot,
          
          firstSignerNameSnapshot: formData.get('firstSignerName') as string || template.firstSignerName,
          firstSignerTitleSnapshot: formData.get('firstSignerTitle') as string || template.firstSignerTitle,
          secondSignerNameSnapshot: formData.get('secondSignerName') as string || template.secondSignerName,
          secondSignerTitleSnapshot: formData.get('secondSignerTitle') as string || template.secondSignerTitle,
          
          primaryColorSnapshot: template.primaryColor,
          secondaryColorSnapshot: template.secondaryColor,
          designKeySnapshot: template.designKey,
          
          createdByAdminUserId: auth.user!.id,
        }
      });

      await tx.auditLog.create({
        data: {
          adminUserId: auth.user!.id,
          action: 'ISSUE_CERTIFICATE',
          entityType: 'CERTIFICATE_ISSUE',
          entityId: issue.id,
          summary: `Issued Certificate to: ${validation.data.recipientFullName}`
        }
      });

      return issue;
    });

    revalidatePath('/certificates');
    revalidatePath('/admin/certificates');
    revalidatePath('/admin/dashboard');

    return { success: true, issueId: newIssue.id };
  } catch (error) {
    console.error(error);
    return { error: 'حدث خطأ أثناء إصدار الشهادة' };
  }
}

export async function revokeCertificateIssue(id: string, reason: string) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  if (!reason || reason.trim().length < 5) {
    return { error: 'يجب إدخال سبب الإلغاء (5 أحرف على الأقل)' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.certificateIssue.update({
        where: { id },
        data: {
          status: 'REVOKED',
          revokedAt: new Date(),
          revocationReason: reason,
        }
      });

      await tx.auditLog.create({
        data: {
          adminUserId: auth.user!.id,
          action: 'REVOKE_CERTIFICATE',
          entityType: 'CERTIFICATE_ISSUE',
          entityId: id,
          summary: `Revoked Certificate: ${reason}`
        }
      });
    });

    revalidatePath('/certificates');
    revalidatePath('/certificates/verify');
    revalidatePath('/admin/certificates');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ أثناء الإلغاء' };
  }
}
