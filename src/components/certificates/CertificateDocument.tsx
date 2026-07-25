import React from 'react';
import Image from 'next/image';

export type CertificateDocumentData = {
  certificateId: string;
  certificateTitle: string;
  certificateBody: string;
  certificateOpeningText?: string | null;
  certificateClosingText?: string | null;
  courseTitle: string;
  
  participantName: string;
  participantDegree?: string | null;
  participantFaculty?: string | null;
  participantDepartment?: string | null;
  participantOrganization?: string | null;
  
  issueDate: string;
  verificationCode?: string | null;
  serialNumber?: string | null;
  status?: string | null;
  trainingHours?: number | null;
  grade?: string | null;
  completionDate?: string | null;
  
  issuerName?: string | null;
  universityName?: string | null;
  platformName?: string | null;
  
  logoUrl?: string | null;
  sealUrl?: string | null;
  firstSignatureUrl?: string | null;
  secondSignatureUrl?: string | null;
  
  firstSignerName?: string | null;
  firstSignerTitle?: string | null;
  secondSignerName?: string | null;
  secondSignerTitle?: string | null;
  
  primaryColor?: string | null;
  secondaryColor?: string | null;
  
  showSerialNumber?: boolean;
  showVerificationCode?: boolean;
  showIssueDate?: boolean;
  showTrainingHours?: boolean;
  showGrade?: boolean;

  isAdminPreview: boolean;
};

export default function CertificateDocument({ data, id = 'certificate-node' }: { data: CertificateDocumentData; id?: string }) {
  const primaryColor = data.primaryColor || '#15803D'; // Default green
  const secondaryColor = data.secondaryColor || '#FBBF24'; // Default gold
  
  const showSerial = data.showSerialNumber !== false;
  const showVerification = data.showVerificationCode !== false;
  const showIssueDate = data.showIssueDate !== false;
  const showTrainingHours = data.showTrainingHours !== false;
  const showGrade = data.showGrade !== false;

  return (
    <div 
      id={id}
      dir="rtl"
      className="relative bg-[#FDFBF7] p-12 overflow-hidden shadow-2xl flex flex-col justify-between text-center mx-auto print:shadow-none print:p-0 print:border-none"
      style={{
        width: '1122px', // A4 Landscape roughly
        height: '793px',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Background and Borders */}
      <div className="absolute inset-4 border-[12px] rounded-xl pointer-events-none z-0" style={{ borderColor: primaryColor }}></div>
      <div className="absolute inset-8 border-[4px] rounded-lg pointer-events-none z-0 opacity-80" style={{ borderColor: secondaryColor }}></div>
      
      {/* Decorative Corners */}
      <div className="absolute top-0 right-0 w-48 h-48 opacity-10 rounded-bl-full z-0 pointer-events-none" style={{ backgroundColor: primaryColor }}></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10 rounded-tr-full z-0 pointer-events-none" style={{ backgroundColor: primaryColor }}></div>
      <div className="absolute top-0 left-0 w-32 h-32 opacity-20 rounded-br-full z-0 pointer-events-none" style={{ backgroundColor: secondaryColor }}></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20 rounded-tl-full z-0 pointer-events-none" style={{ backgroundColor: secondaryColor }}></div>

      {data.isAdminPreview && !data.serialNumber && (
        <div className="absolute top-16 left-0 right-0 text-center z-50 pointer-events-none rotate-[-15deg] opacity-20">
          <span className="text-8xl font-black text-red-500 border-8 border-red-500 rounded-2xl p-4">معاينة قبل الإصدار — غير صالحة للاستخدام</span>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center mt-4">
        {data.logoUrl ? (
          <Image src={data.logoUrl} alt="الشعار" width={100} height={100} className="mb-2 object-contain" />
        ) : (
          <Image src="/brand/quality-accreditation-logo.svg" alt="الشعار" width={100} height={100} className="mb-2 object-contain" />
        )}
        <p className="font-bold text-lg leading-tight" style={{ color: primaryColor }}>{data.universityName || 'جامعة الأزهر'}</p>
        <p className="font-bold text-lg leading-tight" style={{ color: primaryColor }}>{data.platformName || 'منصة ضمان الجودة والاعتماد الأكاديمي'}</p>
      </div>

      {data.status === 'REVOKED' && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <span className="text-8xl font-black text-red-600 border-8 border-red-600 rounded-2xl p-6 rotate-[-20deg] opacity-60">ملغاة</span>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center flex-grow justify-center mt-2">
        <h1 className="text-5xl font-extrabold mb-4 pb-2 border-b-2 inline-block px-12" style={{ color: primaryColor, borderColor: secondaryColor }}>
          {data.certificateTitle}
        </h1>
        
        <p className="text-2xl text-gray-700 mb-4 font-medium">
          {data.certificateOpeningText || 'تشهد منصة ضمان الجودة والاعتماد الأكاديمي بأن'}
        </p>
        
        <h2 className="text-4xl font-bold text-gray-900 mb-2" style={{ overflowWrap: 'anywhere', wordBreak: 'normal', unicodeBidi: 'plaintext' }}>
          {data.participantDegree ? `${data.participantDegree}/ ` : ''}{data.participantName}
        </h2>

        {(data.participantFaculty || data.participantDepartment || data.participantOrganization) && (
          <p className="text-xl text-gray-600 mb-4 font-bold">
            {[data.participantFaculty, data.participantDepartment, data.participantOrganization].filter(Boolean).join(' - ')}
          </p>
        )}
        
        <div className="text-2xl text-gray-800 leading-loose max-w-4xl font-medium px-8 text-center whitespace-pre-wrap">
          {data.certificateBody
            .replace(/\[اسم_المتدرب\]/g, data.participantName)
            .replace(/\[تاريخ_الاصدار\]/g, data.issueDate)
          }
        </div>
        
        <p className="text-2xl text-gray-700 mt-4 mb-2 font-medium">
          {data.certificateClosingText || 'قد أتم/اجتاز بنجاح الدورة التدريبية'}
        </p>

        <p className="text-3xl font-bold mt-2 mb-4" style={{ color: secondaryColor }}>
          {data.courseTitle}
        </p>

        {( (showTrainingHours && data.trainingHours) || (showGrade && data.grade) || data.completionDate ) && (
          <div className="flex gap-6 mt-2 text-gray-700 font-bold bg-white/50 px-6 py-2 rounded-lg border" style={{ borderColor: secondaryColor }}>
            {showTrainingHours && data.trainingHours && <span>ساعات التدريب: {data.trainingHours}</span>}
            {data.completionDate && <span>تاريخ الإتمام: {data.completionDate}</span>}
            {showGrade && data.grade && <span>التقدير: {data.grade}</span>}
          </div>
        )}
      </div>

      {/* Footer / Signatures */}
      <div className="relative z-10 flex justify-between items-end mb-4 px-16 w-full">
        <div className="text-center w-48">
          {data.firstSignatureUrl && <Image src={data.firstSignatureUrl} alt="توقيع أول" width={150} height={60} className="mx-auto mb-2 object-contain" />}
          <div className="border-b-2 border-gray-800 w-full mb-2"></div>
          <p className="font-bold text-gray-800 text-lg">{data.firstSignerName || 'مدير المركز التدريبي'}</p>
          <p className="text-gray-600 text-sm">{data.firstSignerTitle || ''}</p>
        </div>
        
        <div className="text-center flex flex-col items-center justify-center">
          {data.sealUrl ? (
            <Image src={data.sealUrl} alt="الختم" width={120} height={120} className="mb-2 object-contain" />
          ) : (
            <div className="w-28 h-28 border-4 border-dashed rounded-full flex items-center justify-center mb-2 rotate-12 opacity-40" style={{ borderColor: secondaryColor }}>
              <span className="font-bold text-lg text-center leading-tight" style={{ color: secondaryColor }}>الختم</span>
            </div>
          )}
          {data.isAdminPreview && !data.sealUrl && (
            <p className="text-red-500 font-bold text-xs mt-1">لم تتم إضافة ختم للقالب</p>
          )}

          {showIssueDate && <p className="text-sm text-gray-500 font-bold mt-2">تاريخ الإصدار: {data.issueDate}</p>}
          {showSerial && data.serialNumber && (
            <p className="text-xs text-gray-600 font-bold mt-1">الرقم التسلسلي: {data.serialNumber}</p>
          )}
          {showVerification && data.verificationCode && (
            <p className="text-xs text-gray-400 mt-1">كود التحقق: {data.verificationCode}</p>
          )}
        </div>

        <div className="text-center w-48">
          {data.secondSignatureUrl && <Image src={data.secondSignatureUrl} alt="توقيع ثانٍ" width={150} height={60} className="mx-auto mb-2 object-contain" />}
          <div className="border-b-2 border-gray-800 w-full mb-2"></div>
          <p className="font-bold text-gray-800 text-lg">{data.secondSignerName || 'رئيس الجهة'}</p>
          <p className="text-gray-600 text-sm">{data.secondSignerTitle || ''}</p>
        </div>
      </div>
    </div>
  );
}
