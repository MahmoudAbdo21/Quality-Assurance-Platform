import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function AdminCertificatePreviewPage({ params }: { params: { certificateId: string } }) {
  const { certificateId } = await params;
  
  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: { course: true }
  });

  if (!certificate) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl fade-in" dir="rtl">
      <div className="mb-6 flex justify-between items-center no-print">
        <Link href="/admin/certificates" className="text-gray-500 hover:text-green-600 font-bold transition">
          &rarr; العودة لإدارة الشهادات
        </Link>
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold shadow-sm">
          معاينة إدارية
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold shadow transition cursor-not-allowed opacity-50">
          طباعة الشهادة (للمعاينات فقط)
        </button>
      </div>

      <div className="bg-white border-8 border-[var(--primary-green)] p-12 relative overflow-hidden shadow-2xl printable-certificate min-h-[600px] flex flex-col justify-center text-center">
        {/* Certificate Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-gold)] opacity-20 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--accent-gold)] opacity-20 rounded-tr-full"></div>
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-[var(--primary-green)] mb-2">{certificate.title}</h2>
          <p className="text-xl font-bold text-[var(--accent-gold)]">{certificate.course.title}</p>
        </div>

        {/* Body */}
        <div className="text-2xl text-gray-800 leading-loose mb-12 relative z-10 font-medium">
          {certificate.certificateBody.split('\n').map((line, i) => (
            <p key={i} className="mb-4">
              {line
                .replace('[اسم_المتدرب]', 'اسم المتدرب')
                .replace('[تاريخ_الاصدار]', new Date().toLocaleDateString('ar-EG'))
              }
            </p>
          ))}
        </div>

        {/* Footer Signatures */}
        <div className="flex justify-between items-end mt-12 px-12 relative z-10">
          <div className="text-center">
            <div className="border-b-2 border-gray-400 w-48 mb-2"></div>
            <p className="font-bold text-gray-700">مدير المركز التدريبي</p>
          </div>
          
          <div className="text-center opacity-50">
            <div className="w-24 h-24 border-4 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-2 rotate-12">
              <span className="font-bold text-gray-300 text-sm">ختم الاعتماد</span>
            </div>
            <p className="font-bold text-gray-700 text-sm">نسخة للمعاينة</p>
          </div>

          <div className="text-center">
            <div className="border-b-2 border-gray-400 w-48 mb-2"></div>
            <p className="font-bold text-gray-700">رئيس الهيئة</p>
          </div>
        </div>
      </div>
    </div>
  );
}
