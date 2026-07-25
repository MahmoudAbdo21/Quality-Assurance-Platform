"use client";

import { useState } from 'react';
import { createTopic } from '@/actions/forum';

export default function CreateTopicDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    
    try {
      const result = await createTopic(formData);
      
      if (!result.success) {
        setError(result.error ?? "تعذر إضافة الموضوع.");
      } else {
        form.reset();
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Topic submission failed:", err);
      setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="add-topic-btn bg-[var(--primary-green)] text-white px-6 py-3 rounded-lg font-bold transition hover:bg-[var(--secondary-green)] shadow-md"
      >
        + موضوع جديد
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg fade-in p-6 relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition text-2xl"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-[var(--primary-green)] mb-6 border-b pb-3">
              إضافة موضوع جديد
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-bold">{error}</div>}
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">الاسم <span className="text-red-500">*</span></label>
                <input 
                  required 
                  name="authorName" 
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none" 
                  minLength={2}
                  maxLength={80}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">عنوان الموضوع <span className="text-red-500">*</span></label>
                <input 
                  required 
                  name="title" 
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none" 
                  minLength={5}
                  maxLength={180}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">تفاصيل الموضوع <span className="text-red-500">*</span></label>
                <textarea 
                  required 
                  name="content" 
                  rows={5} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none"
                  minLength={10}
                  maxLength={5000}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition font-bold"
                >
                  إلغاء
                </button>
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="bg-[var(--primary-green)] text-white font-bold py-2 px-6 rounded-lg hover:bg-[var(--secondary-green)] transition disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري النشر...' : 'نشر الموضوع'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
