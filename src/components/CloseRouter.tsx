"use client";

import { useRouter } from "next/navigation";

const CloseRouter = () => {
  const router = useRouter();

  const closeModal = () => {
    router.back();
  };
  return (
    <div className="flex justify-end">
      <div className="cursor-pointer" onClick={closeModal}>
        X
      </div>
    </div>
  );
};

export default CloseRouter;
