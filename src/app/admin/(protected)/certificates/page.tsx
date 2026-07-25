import { prisma } from "@/lib/prisma"
import CertificateManager from "@/components/admin/CertificateManager"

export default async function AdminCertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: { displayOrder: 'asc' },
    include: { course: true }
  })
  
  const courses = await prisma.course.findMany({
    orderBy: { title: 'asc' }
  })

  return (
    <div>
      <CertificateManager certificates={certificates} courses={courses} />
    </div>
  )
}
