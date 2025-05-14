/*
  Warnings:

  - You are about to drop the column `presentationId` on the `Presenter` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Presenter" DROP CONSTRAINT "Presenter_presentationId_fkey";

-- AlterTable
ALTER TABLE "Presenter" DROP COLUMN "presentationId";

-- CreateTable
CREATE TABLE "_PresentationPresenters" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PresentationPresenters_AB_unique" ON "_PresentationPresenters"("A", "B");

-- CreateIndex
CREATE INDEX "_PresentationPresenters_B_index" ON "_PresentationPresenters"("B");

-- AddForeignKey
ALTER TABLE "_PresentationPresenters" ADD CONSTRAINT "_PresentationPresenters_A_fkey" FOREIGN KEY ("A") REFERENCES "Presentation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PresentationPresenters" ADD CONSTRAINT "_PresentationPresenters_B_fkey" FOREIGN KEY ("B") REFERENCES "Presenter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
