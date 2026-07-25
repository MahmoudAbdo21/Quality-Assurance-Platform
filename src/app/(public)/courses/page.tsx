import { prisma } from '@/lib/prisma';
import CourseCard from '@/components/public/CourseCard';

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: 'asc' }
  });

  return (
    <div className="container mx-auto px-4 py-12 fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[var(--primary-green)] mb-4 border-b-2 border-[var(--accent-gold)] inline-block pb-2">
          البرامج والدورات التدريبية المعتمدة
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          اختر من بين مجموعة متميزة من البرامج التدريبية المصممة خصيصاً لتلبية احتياجات الكوادر الأكاديمية وتعزيز مهارات الجودة والاعتماد.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
