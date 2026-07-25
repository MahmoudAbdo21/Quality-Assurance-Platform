"use client";

import { useState } from 'react';
import { saveKnowledgeSlide, deleteKnowledgeSlide } from '@/actions/admin-content';
import type { KnowledgeSlide } from '@prisma/client';

export default function ContentManager({ slides }: { slides: KnowledgeSlide[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingSlide, setEditingSlide] = useState<KnowledgeSlide | null>(null);

  function openNew() {
    setEditingSlide(null);
    setIsOpen(true);
    setError('');
  }

  function openEdit(slide: KnowledgeSlide) {
    setEditingSlide(slide);
    setIsOpen(true);
    setError('');
  }

  async function handleDelete(id: string) {
    if (confirm('هل أنت متأكد من حذف هذه المعلومة؟')) {
      const result = await deleteKnowledgeSlide(id);
      if (result.error) alert(result.error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await saveKnowledgeSlide(formData);
    
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setIsOpen(false);
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">إدارة محتوى &quot;تعرف أكثر&quot;</h2>
        <button onClick={openNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow font-bold transition">
          + إضافة معلومة جديدة
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 font-bold border-b">الترتيب</th>
              <th className="p-4 font-bold border-b">العنوان</th>
              <th className="p-4 font-bold border-b">المحتوى</th>
              <th className="p-4 font-bold border-b">الحالة</th>
              <th className="p-4 font-bold border-b">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">لا توجد معلومات حالياً</td>
              </tr>
            ) : (
              slides.map(slide => (
                <tr key={slide.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-600 font-mono">{slide.displayOrder}</td>
                  <td className="p-4 font-semibold text-gray-800">{slide.title}</td>
                  <td className="p-4 text-gray-600 max-w-xs truncate" title={slide.content}>{slide.content}</td>
                  <td className="p-4">
                    {slide.isPublished ? (
                      <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">منشورة</span>
                    ) : (
                      <span className="text-gray-500 font-bold text-xs bg-gray-100 px-2 py-1 rounded-full">مسودة</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(slide)} className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition text-xs rounded px-2 py-1 font-bold border border-blue-200">تعديل</button>
                      <button onClick={() => handleDelete(slide.id)} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition text-xs rounded px-2 py-1 font-bold border border-red-200">حذف</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md fade-in p-6 relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition text-2xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
              {editingSlide ? 'تعديل المعلومة' : 'إضافة معلومة جديدة'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {editingSlide && <input type="hidden" name="id" value={editingSlide.id} />}
              {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-bold">{error}</div>}
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">العنوان <span className="text-red-500">*</span></label>
                <input 
                  required 
                  name="title" 
                  type="text" 
                  defaultValue={editingSlide?.title || ''}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" 
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">المحتوى <span className="text-red-500">*</span></label>
                <textarea 
                  required 
                  name="content" 
                  rows={4} 
                  defaultValue={editingSlide?.content || ''}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">الترتيب <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    name="displayOrder" 
                    type="number" 
                    defaultValue={editingSlide?.displayOrder ?? 0}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" 
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      name="isPublished" 
                      type="checkbox" 
                      defaultChecked={editingSlide ? editingSlide.isPublished : true}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500" 
                    />
                    <span className="text-gray-700 font-bold text-sm">نشر فوراً؟</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition font-bold text-sm"
                >
                  إلغاء
                </button>
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
