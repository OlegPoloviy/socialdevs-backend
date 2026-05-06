-- Allow likes to target either a post or a comment.
ALTER TABLE "Like" ALTER COLUMN "post_id" DROP NOT NULL;

ALTER TABLE "Post" ADD COLUMN "reposts_count" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "Repost" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Repost_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Repost_user_id_post_id_key" ON "Repost"("user_id", "post_id");
CREATE INDEX "Repost_post_id_idx" ON "Repost"("post_id");
CREATE INDEX "Repost_user_id_idx" ON "Repost"("user_id");

ALTER TABLE "Repost" ADD CONSTRAINT "Repost_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Repost" ADD CONSTRAINT "Repost_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
