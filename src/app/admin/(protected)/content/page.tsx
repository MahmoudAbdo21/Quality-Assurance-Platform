import { prisma } from "@/lib/prisma"
import ContentManager from "@/components/admin/ContentManager"

export default async function AdminContentPage() {
  const slides = await prisma.knowledgeSlide.findMany({
    orderBy: { displayOrder: 'asc' }
  })
  
  return (
    <div>
      <ContentManager slides={slides} />
    </div>
  )
}
