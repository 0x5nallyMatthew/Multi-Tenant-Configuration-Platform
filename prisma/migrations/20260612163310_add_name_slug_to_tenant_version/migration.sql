/*
  Warnings:

  - Added the required column `name` to the `TenantVersion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `TenantVersion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TenantVersion" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;
