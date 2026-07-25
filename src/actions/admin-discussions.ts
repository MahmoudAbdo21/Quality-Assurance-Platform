"use server";

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import { updateTopicSchema, updateCommentSchema } from '@/lib/validation/admin-discussions';
import { revalidatePath } from 'next/cache';

export async function updateForumTopic(formData: FormData) {
  const admin = await requireAdmin();
  const rawData = {
    topicId: formData.get('topicId') as string,
    authorName: formData.get('authorName') as string,
    title: formData.get('title') as string,
    content: formData.get('content') as string
  };

  const validation = updateTopicSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  try {
    const existing = await prisma.forumTopic.findUnique({ where: { id: validation.data.topicId } });
    if (!existing) return { success: false, error: 'النقاش غير موجود' };

    await prisma.forumTopic.update({
      where: { id: existing.id },
      data: {
        authorName: validation.data.authorName,
        title: validation.data.title,
        content: validation.data.content
      }
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: admin.id,
        action: 'UPDATE_TOPIC',
        entityType: 'ForumTopic',
        entityId: existing.id,
        summary: `تم تعديل النقاش: ${existing.title}`
      }
    });

    revalidatePath('/forum');
    revalidatePath(`/forum/${existing.id}`);
    revalidatePath('/admin/discussions');

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'حدث خطأ أثناء حفظ النقاش' };
  }
}

export async function setForumTopicVisibility(topicId: string, isVisible: boolean) {
  const admin = await requireAdmin();
  try {
    const topic = await prisma.forumTopic.update({
      where: { id: topicId },
      data: { isVisible }
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: admin.id,
        action: isVisible ? 'RESTORE_TOPIC' : 'HIDE_TOPIC',
        entityType: 'ForumTopic',
        entityId: topicId,
        summary: `تم ${isVisible ? 'إظهار' : 'إخفاء'} النقاش: ${topic.title}`
      }
    });

    revalidatePath('/forum');
    revalidatePath(`/forum/${topicId}`);
    revalidatePath('/admin/discussions');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'فشل تغيير حالة الظهور' };
  }
}

export async function setForumTopicLock(topicId: string, isLocked: boolean) {
  const admin = await requireAdmin();
  try {
    const topic = await prisma.forumTopic.update({
      where: { id: topicId },
      data: { isLocked }
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: admin.id,
        action: isLocked ? 'LOCK_TOPIC' : 'UNLOCK_TOPIC',
        entityType: 'ForumTopic',
        entityId: topicId,
        summary: `تم ${isLocked ? 'إغلاق' : 'فتح'} النقاش: ${topic.title}`
      }
    });

    revalidatePath(`/forum/${topicId}`);
    revalidatePath('/admin/discussions');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'فشل تغيير حالة الإغلاق' };
  }
}

export async function deleteForumTopic(topicId: string) {
  const admin = await requireAdmin();
  try {
    const existing = await prisma.forumTopic.findUnique({ 
      where: { id: topicId },
      include: {
        _count: { select: { comments: true, likes: true } }
      }
    });
    
    if (!existing) return { success: false, error: 'النقاش غير موجود' };

    await prisma.$transaction([
      prisma.forumComment.deleteMany({ where: { topicId } }),
      prisma.forumLike.deleteMany({ where: { topicId } }),
      prisma.forumTopic.delete({ where: { id: topicId } })
    ]);

    await prisma.auditLog.create({
      data: {
        adminUserId: admin.id,
        action: 'DELETE_TOPIC',
        entityType: 'ForumTopic',
        entityId: topicId,
        summary: `حذف النقاش "${existing.title}" للكاتب ${existing.authorName}. (تعليقات: ${existing._count.comments}, إعجابات: ${existing._count.likes}, يدوية: ${existing.manualLikeCount})`
      }
    });

    revalidatePath('/forum');
    revalidatePath('/admin/discussions');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'فشل الحذف' };
  }
}

export async function setManualForumLikeCount(topicId: string, manualLikeCount: number) {
  const admin = await requireAdmin();
  if (manualLikeCount < 0 || manualLikeCount > 1000000) {
    return { success: false, error: 'عدد غير صالح' };
  }

  try {
    const topic = await prisma.forumTopic.findUnique({ where: { id: topicId } });
    if (!topic) return { success: false, error: 'غير موجود' };

    const oldCount = topic.manualLikeCount;
    
    await prisma.forumTopic.update({
      where: { id: topicId },
      data: { manualLikeCount }
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: admin.id,
        action: 'UPDATE_MANUAL_LIKES',
        entityType: 'ForumTopic',
        entityId: topicId,
        summary: `تعديل إعجابات يدوية لنقاش "${topic.title}" من ${oldCount} إلى ${manualLikeCount}`
      }
    });

    revalidatePath('/forum');
    revalidatePath(`/forum/${topicId}`);
    revalidatePath('/admin/discussions');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'فشل التعديل' };
  }
}

export async function updateForumComment(formData: FormData) {
  const admin = await requireAdmin();
  const rawData = {
    commentId: formData.get('commentId') as string,
    authorName: formData.get('authorName') as string,
    content: formData.get('content') as string
  };

  const validation = updateCommentSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  try {
    const existing = await prisma.forumComment.findUnique({ where: { id: validation.data.commentId } });
    if (!existing) return { success: false, error: 'التعليق غير موجود' };

    await prisma.forumComment.update({
      where: { id: existing.id },
      data: {
        authorName: validation.data.authorName,
        content: validation.data.content
      }
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: admin.id,
        action: 'UPDATE_COMMENT',
        entityType: 'ForumComment',
        entityId: existing.id,
        summary: `تعديل تعليق في نقاش`
      }
    });

    revalidatePath('/forum');
    revalidatePath(`/forum/${existing.topicId}`);
    revalidatePath('/admin/discussions');

    return { success: true };
  } catch (error) {
    return { success: false, error: 'فشل حفظ التعليق' };
  }
}

export async function setForumCommentVisibility(commentId: string, isVisible: boolean) {
  const admin = await requireAdmin();
  try {
    const comment = await prisma.forumComment.update({
      where: { id: commentId },
      data: { isVisible },
      include: { topic: true }
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: admin.id,
        action: isVisible ? 'RESTORE_COMMENT' : 'HIDE_COMMENT',
        entityType: 'ForumComment',
        entityId: commentId,
        summary: `تم ${isVisible ? 'إظهار' : 'إخفاء'} تعليق في نقاش "${comment.topic.title}"`
      }
    });

    revalidatePath('/forum');
    revalidatePath(`/forum/${comment.topicId}`);
    revalidatePath('/admin/discussions');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'فشل تغيير حالة الظهور' };
  }
}

export async function deleteForumComment(commentId: string) {
  const admin = await requireAdmin();
  try {
    const existing = await prisma.forumComment.findUnique({ 
      where: { id: commentId },
      include: { topic: true }
    });
    
    if (!existing) return { success: false, error: 'التعليق غير موجود' };

    await prisma.forumComment.delete({ where: { id: commentId } });

    await prisma.auditLog.create({
      data: {
        adminUserId: admin.id,
        action: 'DELETE_COMMENT',
        entityType: 'ForumComment',
        entityId: commentId,
        summary: `حذف تعليق في نقاش "${existing.topic.title}" للكاتب ${existing.authorName}`
      }
    });

    revalidatePath('/forum');
    revalidatePath(`/forum/${existing.topicId}`);
    revalidatePath('/admin/discussions');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'فشل الحذف' };
  }
}
