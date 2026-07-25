import { prisma } from '@/lib/prisma';
import PublicCertificateActions from '@/components/certificates/PublicCertificateActions';
import Link from 'next/link';

export default async function CertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'asc' },
    include: { course: true }
  });

  return (
    <div className="container mx-auto px-4 py-12 fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[var(--primary-green)] mb-4 border-b-2 border-[var(--accent-gold)] inline-block pb-2">الشهادات المعتمدة</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          شهادات موثقة ومعتمدة من الهيئة القومية لضمان جودة التعليم، تمنح للمتدربين الذين أتموا الدورات التدريبية بنجاح.
        </p>

        <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-indigo-50 max-w-xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">التحقق من شهادة</h3>
          <p className="text-gray-600 text-sm mb-6">أدخل كود التحقق أو الرقم التسلسلي الموجود على الشهادة</p>
          <form action="/certificates/verify" method="GET" className="flex flex-col sm:flex-row gap-3 relative z-20">
            <input 
              type="text" 
              name="token" 
              placeholder="كود التحقق أو الرقم التسلسلي..." 
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-lg shadow transition whitespace-nowrap z-20 relative cursor-pointer">
              تحقق من الشهادة
            </button>
          </form>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-r-4 border-[var(--primary-green)] pr-3">قوالب الشهادات المتاحة</h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {certificates.map(cert => (
          <div key={cert.id} className="bg-white rounded-xl shadow-md overflow-hidden interactive-card flex flex-col justify-between border-t-4 border-[var(--primary-green)]">
            <div className="p-6 relative flex-grow">
              <div className="text-4xl mb-4 text-[var(--accent-gold)]">
                📜
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--primary-green)]">
                {cert.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm mb-4">
                {cert.description}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">مرتبطة بدورة:</span>
                <p className="font-semibold text-sm text-[var(--secondary-green)]">{cert.course?.title}</p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <PublicCertificateActions 
                certificateId={cert.id}
                isSuspended={cert.isSuspended}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
