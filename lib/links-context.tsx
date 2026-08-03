"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { LinkItem } from "@/lib/mock-data";
import { createClient } from "@/utils/supabase/client";

type NewLinkInput = Omit<LinkItem, "id">;

type LinkUpdateInput = Pick<LinkItem, "title" | "description" | "folderId">;

type LinksContextValue = {
  links: LinkItem[];
  addLink: (input: NewLinkInput) => Promise<LinkItem>;
  removeLink: (id: string) => void;
  updateLink: (id: string, updates: LinkUpdateInput) => void;
};

const LinksContext = createContext<LinksContextValue | null>(null);

export function LinksProvider({
  initialLinks,
  children,
}: {
  initialLinks: LinkItem[];
  children: ReactNode;
}) {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);

  const addLink = async (input: NewLinkInput) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("links")
      .insert({
        url: input.url,
        title: input.title,
        description: input.description,
        thumbnail_url: input.thumbnailUrl,
        folder_id: Number(input.folderId),
      })
      .select("id, url, title, description, thumbnail_url, folder_id")
      .single();

    if (error || !data) {
      throw error ?? new Error("failed to create link");
    }

    const newLink: LinkItem = {
      id: String(data.id),
      url: data.url,
      title: data.title ?? "",
      description: data.description ?? "",
      thumbnailUrl: data.thumbnail_url ?? undefined,
      folderId: data.folder_id != null ? String(data.folder_id) : "",
    };

    setLinks((prev) => [newLink, ...prev]);
    return newLink;
  };

  const removeLink = (id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  };

  const updateLink = (id: string, updates: LinkUpdateInput) => {
    setLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, ...updates } : link)),
    );
  };

  return (
    <LinksContext.Provider
      value={{ links, addLink, removeLink, updateLink }}
    >
      {children}
    </LinksContext.Provider>
  );
}

export function useLinks() {
  const context = useContext(LinksContext);
  if (!context) {
    throw new Error("useLinks must be used within a LinksProvider");
  }
  return context;
}
