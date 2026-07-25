import { prisma } from "@/lib/prisma"
import CertificateAdminPage from "@/components/admin/certificates/CertificateAdminPage"

export default async function AdminCertificatesRoute() {
  const templates = await prisma.certificate.findMany({
    orderBy: { displayOrder: 'asc' },
    include: { 
      course: true,
      _count: { select: { issues: true } }
    }
  })
  
  const issues = await prisma.certificateIssue.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      certificate: {
        include: { course: true }
      }
    }
  })

  const courses = await prisma.course.findMany({
    orderBy: { title: 'asc' }
  })

  return (
    <div>
      <CertificateAdminPage templates={templates} issues={issues} courses={courses} />
    </div>
  )
}
