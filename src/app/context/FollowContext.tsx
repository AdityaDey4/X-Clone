"use client";

import { createContext, useContext, useState } from "react";

const FollowContext = createContext<any>(null);

export const FollowProvider = ({ children }: { children: React.ReactNode }) => {
  const [followChangeCount, setFollowChangeCount] = useState(0);

  const incrementFollowChange = () => setFollowChangeCount((c: number) => c + 1);
  const decrementFollowChange = () => setFollowChangeCount((c: number) => c - 1);

  return (
    <FollowContext.Provider value={{ followChangeCount, incrementFollowChange, decrementFollowChange }}>
      {children}
    </FollowContext.Provider>
  );
};

export const useFollowContext = () => useContext(FollowContext);
