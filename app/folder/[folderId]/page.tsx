"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import LinkGrid from "@/components/link-grid";
import { useFolders } from "@/lib/folders-context";
import { useLinks } from "@/lib/links-context";

export default function FolderPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const { folders } = useFolders();
  const { links } = useLinks();
  const router = useRouter();
  const folder = folders.find((item) => item.id === folderId);

  useEffect(() => {
    if (!folder) {
      router.replace("/");
    }
  }, [folder, router]);

  if (!folder) {
    return null;
  }

  const folderLinks = links.filter((link) => link.folderId === folderId);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-6 pb-6 pt-10">
          <h1 className="mb-6 text-xl font-semibold text-[var(--text)]">
            {folder.name}
          </h1>
          <LinkGrid links={folderLinks} />
        </main>
      </div>
    </div>
  );
}
