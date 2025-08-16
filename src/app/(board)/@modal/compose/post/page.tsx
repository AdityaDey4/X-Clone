

import CloseRouter from "@/components/CloseRouter";
import PostShare from "@/components/PostShare";

const PostModal = () => {

  return (
    <div className="fixed inset-0 z-20 bg-[#293139a6] flex justify-center items-start overflow-y-auto">
      <div className="py-4 px-8 rounded-xl bg-black w-[600px] h-max mt-12">
        {/* TOP */}
        <CloseRouter />
        {/* BOTTOM */}
        <PostShare key="modal" modal={true}/>
      </div>
    </div>
  );
};

export default PostModal;
