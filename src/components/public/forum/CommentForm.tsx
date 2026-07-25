"use client";

import { useState } from 'react';
import { addComment } from '@/actions/forum';
import { useRouter } from 'next/navigation';

export default function CommentForm({ topicId }: { topicId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("topicId", topicId);

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const result = await addComment(formData);

      if (!result.success) {
        setError(result.error ?? "تعذر إضافة التعليق.");
        return;
      }

      form.reset();
      setSuccess("تم نشر التعليق بنجاح.");
      router.refresh();
    } catch (error) {
      console.error("Comment submission failed:", error);
      setError("تم حفظ الطلب بشكل غير متوقع أو تعذر تحديث الصفحة. برجاء تحديث الصفحة والتحقق قبل إعادة الإرسال.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-6">
      <h4 className="font-bold text-[var(--primary-green)] mb-4">إضافة تعليق جديد</h4>
      {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg text-sm font-bold">{success}</div>}
      
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">الاسم <span className="text-red-500">*</span></label>
        <input 
          disabled={isSubmitting}
          required 
          name="authorName" 
          type="text" 
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed" 
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">التعليق <span className="text-red-500">*</span></label>
        <textarea 
          disabled={isSubmitting}
          required 
          name="content" 
          rows={3} 
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        ></textarea>
      </div>

      <button 
        disabled={isSubmitting}
        type="submit" 
        className="bg-[var(--primary-green)] text-white font-bold py-2 px-6 rounded-lg hover:bg-[var(--secondary-green)] transition disabled:opacity-50"
      >
        {isSubmitting ? 'جاري النشر...' : 'نشر التعليق'}
      </button>
    </form>
  );
}
