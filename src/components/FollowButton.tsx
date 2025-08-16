"use client";

import { followUser } from "@/actions";
import { socket } from "@/socket";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useFollowContext } from "@/app/context/FollowContext";

export const FollowButton = ({
  userId,
  isFollowed,
  username,
}: {
  userId: string;
  isFollowed: boolean;
  username: string;
}) => {
  const { incrementFollowChange, decrementFollowChange } = useFollowContext();
  const [state, setState] = useState(isFollowed);

  const { user } = useUser();

  if (!user) return;

  const followAction = async () => {

    // has not been tested yet.
    if (!state) {
      socket.emit("sendNotification", {
        receiverUsername: username,
        data: {
          senderUsername: user.username,
          type: "follow",
          link: `/${user.username}`,
        },
      });
      incrementFollowChange();
    }else decrementFollowChange();

    await followUser(userId, username);
    setState((prev) => !prev);
  };

  return (
    <form action={followAction}>
      <button className="py-2 px-4 bg-white text-black font-bold rounded-full">
        {state ? "Unfollow" : "Follow"}
      </button>
    </form>
  )
}
