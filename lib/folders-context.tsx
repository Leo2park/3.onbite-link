"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Folder } from "@/lib/mock-data";
import { createClient } from "@/utils/supabase/client";

type FoldersContextValue = {
  folders: Folder[];
  addFolder: (name: string) => Promise<void>;
  removeFolder: (id: string) => Promise<void>;
  renameFolder: (id: string, name: string) => Promise<void>;
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

  const addFolder = async (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("folders")
      .insert({ name: trimmedName })
      .select("id, name")
      .single();

    if (error || !data) {
      throw error ?? new Error("failed to create folder");
    }

    setFolders((prev) => [
      ...prev,
      { id: String(data.id), name: data.name },
    ]);
  };

  const removeFolder = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("folders").delete().eq("id", id);

    if (error) {
      throw error;
    }

    setFolders((prev) => prev.filter((folder) => folder.id !== id));
  };

  const renameFolder = async (id: string, name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("folders")
      .update({ name: trimmedName })
      .eq("id", id);

    if (error) {
      throw error;
    }

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id ? { ...folder, name: trimmedName } : folder,
      ),
    );
  };

  return (
    <FoldersContext.Provider
      value={{ folders, addFolder, removeFolder, renameFolder }}
    >
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
