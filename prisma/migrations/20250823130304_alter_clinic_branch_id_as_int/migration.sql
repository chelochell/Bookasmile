/*
  Warnings:

  - The primary key for the `clinic_branch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `clinic_branch` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `clinic_branch_id` column on the `specific_dentist_availability` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `clinic_branch_id` on the `dentist_availability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."dentist_availability" DROP CONSTRAINT "dentist_availability_clinic_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."specific_dentist_availability" DROP CONSTRAINT "specific_dentist_availability_clinic_branch_id_fkey";

-- AlterTable
ALTER TABLE "public"."clinic_branch" DROP CONSTRAINT "clinic_branch_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "clinic_branch_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."dentist_availability" DROP COLUMN "clinic_branch_id",
ADD COLUMN     "clinic_branch_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."specific_dentist_availability" DROP COLUMN "clinic_branch_id",
ADD COLUMN     "clinic_branch_id" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."dentist_availability" ADD CONSTRAINT "dentist_availability_clinic_branch_id_fkey" FOREIGN KEY ("clinic_branch_id") REFERENCES "public"."clinic_branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."specific_dentist_availability" ADD CONSTRAINT "specific_dentist_availability_clinic_branch_id_fkey" FOREIGN KEY ("clinic_branch_id") REFERENCES "public"."clinic_branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
