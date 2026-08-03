import type { Metadata } from "next";
import "./globals.css";
import { FoldersProvider } from "@/lib/folders-context";
import { LinksProvider } from "@/lib/links-context";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "한입 링크",
  description: "나만의 링크를 저장하고 폴더로 정리하는 북마크 서비스",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data: folderRows } = await supabase
    .from("folders")
    .select("id, name")
    .order("id", { ascending: true });

  const folders = (folderRows ?? []).map((folder) => ({
    id: String(folder.id),
    name: folder.name,
  }));

  const { data: linkRows } = await supabase
    .from("links")
    .select("id, url, title, description, thumbnail_url, folder_id")
    .order("created_at", { ascending: false });

  const links = (linkRows ?? []).map((link) => ({
    id: String(link.id),
    url: link.url,
    title: link.title ?? "",
    description: link.description ?? "",
    thumbnailUrl: link.thumbnail_url ?? undefined,
    folderId: link.folder_id != null ? String(link.folder_id) : "",
  }));

  return (
    <html lang="ko" className="h-full">
      <body className="flex min-h-full flex-col">
        <FoldersProvider initialFolders={folders}>
          <LinksProvider initialLinks={links}>{children}</LinksProvider>
        </FoldersProvider>
      </body>
    </html>
  );
}
