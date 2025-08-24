import ImageIO from "./ImageIO";
import Link from "next/link";
import React from "react";
import Socket from "./Socket";
import { currentUser } from "@clerk/nextjs/server";
import Notification from "./Notification";
import { prisma } from "@/prisma";
import { SignOutButton } from "./SignOutButton";


const LeftBar = async () => {
  const currUser = await currentUser();
  if (!currUser?.username) {
    return null; // or return a placeholder UI
  }
  const username = currUser?.username;

  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if(!user) return null;

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
          {/* HOMEPAGE  */}
            <div>
              <Link
                href={'/'}
                className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
              >
                <ImageIO
                  path={`icons/home.svg`}
                  alt="Homepage"
                  w={24}
                  h={24}
                />
                <span className="hidden xxl:inline">Homepage</span>
              </Link>
            </div>
            {/* EXPLORE- WILL CREATE A SEPARATE COMPONENT LIKE NOTIFICATION  */}
            <div>
              <Link
                href={'/compose/search'}
                className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
              >
                <ImageIO
                  path={`icons/explore.svg`}
                  alt="Explore"
                  w={24}
                  h={24}
                />
                <span className="hidden xxl:inline">Explore</span>
              </Link>
            </div>
            {/* NOTIFICATION  */}
            <div><Notification /></div>
            {/* BOOKMARKS- NEW PAGE  */}
            <div>
              <Link
                href={'/save'}
                className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
              >
                <ImageIO
                  path={`icons/bookmark.svg`}
                  alt="Bookmarks"
                  w={24}
                  h={24}
                />
                <span className="hidden xxl:inline">Bookmarks</span>
              </Link>
            </div>
            {/* PROFILE  */}
            <div>
              <Link
                href={`/${user?.username}`}
                className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
              >
                <ImageIO
                  path={`icons/profile.svg`}
                  alt="Profile"
                  w={24}
                  h={24}
                />
                <span className="hidden xxl:inline">Profile</span>
              </Link>
            </div>
            {/* MORE - MESSAGES, JOBS, COMMUNITIES  */}
            <div>
              <Link
                href={`/${user?.username}`}
                className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
              >
                <ImageIO
                  path={`icons/more.svg`}
                  alt="More"
                  w={24}
                  h={24}
                />
                <span className="hidden xxl:inline">More</span>
              </Link>
            </div>
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
      <div className="flex top-0 justify-between flex-col">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            <Link href={`/${user?.username}`}>
            <ImageIO
              path={user?.img || "icons/profile.svg"}
              alt="Aditya Dey"
              w={100}
              h={100}
              tr={true}
              />
              </Link>
          </div>
          <div className="hidden xxl:flex flex-col">
            <span className="font-bold">{user?.displayName}</span>
            <span className="text-sm text-textGray">{user?.username}</span>
          </div>
        </div>
        <div className="hidden xxl:block cursor-pointer font-bold">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
