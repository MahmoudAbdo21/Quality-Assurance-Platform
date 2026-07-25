"use server";

import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

// Mock visitor auth for now if it doesn't exist
// In a real app we'd use the proper auth helper here
async function getVisitor() {
  return { id: 'visitor-' + Math.random().toString(36).substring(7) };
}

export async function unlockCourseCertificate(courseId: string) {
  const visitor = await getVisitor();

  try {
    const registration = await prisma.courseRegistration.findFirst({
      where: { visitorId: visitor.id, courseId }
    });

    if (!registration) {
      return { error: 'يجب التسجيل وإتمام الدورة للحصول على الشهادة' };
    }

    const certificate = await prisma.certificate.findUnique({
      where: { courseId }
    });

    if (!certificate) return { error: 'لا توجد شهادة متاحة لهذه الدورة حالياً' };
    if (!certificate.isPublished) return { error: 'الشهادة غير منشورة' };
    if (certificate.isSuspended) return { error: 'الشهادة معلقة مؤقتاً' };

    const existingAward = await prisma.certificateAward.findFirst({
      where: { certificateId: certificate.id, registrationId: registration.id }
    });

    if (existingAward) return { success: true, awardId: existingAward.id };

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const award = await prisma.certificateAward.create({
      data: {
        certificateId: certificate.id,
        registrationId: registration.id,
        recipientFullName: registration.fullName,
        recipientDegree: registration.promotionDegree,
        issueDate: new Date(),
        verificationToken,
      }
    });

    revalidatePath('/certificates');
    return { success: true, awardId: award.id };
  } catch (error) {
    return { error: 'حدث خطأ أثناء إصدار الشهادة' };
  }
}

export async function getPublicCertificatePreview(certificateId: string) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: { course: true }
    });

    if (!certificate) return { error: 'الشهادة غير موجودة' };

    return {
      success: true,
      data: {
        certificateTitle: certificate.title,
        courseTitle: certificate.course.title,
        participantName: 'الاسم (للمعاينة)',
        participantDegree: 'الدرجة (للمعاينة)',
        issueDate: new Date().toLocaleDateString('ar-EG'),
        verificationToken: 'PRV-XXXX-XXXX',
        isRevoked: false,
        isAdminPreview: false
      }
    };
  } catch (error) {
    return { error: 'حدث خطأ أثناء تحميل بيانات الشهادة' };
  }
}
