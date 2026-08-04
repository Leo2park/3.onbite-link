"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import LinkGrid from "@/components/link-grid";
import { useLinks } from "@/lib/links-context";

export default function HomeView() {
  const { links } = useLinks();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-6 pb-6 pt-10">
          <LinkGrid links={links} />
        </main>
      </div>
    </div>
  );
}
