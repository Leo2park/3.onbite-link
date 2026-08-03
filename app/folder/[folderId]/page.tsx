"use client";

import { useParams, notFound } from "next/navigation";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import LinkGrid from "@/components/link-grid";
import { links } from "@/lib/mock-data";
import { useFolders } from "@/lib/folders-context";

export default function FolderPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const { folders } = useFolders();
  const folder = folders.find((item) => item.id === folderId);

  if (!folder) {
    notFound();
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
