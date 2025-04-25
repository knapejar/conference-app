/*
  Warnings:

  - You are about to drop the column `end` on the `Presentation` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `Presentation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Presentation" DROP COLUMN "end",
DROP COLUMN "start";

-- CreateIndex
CREATE INDEX "Block_start_idx" ON "Block"("start");
