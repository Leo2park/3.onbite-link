import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-black/10 bg-white px-6 dark:border-white/10 dark:bg-black">
      <span className="text-xl font-bold tracking-tight text-black dark:text-white">
        한입 링크
      </span>
      <Link
        href="/new"
        className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        <span aria-hidden className="text-base leading-none">
          +
        </span>
        새 링크
      </Link>
    </header>
  );
}
