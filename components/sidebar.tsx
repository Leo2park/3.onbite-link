"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFolders } from "@/lib/folders-context";

export default function Sidebar() {
  const pathname = usePathname();
  const { folders } = useFolders();

  return (
    <aside className="w-56 shrink-0 border-r border-[var(--border)] px-3 py-6">
      <nav className="flex flex-col gap-1">
        <SidebarLink href="/" label="ALL" isActive={pathname === "/"} />

        <p className="mt-6 px-3 pb-1 text-xs font-medium uppercase tracking-wide text-[var(--text-sub)]">
          폴더
        </p>
        {folders.map((folder) => (
          <SidebarLink
            key={folder.id}
            href={`/folder/${folder.id}`}
            label={folder.name}
            isActive={pathname === `/folder/${folder.id}`}
          />
        ))}
      </nav>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`sidebar-item rounded-lg px-3 py-2 text-left text-sm font-medium ${
        isActive ? "sidebar-item-active" : ""
      }`}
    >
      {label}
    </Link>
  );
}
