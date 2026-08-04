import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
  description: "한입 링크 계정을 만들고 나만의 링크를 저장해보세요.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
