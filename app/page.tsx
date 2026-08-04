import type { Metadata } from "next";
import HomeView from "@/app/home-view";

export const metadata: Metadata = {
  title: "전체 링크",
  description: "저장한 모든 링크를 한눈에 확인하세요.",
};

export default function Home() {
  return <HomeView />;
}
