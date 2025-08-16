"use client";

import { useRouter } from "next/navigation";

const CloseRouter = () => {

    const router = useRouter();
    
      const closeModal = () => {
        router.back();
      };
  return (
    <div className="flex items-center justify-between">
          <div className="cursor-pointer" onClick={closeModal}>
            X
          </div>
          <div className="text-iconBlue font-bold">Drafts</div>
        </div>
  )
}

export default CloseRouter