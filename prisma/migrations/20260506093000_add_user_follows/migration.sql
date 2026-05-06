ALTER TABLE "User" ADD COLUMN "followers_count" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "following_count" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Follow_follower_id_following_id_key" ON "Follow"("follower_id", "following_id");
CREATE INDEX "Follow_follower_id_idx" ON "Follow"("follower_id");
CREATE INDEX "Follow_following_id_idx" ON "Follow"("following_id");

ALTER TABLE "Follow" ADD CONSTRAINT "Follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
