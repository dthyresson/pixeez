/*
  Warnings:

  - You are about to drop the column `processed` on the `Pic` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "albumId" INTEGER NOT NULL,
    "original" TEXT NOT NULL,
    "withoutBackground" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "format" TEXT,
    "exif" TEXT,
    "description" TEXT,
    CONSTRAINT "Pic_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Pic" ("albumId", "createdAt", "description", "exif", "format", "height", "id", "original", "updatedAt", "width") SELECT "albumId", "createdAt", "description", "exif", "format", "height", "id", "original", "updatedAt", "width" FROM "Pic";
DROP TABLE "Pic";
ALTER TABLE "new_Pic" RENAME TO "Pic";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
