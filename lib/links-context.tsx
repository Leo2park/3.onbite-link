"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { LinkItem } from "@/lib/mock-data";

type NewLinkInput = Omit<LinkItem, "id">;

type LinkUpdateInput = Pick<LinkItem, "title" | "description" | "folderId">;

type LinksContextValue = {
  links: LinkItem[];
  addLink: (input: NewLinkInput) => LinkItem;
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

  const addLink = (input: NewLinkInput) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `link-${Date.now()}`;

    const newLink: LinkItem = { id, ...input };
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
