"use server";

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const verifySchema = z.object({
  tokenOrSerial: z.string().min(3, "الرمز قصير جداً").max(100, "الرمز طويل جداً").trim()
});

export async function verifyCertificateAction(tokenOrSerial: string) {
  const validation = verifySchema.safeParse({ tokenOrSerial });
  if (!validation.success) {
    return { error: 'بيانات التحقق غير صالحة' };
  }

  const query = validation.data.tokenOrSerial;

  try {
    const issue = await prisma.certificateIssue.findFirst({
      where: {
        OR: [
          { verificationToken: query },
          { serialNumber: query }
        ]
      }
    });

    if (!issue) {
      return { error: 'لم يتم العثور على شهادة بهذا الرمز' };
    }

    if (issue.status === 'DRAFT') {
      return { error: 'لم يتم العثور على شهادة بهذا الرمز' }; // Pretend it doesn't exist
    }

    if (issue.status === 'REVOKED') {
      return { 
        revoked: true, 
        revocationReason: issue.revocationReason,
        issueDate: issue.issueDate,
        revokedAt: issue.revokedAt,
        serialNumber: issue.serialNumber
      };
    }

    return { success: true, certificate: issue };
  } catch (error) {
    return { error: 'حدث خطأ أثناء التحقق من الشهادة' };
  }
}
