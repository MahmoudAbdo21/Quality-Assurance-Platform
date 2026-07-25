"use client";

import { useState } from 'react';
import { revokeCertificate, deleteGrantedCertificate } from '@/actions/admin-certificates';
import type { CertificateAward, Certificate, Course } from '@prisma/client';
import CertificatePreviewModal from '@/components/certificates/CertificatePreviewModal';
import IssueCertificateDialog from './IssueCertificateDialog';
import type { CertificateDocumentData } from '@/components/certificates/CertificateDocument';

type AwardWithRelations = CertificateAward & { certificate: Certificate & { course: Course } };
type CertificateWithCourse = Certificate & { course: Course };

export default function CertificateIssuesTable({ 
  awards, 
  certificates,
}: { 
  awards: AwardWithRelations[],
  certificates: CertificateWithCourse[],
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
      const result = await revokeCertificate(id, reason);
      if (result.error) alert(result.error);
      else alert('تم الإلغاء بنجاح');
    }
  }

  async function handleDelete(id: string) {
    if (confirm('هل أنت متأكد من حذف هذه الشهادة الممنوحة؟ (تستخدم فقط في حالات الخطأ ولا يمكن التراجع عنها)')) {
      const result = await deleteGrantedCertificate(id);
      if (result.error) alert(result.error);
      else alert('تم الحذف بنجاح');
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">الشهادات الممنوحة</h2>
        <button onClick={() => setIsDialogOpen(true)} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg shadow-md font-bold transition">
          + منح شهادة لمستفيد
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-right border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 font-bold border-b">اسم المستفيد</th>
              <th className="p-4 font-bold border-b">الدرجة أو اللقب</th>
              <th className="p-4 font-bold border-b">الدورة</th>
              <th className="p-4 font-bold border-b">عنوان الشهادة</th>
              <th className="p-4 font-bold border-b">تاريخ الإصدار</th>
              <th className="p-4 font-bold border-b text-center">الحالة</th>
              <th className="p-4 font-bold border-b text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {awards.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">لا توجد شهادات ممنوحة حالياً</td>
              </tr>
            ) : (
              awards.map(award => (
                <tr key={award.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-semibold text-gray-800">{award.recipientFullName}</td>
                  <td className="p-4 text-gray-600">{award.recipientDegree || '-'}</td>
                  <td className="p-4 text-gray-600 truncate max-w-[150px]">{award.certificate.course.title}</td>
                  <td className="p-4 text-gray-600 truncate max-w-[150px]">{award.certificate.title}</td>
                  <td className="p-4 text-gray-600">{new Date(award.issueDate).toLocaleDateString('ar-EG')}</td>
                  <td className="p-4 text-center">
                    {!award.isRevoked ? (
                      <span className="text-green-700 font-bold text-xs bg-green-50 px-2 py-1 rounded border border-green-200">صحيحة ✅</span>
                    ) : (
                      <span className="text-red-700 font-bold text-xs bg-red-50 px-2 py-1 rounded border border-red-200" title={`السبب: ${award.revocationReason}`}>ملغاة ❌</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => {
                          setPreviewData({
                            certificateTitle: award.certificate.title,
                            courseTitle: award.certificate.course.title,
                            participantName: award.recipientFullName,
                            participantDegree: award.recipientDegree,
                            issueDate: new Date(award.issueDate).toLocaleDateString('ar-EG'),
                            verificationCode: award.verificationToken,
                            isRevoked: award.isRevoked,
                            isAdminPreview: true
                          });
                        }}
                        className="text-blue-600 hover:text-blue-800 transition text-sm font-bold px-2 py-1 bg-blue-50 rounded"
                        title="معاينة"
                      >
                        معاينة
                      </button>
                      <button 
                        onClick={() => {
                          const link = `${window.location.origin}/certificates/verify?token=${award.verificationToken}`;
                          navigator.clipboard.writeText(link);
                          alert('تم نسخ رابط التحقق بنجاح');
                        }}
                        className="text-gray-700 hover:text-gray-900 transition text-sm font-bold px-2 py-1 bg-gray-100 rounded"
                        title="نسخ الرابط"
                      >
                        نسخ الرابط
                      </button>
                      {!award.isRevoked && (
                        <button 
                          onClick={() => handleRevoke(award.id)} 
                          className="text-orange-600 hover:text-orange-800 transition text-sm font-bold px-2 py-1 bg-orange-50 rounded"
                        >
                          إلغاء
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(award.id)} 
                        className="text-red-600 hover:text-red-800 transition text-sm font-bold px-2 py-1 bg-red-50 rounded"
                      >
                        حذف
                      </button>
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
        certificates={certificates}
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
