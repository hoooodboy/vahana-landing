import React, { createContext, useContext, useState } from "react";

interface RootPageContextType {
  isUck: boolean;
  toggleRootPage: () => void;
}

const RootPageContext = createContext<RootPageContextType | undefined>(
  undefined
);

export const RootPageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isUck, setIsUck] = useState(true); // true면 UckPage, false면 HomePage

  const toggleRootPage = () => setIsUck((prev) => !prev);

  return (
    <RootPageContext.Provider value={{ isUck, toggleRootPage }}>
      {children}
    </RootPageContext.Provider>
  );
};

export const useRootPage = () => {
  const ctx = useContext(RootPageContext);
  if (!ctx)
    throw new Error("useRootPage must be used within a RootPageProvider");
  return ctx;
};
