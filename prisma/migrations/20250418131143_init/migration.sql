-- CreateEnum
CREATE TYPE "QuestionState" AS ENUM ('CREATED', 'ANSWERED', 'DELETED');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "state" "QuestionState" NOT NULL DEFAULT 'CREATED';
