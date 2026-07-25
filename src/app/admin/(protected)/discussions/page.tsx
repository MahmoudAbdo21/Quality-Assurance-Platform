import { requireAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import DiscussionsManager from '@/components/admin/discussions/DiscussionsManager';

export const metadata = {
  title: 'إدارة المنتدى والنقاشات - لوحة التحكم',
};

export default async function AdminDiscussionsPage() {
  await requireAdmin();

  const topics = await prisma.forumTopic.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { comments: true, likes: true } },
      comments: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-[var(--primary-green)] mb-2">إدارة المنتدى والنقاشات</h1>
        <p className="text-gray-500">إدارة مواضيع المنتدى، التعليقات، والإعجابات اليدوية.</p>
      </div>

      <DiscussionsManager initialTopics={topics} />
    </div>
  );
}
