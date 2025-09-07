/*
  Warnings:

  - Added the required column `updated_at` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."refresh_tokens" ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;
