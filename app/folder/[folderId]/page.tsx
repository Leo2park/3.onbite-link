import { notFound } from "next/navigation";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import LinkGrid from "@/components/link-grid";
import { folders, links } from "@/lib/mock-data";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await params;
  const folder = folders.find((item) => item.id === folderId);

  if (!folder) {
    notFound();
  }

  const folderLinks = links.filter((link) => link.folderId === folderId);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar folders={folders} />
        <main className="flex-1 p-6">
          <h1 className="mb-6 text-lg font-semibold text-black dark:text-white">
            {folder.name}
          </h1>
          <LinkGrid links={folderLinks} />
        </main>
      </div>
    </div>
  );
}
