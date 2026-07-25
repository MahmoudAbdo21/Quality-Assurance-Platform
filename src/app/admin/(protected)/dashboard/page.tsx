import { prisma } from "@/lib/prisma"

export default async function AdminDashboardPage() {
  const [
    coursesCount,
    activeCoursesCount,
    suspendedCoursesCount,
    unpublishedCoursesCount,
    certificatesCount,
    registrationsCount,
    messagesCount,
    topicsCount,
    commentsCount,
    likesCount,
    subscribersCount,
    latestRegistrations,
    latestMessages
  ] = await Promise.all([
    prisma.course.count(),
    prisma.course.count({ where: { isPublished: true, isSuspended: false } }),
    prisma.course.count({ where: { isSuspended: true } }),
    prisma.course.count({ where: { isPublished: false } }),
    prisma.certificate.count(),
    prisma.courseRegistration.count(),
    prisma.contactMessage.count({ where: { status: 'NEW' } }),
    prisma.forumTopic.count(),
    prisma.forumComment.count(),
    prisma.forumLike.count(),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    prisma.courseRegistration.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { course: true }
    }),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      where: { status: 'NEW' }
    })
  ]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">لوحة التحكم السريعة</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
          <p className="text-blue-600 text-sm font-bold mb-1">إجمالي الدورات</p>
          <p className="text-3xl font-black text-blue-900">{coursesCount}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
          <p className="text-green-600 text-sm font-bold mb-1">دورات نشطة</p>
          <p className="text-3xl font-black text-green-900">{activeCoursesCount}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
          <p className="text-red-600 text-sm font-bold mb-1">دورات معلقة</p>
          <p className="text-3xl font-black text-red-900">{suspendedCoursesCount}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm font-bold mb-1">دورات غير منشورة</p>
          <p className="text-3xl font-black text-gray-900">{unpublishedCoursesCount}</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm">
          <p className="text-yellow-700 text-sm font-bold mb-1">الشهادات</p>
          <p className="text-3xl font-black text-yellow-900">{certificatesCount}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm">
          <p className="text-purple-600 text-sm font-bold mb-1">طلبات التسجيل</p>
          <p className="text-3xl font-black text-purple-900">{registrationsCount}</p>
        </div>
        <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 shadow-sm relative">
          {messagesCount > 0 && <span className="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>}
          <p className="text-pink-600 text-sm font-bold mb-1">رسائل جديدة</p>
          <p className="text-3xl font-black text-pink-900">{messagesCount}</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm">
          <p className="text-indigo-600 text-sm font-bold mb-1">المشتركين (النشرة)</p>
          <p className="text-3xl font-black text-indigo-900">{subscribersCount}</p>
        </div>
        
        <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 shadow-sm">
          <p className="text-teal-600 text-sm font-bold mb-1">النقاشات</p>
          <p className="text-3xl font-black text-teal-900">{topicsCount}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-sm">
          <p className="text-orange-600 text-sm font-bold mb-1">التعليقات</p>
          <p className="text-3xl font-black text-orange-900">{commentsCount}</p>
        </div>
        <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100 shadow-sm">
          <p className="text-cyan-600 text-sm font-bold mb-1">الإعجابات</p>
          <p className="text-3xl font-black text-cyan-900">{likesCount}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="border rounded-xl p-4 shadow-sm bg-white">
          <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">أحدث التسجيلات</h3>
          {latestRegistrations.length === 0 ? <p className="text-sm text-gray-500">لا يوجد تسجيلات بعد</p> : (
            <ul className="space-y-3">
              {latestRegistrations.map((reg: any) => (
                <li key={reg.id} className="text-sm">
                  <span className="font-bold">{reg.fullName}</span> سجل في <span className="text-gray-500">{reg.course.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="border rounded-xl p-4 shadow-sm bg-white">
          <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">أحدث الرسائل الواردة</h3>
          {latestMessages.length === 0 ? <p className="text-sm text-gray-500">لا يوجد رسائل جديدة</p> : (
            <ul className="space-y-3">
              {latestMessages.map((msg: any) => (
                <li key={msg.id} className="text-sm">
                  <span className="font-bold">{msg.fullName}:</span> {msg.message.substring(0, 50)}...
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
