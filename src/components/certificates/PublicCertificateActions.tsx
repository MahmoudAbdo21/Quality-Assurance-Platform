"use client";

import React, { useState } from 'react';
import CertificatePreviewModal from './CertificatePreviewModal';
import type { CertificateDocumentData } from './CertificateDocument';
import { getPublicCertificatePreview } from '@/actions/certificates';

type Props = {
  certificateId: string;
  isSuspended: boolean;
};

export default function PublicCertificateActions({ certificateId, isSuspended }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CertificateDocumentData | null>(null);
  const [error, setError] = useState('');

  if (isSuspended) {
    return (
      <div className="bg-red-50 text-red-600 font-bold py-3 px-4 rounded-xl text-center w-full mt-4 select-none border border-red-200">
        ⚠️ قالب معلق
      </div>
    );
  }

  async function handleOpen() {
    setIsLoading(true);
    setError('');
    
    if (!data) {
      const result = await getPublicCertificatePreview(certificateId);
      if (result.error || !result.data) {
        setError(result.error || 'حدث خطأ غير معروف');
        setIsLoading(false);
        return;
      }
      setData(result.data);
    }
    
    setIsOpen(true);
    setIsLoading(false);
  }

  return (
    <div className="mt-6">
      {error && <div className="text-red-500 font-bold text-sm mb-3 text-center bg-red-50 p-2 rounded">{error}</div>}
      
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button 
          onClick={handleOpen}
          disabled={isLoading}
          className="flex-1 bg-white text-[#15803D] border-2 border-[#15803D] font-bold py-3 rounded-xl hover:bg-green-50 transition flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? 'جاري التحميل...' : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              معاينة نموذج الشهادة
            </>
          )}
        </button>
      </div>

      {data && (
        <CertificatePreviewModal 
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          data={data}
        />
      )}
    </div>
  );
}
