import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth-helpers';
import CertificateDocument from '@/components/certificates/CertificateDocument';

export const runtime = "nodejs";

export default async function AdminCertificatePreviewPage({ params }: { params: { certificateId: string } }) {
  await requireAdmin();
  const { certificateId } = await params;
  
  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: { course: true }
  });

  if (!certificate) {
    return (
      <div className="p-8 text-center" dir="rtl">
        <h1 className="text-2xl font-bold text-red-600 mb-4">الشهادة غير موجودة</h1>
        <p className="text-gray-600 mb-6">عذراً، لم نتمكن من العثور على الشهادة المطلوبة.</p>
        <Link href="/admin/certificates" className="text-green-600 hover:underline font-bold">
          العودة لإدارة الشهادات
        </Link>
      </div>
    );
  }

  const documentData = {
    certificateId: certificate.id,
    certificateTitle: certificate.title,
    certificateBody: certificate.certificateBody,
    courseTitle: certificate.course?.title || 'دورة غير محددة',
    participantName: 'اسم المتدرب للمعاينة',
    issueDate: new Date().toLocaleDateString('ar-EG'),
    isAdminPreview: true
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl fade-in" dir="rtl">
      <div className="mb-6 flex justify-between items-center no-print bg-white p-4 rounded-xl shadow-sm">
        <Link href="/admin/certificates" className="text-gray-500 hover:text-green-600 font-bold transition flex items-center gap-2">
          <span>&rarr;</span> العودة لإدارة الشهادات
        </Link>
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-bold shadow-sm border border-red-200">
          معاينة إدارية للمسار البديل
        </div>
      </div>

      <div className="flex justify-center overflow-x-auto p-4 bg-gray-100 rounded-xl print:bg-transparent print:p-0">
        <div className="transform origin-top scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 print:scale-100 min-w-[1122px]">
          <CertificateDocument data={documentData} />
        </div>
      </div>
    </div>
  );
}
