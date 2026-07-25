"use client";

import { useState } from 'react';
import { updateForumTopic, setForumTopicVisibility, setForumTopicLock, deleteForumTopic, setManualForumLikeCount, updateForumComment, setForumCommentVisibility, deleteForumComment } from '@/actions/admin-discussions';

type Topic = {
  id: string;
  authorName: string;
  title: string;
  content: string;
  isVisible: boolean;
  isLocked: boolean;
  manualLikeCount: number;
  createdAt: Date;
  updatedAt: Date;
  _count: { comments: number; likes: number };
  comments: Comment[];
};

type Comment = {
  id: string;
  authorName: string;
  content: string;
  isVisible: boolean;
  createdAt: Date;
};

export default function DiscussionsManager({ initialTopics }: { initialTopics: Topic[] }) {
  const [topics, setTopics] = useState(initialTopics);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editingComment, setEditingComment] = useState<{ comment: Comment; topicId: string } | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleToggleVisibility(id: string, current: boolean) {
    setIsPending(true);
    const result = await setForumTopicVisibility(id, !current);
    if (result.success) {
      setTopics(prev => prev.map(t => t.id === id ? { ...t, isVisible: !current } : t));
    } else {
      alert(result.error);
    }
    setIsPending(false);
  }

  async function handleToggleLock(id: string, current: boolean) {
    setIsPending(true);
    const result = await setForumTopicLock(id, !current);
    if (result.success) {
      setTopics(prev => prev.map(t => t.id === id ? { ...t, isLocked: !current } : t));
    } else {
      alert(result.error);
    }
    setIsPending(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا النقاش وجميع تعليقاته؟')) return;
    setIsPending(true);
    const result = await deleteForumTopic(id);
    if (result.success) {
      setTopics(prev => prev.filter(t => t.id !== id));
    } else {
      alert(result.error);
    }
    setIsPending(false);
  }

  async function handleUpdateManualLikes(id: string, count: number) {
    const result = await setManualForumLikeCount(id, count);
    if (result.success) {
      setTopics(prev => prev.map(t => t.id === id ? { ...t, manualLikeCount: count } : t));
    } else {
      alert(result.error);
    }
  }

  async function handleEditTopicSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingTopic) return;
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    formData.set('topicId', editingTopic.id);
    const result = await updateForumTopic(formData);
    if (result.success) {
      setTopics(prev => prev.map(t => t.id === editingTopic.id ? { 
        ...t, 
        authorName: formData.get('authorName') as string,
        title: formData.get('title') as string,
        content: formData.get('content') as string
      } : t));
      setEditingTopic(null);
    } else {
      alert(result.error);
    }
    setIsPending(false);
  }

  async function handleToggleCommentVisibility(commentId: string, topicId: string, current: boolean) {
    setIsPending(true);
    const result = await setForumCommentVisibility(commentId, !current);
    if (result.success) {
      setTopics(prev => prev.map(t => {
        if (t.id === topicId) {
          return {
            ...t,
            comments: t.comments.map(c => c.id === commentId ? { ...c, isVisible: !current } : c)
          };
        }
        return t;
      }));
    } else {
      alert(result.error);
    }
    setIsPending(false);
  }

  async function handleDeleteComment(commentId: string, topicId: string) {
    if (!confirm('هل أنت متأكد من حذف هذا التعليق؟')) return;
    setIsPending(true);
    const result = await deleteForumComment(commentId);
    if (result.success) {
      setTopics(prev => prev.map(t => {
        if (t.id === topicId) {
          return {
            ...t,
            comments: t.comments.filter(c => c.id !== commentId),
            _count: { ...t._count, comments: t._count.comments - 1 }
          };
        }
        return t;
      }));
    } else {
      alert(result.error);
    }
    setIsPending(false);
  }

  async function handleEditCommentSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingComment) return;
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    formData.set('commentId', editingComment.comment.id);
    const result = await updateForumComment(formData);
    if (result.success) {
      setTopics(prev => prev.map(t => {
        if (t.id === editingComment.topicId) {
          return {
            ...t,
            comments: t.comments.map(c => c.id === editingComment.comment.id ? { 
              ...c, 
              authorName: formData.get('authorName') as string,
              content: formData.get('content') as string
            } : c)
          };
        }
        return t;
      }));
      setEditingComment(null);
    } else {
      alert(result.error);
    }
    setIsPending(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
      {topics.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          لا يوجد نقاشات مسجلة بعد
        </div>
      ) : (
        <div className="space-y-6">
          {topics.map(topic => (
            <div key={topic.id} className="border border-gray-100 rounded-xl bg-gray-50/50 overflow-hidden">
              <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${topic.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                      {topic.isVisible ? 'مرئي' : 'مخفي'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${topic.isLocked ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {topic.isLocked ? 'مغلق' : 'مفتوح'}
                    </span>
                    <h3 className="font-bold text-[var(--primary-green)] text-lg mr-2">{topic.title}</h3>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-4">
                    <span>الكاتب: {topic.authorName}</span>
                    <span dir="ltr">📅 {new Date(topic.createdAt).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-sm flex flex-col items-center px-3 border-l border-gray-100">
                    <span className="text-gray-500 text-xs mb-1">إعجابات حقيقية</span>
                    <span className="font-bold text-gray-700">{topic._count.likes}</span>
                  </div>
                  <div className="text-sm flex flex-col items-center px-3 border-l border-gray-100">
                    <span className="text-gray-500 text-xs mb-1">إعجابات يدوية</span>
                    <input 
                      type="number" 
                      min="0"
                      className="w-16 px-2 py-1 text-center border rounded font-bold text-gray-700 text-sm focus:ring-1 outline-none"
                      value={topic.manualLikeCount}
                      onChange={(e) => handleUpdateManualLikes(topic.id, parseInt(e.target.value) || 0)}
                      disabled={isPending}
                    />
                  </div>
                  <div className="text-sm flex flex-col items-center px-3">
                    <span className="text-gray-500 text-xs mb-1">الإجمالي المعروض</span>
                    <span className="font-bold text-[var(--primary-green)]">{topic._count.likes + topic.manualLikeCount}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:flex-nowrap">
                  <button 
                    onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-bold flex items-center"
                  >
                    💬 التعليقات ({topic.comments.length})
                  </button>
                  <button 
                    onClick={() => setEditingTopic(topic)}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-sm font-bold"
                  >
                    تعديل
                  </button>
                  <button 
                    onClick={() => handleToggleVisibility(topic.id, topic.isVisible)}
                    disabled={isPending}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-bold"
                  >
                    {topic.isVisible ? 'إخفاء' : 'إظهار'}
                  </button>
                  <button 
                    onClick={() => handleToggleLock(topic.id, topic.isLocked)}
                    disabled={isPending}
                    className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 text-sm font-bold"
                  >
                    {topic.isLocked ? 'فتح' : 'إغلاق'}
                  </button>
                  <button 
                    onClick={() => handleDelete(topic.id)}
                    disabled={isPending}
                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-bold"
                  >
                    حذف
                  </button>
                </div>
              </div>

              {expandedTopic === topic.id && (
                <div className="p-4 bg-white border-t border-gray-100">
                  <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">التعليقات</h4>
                  {topic.comments.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center py-4">لا توجد تعليقات</div>
                  ) : (
                    <div className="space-y-3">
                      {topic.comments.map(comment => (
                        <div key={comment.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`w-2 h-2 rounded-full ${comment.isVisible ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                              <span className="font-bold text-[var(--primary-green)] text-sm">{comment.authorName}</span>
                              <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString('ar-EG')}</span>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                          </div>
                          <div className="flex items-start gap-2 shrink-0">
                            <button 
                              onClick={() => setEditingComment({ comment, topicId: topic.id })}
                              className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 text-xs font-bold"
                            >
                              تعديل
                            </button>
                            <button 
                              onClick={() => handleToggleCommentVisibility(comment.id, topic.id, comment.isVisible)}
                              disabled={isPending}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs font-bold"
                            >
                              {comment.isVisible ? 'إخفاء' : 'إظهار'}
                            </button>
                            <button 
                              onClick={() => handleDeleteComment(comment.id, topic.id)}
                              disabled={isPending}
                              className="px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-xs font-bold"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Topic Modal */}
      {editingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden" dir="rtl">
            <div className="bg-[var(--primary-green)] p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">تعديل النقاش</h3>
              <button onClick={() => setEditingTopic(null)} className="text-white/80 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleEditTopicSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">الكاتب</label>
                <input 
                  type="text" 
                  name="authorName"
                  defaultValue={editingTopic.authorName}
                  required 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">العنوان</label>
                <input 
                  type="text" 
                  name="title"
                  defaultValue={editingTopic.title}
                  required 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">المحتوى</label>
                <textarea 
                  name="content"
                  defaultValue={editingTopic.content}
                  required 
                  rows={6}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setEditingTopic(null)}
                  className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="px-6 py-2 text-white bg-[var(--primary-green)] rounded-lg hover:bg-[var(--secondary-green)] font-bold disabled:opacity-50"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Comment Modal */}
      {editingComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden" dir="rtl">
            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">تعديل التعليق</h3>
              <button onClick={() => setEditingComment(null)} className="text-white/80 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleEditCommentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">الكاتب</label>
                <input 
                  type="text" 
                  name="authorName"
                  defaultValue={editingComment.comment.authorName}
                  required 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">التعليق</label>
                <textarea 
                  name="content"
                  defaultValue={editingComment.comment.content}
                  required 
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setEditingComment(null)}
                  className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-bold disabled:opacity-50"
                >
                  حفظ التعليق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
