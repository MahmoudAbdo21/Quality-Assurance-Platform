import { z } from 'zod';

export const createTopicSchema = z.object({
  authorName: z.string().trim().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(80, 'الاسم طويل جداً'),
  title: z.string().trim().min(5, 'عنوان الموضوع يجب أن يكون 5 أحرف على الأقل').max(180, 'عنوان الموضوع طويل جداً'),
  content: z.string().trim().min(10, 'تفاصيل الموضوع يجب أن تكون 10 أحرف على الأقل').max(5000, 'تفاصيل الموضوع طويلة جداً')
});

export const createCommentSchema = z.object({
  topicId: z.string(),
  authorName: z.string().trim().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(80, 'الاسم طويل جداً'),
  content: z.string().trim().min(2, 'التعليق يجب أن يكون حرفين على الأقل').max(1500, 'التعليق طويل جداً')
});
