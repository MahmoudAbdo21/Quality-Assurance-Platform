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
  
  issuerName: z.string().optional().nullable(),
  universityName: z.string().optional().nullable(),
  platformName: z.string().optional().nullable(),
  certificateOpeningText: z.string().optional().nullable(),
  certificateClosingText: z.string().optional().nullable(),
  
  firstSignerName: z.string().optional().nullable(),
  firstSignerTitle: z.string().optional().nullable(),
  secondSignerName: z.string().optional().nullable(),
  secondSignerTitle: z.string().optional().nullable(),
  
  primaryColor: z.string().optional().nullable(),
  secondaryColor: z.string().optional().nullable(),
  designKey: z.string().optional().nullable(),
  
  showSerialNumber: z.boolean().default(true),
  showVerificationCode: z.boolean().default(true),
  showIssueDate: z.boolean().default(true),
  showTrainingHours: z.boolean().default(true),
  showGrade: z.boolean().default(true),

  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
  isSuspended: z.boolean().default(false),
  suspensionReason: z.string().optional().nullable(),
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
    
    issuerName: formData.get('issuerName') as string || null,
    universityName: formData.get('universityName') as string || null,
    platformName: formData.get('platformName') as string || null,
    certificateOpeningText: formData.get('certificateOpeningText') as string || null,
    certificateClosingText: formData.get('certificateClosingText') as string || null,
    
    firstSignerName: formData.get('firstSignerName') as string || null,
    firstSignerTitle: formData.get('firstSignerTitle') as string || null,
    secondSignerName: formData.get('secondSignerName') as string || null,
    secondSignerTitle: formData.get('secondSignerTitle') as string || null,
    
    primaryColor: formData.get('primaryColor') as string || null,
    secondaryColor: formData.get('secondaryColor') as string || null,
    designKey: formData.get('designKey') as string || null,
    
    showSerialNumber: formData.get('showSerialNumber') === 'on' || formData.get('showSerialNumber') === 'true',
    showVerificationCode: formData.get('showVerificationCode') === 'on' || formData.get('showVerificationCode') === 'true',
    showIssueDate: formData.get('showIssueDate') === 'on' || formData.get('showIssueDate') === 'true',
    showTrainingHours: formData.get('showTrainingHours') === 'on' || formData.get('showTrainingHours') === 'true',
    showGrade: formData.get('showGrade') === 'on' || formData.get('showGrade') === 'true',

    displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
    isPublished: formData.get('isPublished') === 'on' || formData.get('isPublished') === 'true',
    isSuspended: formData.get('isSuspended') === 'on' || formData.get('isSuspended') === 'true',
    suspensionReason: formData.get('suspensionReason') as string || null,
  };

  const validation = certificateTemplateSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    let certificateId = validation.data.id;
    let actionType = 'CREATE_CERTIFICATE_TEMPLATE';

    const filesToUpload: { field: string, file: File | null }[] = [
      { field: 'logoFile', file: formData.get('logoFile') as File | null },
      { field: 'sealFile', file: formData.get('sealFile') as File | null },
      { field: 'firstSignatureFile', file: formData.get('firstSignatureFile') as File | null },
      { field: 'secondSignatureFile', file: formData.get('secondSignatureFile') as File | null },
    ];

    const assetIds: Record<string, string | null> = {
      logoAssetId: formData.get('logoAssetId') as string || null,
      sealAssetId: formData.get('sealAssetId') as string || null,
      firstSignatureAssetId: formData.get('firstSignatureAssetId') as string || null,
      secondSignatureAssetId: formData.get('secondSignatureAssetId') as string || null,
    };

    const fs = await import('fs/promises');
    const path = await import('path');
    const crypto = await import('crypto');

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

        if (field === 'logoFile') assetIds.logoAssetId = mediaAsset.id;
        if (field === 'sealFile') assetIds.sealAssetId = mediaAsset.id;
        if (field === 'firstSignatureFile') assetIds.firstSignatureAssetId = mediaAsset.id;
        if (field === 'secondSignatureFile') assetIds.secondSignatureAssetId = mediaAsset.id;
      }
    }

    const dataToSave = {
      ...validation.data,
      ...assetIds
    };

    if (certificateId) {
      actionType = 'UPDATE_CERTIFICATE_TEMPLATE';
      await prisma.certificate.update({
        where: { id: certificateId },
        data: dataToSave,
      });
    } else {
      const newCert = await prisma.certificate.create({
        data: dataToSave,
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
  } catch (err: unknown) {
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
