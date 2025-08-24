import ImageIO from "@/components/ImageIO";
import { Post } from "@/components/Post";
import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const SavedPost = async () => {
  const { userId } = await auth();
  if (!userId) return;

  const user = await prisma.user.findFirst({ where: { id: userId } });
  if (!user) return null;

  const postIncludeQuery = {
    user: { select: { displayName: true, username: true, img: true } },
    _count: { select: { likes: true, rePosts: true, comments: true } },
    likes: { where: { userId: userId }, select: { id: true } },
    rePosts: { where: { userId: userId }, select: { id: true } },
    saves: { where: { userId: userId }, select: { id: true } },
  };

  const savedPost = await prisma.savedPosts.findMany({
    where: { userId },
    include: {
      post: {
        include: {
          rePost: {
            include: { ...postIncludeQuery },
          },
          ...postIncludeQuery,
        },
      },
    },
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <ImageIO path="icons/back.svg" alt="back" w={24} h={24} />
        </Link>
        <h1 className="font-bold text-lg">Saved Posts</h1>
      </div>
      {savedPost.map((post) => (
        <div key={post.id}>
          <Post post={post} />
        </div>
      ))}

      <>
        {!savedPost.length && (
          <div className="flex flex-1 justify-center">
            <span className="my-auto">You haven't saved any post yet.</span>
          </div>
        )}
      </>
    </div>
  );
};

export default SavedPost;
