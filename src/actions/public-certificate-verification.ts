"use server";

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const verifySchema = z.object({
  token: z.string().min(3, "الرمز قصير جداً").max(100, "الرمز طويل جداً").trim()
});

export async function verifyCertificateAction(token: string) {
  const validation = verifySchema.safeParse({ token });
  if (!validation.success) {
    return { error: 'بيانات التحقق غير صالحة' };
  }

  const query = validation.data.token;

  try {
    const award = await prisma.certificateAward.findFirst({
      where: {
        verificationToken: query
      },
      include: {
        certificate: {
          include: {
            course: true
          }
        }
      }
    });

    if (!award) {
      return { error: 'لم يتم العثور على شهادة بهذا الرمز' };
    }

    if (award.isRevoked) {
      return { 
        revoked: true, 
        revocationReason: award.revocationReason,
        issueDate: award.issueDate,
        revokedAt: award.revokedAt,
      };
    }

    return { success: true, award };
  } catch (error) {
    return { error: 'حدث خطأ أثناء التحقق من الشهادة' };
  }
}
