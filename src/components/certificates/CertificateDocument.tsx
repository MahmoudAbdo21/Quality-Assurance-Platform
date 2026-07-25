import React from 'react';
import Image from 'next/image';

export type CertificateDocumentData = {
  certificateTitle: string;
  courseTitle: string;
  
  participantName: string;
  participantDegree?: string | null;
  
  issueDate: string;
  verificationCode?: string | null;
  isRevoked?: boolean;
  
  isAdminPreview: boolean;
};

export default function CertificateDocument({ data, id = 'certificate-node' }: { data: CertificateDocumentData; id?: string }) {
  const primaryGreen = '#15803d'; // Emerald 700
  const darkGold = '#b45309'; // Amber 700

  return (
    <div 
      id={id}
      dir="rtl"
      className="relative bg-white overflow-hidden mx-auto print:shadow-none print:m-0"
      style={{
        width: '1122px', // A4 Landscape
        height: '793px',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div 
        className="w-full h-full border-[12px] border-double p-8 sm:p-12 text-center bg-[#fffdf9] relative" 
        style={{ borderColor: primaryGreen }}
      >
        <div className="absolute inset-2 border-2 border-yellow-500 pointer-events-none"></div>
        
        {data.isAdminPreview && (
          <div className="absolute top-16 left-0 right-0 text-center z-50 pointer-events-none rotate-[-15deg] opacity-20">
            <span className="text-8xl font-black text-red-500 border-8 border-red-500 rounded-2xl p-4">معاينة قبل الإصدار</span>
          </div>
        )}

        {data.isRevoked && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            <span className="text-8xl font-black text-red-600 border-8 border-red-600 rounded-2xl p-6 rotate-[-20deg] opacity-60">ملغاة</span>
          </div>
        )}

        <div className="mb-12 mt-8">
          <div className="relative w-28 h-28 mx-auto mb-6">
            <Image src="/brand/quality-accreditation-logo.svg" alt="Logo" fill className="object-contain" />
          </div>
          <h2 className="text-4xl font-bold mb-3" style={{ color: primaryGreen }}>{data.certificateTitle || 'شهادة اجتياز دورة تدريبية'}</h2>
          <p className="text-lg text-gray-500 tracking-widest font-bold">جامعة الأزهر - مركز ضمان الجودة</p>
        </div>

        <div className="text-2xl leading-loose mb-16 px-16 text-gray-800">
          تشهد المنصة بأن المتدرب/ة
          <br/>
          <span className="font-bold text-4xl px-4 text-green-700 block my-4">{data.participantDegree ? `${data.participantDegree} / ` : ''}{data.participantName}</span>
          قد اجتاز بنجاح متطلبات الدورة التدريبية بعنوان:
          <br/>
          <div className="text-3xl font-bold my-6 border-b-2 border-dashed inline-block px-8 pb-2" style={{ color: darkGold, borderColor: darkGold }}>
            {data.courseTitle}
          </div>
          <br/>
          وذلك بواقع إتمام كافة الساعات التدريبية والتطبيقات العملية المقررة.
        </div>

        <div className="flex justify-between items-end mt-20 px-16 text-lg font-bold text-gray-700 absolute bottom-16 left-0 right-0">
          <div className="text-center">
            <div className="mb-4 h-16 relative w-48">
              {/* Optional: Static signature image can go here */}
            </div>
            <div className="border-t-2 border-gray-400 pt-2 w-48">مدير المركز</div>
          </div>
          
          <div className="text-center flex flex-col items-center">
            <div className="w-32 h-32 border-4 border-red-500/30 rounded-full flex items-center justify-center text-red-500 font-bold rotate-12 opacity-80 mb-2">
              ختم الاعتماد
            </div>
            <div className="text-sm text-gray-500 font-normal mt-2">
              تاريخ الإصدار: {data.issueDate}
              <br/>
              {data.verificationCode && <span className="text-xs">كود: {data.verificationCode}</span>}
            </div>
          </div>
          
          <div className="text-center">
            <div className="mb-4 h-16 relative w-48">
              {/* Optional: Static signature image can go here */}
            </div>
            <div className="border-t-2 border-gray-400 pt-2 w-48">رئيس الجامعة</div>
          </div>
        </div>
      </div>
    </div>
  );
}
