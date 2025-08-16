import React from "react";
import ImageIO from "./ImageIO";
import { FollowButton } from "./FollowButton";
import Link from "next/link";

type PersonProfile = {
  id: string;
  img: string | null;
  username: string;
  displayName: string | null;
};
export const RecommendationProfile = ({
  person,
}: {
  person: PersonProfile;
}) => {
  return (
    <div className="flex items-center justify-between" key={person.id}>
      {/* IMAGE AND USER INFO */}
        <Link href={`/${person.username}`} className="flex items-center gap-2" >
          <div className="relative rounded-full overflow-hidden w-10 h-10">
            <ImageIO
              path={person.img || "icons/profile.svg"}
              alt={person.username}
              w={100}
              h={100}
              tr={true}
            />
          </div>
          <div className="">
            <h1 className="text-md font-bold">
              {person.displayName || person.username}
            </h1>
            <span className="text-textGray text-sm">{person.username}</span>
          </div>
          </Link>
      {/* BUTTON */}
      <FollowButton
        userId={person.id}
        isFollowed={false}
        username={person.username}
      />
    </div>
  );
};
