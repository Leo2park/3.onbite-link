import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import NewLinkForm from "@/components/new-link-form";
import { folders } from "@/lib/mock-data";

export default function NewLinkPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar folders={folders} />
        <main className="flex-1 p-6">
          <h1 className="mb-6 text-lg font-semibold text-black dark:text-white">
            새 링크 추가
          </h1>
          <NewLinkForm folders={folders} />
        </main>
      </div>
    </div>
  );
}
