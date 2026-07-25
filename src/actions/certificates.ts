"use server";

import { prisma } from '@/lib/prisma';
import { getVisitorId } from '@/lib/visitor';
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

    const visitorId = await getVisitorId();

    const cert = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: { course: true }
    });

    if (!cert) return { error: 'الشهادة غير موجودة' };
    if (!cert.isPublished) return { error: 'هذه الشهادة غير متاحة حالياً' };
    if (cert.isSuspended) return { error: 'تم إيقاف هذه الشهادة مؤقتاً' };

    // Find registration for this visitor and course
    const registration = await prisma.courseRegistration.findFirst({
      where: {
        visitorId,
        courseId: cert.courseId
      }
    });

    if (!registration) {
      return { error: 'غير مصرح لك بمعاينة هذه الشهادة (لم تقم باجتياز الدورة)' };
    }

    return {
      data: {
        certificateId: cert.id,
        certificateTitle: cert.title,
        certificateBody: cert.certificateBody,
        courseTitle: cert.course.title,
        participantName: registration.fullName,
        participantDegree: registration.promotionDegree,
        issueDate: registration.createdAt.toLocaleDateString('ar-EG'),
        verificationCode: registration.publicToken,
        isAdminPreview: false
      }
    };
  } catch (error) {
    console.error('getPublicCertificatePreview error:', error);
    return { error: 'حدث خطأ غير متوقع أثناء تحميل بيانات الشهادة' };
  }
}
