"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { LinkItem } from "@/lib/mock-data";
import { createClient } from "@/utils/supabase/client";

type NewLinkInput = Omit<LinkItem, "id">;

type LinkUpdateInput = Pick<LinkItem, "title" | "description" | "folderId">;

type LinksContextValue = {
  links: LinkItem[];
  addLink: (input: NewLinkInput) => Promise<LinkItem>;
  removeLink: (id: string) => Promise<void>;
  updateLink: (id: string, updates: LinkUpdateInput) => Promise<void>;
};

const LinksContext = createContext<LinksContextValue | null>(null);

async function fetchLinksForUser(userId: string): Promise<LinkItem[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("links")
    .select("id, url, title, description, thumbnail_url, folder_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((link) => ({
    id: String(link.id),
    url: link.url,
    title: link.title ?? "",
    description: link.description ?? "",
    thumbnailUrl: link.thumbnail_url ?? undefined,
    folderId: link.folder_id != null ? String(link.folder_id) : "",
  }));
}

export function LinksProvider({
  initialLinks,
  initialUserId,
  children,
}: {
  initialLinks: LinkItem[];
  initialUserId: string | null;
  children: ReactNode;
}) {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const currentUserId = useRef(initialUserId);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUserId = session?.user.id ?? null;
      if (nextUserId === currentUserId.current) return;

      currentUserId.current = nextUserId;

      if (!nextUserId) {
        setLinks([]);
        return;
      }

      fetchLinksForUser(nextUserId).then(setLinks);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const removeLink = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("links").delete().eq("id", id);

    if (error) {
      throw error;
    }

    setLinks((prev) => prev.filter((link) => link.id !== id));
  };

  const updateLink = async (id: string, updates: LinkUpdateInput) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("links")
      .update({
        title: updates.title,
        description: updates.description,
        folder_id: Number(updates.folderId),
      })
      .eq("id", id);

    if (error) {
      throw error;
    }

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
