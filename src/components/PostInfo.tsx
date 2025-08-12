import ImageIO from "./ImageIO";

const PostInfo = () => {
  return (
    <div className="cursor-pointer w-4 h-4 relative">
      <ImageIO path="icons/infoMore.svg" alt="" w={16} h={16} />
    </div>
  );
};

export default PostInfo;