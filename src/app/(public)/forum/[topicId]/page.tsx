import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getVisitorId } from '@/lib/visitor';
import LikeButton from '@/components/public/forum/LikeButton';
import CommentForm from '@/components/public/forum/CommentForm';

export default async function TopicPage({ params }: { params: { topicId: string } }) {
  const visitorId = await getVisitorId();
  const { topicId } = await params;

  const topic = await prisma.forumTopic.findUnique({
    where: { id: topicId },
    include: {
      comments: {
        where: { isVisible: true },
        orderBy: { createdAt: 'asc' }
      },
      _count: {
        select: { 
          likes: true, 
          comments: {
            where: { isVisible: true }
          } 
        }
      },
      likes: {
        where: { visitorId }
      }
    }
  });

  if (!topic || !topic.isVisible) {
    notFound();
  }

  const hasLiked = topic.likes.length > 0;
  const displayedLikesCount = topic._count.likes + topic.manualLikeCount;

  return (
    <div className="container mx-auto px-4 py-12 fade-in max-w-4xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 border-t-4 border-[var(--primary-green)]">
        <h1 className="text-3xl font-bold text-[var(--primary-green)] mb-4">{topic.title}</h1>
        <div className="flex items-center text-sm text-gray-500 mb-8 border-b pb-4">
          <span className="flex items-center ml-6"><span className="ml-2">👤</span> {topic.authorName}</span>
          <span className="flex items-center ml-6"><span className="ml-2">📅</span> {topic.createdAt.toLocaleDateString('ar-EG')}</span>
        </div>
        
        <div className="text-gray-800 leading-relaxed text-lg mb-8 whitespace-pre-wrap">
          {topic.content}
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <LikeButton topicId={topic.id} initialCount={displayedLikesCount} initialLiked={hasLiked} />
          
          <div className="text-gray-500">
            {topic.isLocked && <span className="text-red-500 font-bold ml-4">🔒 الموضوع مغلق</span>}
            <span>💬 {topic._count.comments} تعليق</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold mb-6 border-b pb-2">التعليقات</h3>
        
        {topic.comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">لا توجد تعليقات بعد. كن أول من يعلق!</p>
        ) : (
          <div className="space-y-6 mb-8">
            {topic.comments.map(comment => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-[var(--primary-green)]">{comment.authorName}</span>
                  <span className="text-xs text-gray-400">{comment.createdAt.toLocaleDateString('ar-EG')}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
          </div>
        )}

        {!topic.isLocked ? (
          <CommentForm topicId={topic.id} />
        ) : (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold">
            هذا الموضوع مغلق ولا يمكن إضافة تعليقات جديدة.
          </div>
        )}
      </div>
    </div>
  );
}
