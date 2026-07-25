"use server";

import { prisma } from '@/lib/prisma';
import { getVisitorId } from '@/lib/visitor';
import { randomBytes } from 'crypto';

export async function submitRegistration(formData: FormData) {
  const courseId = formData.get('courseId') as string;
  const fullName = formData.get('fullName') as string;
  const age = parseInt(formData.get('age') as string);
  const faculty = formData.get('faculty') as string;
  const department = formData.get('department') as string;
  const promotionDegree = formData.get('promotionDegree') as string;

  if (!courseId || !fullName || !age || !faculty || !department || !promotionDegree) {
    return { error: 'جميع الحقول مطلوبة' };
  }

  const visitorId = await getVisitorId();

  try {
    const existing = await prisma.courseRegistration.findUnique({
      where: {
        visitorId_courseId: { visitorId, courseId }
      }
    });

    if (existing) {
      return { error: 'لقد قمت بالتسجيل في هذه الدورة مسبقاً' };
    }

    const publicToken = randomBytes(16).toString('hex');

    await prisma.courseRegistration.create({
      data: {
        courseId,
        visitorId,
        fullName,
        age,
        faculty,
        department,
        promotionDegree,
        publicToken
      }
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.' };
  }
}
