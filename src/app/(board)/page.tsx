import Feed from "@/components/Feed";
import PostShare from "@/components/PostShare";
import Link from "next/link";

const Homepage = () => {
  return (
    <div className="">
      <div className="px-4 pt-4 flex justify-around text-textGray font-bold border-b-[1px] border-borderGray">
        <Link
          className="pb-3 flex items-center border-b-4 border-iconBlue"
          href="/"
        >
          For you
        </Link>
        <Link className="pb-3 flex items-center" href="/">
          Following
        </Link>
      </div>
      <PostShare />
      <Feed />
    </div>
  );
};

export default Homepage;
