"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Folder } from "@/lib/mock-data";

type FoldersContextValue = {
  folders: Folder[];
  addFolder: (name: string) => void;
};

const FoldersContext = createContext<FoldersContextValue | null>(null);

export function FoldersProvider({
  initialFolders,
  children,
}: {
  initialFolders: Folder[];
  children: ReactNode;
}) {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);

  const addFolder = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `folder-${Date.now()}`;

    setFolders((prev) => [...prev, { id, name: trimmedName }]);
  };

  return (
    <FoldersContext.Provider value={{ folders, addFolder }}>
      {children}
    </FoldersContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FoldersContext);
  if (!context) {
    throw new Error("useFolders must be used within a FoldersProvider");
  }
  return context;
}
