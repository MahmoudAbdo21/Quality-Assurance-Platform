import { prisma } from "@/lib/prisma"
import CourseManager from "@/components/admin/CourseManager"

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { displayOrder: 'asc' },
    include: { _count: { select: { registrations: true } } }
  })

  return (
    <div>
      <CourseManager courses={courses} />
    </div>
  )
}
