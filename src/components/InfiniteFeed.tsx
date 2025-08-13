"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { Post } from "./Post";

const fetchPosts = async (pageParam: number, userProfileId?: string) => {
  const res = await fetch(
    "http://localhost:3000/api/posts?cursor=" +
      pageParam +
      "&user=" +
      userProfileId
  );
  return res.json();
};

const InfiniteFeed = ({ userProfileId }: { userProfileId?: string }) => {
    
  const { data, error, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["posts"], // Used by React Query to uniquely identify and cache this query
    queryFn: ({ pageParam = 2 }) => fetchPosts(pageParam, userProfileId),
    initialPageParam: 2,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 2 : undefined,
  });

  if (error) return "Something went wrong!";
  if (status === "pending") return "Loading...";

 const allPosts = data?.pages?.flatMap((page) => page.posts) || [];


  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<div className="flex items-center text-gray-600"><h1>Posts are loading...</h1></div>}
      endMessage={<div className="flex justify-center items-center text-gray-600"><h1>All posts are loaded!</h1></div>}
    >
      {allPosts.map((post) => (
        <Post key={post.id} post={post}/>
      ))}
    </InfiniteScroll>
  );
};

export default InfiniteFeed;
