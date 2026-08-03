import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import NewLinkForm from "@/components/new-link-form";

export default function NewLinkPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-6 pb-6 pt-10">
          <h1 className="mb-6 text-xl font-semibold text-[var(--text)]">
            새 링크 추가
          </h1>
          <NewLinkForm />
        </main>
      </div>
    </div>
  );
}
