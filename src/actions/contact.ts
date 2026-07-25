"use server";

import { prisma } from '@/lib/prisma';

export async function submitContact(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!fullName || !email || !message) {
    return { error: 'جميع الحقول مطلوبة' };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        fullName,
        email,
        message
      }
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.' };
  }
}
