import React from 'react';
import Image from 'next/image';

export type CertificateDocumentData = {
  certificateId: string;
  certificateTitle: string;
  certificateBody: string;
  courseTitle: string;
  participantName: string;
  participantDegree?: string | null;
  issueDate: string;
  verificationCode?: string | null;
  isAdminPreview: boolean;
};

export default function CertificateDocument({ data, id = 'certificate-node' }: { data: CertificateDocumentData; id?: string }) {
  return (
    <div 
      id={id}
      dir="rtl"
      className="relative bg-[#FDFBF7] p-12 overflow-hidden shadow-2xl flex flex-col justify-between text-center mx-auto print:shadow-none print:p-0 print:border-none"
      style={{
        width: '1122px', // A4 Landscape roughly
        height: '793px',
        maxWidth: '100%', // Allow scaling down visually in modal if needed via CSS transforms or container, though PDF needs exact px
        boxSizing: 'border-box'
      }}
    >
      {/* Background and Borders */}
      <div className="absolute inset-4 border-[12px] border-[#15803D] rounded-xl pointer-events-none z-0"></div>
      <div className="absolute inset-8 border-[4px] border-[#FBBF24] rounded-lg pointer-events-none z-0 opacity-80"></div>
      
      {/* Decorative Corners */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#15803D] opacity-10 rounded-bl-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#15803D] opacity-10 rounded-tr-full z-0 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#FBBF24] opacity-20 rounded-br-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#FBBF24] opacity-20 rounded-tl-full z-0 pointer-events-none"></div>

      {data.isAdminPreview && (
        <div className="absolute top-16 left-0 right-0 text-center z-50 pointer-events-none rotate-[-15deg] opacity-20">
          <span className="text-8xl font-black text-red-500 border-8 border-red-500 rounded-2xl p-4">معاينة إدارية</span>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center mt-6">
        <Image 
          src="/brand/quality-accreditation-logo.svg" 
          alt="الشعار"
          width={100}
          height={100}
          className="mb-2"
        />
        <p className="text-[#15803D] font-bold text-lg leading-tight">جامعة الأزهر</p>
        <p className="text-[#15803D] font-bold text-lg leading-tight">منصة ضمان الجودة والاعتماد الأكاديمي</p>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center flex-grow justify-center mt-4">
        <h1 className="text-5xl font-extrabold text-[#15803D] mb-8 pb-4 border-b-2 border-[#FBBF24] inline-block px-12">
          {data.certificateTitle}
        </h1>
        
        <p className="text-2xl text-gray-700 mb-4 font-medium">تشهد الهيئة بأن المتدرب</p>
        
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          {data.participantDegree ? `${data.participantDegree}/ ` : ''}{data.participantName}
        </h2>
        
        <div className="text-2xl text-gray-800 leading-loose max-w-4xl font-medium px-8 text-center whitespace-pre-wrap">
          {data.certificateBody
            .replace(/\[اسم_المتدرب\]/g, data.participantName)
            .replace(/\[تاريخ_الاصدار\]/g, data.issueDate)
          }
        </div>
        
        <p className="text-3xl font-bold text-[#FBBF24] mt-8 mb-4">
          {data.courseTitle}
        </p>
      </div>

      {/* Footer / Signatures */}
      <div className="relative z-10 flex justify-between items-end mb-6 px-24">
        <div className="text-center">
          <div className="border-b-2 border-gray-800 w-48 mb-2"></div>
          <p className="font-bold text-gray-800 text-xl">مدير المركز التدريبي</p>
        </div>
        
        <div className="text-center flex flex-col items-center justify-center">
          <div className="w-28 h-28 border-4 border-dashed border-[#FBBF24] rounded-full flex items-center justify-center mb-2 rotate-12 opacity-40">
            <span className="font-bold text-[#FBBF24] text-lg text-center leading-tight">ختم<br/>الاعتماد</span>
          </div>
          <p className="text-sm text-gray-500 font-bold">تاريخ الإصدار: {data.issueDate}</p>
          {data.verificationCode && (
            <p className="text-xs text-gray-400 mt-1">كود التحقق: {data.verificationCode}</p>
          )}
          {data.isAdminPreview && (
            <p className="text-red-500 font-bold text-sm mt-2">معاينة إدارية — غير صالحة للاستخدام</p>
          )}
        </div>

        <div className="text-center">
          <div className="border-b-2 border-gray-800 w-48 mb-2"></div>
          <p className="font-bold text-gray-800 text-xl">رئيس الجهة</p>
        </div>
      </div>
    </div>
  );
}
