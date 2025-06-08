/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `githubUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twitterUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl",
DROP COLUMN "githubUrl",
DROP COLUMN "linkedinUrl",
DROP COLUMN "providerId",
DROP COLUMN "twitterUrl",
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "githu_url" TEXT,
ADD COLUMN     "linkedin_url" TEXT,
ADD COLUMN     "provider_id" TEXT,
ADD COLUMN     "twitter_url" TEXT;
