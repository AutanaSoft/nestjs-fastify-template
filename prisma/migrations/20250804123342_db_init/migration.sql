-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('REGISTERED', 'ACTIVE', 'BANNED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(64) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "user_name" VARCHAR(20) NOT NULL,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'REGISTERED',
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "public"."users"("user_name");
