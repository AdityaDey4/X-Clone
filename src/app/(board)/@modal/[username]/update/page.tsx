import UpdateUserProfileClient from "@/components/UpdateUserProfileClient";
import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function UpdateUserProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { userId } = await auth();
  const username = (await params).username;

  const user = await prisma.user.findUnique({
    where: { username },
    select : {
      username : true, bio : true, displayName : true, img : true, cover : true, location : true, job : true, website : true, id : true
    }
  });

  if (!user || userId !== user.id) return notFound();

  

  
  return <UpdateUserProfileClient user={user} />;
}
