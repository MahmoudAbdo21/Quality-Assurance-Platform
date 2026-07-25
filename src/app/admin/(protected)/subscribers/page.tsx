import { prisma } from "@/lib/prisma"
import SubscribersManager from "@/components/admin/SubscribersManager"

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: 'desc' }
  })
  
  return (
    <div>
      <SubscribersManager subscribers={subscribers} />
    </div>
  )
}
