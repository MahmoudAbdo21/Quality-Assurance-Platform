import { verifyCertificateAction } from '@/actions/public-certificate-verification';
import VerifiedCertificateActions from '@/components/certificates/VerifiedCertificateActions';
import Link from 'next/link';

export default async function VerifyCertificatePage({
  searchParams
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token;
  
  if (!token) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border-2 border-red-100 max-w-lg w-full">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">بيانات غير مكتملة</h2>
          <p className="text-gray-600 mb-6">الرجاء تقديم كود التحقق.</p>
          <Link href="/certificates" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition">
            العودة لصفحة الشهادات
          </Link>
        </div>
      </div>
    );
  }

  const result = await verifyCertificateAction(token);

  if (result.error) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border-2 border-red-100 max-w-lg w-full">
          <div className="text-5xl mb-4 text-red-500">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">شهادة غير صالحة</h2>
          <p className="text-red-600 font-bold mb-6">{result.error}</p>
          <Link href="/certificates" className="bg-gray-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-900 transition">
            العودة لصفحة الشهادات
          </Link>
        </div>
      </div>
    );
  }

  if (result.revoked) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border-2 border-red-200 max-w-lg w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-600 text-white px-12 py-1 transform translate-x-8 -translate-y-2 rotate-45 text-sm font-bold shadow-md">
            ملغاة
          </div>
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">هذه الشهادة ملغاة</h2>
          <p className="text-gray-500 text-sm mb-4">سبب الإلغاء: {result.revocationReason || 'غير محدد'}</p>
          <p className="text-gray-500 text-sm mb-6">
            تم إلغاء هذه الشهادة بتاريخ {result.revokedAt ? new Date(result.revokedAt).toLocaleDateString('ar-EG') : ''}.
          </p>
          <Link href="/certificates" className="bg-gray-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-900 transition">
            العودة لصفحة الشهادات
          </Link>
        </div>
      </div>
    );
  }

  const award = result.award!;

  const data = {
    certificateTitle: award.certificate.title,
    courseTitle: award.certificate.course.title,
    
    participantName: award.recipientFullName,
    participantDegree: award.recipientDegree,
    
    issueDate: new Date(award.issueDate).toLocaleDateString('ar-EG'),
    verificationCode: award.verificationToken,
    
    isAdminPreview: false
  };

  return (
    <div className="container mx-auto px-4 py-12 fade-in">
      <div className="text-center mb-8">
        <div className="inline-block bg-green-100 text-green-800 px-6 py-2 rounded-full font-bold text-lg mb-6 border-2 border-green-200 shadow-sm">
          ✅ شهادة موثقة وصحيحة
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">معلومات الشهادة</h2>
        <p className="text-gray-500">تم التحقق من صحة هذه الشهادة من سجلات منصة ضمان الجودة</p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="block text-gray-500 text-sm mb-1">اسم المستفيد</span>
                <strong className="text-xl text-gray-900">{award.recipientDegree ? `${award.recipientDegree}/ ` : ''}{award.recipientFullName}</strong>
              </div>
              <div>
                <span className="block text-gray-500 text-sm mb-1">الدورة التدريبية</span>
                <strong className="text-lg text-[#15803D]">{award.certificate.course.title}</strong>
              </div>
              <div>
                <span className="block text-gray-500 text-sm mb-1">عنوان الشهادة</span>
                <strong className="text-md text-gray-800">{award.certificate.title}</strong>
              </div>
            </div>
            
            <div className="space-y-4 md:border-r md:pr-6 border-gray-100">
              <div>
                <span className="block text-gray-500 text-sm mb-1">كود التحقق</span>
                <strong className="text-lg font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded border inline-block">{award.verificationToken}</strong>
              </div>
              <div>
                <span className="block text-gray-500 text-sm mb-1">تاريخ الإصدار</span>
                <strong className="text-md text-gray-800">{new Date(award.issueDate).toLocaleDateString('ar-EG')}</strong>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-center gap-4">
          <VerifiedCertificateActions data={data} />
        </div>
      </div>
    </div>
  );
}
