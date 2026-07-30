"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Folder } from "@/lib/mock-data";

export default function Sidebar({ folders }: { folders: Folder[] }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-black/10 px-3 py-6 dark:border-white/10">
      <nav className="flex flex-col gap-1">
        <SidebarLink href="/" label="ALL" isActive={pathname === "/"} />

        <p className="mt-6 px-3 pb-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
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
      className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
        isActive
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "text-zinc-600 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10"
      }`}
    >
      {label}
    </Link>
  );
}
