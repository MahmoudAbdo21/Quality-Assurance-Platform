import { prisma } from '@/lib/prisma';
import KnowledgeSlider from '@/components/public/KnowledgeSlider';

export default async function KnowMorePage() {
  const slides = await prisma.knowledgeSlide.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: 'asc' }
  });

  return (
    <div className="container mx-auto px-4 py-12 fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[var(--primary-green)] mb-4 border-b-2 border-[var(--accent-gold)] inline-block pb-2">تعرف أكثر (معلومات تهمك)</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          محطات معرفية سريعة تضيء لك الطريق نحو فهم أعمق لثقافة الجودة والاعتماد الأكاديمي.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <KnowledgeSlider slides={slides} />
      </div>
    </div>
  );
}
