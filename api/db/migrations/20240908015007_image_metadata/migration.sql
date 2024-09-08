-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "albumId" INTEGER NOT NULL,
    "original" TEXT NOT NULL,
    "processed" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "imageType" TEXT,
    CONSTRAINT "Pic_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Pic" ("albumId", "createdAt", "id", "original", "processed", "updatedAt") SELECT "albumId", "createdAt", "id", "original", "processed", "updatedAt" FROM "Pic";
DROP TABLE "Pic";
ALTER TABLE "new_Pic" RENAME TO "Pic";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
