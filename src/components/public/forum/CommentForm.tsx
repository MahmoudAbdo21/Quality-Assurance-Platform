"use client";

import { useState } from 'react';
import { addComment } from '@/actions/forum';

export default function CommentForm({ topicId }: { topicId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.append('topicId', topicId);
    
    const result = await addComment(formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      e.currentTarget.reset();
    }
    
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-6">
      <h4 className="font-bold text-[var(--primary-green)] mb-4">إضافة تعليق جديد</h4>
      {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">{error}</div>}
      
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">الاسم <span className="text-red-500">*</span></label>
        <input 
          required 
          name="authorName" 
          type="text" 
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none" 
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">التعليق <span className="text-red-500">*</span></label>
        <textarea 
          required 
          name="content" 
          rows={3} 
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none"
        ></textarea>
      </div>

      <button 
        disabled={isSubmitting}
        type="submit" 
        className="bg-[var(--primary-green)] text-white font-bold py-2 px-6 rounded-lg hover:bg-[var(--secondary-green)] transition disabled:opacity-50"
      >
        {isSubmitting ? 'جاري الإرسال...' : 'نشر التعليق'}
      </button>
    </form>
  );
}
