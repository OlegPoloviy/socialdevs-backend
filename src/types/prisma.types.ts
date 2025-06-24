import {
  Post as PrismaPost,
  User as PrismaUser,
  Comment as PrismaComment,
  Like as PrismaLike,
  Bookmark as PrismaBookmark
} from '@prisma/client';

// Типи з partial relations для використання в сервісах
export type UserWithBasicInfo = PrismaUser;

export type PostWithAuthor = PrismaPost & {
  author: UserWithBasicInfo;
};

export type PostWithRelations = PrismaPost & {
  author: UserWithBasicInfo;
  comments: (PrismaComment & {
    author: UserWithBasicInfo;
    likes: PrismaLike[];
    replies: PrismaComment[];
  })[];
  likes: (PrismaLike & {
    user: UserWithBasicInfo;
  })[];
  bookmarks: (PrismaBookmark & {
    user: UserWithBasicInfo;
  })[];
};

export type CommentWithRelations = PrismaComment & {
  author: UserWithBasicInfo;
  post: PrismaPost;
  parent?: PrismaComment;
  replies: PrismaComment[];
  likes: (PrismaLike & {
    user: UserWithBasicInfo;
  })[];
};