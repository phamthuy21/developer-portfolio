-- AlterTable
ALTER TABLE "certificates" ADD COLUMN     "deleted_at" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "deleted_at" TIMESTAMPTZ;
