import CloseRouter from '@/components/CloseRouter';
import { RecommendationProfile } from '@/components/RecommendationProfile';
import { prisma } from '@/prisma';
import React from 'react'

const FollowersList = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {

  const username = (await params).username;
  
    const user = await prisma.user.findUnique({
      where: { username },
    });
  
    if (!user) return null;
  
    const followers = await prisma.follow.findMany({
      where: { followingId: user.id },
      include: {
        follower: {
          select: { id: true, displayName: true, username: true, img: true },
        },
      },
    });

  return (
    <div className="fixed inset-0 z-20 flex items-start justify-center bg-[#293139a6] overflow-y-auto">
      <div className="my-auto w-[500px] rounded-xl bg-black p-8 mx-3 flex gap-4 flex-col">
        <CloseRouter />


        {followers.map((follower) => (
          <div key={follower.id}>
            <RecommendationProfile person={follower.follower} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FollowersList