import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function migrateData() {
  const docsPath = 'docs/certificate-simplification-migration.md';
  let report = `# Certificate Simplification Migration\n\n`;
  report += `## Existing Complex Fields Removed\n`;
  report += `- certificateBody\n- displayOrder\n- imageAssetId\n- fileAssetId\n- issuerName\n- universityName\n- platformName\n- certificateOpeningText\n- certificateClosingText\n- logoAssetId\n- sealAssetId\n- firstSignatureAssetId\n- secondSignatureAssetId\n- firstSignerName\n- firstSignerTitle\n- secondSignerName\n- secondSignerTitle\n- primaryColor\n- secondaryColor\n- designKey\n- showSerialNumber\n- showVerificationCode\n- showIssueDate\n- showTrainingHours\n- showGrade\n\n`;

  report += `## Simplified Active Fields\n`;
  report += `- Certificate: id, courseId, title, description, isPublished, isSuspended, suspensionReason, createdAt, updatedAt\n`;
  report += `- CertificateAward: id, certificateId, registrationId, recipientFullName, recipientDegree, issueDate, verificationToken, isRevoked, revokedAt, revocationReason, createdAt, updatedAt\n\n`;

  // 1. Find duplicate course certificates
  const courses = await prisma.course.findMany({
    include: {
      certificate: {
        orderBy: [
          { isPublished: 'desc' },
          { isSuspended: 'asc' },
          { createdAt: 'asc' }
        ]
      }
    }
  });

  report += `## Duplicate Course Certificates Handling\n`;
  let duplicatesFound = false;

  for (const course of courses) {
    if (course.certificate.length > 1) {
      duplicatesFound = true;
      const [primary, ...duplicates] = course.certificate;
      
      report += `### Course: ${course.title} (ID: ${course.id})\n`;
      report += `- **Selected Primary Certificate**: ${primary.title} (ID: ${primary.id})\n`;
      
      for (const dup of duplicates) {
        report += `- **Duplicate Found**: ${dup.title} (ID: ${dup.id}). Action: Reassigning issues and deleting.\n`;
        
        // Reassign issues
        const issues = await prisma.certificateAward.updateMany({
          where: { certificateId: dup.id },
          data: { certificateId: primary.id }
        });
        
        report += `  - Reassigned ${issues.count} awards to primary certificate.\n`;
        
        // Delete duplicate
        await prisma.certificate.delete({ where: { id: dup.id } });
      }
    }
  }

  if (!duplicatesFound) {
    report += `No duplicate course certificates found.\n`;
  }

  // Count preserved awards
  const preservedCount = await prisma.certificateAward.count();
  report += `\n## Existing Awards Preserved\n`;
  report += `- Total ${preservedCount} awards safely preserved and retained in the simplified structure.\n`;

  fs.writeFileSync(docsPath, report);
  console.log('Migration prep script completed safely.');
}

migrateData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
