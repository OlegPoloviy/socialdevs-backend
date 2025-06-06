/*
  Warnings:

  - You are about to drop the column `githu_url` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "githu_url",
ADD COLUMN     "github_url" TEXT;
