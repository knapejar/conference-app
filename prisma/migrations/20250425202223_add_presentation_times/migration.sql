/*
  Warnings:

  - Added the required column `end` to the `Presentation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Presentation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Block_start_idx";

-- AlterTable
ALTER TABLE "Presentation" ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;
