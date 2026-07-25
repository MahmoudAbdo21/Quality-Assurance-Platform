"use client";

import { useState } from 'react';
import { issueCertificate } from '@/actions/admin-certificate-issues';
import type { Certificate, Course, MediaAsset } from '@prisma/client';
import CertificatePreviewModal from '@/components/certificates/CertificatePreviewModal';
import type { CertificateDocumentData } from '@/components/certificates/CertificateDocument';

type TemplateWithCourse = Certificate & { 
  course: Course;
  logoAsset?: MediaAsset | null;
  sealAsset?: MediaAsset | null;
  firstSignatureAsset?: MediaAsset | null;
  secondSignatureAsset?: MediaAsset | null;
};

export default function IssueCertificateDialog({
  isOpen,
  onClose,
  templates,
  courses
}: {
  isOpen: boolean;
  onClose: () => void;
  templates: TemplateWithCourse[];
  courses: Course[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [previewData, setPreviewData] = useState<CertificateDocumentData | null>(null);

  const availableTemplates = templates.filter(t => t.courseId === selectedCourseId && t.isPublished);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await issueCertificate(formData);
    
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      alert('تم إصدار الشهادة بنجاح!');
      setIsSubmitting(false);
      onClose();
    }
  }

  function handlePreview(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (!form) return;
    
    const formData = new FormData(form);
    const template = templates.find(t => t.id === formData.get('certificateId'));
    if (!template) {
      alert('اختر قالب الشهادة أولاً');
      return;
    }

    setPreviewData({
      certificateId: template.id,
      certificateTitle: template.title,
      certificateBody: template.certificateBody,
      certificateOpeningText: template.certificateOpeningText,
      certificateClosingText: template.certificateClosingText,
      courseTitle: template.course.title,
      
      participantName: formData.get('recipientFullName') as string || 'الاسم غير مدخل',
      participantDegree: formData.get('recipientTitle') as string || null,
      participantFaculty: formData.get('recipientFaculty') as string || null,
      participantDepartment: formData.get('recipientDepartment') as string || null,
      participantOrganization: formData.get('recipientOrganization') as string || null,
      
      issueDate: formData.get('issueDate') as string || new Date().toLocaleDateString('ar-EG'),
      trainingHours: formData.get('trainingHours') ? parseInt(formData.get('trainingHours') as string) : null,
      grade: formData.get('grade') as string || null,
      completionDate: formData.get('completionDate') as string || null,
      
      issuerName: template.issuerName,
      universityName: template.universityName,
      platformName: template.platformName,
      
      logoUrl: template.logoAsset?.relativePath || null,
      sealUrl: template.sealAsset?.relativePath || null,
      firstSignatureUrl: template.firstSignatureAsset?.relativePath || null,
      secondSignatureUrl: template.secondSignatureAsset?.relativePath || null,
      
      firstSignerName: formData.get('firstSignerName') as string || template.firstSignerName,
      firstSignerTitle: formData.get('firstSignerTitle') as string || template.firstSignerTitle,
      secondSignerName: formData.get('secondSignerName') as string || template.secondSignerName,
      secondSignerTitle: formData.get('secondSignerTitle') as string || template.secondSignerTitle,
      
      primaryColor: template.primaryColor,
      secondaryColor: template.secondaryColor,
      
      showSerialNumber: template.showSerialNumber,
      showVerificationCode: template.showVerificationCode,
      showIssueDate: template.showIssueDate,
      showTrainingHours: template.showTrainingHours,
      showGrade: template.showGrade,
      
      isAdminPreview: true
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto fade-in p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition text-2xl"
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          إصدار شهادة جديدة
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-bold">{error}</div>}
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">1. الدورة والقالب</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">الدورة <span className="text-red-500">*</span></label>
                <select 
                  required 
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    setSelectedTemplateId('');
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white" 
                >
                  <option value="" disabled>اختر الدورة...</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">قالب الشهادة <span className="text-red-500">*</span></label>
                <select 
                  required 
                  name="certificateId"
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white disabled:opacity-50" 
                  disabled={!selectedCourseId}
                >
                  <option value="" disabled>اختر القالب...</option>
                  {availableTemplates.map(template => (
                    <option key={template.id} value={template.id} disabled={template.isSuspended}>
                      {template.title} {template.isSuspended ? '(معلق)' : ''}
                    </option>
                  ))}
                </select>
                {selectedCourseId && availableTemplates.length === 0 && (
                  <p className="text-red-500 text-xs mt-1">لا توجد قوالب منشورة لهذه الدورة.</p>
                )}
              </div>
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

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">اللقب أو الدرجة العلمية</label>
                <input 
                  name="recipientTitle" 
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                  placeholder="مثال: دكتور، مهندس..."
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">البريد الإلكتروني</label>
                <input 
                  name="recipientEmail" 
                  type="email" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-left" dir="ltr"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">الكلية</label>
                <input 
                  name="recipientFaculty" 
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">الجهة أو المؤسسة</label>
                <input 
                  name="recipientOrganization" 
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">3. تفاصيل الشهادة</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">تاريخ إتمام الدورة</label>
                <input 
                  name="completionDate" 
                  type="date" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">عدد الساعات التدريبية</label>
                <input 
                  name="trainingHours" 
                  type="number" min="1" max="10000"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">التقدير أو النتيجة</label>
                <input 
                  name="grade" 
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">ملاحظات إدارية (لا تظهر في الشهادة)</label>
                <input 
                  name="notes" 
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">4. تخصيص التوقيعات والأختام (اختياري)</h4>
            <p className="text-sm text-gray-500 mb-4">في حال عدم إرفاق صور جديدة هنا، سيتم استخدام التوقيعات والأختام الافتراضية المحفوظة في قالب الشهادة المختار.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">ختم مخصص للشهادة</label>
                <input 
                  name="sealFile" 
                  type="file" accept="image/*"
                  className="w-full px-4 py-2 border rounded-lg outline-none bg-white" 
                />
              </div>

              <div>
                <h5 className="font-bold text-gray-700 mb-2 border-b pb-1">التوقيع الأول</h5>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-600 text-xs font-bold mb-1">تخصيص اسم الموقِّع الأول</label>
                    <input name="firstSignerName" type="text" className="w-full px-3 py-1.5 border rounded" placeholder="يستبدل الاسم في القالب" />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-bold mb-1">تخصيص المسمى الوظيفي</label>
                    <input name="firstSignerTitle" type="text" className="w-full px-3 py-1.5 border rounded" placeholder="يستبدل المسمى في القالب" />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-bold mb-1">صورة التوقيع الأول المخصصة</label>
                    <input name="firstSignatureFile" type="file" accept="image/*" className="w-full px-3 py-1.5 border rounded bg-white text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-gray-700 mb-2 border-b pb-1">التوقيع الثاني</h5>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-600 text-xs font-bold mb-1">تخصيص اسم الموقِّع الثاني</label>
                    <input name="secondSignerName" type="text" className="w-full px-3 py-1.5 border rounded" placeholder="يستبدل الاسم في القالب" />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-bold mb-1">تخصيص المسمى الوظيفي</label>
                    <input name="secondSignerTitle" type="text" className="w-full px-3 py-1.5 border rounded" placeholder="يستبدل المسمى في القالب" />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-bold mb-1">صورة التوقيع الثاني المخصصة</label>
                    <input name="secondSignatureFile" type="file" accept="image/*" className="w-full px-3 py-1.5 border rounded bg-white text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 border-t pt-5">
            <button 
              type="button"
              onClick={handlePreview}
              className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold py-2 px-6 rounded-lg hover:bg-indigo-100 transition"
            >
              👁️ معاينة قبل الإصدار
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
