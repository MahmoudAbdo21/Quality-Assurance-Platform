# Certificate Simplification Migration

## Existing Complex Fields Removed
- certificateBody
- displayOrder
- imageAssetId
- fileAssetId
- issuerName
- universityName
- platformName
- certificateOpeningText
- certificateClosingText
- logoAssetId
- sealAssetId
- firstSignatureAssetId
- secondSignatureAssetId
- firstSignerName
- firstSignerTitle
- secondSignerName
- secondSignerTitle
- primaryColor
- secondaryColor
- designKey
- showSerialNumber
- showVerificationCode
- showIssueDate
- showTrainingHours
- showGrade

## Simplified Active Fields
- Certificate: id, courseId, title, description, isPublished, isSuspended, suspensionReason, createdAt, updatedAt
- CertificateAward: id, certificateId, registrationId, recipientFullName, recipientDegree, issueDate, verificationToken, isRevoked, revokedAt, revocationReason, createdAt, updatedAt

## Duplicate Course Certificates Handling
### Course: المفاهيم الأساسية لنظم الجودة (ID: cms09pct70001v1po61tcg671)
- **Selected Primary Certificate**: شهادة المفاهيم الأساسية للجودة (ID: cms09pcx70003v1po842jsdta)
- **Duplicate Found**: شهادة اجتياز برنامج إعداد المراجعين (معتمدة) (ID: cms0kcl0t0004v1eotq4b6cw2). Action: Reassigning issues and deleting.
  - Reassigned 2 awards to primary certificate.

## Existing Awards Preserved
- Total 2 awards safely preserved and retained in the simplified structure.
