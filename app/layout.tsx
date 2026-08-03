import type { Metadata } from "next";
import "./globals.css";
import { FoldersProvider } from "@/lib/folders-context";
import { folders } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "한입 링크",
  description: "나만의 링크를 저장하고 폴더로 정리하는 북마크 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="flex min-h-full flex-col">
        <FoldersProvider initialFolders={folders}>{children}</FoldersProvider>
      </body>
    </html>
  );
}
