'use server';

import { revalidatePath } from 'next/cache';
import { registrationSchema, forumTopicSchema, contactMessageSchema } from '../../lib/validation/schemas';
import { createRegistration } from '../../lib/repositories/registrations';
import { createForumTopic } from '../../lib/repositories/forum';
import { createContactMessage } from '../../lib/repositories/contact';
import { getVisitorId } from '../../lib/auth/visitor';

export async function submitRegistrationAction(formData: FormData) {
    try {
        const visitorId = getVisitorId();
        
        const data = {
            course_id: parseInt(formData.get('course_id') as string, 10),
            full_name: formData.get('full_name') as string,
            age: parseInt(formData.get('age') as string, 10),
            address: formData.get('address') as string,
            university: formData.get('university') as string,
            college: formData.get('college') as string,
            degree: formData.get('degree') as string,
            specialty: formData.get('specialty') as string,
        };

        const validated = registrationSchema.parse(data);

        await createRegistration({
            visitor_id: visitorId,
            ...validated
        });

        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        if (error.code === '23505') { // Postgres unique violation
            return { error: 'أنت مسجل بالفعل في هذا البرنامج التدريبي.' };
        }
        return { error: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.' };
    }
}

export async function submitForumTopicAction(formData: FormData) {
    try {
        const data = {
            author: formData.get('author') as string,
            title: formData.get('title') as string,
            content: formData.get('content') as string,
        };

        const validated = forumTopicSchema.parse(data);

        await createForumTopic(validated);

        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { error: 'حدث خطأ أثناء نشر الموضوع. يرجى التأكد من صحة البيانات.' };
    }
}

export async function submitContactMessageAction(formData: FormData) {
    try {
        const data = {
            full_name: formData.get('full_name') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string,
        };

        const validated = contactMessageSchema.parse(data);

        await createContactMessage(validated);

        return { success: true };
    } catch (error: any) {
        return { error: 'حدث خطأ أثناء إرسال الرسالة. يرجى التأكد من صحة البيانات.' };
    }
}
