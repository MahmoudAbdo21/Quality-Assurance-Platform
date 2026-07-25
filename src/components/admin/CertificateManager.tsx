"use client";

import { useState } from 'react';
import { saveCertificate, deleteCertificate } from '@/actions/admin-certificates';
import type { Certificate, Course } from '@prisma/client';
import Link from 'next/link';

type CertificateWithCourse = Certificate & { course: Course };

export default function CertificateManager({ 
  certificates, 
  courses 
}: { 
  certificates: CertificateWithCourse[],
  courses: Course[] 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingCert, setEditingCert] = useState<CertificateWithCourse | null>(null);

  function openNew() {
    setEditingCert(null);
    setIsOpen(true);
    setError('');
  }

  function openEdit(cert: CertificateWithCourse) {
    setEditingCert(cert);
    setIsOpen(true);
    setError('');
  }

  async function handleDelete(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا النموذج للشهادة؟ لن يؤثر ذلك على المسجلين ولكن لن يتمكنوا من طباعة الشهادة.')) {
      const result = await deleteCertificate(id);
      if (result.error) alert(result.error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await saveCertificate(formData);
    
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
        <h2 className="text-2xl font-bold text-gray-800">إدارة الشهادات المعتمدة</h2>
        <button onClick={openNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow font-bold transition">
          + إضافة نموذج شهادة
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 font-bold border-b">عنوان الشهادة</th>
              <th className="p-4 font-bold border-b">الدورة التدريبية</th>
              <th className="p-4 font-bold border-b">الحالة</th>
              <th className="p-4 font-bold border-b">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {certificates.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">لا توجد شهادات حالياً</td>
              </tr>
            ) : (
              certificates.map(cert => (
                <tr key={cert.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-semibold text-gray-800">{cert.title}</td>
                  <td className="p-4 text-gray-600">{cert.course.title}</td>
                  <td className="p-4">
                    {cert.isPublished ? (
                      <span className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">جاهزة ✅</span>
                    ) : (
                      <span className="text-gray-500 font-bold text-sm bg-gray-100 px-3 py-1 rounded-full">مسودة 📝</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link 
                        href={`/certificates/verify?token=SAMPLE`} 
                        className="bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition text-sm rounded px-3 py-1.5 font-bold border border-indigo-200"
                        title="معاينة"
                      >
                        معاينة
                      </Link>
                      <button onClick={() => openEdit(cert)} className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition text-sm rounded px-3 py-1.5 font-bold border border-blue-200">تعديل</button>
                      <button onClick={() => handleDelete(cert.id)} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition text-sm rounded px-3 py-1.5 font-bold border border-red-200">حذف</button>
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
              {editingCert ? 'تعديل الشهادة' : 'إضافة نموذج شهادة'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {editingCert && <input type="hidden" name="id" value={editingCert.id} />}
              {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-bold">{error}</div>}
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">الدورة التدريبية <span className="text-red-500">*</span></label>
                <select 
                  required 
                  name="courseId" 
                  defaultValue={editingCert?.courseId || ''}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white" 
                >
                  <option value="" disabled>اختر الدورة التدريبية...</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">يجب اختيار الدورة التي ستمنح هذه الشهادة لمجتازيها.</p>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">عنوان الشهادة <span className="text-red-500">*</span></label>
                <input 
                  required 
                  name="title" 
                  type="text" 
                  defaultValue={editingCert?.title || 'شهادة إتمام دورة تدريبية'}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">وصف قصير <span className="text-red-500">*</span></label>
                <input 
                  required 
                  name="description" 
                  type="text" 
                  defaultValue={editingCert?.description || ''}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">محتوى ونص الشهادة <span className="text-red-500">*</span></label>
                <textarea 
                  required 
                  name="certificateBody" 
                  rows={4} 
                  defaultValue={editingCert?.certificateBody || 'تشهد الهيئة القومية لضمان جودة التعليم والاعتماد بأن المتدرب قد اجتاز بنجاح الدورة التدريبية...'}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">يمكنك استخدام المتغيرات مثل: [اسم_المتدرب]، [تاريخ_الاصدار] إذا تم دعمها لاحقاً.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">الترتيب <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    name="displayOrder" 
                    type="number" 
                    defaultValue={editingCert?.displayOrder ?? 0}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      name="isPublished" 
                      type="checkbox" 
                      defaultChecked={editingCert ? editingCert.isPublished : true}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500" 
                    />
                    <span className="text-gray-700 font-bold text-sm">تفعيل الشهادة وإتاحتها للطباعة؟</span>
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
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ الشهادة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
