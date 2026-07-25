import { prisma } from "@/lib/prisma"

export default async function AdminRegistrationsPage() {
  const registrations = await prisma.courseRegistration.findMany({
    orderBy: { createdAt: 'desc' },
    include: { course: true }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">إدارة المسجلين</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 border">الاسم</th>
              <th className="p-3 border">الدورة</th>
              <th className="p-3 border">الكلية/القسم</th>
              <th className="p-3 border">الدرجة</th>
              <th className="p-3 border">تاريخ التسجيل</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(reg => (
              <tr key={reg.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 font-semibold text-gray-800">{reg.fullName}</td>
                <td className="p-3 text-green-700 font-bold">{reg.course.title}</td>
                <td className="p-3 text-gray-600">{reg.faculty} / {reg.department}</td>
                <td className="p-3">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                    {reg.promotionDegree}
                  </span>
                </td>
                <td className="p-3 text-gray-500" dir="ltr">{reg.createdAt.toLocaleDateString('ar-EG')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
