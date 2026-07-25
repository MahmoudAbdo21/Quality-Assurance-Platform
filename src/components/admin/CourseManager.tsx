"use client";

import { useState } from 'react';
import { saveCourse, deleteCourse } from '@/actions/admin-courses';
import type { Course } from '@prisma/client';

export default function CourseManager({ courses }: { courses: (Course & { _count: { registrations: number } })[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  function openNew() {
    setEditingCourse(null);
    setIsOpen(true);
    setError('');
  }

  function openEdit(course: Course) {
    setEditingCourse(course);
    setIsOpen(true);
    setError('');
  }

  async function handleDelete(id: string) {
    if (confirm('هل أنت متأكد من حذف هذه الدورة؟ لا يمكن التراجع عن هذا الإجراء وسيتم حذف كافة المسجلين بها.')) {
      const result = await deleteCourse(id);
      if (result.error) alert(result.error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await saveCourse(formData);
    
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
        <h2 className="text-2xl font-bold text-gray-800">إدارة الدورات التدريبية</h2>
        <button onClick={openNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow font-bold transition">
          + إضافة دورة جديدة
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 font-bold border-b">عنوان الدورة</th>
              <th className="p-4 font-bold border-b">المسجلين</th>
              <th className="p-4 font-bold border-b">الحالة</th>
              <th className="p-4 font-bold border-b">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">لا توجد دورات حالياً</td>
              </tr>
            ) : (
              courses.map(course => (
                <tr key={course.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-semibold text-gray-800">{course.title}</td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                      {course._count.registrations}
                    </span>
                  </td>
                  <td className="p-4">
                    {course.isPublished ? (
                      <span className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">منشورة ✅</span>
                    ) : (
                      <span className="text-gray-500 font-bold text-sm bg-gray-100 px-3 py-1 rounded-full">مسودة 📝</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(course)} className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition text-sm rounded px-3 py-1.5 font-bold border border-blue-200">تعديل</button>
                      <button onClick={() => handleDelete(course.id)} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition text-sm rounded px-3 py-1.5 font-bold border border-red-200">حذف</button>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto fade-in p-8 relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition text-2xl"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
              {editingCourse ? 'تعديل الدورة' : 'إضافة دورة جديدة'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {editingCourse && <input type="hidden" name="id" value={editingCourse.id} />}
              {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-bold">{error}</div>}
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">عنوان الدورة <span className="text-red-500">*</span></label>
                <input 
                  required 
                  name="title" 
                  type="text" 
                  defaultValue={editingCourse?.title || ''}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">الرابط الدائم (Slug) الإنجليزي <span className="text-red-500">*</span></label>
                <input 
                  required 
                  name="slug" 
                  type="text" 
                  dir="ltr"
                  defaultValue={editingCourse?.slug || ''}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-left" 
                />
                <p className="text-xs text-gray-500 mt-1">يستخدم في رابط الدورة (مثال: quality-assurance-101)</p>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">ملخص قصير <span className="text-red-500">*</span></label>
                <input 
                  required 
                  name="summary" 
                  type="text" 
                  defaultValue={editingCourse?.summary || ''}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">الوصف الكامل <span className="text-red-500">*</span></label>
                <textarea 
                  required 
                  name="description" 
                  rows={5} 
                  defaultValue={editingCourse?.description || ''}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">الترتيب <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    name="displayOrder" 
                    type="number" 
                    defaultValue={editingCourse?.displayOrder ?? 0}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      name="isPublished" 
                      type="checkbox" 
                      defaultChecked={editingCourse ? editingCourse.isPublished : true}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500" 
                    />
                    <span className="text-gray-700 font-bold text-sm">نشر الدورة فوراً؟</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 border-t pt-5">
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
                  className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ الدورة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
