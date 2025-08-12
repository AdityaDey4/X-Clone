import React from 'react'
import ImageIO from './ImageIO'
import Link from 'next/link'
import PostInteractions from './PostInteractions'
import PostInfo from './PostInfo'
import { Post as PostType } from "@prisma/client";
import { imagekit } from '@/utils'
import { format } from "timeago.js";
import { prisma } from '@/prisma'



type UserSummary = {
  displayName: string | null;
  username: string;
  img: string | null;
};

type Engagement = {
  _count: { likes: number; rePosts: number; comments: number };
  likes: { id: number }[];
  rePosts: { id: number }[];
  saves: { id: number }[];
};

type PostWithDetails = PostType &
  Engagement & {
    user: UserSummary;
    rePost?: (PostType & Engagement & { user: UserSummary }) | null;
  };

export const Post = ({ type , post}: { type?: "status" | "comment", post : PostWithDetails }) => {

  const originalPost = post.rePost || post;
  return (
    <div className="p-4 border-y-[1px] border-borderGray">
      {/* POST TYPE */}
      {post.rePostId && (<div className="flex items-center gap-2 text-sm text-textGray mb-2 from-bold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="#71767b"
            d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"
          />
        </svg>
        <span>{post.user.displayName} reposted</span>
      </div>)}
      {/* POST CONTENT */}
      <div className={`flex gap-4 `}>
        {/* AVATAR */}
        <div
          className={`relative w-10 h-10 rounded-full overflow-hidden -z-10`}
        >
          <ImageIO path={originalPost.user.img || "icons/profile.svg"} alt="" w={100} h={100} tr={true} />
        </div>
        {/* CONTENT */}
        <div className="flex-1 flex flex-col gap-2">
          {/* TOP */}
          <div className="w-full flex justify-between">
            <Link href={`/${originalPost.user.username}`} className="flex gap-4">
              <div
                className={`flex items-center gap-2 flex-wrap `}
              >
                <h1 className="text-md font-bold">{originalPost.user?.displayName}</h1>
                <span
                  className={`text-textGray ${type === "status" && "hidden"}`}
                >
                  {originalPost.user.username}
                </span>
                {type !== "status" && (
                  <span className="text-textGray">
                    {format(originalPost.createdAt)}
                  </span>
                )}
              </div>
            </Link>
            <PostInfo />
          </div>
          {/* TEXT & MEDIA */}
          <Link href={`/${post.user.username}/status/${post.id}`}>
            <p className={`${type === "status" && "text-lg"}`}
           >
              {originalPost?.desc}
            </p>
          
          {originalPost.img && (
            <div className="overflow-hidden cursor-pointer">
              <ImageIO
                path={originalPost.img}
                alt=""
                w={600}
                h={originalPost.imgHeight || 600}
                className={originalPost.isSensitive ? "blur-3xl" : ""}
              />
            </div>
          )}
          </Link>
          {type === "status" && (
            <span className="text-textGray">{post.createdAt.toISOString()}</span>
          )}
          <PostInteractions 
           username={post.user.username}
          _count={post._count} 
          postId={post.id}
            isLiked={!!post.likes.length}
            isSaved={!!post.saves.length}
            isReposted={!!post.rePosts.length}/>
        </div>
      </div>
    </div>
  )
}
