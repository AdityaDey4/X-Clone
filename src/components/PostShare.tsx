import React from 'react'
import ImageIO from './ImageIO'
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/prisma';
import Share from './Share';
import Link from 'next/link';

const PostShare = async ({modal} : {modal : boolean}) => {

    const { userId } = await auth();
    if(!userId) return;
    const user = await prisma.user.findUnique({
        where: { id : userId },
        select : {img : true, username : true}
      });

  return (
    <div className="p-4 flex gap-4">

    <div className="relative w-10 h-10 rounded-full overflow-hidden">
      <Link href={`/${user?.username}`}>
      <ImageIO path={user?.img || "icons/profile.svg"} alt="" w={150} h={150} tr={true} />
      </Link>
    </div>
    <Share modal={modal}/>
    </div>
  )
}

export default PostShare