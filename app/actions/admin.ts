'use server';

import { revalidatePath } from 'next/cache';
import { adminLoginSchema } from '../../lib/validation/schemas';
import { getSession, createSession, verifyPassword, clearSession } from '../../lib/auth/admin';
import { checkRateLimit, recordLoginAttempt } from '../../lib/auth/rate-limit';
import { deleteRegistration } from '../../lib/repositories/registrations';
import { deleteForumTopic } from '../../lib/repositories/forum';
import { deleteContactMessage } from '../../lib/repositories/contact';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = headersList.get('user-agent') || 'unknown';

    const canAttempt = await checkRateLimit(ip, userAgent);
    if (!canAttempt) {
        return { error: 'تم تجاوز الحد المسموح لمحاولات تسجيل الدخول. يرجى المحاولة بعد 15 دقيقة.' };
    }

    try {
        const data = {
            username: formData.get('username') as string,
            password: formData.get('password') as string,
        };

        const validated = adminLoginSchema.parse(data);

        const expectedUsername = process.env.ADMIN_USERNAME;
        const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!expectedUsername || !expectedPasswordHash) {
            return { error: 'إعدادات النظام غير مكتملة.' };
        }

        if (validated.username === expectedUsername) {
            const isMatch = await verifyPassword(validated.password, expectedPasswordHash);
            if (isMatch) {
                await recordLoginAttempt(ip, userAgent, true);
                await createSession();
                redirect('/admin');
            }
        }

        await recordLoginAttempt(ip, userAgent, false);
        return { error: 'بيانات الدخول غير صحيحة.' };
    } catch (error: any) {
        if (error.message === 'NEXT_REDIRECT') throw error;
        return { error: 'حدث خطأ أثناء تسجيل الدخول.' };
    }
}

export async function logoutAction() {
    await clearSession();
    redirect('/admin/login');
}

export async function deleteRegistrationAction(id: string) {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');
    await deleteRegistration(id);
    revalidatePath('/admin');
}

export async function deleteForumTopicAction(id: string) {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');
    await deleteForumTopic(id);
    revalidatePath('/admin');
}

export async function deleteContactMessageAction(id: string) {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');
    await deleteContactMessage(id);
    revalidatePath('/admin');
}
