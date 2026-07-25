import { prisma } from '@/lib/prisma';

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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {slides.map((slide, index) => (
          <div key={slide.id} className="modern-slide rounded-xl shadow-lg p-6 text-white border-b-4 border-[var(--accent-gold)] interactive-card hover:scale-105 transition-transform">
            <div className="text-4xl mb-4 opacity-80">
              {index % 4 === 0 ? '💡' : index % 4 === 1 ? '🎯' : index % 4 === 2 ? '🌟' : '📈'}
            </div>
            <h3 className="text-xl font-bold mb-3">{slide.title}</h3>
            <p className="text-green-50 text-sm leading-relaxed">
              {slide.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
