import ImageIO from './ImageIO'
import Link from 'next/link'
import React from 'react'
import Socket from './Socket';
import { currentUser } from "@clerk/nextjs/server";
import Notification from './Notification';
import { prisma } from '@/prisma';

const menuList = [
  {
    id: 1,
    name: "Homepage",
    link: "/",
    icon: "home.svg",
  },
  {
    id: 2,
    name: "Explore",
    link: "/",
    icon: "explore.svg",
  },
  // {
  //   id: 3,
  //   name: "Notification",
  //   link: "/",
  //   icon: "notification.svg",
  // },
  {
    id: 4,
    name: "Messages",
    link: "/",
    icon: "message.svg",
  },
  {
    id: 5,
    name: "Bookmarks",
    link: "/",
    icon: "bookmark.svg",
  },
  {
    id: 6,
    name: "Jobs",
    link: "/",
    icon: "job.svg",
  },
  {
    id: 7,
    name: "Communities",
    link: "/",
    icon: "community.svg",
  },
  {
    id: 8,
    name: "Profile",
    link: "/",
    icon: "profile.svg",
  },
  {
    id: 9,
    name: "More",
    link: "/",
    icon: "more.svg",
  },
];

const LeftBar = async () => {

  const currUser = await currentUser();
  if (!currUser?.username) {
    return null; // or return a placeholder UI
  }
  const username = currUser?.username;

  const user = await prisma.user.findUnique({
      where: { username: username }
  });


  return (
     <div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
      {/* LOGO MENU BUTTON */}
      <div className="flex flex-col gap-4 text-lg items-center xxl:items-start">
        {/* LOGO */}
        <Link href="/" className="p-2 rounded-full hover:bg-[#181818] ">
          <ImageIO path="icons/logo.svg" alt="logo" w={24} h={24} />
        </Link>
        {/* MENU LIST */}
        <div className="flex flex-col gap-4">
          {menuList.map((item, i) => (
            <div key={item.id || i}>
            {i === 2 && user && (
                <div>
                  <Notification />
                </div>
              )}
            <Link
              href={item.link}
              className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
              key={item.id}
            >
              <ImageIO
                path={`icons/${item.icon}`}
                alt={item.name}
                w={24}
                h={24}
              />
              <span className="hidden xxl:inline">{item.name}</span>
            </Link>
            </div>
          ))}
        </div>
        {/* BUTTON */}
        <Link
          href="/compose/post"
          className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center xxl:hidden"
        >
          <ImageIO path="icons/post.svg" alt="new post" w={24} h={24} />
        </Link>
        <Link
          href="/compose/post"
          className="hidden xxl:block bg-white text-black rounded-full font-bold py-2 px-20"
        >
          Post
        </Link>
      </div>
      <Socket />
      {/* USER */}
      <div className="flex top-0 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            <ImageIO path={user?.img || "icons/profile.svg"} alt="lama dev" w={100} h={100} tr={true} />
          </div>
          <div className="hidden xxl:flex flex-col">
            <span className="font-bold">{user?.displayName}</span>
            <span className="text-sm text-textGray">{user?.username}</span>
          </div>
        </div>
        <div className="hidden xxl:block cursor-pointer font-bold">...</div>
      </div>
    </div>
  )
}

export default LeftBar