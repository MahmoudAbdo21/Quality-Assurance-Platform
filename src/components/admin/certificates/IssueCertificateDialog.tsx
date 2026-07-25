"use client";

import { useState } from 'react';
import { grantCertificate } from '@/actions/admin-certificates';
import type { Certificate, Course } from '@prisma/client';
import CertificatePreviewModal from '@/components/certificates/CertificatePreviewModal';
import type { CertificateDocumentData } from '@/components/certificates/CertificateDocument';

type CertificateWithCourse = Certificate & { 
  course: Course;
};

export default function IssueCertificateDialog({
  isOpen,
  onClose,
  certificates,
}: {
  isOpen: boolean;
  onClose: () => void;
  certificates: CertificateWithCourse[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState<CertificateDocumentData | null>(null);

  const availableCertificates = certificates.filter(t => t.isPublished && !t.isSuspended);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await grantCertificate(formData);
    
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      alert('تم منح الشهادة بنجاح!');
      setIsSubmitting(false);
      onClose();
    }
  }

  function handlePreview(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (!form) return;
    
    const formData = new FormData(form);
    const certificate = certificates.find(t => t.id === formData.get('certificateId'));
    if (!certificate) {
      alert('اختر الشهادة أولاً');
      return;
    }

    setPreviewData({
      certificateTitle: certificate.title,
      courseTitle: certificate.course.title,
      
      participantName: formData.get('recipientFullName') as string || 'محمود عبده',
      participantDegree: formData.get('recipientDegree') as string || 'الفرقة الرابعة',
      
      issueDate: formData.get('issueDate') as string || new Date().toLocaleDateString('ar-EG'),
      
      verificationCode: 'PRV-XXXX-XXXX',
      isRevoked: false,
      isAdminPreview: true
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition text-2xl"
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          منح شهادة لمستفيد
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-bold">{error}</div>}
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">1. اختيار الشهادة</h4>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">الشهادة <span className="text-red-500">*</span></label>
              <select 
                required 
                name="certificateId"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white" 
              >
                <option value="" disabled selected>اختر الشهادة...</option>
                {availableCertificates.map(certificate => (
                  <option key={certificate.id} value={certificate.id}>
                    {certificate.course.title} - {certificate.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">2. بيانات المستفيد</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">اسم المستفيد بالكامل <span className="text-red-500">*</span></label>
                <input 
                  required 
                  name="recipientFullName" 
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                  placeholder="الاسم الرباعي كما سيطبع"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">الدرجة أو اللقب (اختياري)</label>
                <input 
                  name="recipientDegree" 
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                  placeholder="مثال: الفرقة الرابعة، كلية الهندسة..."
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">3. تفاصيل الإصدار</h4>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">تاريخ الإصدار <span className="text-red-500">*</span></label>
              <input 
                required 
                name="issueDate" 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 border-t pt-5">
            <button 
              type="button"
              onClick={handlePreview}
              className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold py-2 px-6 rounded-lg hover:bg-indigo-100 transition"
            >
              👁️ معاينة الشهادة
            </button>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition font-bold"
              >
                إلغاء
              </button>
              <button 
                disabled={isSubmitting}
                type="submit" 
                className="bg-green-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-lg"
              >
                {isSubmitting ? 'جاري الإصدار...' : 'إصدار الشهادة'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {previewData && (
        <CertificatePreviewModal 
          isOpen={!!previewData}
          onClose={() => setPreviewData(null)}
          data={previewData}
        />
      )}
    </div>
  );
}
