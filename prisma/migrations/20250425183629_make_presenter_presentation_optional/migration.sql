-- DropForeignKey
ALTER TABLE "Presenter" DROP CONSTRAINT "Presenter_presentationId_fkey";

-- AlterTable
ALTER TABLE "Presenter" ALTER COLUMN "presentationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Presenter" ADD CONSTRAINT "Presenter_presentationId_fkey" FOREIGN KEY ("presentationId") REFERENCES "Presentation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
