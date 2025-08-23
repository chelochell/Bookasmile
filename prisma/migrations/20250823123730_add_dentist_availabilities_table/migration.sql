-- CreateTable
CREATE TABLE "public"."dentist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialization" TEXT[],

    CONSTRAINT "dentist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clinic_branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "clinic_branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dentist_availability" (
    "id" TEXT NOT NULL,
    "dentist_id" TEXT NOT NULL,
    "standard_start_time" TEXT NOT NULL,
    "standard_end_time" TEXT NOT NULL,
    "break_start_time" TEXT,
    "break_end_time" TEXT,
    "day_of_week" TEXT NOT NULL,
    "clinic_branch_id" TEXT NOT NULL,

    CONSTRAINT "dentist_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."specific_dentist_availability" (
    "id" TEXT NOT NULL,
    "dentist_id" TEXT NOT NULL,
    "start_date_time" TIMESTAMP(3) NOT NULL,
    "end_date_time" TIMESTAMP(3) NOT NULL,
    "clinic_branch_id" TEXT,

    CONSTRAINT "specific_dentist_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dentist_leaves" (
    "id" TEXT NOT NULL,
    "dentist_id" TEXT NOT NULL,
    "start_date_time" TIMESTAMP(3) NOT NULL,
    "end_date_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dentist_leaves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dentist_userId_key" ON "public"."dentist"("userId");

-- AddForeignKey
ALTER TABLE "public"."dentist" ADD CONSTRAINT "dentist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dentist_availability" ADD CONSTRAINT "dentist_availability_dentist_id_fkey" FOREIGN KEY ("dentist_id") REFERENCES "public"."dentist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dentist_availability" ADD CONSTRAINT "dentist_availability_clinic_branch_id_fkey" FOREIGN KEY ("clinic_branch_id") REFERENCES "public"."clinic_branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."specific_dentist_availability" ADD CONSTRAINT "specific_dentist_availability_dentist_id_fkey" FOREIGN KEY ("dentist_id") REFERENCES "public"."dentist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."specific_dentist_availability" ADD CONSTRAINT "specific_dentist_availability_clinic_branch_id_fkey" FOREIGN KEY ("clinic_branch_id") REFERENCES "public"."clinic_branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dentist_leaves" ADD CONSTRAINT "dentist_leaves_dentist_id_fkey" FOREIGN KEY ("dentist_id") REFERENCES "public"."dentist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
