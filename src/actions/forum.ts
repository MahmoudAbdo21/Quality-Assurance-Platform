"use server";

import { prisma } from '@/lib/prisma';
import { getVisitorId } from '@/lib/visitor';
import { createTopicSchema, createCommentSchema } from '@/lib/validation/forum';
import { revalidatePath } from 'next/cache';

export async function createTopic(formData: FormData) {
  const visitorId = await getVisitorId();
  const rawData = {
    authorName: formData.get('authorName') as string,
    title: formData.get('title') as string,
    content: formData.get('content') as string
  };

  const validation = createTopicSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    const topic = await prisma.forumTopic.create({
      data: {
        authorName: validation.data.authorName,
        title: validation.data.title,
        content: validation.data.content
      }
    });
    
    revalidatePath('/forum');
    return { success: true, topicId: topic.id };
  } catch (error) {
    console.error(error);
    return { error: 'حدث خطأ أثناء إضافة الموضوع' };
  }
}

export async function toggleLike(topicId: string) {
  const visitorId = await getVisitorId();
  
  try {
    const topic = await prisma.forumTopic.findUnique({ where: { id: topicId } });
    if (!topic || !topic.isVisible) {
      return { error: 'الموضوع غير متاح' };
    }

    const existingLike = await prisma.forumLike.findUnique({
      where: {
        topicId_visitorId: { topicId, visitorId }
      }
    });

    if (existingLike) {
      await prisma.forumLike.delete({
        where: { id: existingLike.id }
      });
    } else {
      await prisma.forumLike.create({
        data: { topicId, visitorId }
      });
    }

    revalidatePath('/forum');
    revalidatePath(`/forum/${topicId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'حدث خطأ أثناء تسجيل الإعجاب' };
  }
}

export async function addComment(formData: FormData) {
  const visitorId = await getVisitorId();
  const rawData = {
    topicId: formData.get('topicId') as string,
    authorName: formData.get('authorName') as string,
    content: formData.get('content') as string
  };

  const validation = createCommentSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    const topic = await prisma.forumTopic.findUnique({ where: { id: validation.data.topicId } });
    if (!topic || !topic.isVisible) {
      return { error: 'الموضوع غير متاح' };
    }
    if (topic.isLocked) {
      return { error: 'الموضوع مغلق ولا يمكن إضافة تعليقات' };
    }

    await prisma.forumComment.create({
      data: {
        topicId: validation.data.topicId,
        authorName: validation.data.authorName,
        content: validation.data.content
      }
    });

    revalidatePath(`/forum/${validation.data.topicId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'حدث خطأ أثناء إضافة التعليق' };
  }
}
