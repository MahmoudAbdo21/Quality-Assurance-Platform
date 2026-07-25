import { prisma } from "@/lib/prisma"
import CertificateAdminPage from "@/components/admin/certificates/CertificateAdminPage"

export default async function AdminCertificatesRoute() {
  const certificates = await prisma.certificate.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      course: true,
      _count: { select: { awards: true } }
    }
  })
  
  const awards = await prisma.certificateAward.findMany({
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
      <CertificateAdminPage certificates={certificates} awards={awards} courses={courses} />
    </div>
  )
}
