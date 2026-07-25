import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CreateTopicDialog from '@/components/public/forum/CreateTopicDialog';
import LikeButton from '@/components/public/forum/LikeButton';
import { getVisitorId } from '@/lib/visitor';

export default async function ForumPage() {
  const visitorId = await getVisitorId();
  
  const topics = await prisma.forumTopic.findMany({
    where: { isVisible: true },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { 
          comments: {
            where: { isVisible: true }
          }, 
          likes: true 
        }
      },
      likes: {
        where: { visitorId }
      }
    }
  });

  return (
    <div className="container mx-auto px-4 py-12 fade-in max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-2 border-[var(--accent-gold)] pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[var(--primary-green)] mb-2">منتدى النقاش والتطوير</h2>
          <p className="text-gray-600">مساحة تفاعلية لتبادل الرؤى والخبرات حول قضايا الجودة والاعتماد.</p>
        </div>
        <CreateTopicDialog />
      </div>

      <div className="space-y-6">
        {topics.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500">لا توجد نقاشات مضافة حتى الآن.</p>
          </div>
        ) : topics.map(topic => (
          <div key={topic.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 forum-thread-modern border-r-4 transition hover:shadow-md">
            <div className="flex items-start">
              <div className="hidden md:flex thread-avatar w-12 h-12 rounded-full text-white items-center justify-center font-bold text-xl ml-4 shrink-0 shadow-inner">
                {topic.authorName.charAt(0)}
              </div>
              <div className="flex-grow">
                <Link href={`/forum/${topic.id}`}>
                  <h3 className="text-xl font-bold text-[var(--primary-green)] hover:text-[var(--secondary-green)] transition mb-2">
                    {topic.title}
                  </h3>
                </Link>
                <div className="text-sm text-gray-500 mb-3 flex items-center space-x-4 space-x-reverse">
                  <span className="flex items-center"><span className="mr-1">👤</span> {topic.authorName}</span>
                  <span className="flex items-center"><span className="mr-1">📅</span> {topic.createdAt.toLocaleDateString('ar-EG')}</span>
                </div>
                <p className="text-gray-700 leading-relaxed line-clamp-2">
                  {topic.content}
                </p>
                <div className="mt-4 flex space-x-4 space-x-reverse border-t border-gray-50 pt-3">
                  <Link href={`/forum/${topic.id}#comments`} className="text-sm text-gray-500 hover:text-[var(--primary-green)] transition flex items-center">
                    <span className="mr-1">💬</span> <span className="mr-1" dir="ltr">{topic._count.comments}</span> تعليقات
                  </Link>
                  <LikeButton 
                    topicId={topic.id} 
                    initialCount={topic._count.likes + topic.manualLikeCount} 
                    initialLiked={topic.likes.length > 0} 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
