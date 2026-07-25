-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" DATETIME,
    "lastLoginAt" DATETIME,
    "sessionVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "suspensionReason" TEXT,
    "imageAssetId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Course_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certificate" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Certificate_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Certificate_fileAssetId_fkey" FOREIGN KEY ("fileAssetId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CourseRegistration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicToken" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "faculty" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "promotionDegree" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseRegistration_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseRegistration_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ForumTopic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ForumComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ForumComment_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ForumLike" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ForumLike_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ForumLike_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" DATETIME,
    "archivedAt" DATETIME
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "subscribedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribedAt" DATETIME
);

-- CreateTable
CREATE TABLE "KnowledgeSlide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteTitle" TEXT NOT NULL DEFAULT 'منصة ضمان الجودة والاعتماد الأكاديمي - جامعة الأزهر',
    "siteSubtitle" TEXT NOT NULL DEFAULT 'نظام متكامل للاعتماد الأكاديمي',
    "heroBadge" TEXT NOT NULL DEFAULT 'التميز في التعليم',
    "heroTitle" TEXT NOT NULL DEFAULT 'نحو تعليم معتمد ومستقبل مشرق',
    "heroHighlightedText" TEXT NOT NULL DEFAULT 'معتمد',
    "heroDescription" TEXT NOT NULL DEFAULT 'الهيئة القومية لضمان جودة التعليم والاعتماد هي الجهة المسؤولة عن نشر ثقافة الجودة وتقييم واعتماد المؤسسات التعليمية للارتقاء بمستوى التعليم في مصر.',
    "heroPrimaryButtonText" TEXT NOT NULL DEFAULT 'اكتشف دوراتنا',
    "heroSecondaryButtonText" TEXT NOT NULL DEFAULT 'تعرف علينا أكثر',
    "aboutIntro" TEXT NOT NULL DEFAULT 'منصة أكاديمية رائدة مخصصة لنشر ثقافة الجودة الشاملة والاعتماد المؤسسي وفقاً لأعلى المعايير الوطنية والدولية.',
    "visionTitle" TEXT NOT NULL DEFAULT 'رؤيتنا',
    "visionContent" TEXT NOT NULL DEFAULT 'الريادة والتميز في تمكين المؤسسات التعليمية والأكاديمية من تطبيق أعلى معايير الجودة الشاملة والاعتماد الأكاديمي للوصول إلى مستويات التنافسية العالمية.',
    "missionTitle" TEXT NOT NULL DEFAULT 'رسالتنا',
    "missionContent" TEXT NOT NULL DEFAULT 'توفير برامج تدريبية متطورة، ونظم تقييم دقيقة، وبيئة تفاعلية متكاملة للارتقاء بمهارات الكوادر الأكاديمية وبناء مجتمع معرفي قائم على التحسين المستمر والتميز المؤسسي.',
    "contactAddress" TEXT NOT NULL DEFAULT '١٢ شارع الجودة، مدينة نصر، القاهرة، جمهورية مصر العربية',
    "contactPhone" TEXT NOT NULL DEFAULT '+20 2 2345 6789',
    "contactEmail" TEXT NOT NULL DEFAULT 'info@naqaae.eg',
    "footerDescription" TEXT NOT NULL DEFAULT 'المظلة الرسمية لضمان جودة التعليم في مصر والارتقاء به لمستوى المعايير الدولية.',
    "copyrightText" TEXT NOT NULL DEFAULT 'جميع الحقوق محفوظة © ٢٠٢٤ الهيئة القومية لضمان جودة التعليم والاعتماد.',
    "privacyText" TEXT NOT NULL DEFAULT 'سياسة الخصوصية للمنصة',
    "termsText" TEXT NOT NULL DEFAULT 'شروط الاستخدام والأحكام',
    "facebookUrl" TEXT NOT NULL DEFAULT '#',
    "xUrl" TEXT NOT NULL DEFAULT '#',
    "youtubeUrl" TEXT NOT NULL DEFAULT '#',
    "linkedinUrl" TEXT NOT NULL DEFAULT '#',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalName" TEXT NOT NULL,
    "storedName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "relativePath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminUserId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "summary" TEXT NOT NULL,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_courseId_key" ON "Certificate"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseRegistration_publicToken_key" ON "CourseRegistration"("publicToken");

-- CreateIndex
CREATE UNIQUE INDEX "CourseRegistration_visitorId_courseId_key" ON "CourseRegistration"("visitorId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "ForumLike_topicId_visitorId_key" ON "ForumLike"("topicId", "visitorId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");
