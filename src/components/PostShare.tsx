import React from 'react'
import ImageIO from './ImageIO'
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/prisma';
import Share from './Share';

const PostShare = async () => {

    const { userId } = await auth();
    if(!userId) return;
    const user = await prisma.user.findUnique({
        where: { id : userId },
        select : {img : true}
      });

  return (
    <div className="p-4 flex gap-4">

    <div className="relative w-10 h-10 rounded-full overflow-hidden">
      <ImageIO path={user?.img || "icons/profile.svg"} alt="" w={150} h={150} tr={true} />
    </div>
    <Share />
    </div>
  )
}

export default PostShare