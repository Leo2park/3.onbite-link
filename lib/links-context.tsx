"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { LinkItem } from "@/lib/mock-data";

type NewLinkInput = Omit<LinkItem, "id">;

type LinksContextValue = {
  links: LinkItem[];
  addLink: (input: NewLinkInput) => LinkItem;
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

  return (
    <LinksContext.Provider value={{ links, addLink }}>
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
