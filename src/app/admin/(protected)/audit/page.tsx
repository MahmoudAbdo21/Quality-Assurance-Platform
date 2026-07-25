import { prisma } from "@/lib/prisma"

export default async function AdminAuditPage() {
  // Let's also fetch AdminUsers for join since AuditLog only stores adminUserId (optional)
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100 // limit to last 100 for performance
  })

  // Group by adminUserId to easily show names, if we want. But the schema is simple.
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">سجل عمليات النظام (Audit Log)</h2>
        <span className="text-sm text-gray-500">عرض أحدث 100 عملية</span>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 font-bold border-b">التاريخ والوقت</th>
              <th className="p-4 font-bold border-b">العملية</th>
              <th className="p-4 font-bold border-b">النوع</th>
              <th className="p-4 font-bold border-b">التفاصيل</th>
              <th className="p-4 font-bold border-b">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">لا توجد سجلات حالياً</td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-500 whitespace-nowrap" dir="ltr">
                    {log.createdAt.toLocaleString('ar-EG')}
                  </td>
                  <td className="p-4 font-semibold text-gray-800">{log.action}</td>
                  <td className="p-4 text-gray-600 font-mono text-xs">{log.entityType}</td>
                  <td className="p-4 text-gray-700">{log.summary}</td>
                  <td className="p-4 text-gray-400 font-mono text-xs" dir="ltr">{log.ipAddress || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
