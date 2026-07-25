"use server";

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import type { CertificateDocumentData } from '@/components/certificates/CertificateDocument';

const getPreviewSchema = z.object({
  certificateId: z.string().cuid(),
});

export async function getPublicCertificatePreview(certificateId: string): Promise<{ data?: CertificateDocumentData, error?: string }> {
  try {
    const parsed = getPreviewSchema.safeParse({ certificateId });
    if (!parsed.success) {
      return { error: 'معرف الشهادة غير صالح' };
    }

    const cert = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: { course: true }
    });

    if (!cert) return { error: 'القالب غير موجود' };
    if (!cert.isPublished) return { error: 'هذا القالب غير متاح حالياً' };
    if (cert.isSuspended) return { error: 'تم إيقاف هذا القالب مؤقتاً' };

    return {
      data: {
        certificateId: cert.id,
        certificateTitle: cert.title,
        certificateBody: cert.certificateBody,
        courseTitle: cert.course.title,
        participantName: 'اسم المستفيد',
        participantDegree: null,
        issueDate: new Date().toLocaleDateString('ar-EG'),
        isAdminPreview: true, // Mark it true so it shows the watermark "غير صالح للاستخدام"
        status: 'TEMPLATE' // not revoked, no serial number
      }
    };
  } catch (error) {
    return { error: 'حدث خطأ غير متوقع أثناء تحميل بيانات القالب' };
  }
}
