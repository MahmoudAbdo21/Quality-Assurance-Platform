import { prisma } from "@/lib/prisma"
import MessagesManager from "@/components/admin/MessagesManager"

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  return (
    <div>
      <MessagesManager messages={messages} />
    </div>
  )
}
