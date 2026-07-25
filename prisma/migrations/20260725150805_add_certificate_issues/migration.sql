-- DropIndex
DROP INDEX "Certificate_courseId_key";

-- CreateTable
CREATE TABLE "CertificateIssue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "certificateId" TEXT NOT NULL,
    "registrationId" TEXT,
    "recipientFullName" TEXT NOT NULL,
    "recipientTitle" TEXT,
    "recipientFaculty" TEXT,
    "recipientDepartment" TEXT,
    "recipientOrganization" TEXT,
    "recipientEmail" TEXT,
    "recipientReference" TEXT,
    "issueDate" DATETIME NOT NULL,
    "completionDate" DATETIME,
    "trainingHours" INTEGER,
    "grade" TEXT,
    "notes" TEXT,
    "serialNumber" TEXT NOT NULL,
    "verificationToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ISSUED',
    "revokedAt" DATETIME,
    "revocationReason" TEXT,
    "certificateTitleSnapshot" TEXT NOT NULL,
    "certificateBodySnapshot" TEXT NOT NULL,
    "courseTitleSnapshot" TEXT NOT NULL,
    "templateDesignSnapshot" TEXT,
    "customFieldsJson" TEXT,
    "createdByAdminUserId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CertificateIssue_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "Certificate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CertificateIssue_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "CourseRegistration" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CertificateIssue_createdByAdminUserId_fkey" FOREIGN KEY ("createdByAdminUserId") REFERENCES "AdminUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CertificateIssue_serialNumber_key" ON "CertificateIssue"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CertificateIssue_verificationToken_key" ON "CertificateIssue"("verificationToken");

-- CreateIndex
CREATE INDEX "CertificateIssue_certificateId_idx" ON "CertificateIssue"("certificateId");

-- CreateIndex
CREATE INDEX "CertificateIssue_registrationId_idx" ON "CertificateIssue"("registrationId");

-- CreateIndex
CREATE INDEX "CertificateIssue_recipientFullName_idx" ON "CertificateIssue"("recipientFullName");

-- CreateIndex
CREATE INDEX "CertificateIssue_serialNumber_idx" ON "CertificateIssue"("serialNumber");

-- CreateIndex
CREATE INDEX "CertificateIssue_status_idx" ON "CertificateIssue"("status");

-- CreateIndex
CREATE INDEX "CertificateIssue_issueDate_idx" ON "CertificateIssue"("issueDate");
