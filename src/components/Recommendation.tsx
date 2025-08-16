import Link from 'next/link'
import React from 'react'
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/prisma';
import { RecommendationProfile } from './RecommendationProfile';

const Recommendation = async () => {

  const { userId } = await auth();

  if (!userId) return;

  const followingIds = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followedUserIds = followingIds.map((f) => f.followingId);

  const friendRecommendations = await prisma.user.findMany({
    where: {
      id: { not: userId, notIn: followedUserIds },
      followings: { some: { followerId: { in: followedUserIds } } },
    },
    take: 3,
    select: { id: true, displayName: true, username: true, img: true },
  });

  const remain = 3-friendRecommendations.length;
  const friendRecommendationsIds = friendRecommendations.map((f)=> f.id);
  const allFollowedIds = [...friendRecommendationsIds, ...followedUserIds];

  const remainFriendRecommendations = await prisma.user.findMany({
    where: {
      id: { not: userId, notIn: allFollowedIds  }
    },
    take: remain,
    select: { id: true, displayName: true, username: true, img: true },
  });

  const allFriendRecommendations = [...friendRecommendations, ...remainFriendRecommendations];

  return (
    <div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4">
      {/* USER CARD */}
      {allFriendRecommendations.map((person) => (
        <div key={person.id}> 

          <RecommendationProfile person={person} />
        </div>
      ))}
      <Link href="/" className="text-iconBlue">
        Show More
      </Link>
      
      </div>
  )
}

export default Recommendation