-- DropForeignKey
ALTER TABLE "public"."appointment" DROP CONSTRAINT "appointment_dentist_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."appointment" ADD CONSTRAINT "appointment_dentist_id_fkey" FOREIGN KEY ("dentist_id") REFERENCES "public"."dentist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
