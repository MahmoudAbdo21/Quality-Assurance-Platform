"use client";

import { useState } from 'react';
import { saveCertificate, deleteCertificate } from '@/actions/admin-certificates';
import type { Certificate, Course } from '@prisma/client';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';

type CertificateWithCourse = Certificate & { course: Course; _count: { awards: number } };

export default function CertificateTemplatesTable({
  certificates,
  courses
}: {
  certificates: CertificateWithCourse[];
  courses: Course[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateWithCourse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter courses that don't have a certificate yet for the dropdown (only if creating new)
  const availableCourses = editingCert
    ? courses // when editing, we don't care, we just show the selected course
    : courses.filter(c => !certificates.some(cert => cert.courseId === c.id));

  const handleOpenModal = (cert: CertificateWithCourse | null = null) => {
    setEditingCert(cert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingCert(null);
    setIsModalOpen(false);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    if (editingCert) {
      formData.append('id', editingCert.id);
    }
    
    // Add default title if empty
    if (!formData.get('title')) {
      const courseId = formData.get('courseId');
      const course = courses.find(c => c.id === courseId);
      if (course) {
        formData.set('title', `شهادة ${course.title}`);
      }
    }

    const result = await saveCertificate(formData);
    
    setIsLoading(false);
    
    if (result.error) {
      alert(result.error);
    } else {
      alert(editingCert ? 'تم تحديث الشهادة' : 'تم إضافة الشهادة بنجاح');
      handleCloseModal();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذه الشهادة؟')) return;
    
    const result = await deleteCertificate(id);
    if (result.error) {
      alert(result.error);
    } else {
      alert('تم حذف الشهادة بنجاح');
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">شهادات الدورات</h2>
        {availableCourses.length > 0 && (
          <button 
            onClick={() => handleOpenModal()} 
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <Plus size={18} />
            إضافة شهادة لدورة
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 p-2">الدورة</th>
              <th className="border border-gray-200 p-2">عنوان الشهادة</th>
              <th className="border border-gray-200 p-2">الحالة</th>
              <th className="border border-gray-200 p-2">الشهادات الممنوحة</th>
              <th className="border border-gray-200 p-2 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map(cert => (
              <tr key={cert.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 p-2">{cert.course.title}</td>
                <td className="border border-gray-200 p-2">{cert.title}</td>
                <td className="border border-gray-200 p-2">
                  {!cert.isPublished ? (
                    <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-sm">مسودة</span>
                  ) : cert.isSuspended ? (
                    <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-sm">معلقة</span>
                  ) : (
                    <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-sm">نشطة</span>
                  )}
                </td>
                <td className="border border-gray-200 p-2">{cert._count.awards}</td>
                <td className="border border-gray-200 p-2">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleOpenModal(cert)} className="text-blue-600 hover:text-blue-800" title="تعديل">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(cert.id)} className="text-red-600 hover:text-red-800" title="حذف">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {certificates.length === 0 && (
              <tr>
                <td colSpan={5} className="border border-gray-200 p-8 text-center text-gray-500">
                  لا توجد شهادات حالياً
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">{editingCert ? 'تعديل الشهادة' : 'إضافة شهادة جديدة'}</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>
            
            <form onSubmit={onSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">الدورة التدريبية *</label>
                <select 
                  name="courseId" 
                  required 
                  defaultValue={editingCert?.courseId || ''} 
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={!!editingCert}
                >
                  <option value="" disabled>اختر الدورة</option>
                  {availableCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                  {editingCert && (
                    <option value={editingCert.courseId}>{editingCert.course.title}</option>
                  )}
                </select>
                {editingCert && <input type="hidden" name="courseId" value={editingCert.courseId} />}
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">عنوان الشهادة</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingCert?.title || ''} 
                  placeholder="مثال: شهادة اجتياز دورة..."
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <p className="text-xs text-gray-500 mt-1">يترك فارغاً لاستخدام العنوان الافتراضي</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">وصف قصير (اختياري)</label>
                <textarea 
                  name="description" 
                  defaultValue={editingCert?.description || ''} 
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  name="isPublished" 
                  id="isPublished"
                  defaultChecked={editingCert ? editingCert.isPublished : true} 
                  className="w-4 h-4"
                />
                <label htmlFor="isPublished" className="font-bold">نشر الشهادة (إتاحتها للطلاب)</label>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  name="isSuspended" 
                  id="isSuspended"
                  defaultChecked={editingCert ? editingCert.isSuspended : false} 
                  className="w-4 h-4"
                />
                <label htmlFor="isSuspended" className="font-bold text-red-600">تعليق الشهادة مؤقتاً</label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 border rounded hover:bg-gray-50">
                  إلغاء
                </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2">
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                  حفظ الشهادة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
