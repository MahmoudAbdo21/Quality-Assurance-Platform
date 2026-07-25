import { prisma } from '@/lib/prisma';
import { getVisitorId } from '@/lib/visitor';

export default async function CertificatesPage() {
  const visitorId = await getVisitorId();
  
  const certificates = await prisma.certificate.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: 'asc' },
    include: { course: true }
  });

  // Check user registrations to see if they unlocked the certificates
  const userRegistrations = await prisma.courseRegistration.findMany({
    where: { visitorId },
    select: { courseId: true }
  });
  
  const registeredCourseIds = new Set(userRegistrations.map(r => r.courseId));

  return (
    <div className="container mx-auto px-4 py-12 fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[var(--primary-green)] mb-4 border-b-2 border-[var(--accent-gold)] inline-block pb-2">الشهادات المعتمدة</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          شهادات موثقة ومعتمدة من الهيئة القومية لضمان جودة التعليم، تمنح للمتدربين الذين أتموا الدورات التدريبية بنجاح.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificates.map(cert => {
          const isUnlocked = registeredCourseIds.has(cert.courseId);
          return (
            <div key={cert.id} className={`bg-white rounded-xl shadow-md overflow-hidden interactive-card border-t-4 ${isUnlocked ? 'certificate-box unlocked' : 'border-t-gray-300'}`}>
              <div className="p-6 relative">
                {isUnlocked && (
                  <div className="absolute top-4 left-4 badge-unlocked text-xs font-bold px-3 py-1 rounded-full flex items-center">
                    <span className="mr-1">✅</span> تم الحصول عليها
                  </div>
                )}
                
                <div className={`text-4xl mb-4 ${isUnlocked ? 'text-[var(--accent-gold)]' : 'text-gray-300 grayscale'}`}>
                  📜
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isUnlocked ? 'text-[var(--primary-green)]' : 'text-gray-500'}`}>
                  {cert.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm mb-4">
                  {cert.description}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">مرتبطة بدورة:</span>
                  <p className="font-semibold text-sm text-[var(--secondary-green)]">{cert.course?.title}</p>
                </div>
                {isUnlocked ? (
                  <button className="mt-4 w-full bg-[var(--primary-green)] text-white py-2 rounded-lg font-bold hover:bg-[var(--secondary-green)] transition">
                    تحميل الشهادة
                  </button>
                ) : (
                  <div className="mt-4 text-xs text-gray-400 flex items-center justify-center border border-gray-200 py-2 rounded-lg bg-gray-50">
                    <span className="mr-2">🔒</span> مقفلة - تتطلب إتمام الدورة
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
