import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { displayOrder: 'asc' },
    include: { _count: { select: { registrations: true } } }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">إدارة الدورات التدريبية</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow font-bold transition">
          + إضافة دورة جديدة
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 border">عنوان الدورة</th>
              <th className="p-3 border">المسجلين</th>
              <th className="p-3 border">الحالة</th>
              <th className="p-3 border">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 font-semibold text-green-700">{course.title}</td>
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                    {course._count.registrations}
                  </span>
                </td>
                <td className="p-3">
                  {course.isPublished ? (
                    <span className="text-green-600 font-bold text-sm">منشورة ✅</span>
                  ) : (
                    <span className="text-gray-400 font-bold text-sm">مسودة 📝</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex space-x-2 space-x-reverse">
                    <button className="text-blue-500 hover:text-blue-700 text-sm border border-blue-500 rounded px-2 py-1">تعديل</button>
                    <button className="text-red-500 hover:text-red-700 text-sm border border-red-500 rounded px-2 py-1">حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
