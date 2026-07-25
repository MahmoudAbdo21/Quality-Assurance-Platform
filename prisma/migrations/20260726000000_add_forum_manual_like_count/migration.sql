-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ForumTopic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "manualLikeCount" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_ForumTopic" ("authorName", "content", "createdAt", "id", "isLocked", "isVisible", "title", "updatedAt") SELECT "authorName", "content", "createdAt", "id", "isLocked", "isVisible", "title", "updatedAt" FROM "ForumTopic";
DROP TABLE "ForumTopic";
ALTER TABLE "new_ForumTopic" RENAME TO "ForumTopic";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

