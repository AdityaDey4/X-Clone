import Comments from "@/components/Comments";
import ImageIO from "@/components/ImageIO";
import {Post} from "@/components/Post";
import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import { User } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

const StatusPage = async ({
  params,
}: {
  params: Promise<{ username: string; postId: string }>;
}) => {

  const { userId } = await auth();
  const postId = (await params).postId;

  if (!userId) return;

  const loggedInUser : User | null = await prisma.user.findFirst({where : {id : userId}});
  if(!loggedInUser) return;

   const postIncludeQuery = {
    user: { select: { displayName: true, username: true, img: true } },
    _count: { select: { likes: true, rePosts: true, comments: true } },
    likes: { where: { userId: userId }, select: { id: true } },
    rePosts: { where: { userId: userId }, select: { id: true } },
    saves: { where: { userId: userId }, select: { id: true } },
  };
  
  const postWithComments = await prisma.post.findFirst({
    
    where: { id: Number(postId) },
    include: {
      ...postIncludeQuery,
      comments: {
        orderBy:{createdAt:"desc"},
        include: postIncludeQuery
      },
    },
  });

  const postWithDetails = await prisma.post.findFirst({
    
    where: { id: Number(postId) },
    include: {
      ...postIncludeQuery,
      rePost: {
        include: postIncludeQuery
      },
    },
  });

  if (!postWithDetails || !postWithComments) return notFound();
  
  return (
    <div className="">
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <ImageIO path="icons/back.svg" alt="back" w={24} h={24} />
        </Link>
        <h1 className="font-bold text-lg">Post</h1>
      </div>
      <Post type="status" post={postWithDetails}/>
       <Comments
        comments={postWithComments.comments}
        postId={postWithComments.id}
        username={postWithComments.user.username}
        userProfilePic={loggedInUser.img}
      />
    </div>
  );
};

export default StatusPage;