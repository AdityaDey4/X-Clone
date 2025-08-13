"use client";

import { followUser } from "@/actions";
import { socket } from "@/socket";
import { useUser } from "@clerk/nextjs";
import { useOptimistic, useState } from "react";

export const FollowButton = ({
  userId,
  isFollowed,
  username,
}: {
  userId: string;
  isFollowed: boolean;
  username: string;
}) => {
  const [state, setState] = useState(isFollowed);

  const { user } = useUser();

  const [optimisticFollow, switchOptimisticFollow] = useOptimistic(
    state,
    (prev) => !prev
  );

  if (!user) return;

  const followAction = async () => {

    // has not been tested yet.
    if (!optimisticFollow) {
      socket.emit("sendNotification", {
        receiverUsername: username,
        data: {
          senderUsername: user.username,
          type: "follow",
          link: `/${user.username}`,
        },
      });
    }

    switchOptimisticFollow("");
    await followUser(userId, username);
    setState((prev) => !prev);
  };

  return (
    <form action={followAction}>
      <button className="py-2 px-4 bg-white text-black font-bold rounded-full">
        {optimisticFollow ? "Unfollow" : "Follow"}
      </button>
    </form>
  )
}
