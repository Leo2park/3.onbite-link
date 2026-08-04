import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description: "한입 링크에 로그인하고 저장한 링크를 관리하세요.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
