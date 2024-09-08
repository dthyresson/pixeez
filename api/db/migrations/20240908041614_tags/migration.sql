/*
  Warnings:

  - You are about to drop the column `picId` on the `Tag` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_PicToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PicToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Pic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PicToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Tag" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_PicToTag_AB_unique" ON "_PicToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PicToTag_B_index" ON "_PicToTag"("B");
