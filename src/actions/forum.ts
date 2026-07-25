"use server";

import { prisma } from '@/lib/prisma';
import { getVisitorId } from '@/lib/visitor';
import { createTopicSchema, createCommentSchema } from '@/lib/validation/forum';
import { revalidatePath } from 'next/cache';

export async function createTopic(formData: FormData) {
  const rawData = {
    authorName: formData.get('authorName') as string,
    title: formData.get('title') as string,
    content: formData.get('content') as string
  };

  const validation = createTopicSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
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
    return { success: false, error: 'حدث خطأ أثناء إضافة الموضوع' };
  }
}

export async function toggleLike(topicId: string) {
  const visitorId = await getVisitorId();
  
  try {
    const topic = await prisma.forumTopic.findUnique({ 
      where: { id: topicId },
      select: { isVisible: true, manualLikeCount: true } 
    });
    
    if (!topic || !topic.isVisible) {
      return { success: false, error: 'الموضوع غير متاح' };
    }

    const existingLike = await prisma.forumLike.findUnique({
      where: {
        topicId_visitorId: { topicId, visitorId }
      }
    });

    let liked = false;
    if (existingLike) {
      await prisma.forumLike.delete({
        where: { id: existingLike.id }
      });
      liked = false;
    } else {
      await prisma.forumLike.create({
        data: { topicId, visitorId }
      });
      liked = true;
    }

    const realCount = await prisma.forumLike.count({ where: { topicId } });
    const manualCount = topic.manualLikeCount;
    const displayedCount = realCount + manualCount;

    revalidatePath('/forum');
    revalidatePath(`/forum/${topicId}`);
    
    return { 
      success: true, 
      liked, 
      realCount, 
      manualCount, 
      displayedCount 
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'حدث خطأ أثناء تسجيل الإعجاب' };
  }
}

export async function addComment(formData: FormData) {
  const rawData = {
    topicId: formData.get('topicId') as string,
    authorName: formData.get('authorName') as string,
    content: formData.get('content') as string
  };

  const validation = createCommentSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  try {
    const topic = await prisma.forumTopic.findUnique({ where: { id: validation.data.topicId } });
    if (!topic || !topic.isVisible) {
      return { success: false, error: 'الموضوع غير متاح' };
    }
    if (topic.isLocked) {
      return { success: false, error: 'الموضوع مغلق ولا يمكن إضافة تعليقات' };
    }

    const comment = await prisma.forumComment.create({
      data: {
        topicId: validation.data.topicId,
        authorName: validation.data.authorName,
        content: validation.data.content
      }
    });

    revalidatePath('/forum');
    revalidatePath(`/forum/${validation.data.topicId}`);
    return { success: true, commentId: comment.id };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'حدث خطأ أثناء إضافة التعليق' };
  }
}
