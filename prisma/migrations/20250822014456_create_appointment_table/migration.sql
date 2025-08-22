-- CreateTable
CREATE TABLE "public"."appointment" (
    "appointment_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "dentist_id" TEXT NOT NULL,
    "scheduled_by" TEXT NOT NULL,
    "appointment_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notif_content" TEXT,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("appointment_id")
);

-- AddForeignKey
ALTER TABLE "public"."appointment" ADD CONSTRAINT "appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."appointment" ADD CONSTRAINT "appointment_dentist_id_fkey" FOREIGN KEY ("dentist_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."appointment" ADD CONSTRAINT "appointment_scheduled_by_fkey" FOREIGN KEY ("scheduled_by") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
