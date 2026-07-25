"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import CertificateDocument, { CertificateDocumentData } from './CertificateDocument';
import { downloadCertificatePdf } from '@/lib/certificate-pdf';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: CertificateDocumentData;
};

export default function CertificatePreviewModal({ isOpen, onClose, data }: Props) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  async function handleDownloadPdf() {
    setIsGeneratingPdf(true);
    setPdfError('');
    try {
      await downloadCertificatePdf('certificate-preview-node', `شهادة-${data.courseTitle}-${data.participantName}`);
    } catch (err: unknown) {
      setPdfError(err instanceof Error ? err.message : 'تعذر تجهيز ملف PDF، برجاء المحاولة مرة أخرى.');
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  const modalContent = (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="certificate-preview-title" 
      dir="rtl" 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-6 bg-black/80 backdrop-blur-sm print:bg-transparent print:p-0"
      onClick={onClose}
    >
      <div 
        className="bg-gray-100 rounded-xl shadow-2xl w-full max-w-[96vw] md:max-w-6xl max-h-[96vh] overflow-hidden flex flex-col print:bg-transparent print:shadow-none print:max-h-none print:overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Toolbar */}
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm z-10 print:hidden">
          <div className="flex items-center gap-4">
            <h2 id="certificate-preview-title" className="text-xl font-bold text-gray-800 line-clamp-1">
              {data.certificateTitle}
            </h2>
            {data.isAdminPreview && (
              <span className="bg-red-100 text-red-800 px-3 py-1 text-xs rounded-full font-bold">
                {data.status === 'REVOKED' ? 'شهادة ملغاة' : (data.serialNumber ? 'معاينة إدارية' : 'معاينة قالب')}
              </span>
            )}
            {data.status === 'REVOKED' && !data.isAdminPreview && (
              <span className="bg-red-600 text-white px-3 py-1 text-xs rounded-full font-bold">
                شهادة ملغاة
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition text-3xl leading-none"
            aria-label="إغلاق"
          >
            &times;
          </button>
        </div>

        {/* Certificate Scrollable Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center bg-gray-200 print:bg-transparent print:p-0 print:overflow-visible">
          <div className="transform-origin-top-center w-full max-w-[1123px] flex justify-center print:transform-none">
            <div className="scale-[0.35] sm:scale-[0.5] md:scale-[0.7] lg:scale-[0.9] xl:scale-100 origin-top flex justify-center print:scale-100 w-[1123px]">
              <CertificateDocument id="certificate-preview-node" data={data} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md z-10 print:hidden">
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 border rounded-lg hover:bg-gray-50 transition font-bold"
          >
            إغلاق
          </button>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 items-center">
            {pdfError && <span className="text-red-500 text-sm font-bold mr-4">{pdfError}</span>}
            
            {data.isAdminPreview && !data.serialNumber ? (
              <button 
                onClick={handlePrint}
                className="w-full sm:w-auto bg-[#15803D] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#166534] transition flex items-center justify-center gap-2 shadow-sm"
              >
                🖨️ طباعة نسخة المعاينة
              </button>
            ) : data.status !== 'REVOKED' ? (
              <>
                <button 
                  onClick={handlePrint}
                  className="w-full sm:w-auto bg-gray-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-900 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  🖨️ طباعة الشهادة
                </button>
                <button 
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="w-full sm:w-auto bg-[#15803D] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#166534] disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  {isGeneratingPdf ? '⏳ جاري التجهيز...' : '📥 تحميل PDF'}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
