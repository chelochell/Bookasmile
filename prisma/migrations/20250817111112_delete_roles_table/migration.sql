/*
  Warnings:

  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."user_role" DROP CONSTRAINT "user_role_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_role" DROP CONSTRAINT "user_role_userId_fkey";

-- DropTable
DROP TABLE "public"."role";

-- DropTable
DROP TABLE "public"."user_role";
