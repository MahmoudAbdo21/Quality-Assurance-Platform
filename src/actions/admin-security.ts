"use server";

import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export async function unlockUser(id: string) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  try {
    await prisma.adminUser.update({
      where: { id },
      data: {
        lockedUntil: null,
        failedLoginCount: 0,
      }
    });
    revalidatePath('/admin/security');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ' };
  }
}

export async function toggleUserActive(id: string, isActive: boolean) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  if (auth.user.id === id) {
    return { error: 'لا يمكنك تعطيل حسابك الحالي' };
  }

  try {
    await prisma.adminUser.update({
      where: { id },
      data: { isActive, sessionVersion: { increment: 1 } }
    });
    revalidatePath('/admin/security');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ' };
  }
}

const adminUserSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(4, "اسم المستخدم قصير جداً").regex(/^[a-zA-Z0-9_]+$/, "اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط"),
  displayName: z.string().min(3, "الاسم المعروض قصير جداً"),
  password: z.string().optional(),
  role: z.enum(["SUPER_ADMIN", "EDITOR"]),
});

export async function saveAdminUser(formData: FormData) {
  const auth = await requireAdminApi();
  if (auth.error) return { error: auth.error };

  const rawData = {
    id: formData.get('id') as string || undefined,
    username: formData.get('username') as string,
    displayName: formData.get('displayName') as string,
    password: formData.get('password') as string || undefined,
    role: formData.get('role') as string,
  };

  const validation = adminUserSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  if (!validation.data.id && !validation.data.password) {
    return { error: 'يجب إدخال كلمة المرور للمستخدم الجديد' };
  }
  if (validation.data.password && validation.data.password.length < 8) {
    return { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' };
  }

  try {
    const dataToSave: any = {
      username: validation.data.username,
      displayName: validation.data.displayName,
      role: validation.data.role,
    };

    if (validation.data.password) {
      dataToSave.passwordHash = await bcrypt.hash(validation.data.password, 10);
      dataToSave.sessionVersion = { increment: 1 };
    }

    if (validation.data.id) {
      await prisma.adminUser.update({
        where: { id: validation.data.id },
        data: dataToSave,
      });
    } else {
      await prisma.adminUser.create({
        data: dataToSave,
      });
    }
    
    revalidatePath('/admin/security');
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'اسم المستخدم مسجل بالفعل' };
    }
    return { error: 'حدث خطأ أثناء الحفظ' };
  }
}
