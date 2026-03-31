"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface CloakContextType {
  isCloaked: boolean;
  toggleCloak: () => void;
}

const CloakContext = createContext<CloakContextType | undefined>(undefined);

export function CloakProvider({ children }: { children: ReactNode }) {
  const [isCloaked, setIsCloaked] = useState(false);

  const toggleCloak = () => {
    setIsCloaked((prev) => !prev);
  };

  return (
    <CloakContext.Provider value={{ isCloaked, toggleCloak }}>
      {children}
    </CloakContext.Provider>
  );
}

export function useCloak() {
  const context = useContext(CloakContext);
  if (context === undefined) {
    throw new Error("useCloak must be used within a CloakProvider");
  }
  return context;
}
