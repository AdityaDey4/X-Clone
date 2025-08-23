"use client";
import { useState } from "react";
import ImageIO from "./ImageIO";

const PostInfo = ({postId} : {postId : number}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="relative">
      <div
        className="cursor-pointer w-4 h-4 relative"
        onClick={() => setOpen((prev) => !prev)}
      >
        <ImageIO path="icons/infoMore.svg" alt="" w={16} h={16} />
      </div>

      {open && (
        <div className=""> 
          <span className="text-red-500 absolute -translate-x-8 cursor-pointer">Delete</span>
        </div>
      )}
    </div>
  );
};

export default PostInfo;
