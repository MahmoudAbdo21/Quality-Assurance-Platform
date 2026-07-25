import { z } from 'zod';

export const updateTopicSchema = z.object({
  topicId: z.string().min(1),
  authorName: z.string().trim().min(2, "يجب أن يكون الاسم من حرفين على الأقل").max(80, "الاسم طويل جداً"),
  title: z.string().trim().min(5, "يجب أن يكون العنوان 5 حروف على الأقل").max(180, "العنوان طويل جداً"),
  content: z.string().trim().min(10, "يجب أن يكون المحتوى 10 حروف على الأقل").max(5000, "المحتوى طويل جداً")
});

export const updateCommentSchema = z.object({
  commentId: z.string().min(1),
  authorName: z.string().trim().min(2, "يجب أن يكون الاسم من حرفين على الأقل").max(80, "الاسم طويل جداً"),
  content: z.string().trim().min(2, "يجب أن يكون المحتوى حرفين على الأقل").max(1500, "المحتوى طويل جداً")
});
