import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "폴더",
  description: "폴더에 저장한 링크를 확인하세요.",
};

export default function FolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
