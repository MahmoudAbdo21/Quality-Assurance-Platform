-- AlterTable
ALTER TABLE "CertificateIssue" ADD COLUMN "certificateClosingTextSnapshot" TEXT;
ALTER TABLE "CertificateIssue" ADD COLUMN "certificateOpeningTextSnapshot" TEXT;
ALTER TABLE "CertificateIssue" ADD COLUMN "designKeySnapshot" TEXT;
ALTER TABLE "CertificateIssue" ADD COLUMN "firstSignatureAssetIdSnapshot" TEXT;
ALTER TABLE "CertificateIssue" ADD COLUMN "firstSignerNameSnapshot" TEXT;
ALTER TABLE "CertificateIssue" ADD COLUMN "firstSignerTitleSnapshot" TEXT;
ALTER TABLE "CertificateIssue" ADD COLUMN "issuerNameSnapshot" TEXT;
ALTER TABLE "CertificateIssue" ADD COLUMN "logoAssetIdSnapshot" TEXT;
ALTER TABLE "CertificateIssue" ADD COLUMN "platformNameSnapshot" TEXT;
ALTER TABLE "CertificateIssue" ADD COLUMN "primaryColorSnapshot" TEXT;
ALTER TABLE "CertificateIssue" ADD COLUMN "sealAssetIdSnapshot" TEXT;
ALTER TABLE "CertificateIssue" ADD COLUMN "secondSignatureAssetIdSnapshot" TEXT;
ALTER TABLE "CertificateIssue" ADD COLUMN "secondSignerNameSnapshot" TEXT;
ALTER TABLE "CertificateIssue" ADD COLUMN "secondSignerTitleSnapshot" TEXT;
ALTER TABLE "CertificateIssue" ADD COLUMN "secondaryColorSnapshot" TEXT;
ALTER TABLE "CertificateIssue" ADD COLUMN "universityNameSnapshot" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Certificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "certificateBody" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "suspensionReason" TEXT,
    "imageAssetId" TEXT,
    "fileAssetId" TEXT,
    "issuerName" TEXT,
    "universityName" TEXT,
    "platformName" TEXT,
    "certificateOpeningText" TEXT,
    "certificateClosingText" TEXT,
    "logoAssetId" TEXT,
    "sealAssetId" TEXT,
    "firstSignatureAssetId" TEXT,
    "secondSignatureAssetId" TEXT,
    "firstSignerName" TEXT,
    "firstSignerTitle" TEXT,
    "secondSignerName" TEXT,
    "secondSignerTitle" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "designKey" TEXT,
    "showSerialNumber" BOOLEAN NOT NULL DEFAULT true,
    "showVerificationCode" BOOLEAN NOT NULL DEFAULT true,
    "showIssueDate" BOOLEAN NOT NULL DEFAULT true,
    "showTrainingHours" BOOLEAN NOT NULL DEFAULT true,
    "showGrade" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Certificate_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Certificate_fileAssetId_fkey" FOREIGN KEY ("fileAssetId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Certificate_logoAssetId_fkey" FOREIGN KEY ("logoAssetId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Certificate_sealAssetId_fkey" FOREIGN KEY ("sealAssetId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Certificate_firstSignatureAssetId_fkey" FOREIGN KEY ("firstSignatureAssetId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Certificate_secondSignatureAssetId_fkey" FOREIGN KEY ("secondSignatureAssetId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Certificate" ("certificateBody", "courseId", "createdAt", "description", "displayOrder", "fileAssetId", "id", "imageAssetId", "isPublished", "isSuspended", "suspensionReason", "title", "updatedAt") SELECT "certificateBody", "courseId", "createdAt", "description", "displayOrder", "fileAssetId", "id", "imageAssetId", "isPublished", "isSuspended", "suspensionReason", "title", "updatedAt" FROM "Certificate";
DROP TABLE "Certificate";
ALTER TABLE "new_Certificate" RENAME TO "Certificate";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
