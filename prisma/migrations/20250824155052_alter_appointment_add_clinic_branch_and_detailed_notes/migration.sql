-- AlterTable
ALTER TABLE "public"."appointment" ADD COLUMN     "clinic_branch_id" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "detailed_notes" TEXT;

-- AddForeignKey
ALTER TABLE "public"."appointment" ADD CONSTRAINT "appointment_clinic_branch_id_fkey" FOREIGN KEY ("clinic_branch_id") REFERENCES "public"."clinic_branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
