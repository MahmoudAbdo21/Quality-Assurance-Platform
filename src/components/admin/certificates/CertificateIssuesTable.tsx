"use client";

import { useState } from 'react';
import { revokeCertificateIssue } from '@/actions/admin-certificate-issues';
import type { CertificateIssue, Certificate, Course } from '@prisma/client';
import CertificatePreviewModal from '@/components/certificates/CertificatePreviewModal';
import IssueCertificateDialog from './IssueCertificateDialog';
import type { CertificateDocumentData } from '@/components/certificates/CertificateDocument';

type IssueWithRelations = CertificateIssue & { certificate: Certificate & { course: Course } };
type TemplateWithCourse = Certificate & { course: Course };

export default function CertificateIssuesTable({ 
  issues, 
  templates,
  courses 
}: { 
  issues: IssueWithRelations[],
  templates: TemplateWithCourse[],
  courses: Course[] 
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewData, setPreviewData] = useState<CertificateDocumentData | null>(null);

  async function handleRevoke(id: string) {
    const reason = prompt('الرجاء إدخال سبب إلغاء الشهادة:');
    if (reason === null) return;
    if (reason.trim().length < 5) {
      alert('يجب إدخال سبب واضح للإلغاء (5 أحرف على الأقل).');
      return;
    }
    
    if (confirm('هل أنت متأكد من إلغاء هذه الشهادة؟ لا يمكن التراجع عن هذه الخطوة، وستظهر كملغاة عند التحقق منها.')) {
      const result = await revokeCertificateIssue(id, reason);
      if (result.error) alert(result.error);
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">الشهادات الصادرة</h2>
        <button onClick={() => setIsDialogOpen(true)} className="bg-[#15803D] hover:bg-[#166534] text-white px-6 py-2 rounded-lg shadow-md font-bold transition">
          + إصدار شهادة جديدة
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-right border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 font-bold border-b">الرقم التسلسلي</th>
              <th className="p-4 font-bold border-b">اسم المستفيد</th>
              <th className="p-4 font-bold border-b">الدورة</th>
              <th className="p-4 font-bold border-b">تاريخ الإصدار</th>
              <th className="p-4 font-bold border-b text-center">الحالة</th>
              <th className="p-4 font-bold border-b">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {issues.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">لا توجد شهادات صادرة حالياً</td>
              </tr>
            ) : (
              issues.map(issue => (
                <tr key={issue.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-mono text-sm text-gray-600">{issue.serialNumber}</td>
                  <td className="p-4 font-semibold text-gray-800">{issue.recipientFullName}</td>
                  <td className="p-4 text-gray-600 max-w-[200px] truncate" title={issue.courseTitleSnapshot}>
                    {issue.courseTitleSnapshot}
                  </td>
                  <td className="p-4 text-gray-600">{new Date(issue.issueDate).toLocaleDateString('ar-EG')}</td>
                  <td className="p-4 text-center">
                    {issue.status === 'ISSUED' ? (
                      <span className="text-green-700 font-bold text-xs bg-green-50 px-2 py-1 rounded-full border border-green-200">صادرة ✅</span>
                    ) : issue.status === 'REVOKED' ? (
                      <span className="text-red-700 font-bold text-xs bg-red-50 px-2 py-1 rounded-full border border-red-200" title={`السبب: ${issue.revocationReason}`}>ملغاة ❌</span>
                    ) : (
                      <span className="text-gray-500 font-bold text-xs bg-gray-100 px-2 py-1 rounded-full">مسودة</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setPreviewData({
                            certificateId: issue.certificateId,
                            certificateTitle: issue.certificateTitleSnapshot,
                            certificateBody: issue.certificateBodySnapshot,
                            courseTitle: issue.courseTitleSnapshot,
                            participantName: issue.recipientFullName,
                            participantDegree: issue.recipientTitle,
                            issueDate: new Date(issue.issueDate).toLocaleDateString('ar-EG'),
                            trainingHours: issue.trainingHours,
                            grade: issue.grade,
                            completionDate: issue.completionDate ? new Date(issue.completionDate).toLocaleDateString('ar-EG') : null,
                            serialNumber: issue.serialNumber,
                            verificationCode: issue.verificationToken,
                            status: issue.status,
                            isAdminPreview: true
                          });
                        }}
                        className="bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition text-xs rounded px-3 py-1.5 font-bold border border-indigo-200"
                        title="معاينة"
                      >
                        👁️ عرض
                      </button>
                      <button 
                        onClick={() => {
                          const link = `${window.location.origin}/certificates/verify?token=${issue.verificationToken}`;
                          navigator.clipboard.writeText(link);
                          alert('تم نسخ رابط التحقق بنجاح');
                        }}
                        className="bg-gray-50 text-gray-700 hover:bg-gray-600 hover:text-white transition text-xs rounded px-3 py-1.5 font-bold border border-gray-200"
                        title="نسخ الرابط"
                      >
                        🔗 نسخ الرابط
                      </button>
                      {issue.status === 'ISSUED' && (
                        <button 
                          onClick={() => handleRevoke(issue.id)} 
                          className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition text-xs rounded px-3 py-1.5 font-bold border border-red-200"
                        >
                          إلغاء
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <IssueCertificateDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        templates={templates}
        courses={courses}
      />

      {previewData && (
        <CertificatePreviewModal 
          isOpen={!!previewData}
          onClose={() => setPreviewData(null)}
          data={previewData}
        />
      )}
    </>
  );
}
