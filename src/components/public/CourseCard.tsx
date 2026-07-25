"use client";

import { useState } from 'react';
import { submitRegistration } from '@/actions/register';

import type { Course } from '@prisma/client';

export default function CourseCard({ course }: { course: Course }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await submitRegistration(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(false);
      }, 3000);
    }
    setIsSubmitting(false);
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden interactive-card border-t-4 flex flex-col h-full">
        <div className="p-6 flex-grow">
          <div className="text-[var(--accent-gold)] text-3xl mb-4">🎓</div>
          <h3 className="text-xl font-bold mb-3">{course.title}</h3>
          <p className="text-gray-600 leading-relaxed text-sm">{course.summary}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full course-action-btn py-2 rounded-lg font-bold shadow-sm"
          >
            تسجيل في الدورة
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto fade-in p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition text-2xl"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-[var(--primary-green)] mb-6 text-center border-b pb-3">
              التسجيل في: {course.title}
            </h3>
            
            {success ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center font-bold">
                تم استلام طلب التسجيل بنجاح!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="courseId" value={course.id} />
                {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">{error}</div>}
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">الاسم الثلاثي أو الرباعي <span className="text-red-500">*</span></label>
                  <input required name="fullName" type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">السن <span className="text-red-500">*</span></label>
                    <input required name="age" type="number" min="18" max="100" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">الكلية <span className="text-red-500">*</span></label>
                    <input required name="faculty" type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">القسم <span className="text-red-500">*</span></label>
                    <input required name="department" type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">الدرجة للترقي <span className="text-red-500">*</span></label>
                    <select required name="promotionDegree" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none">
                      <option value="">اختر الدرجة</option>
                      <option value="مدرس">مدرس</option>
                      <option value="أستاذ مساعد">أستاذ مساعد</option>
                      <option value="أستاذ">أستاذ</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="w-full bg-[var(--primary-green)] text-white font-bold py-3 px-4 rounded-lg hover:bg-[var(--secondary-green)] transition disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? 'جاري التسجيل...' : 'تأكيد التسجيل'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
