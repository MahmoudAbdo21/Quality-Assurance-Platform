import { prisma } from '@/lib/prisma';

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="container mx-auto px-4 py-12 fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[var(--primary-green)] mb-4 border-b-2 border-[var(--accent-gold)] inline-block pb-2">عن المنصة</h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
          {settings?.aboutIntro || 'منصة أكاديمية رائدة مخصصة لنشر ثقافة الجودة الشاملة والاعتماد المؤسسي وفقاً لأعلى المعايير الوطنية والدولية.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-md border-r-4 border-[var(--primary-green)]">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-2xl ml-4">
              👁️
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{settings?.visionTitle || 'رؤيتنا'}</h3>
          </div>
          <p className="text-gray-600 leading-relaxed text-lg">
            {settings?.visionContent || 'الريادة والتميز في تمكين المؤسسات التعليمية والأكاديمية من تطبيق أعلى معايير الجودة الشاملة والاعتماد الأكاديمي للوصول إلى مستويات التنافسية العالمية.'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md border-r-4 border-[var(--accent-gold)]">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-2xl ml-4">
              🎯
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{settings?.missionTitle || 'رسالتنا'}</h3>
          </div>
          <p className="text-gray-600 leading-relaxed text-lg">
            {settings?.missionContent || 'توفير برامج تدريبية متطورة، ونظم تقييم دقيقة، وبيئة تفاعلية متكاملة للارتقاء بمهارات الكوادر الأكاديمية وبناء مجتمع معرفي قائم على التحسين المستمر والتميز المؤسسي.'}
          </p>
        </div>
      </div>
    </div>
  );
}
