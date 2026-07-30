import type { LinkItem } from "@/lib/mock-data";

export default function LinkCard({ link }: { link: LinkItem }) {
  const hostname = new URL(link.url).hostname;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white transition-shadow hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
    >
      <div className="flex aspect-video w-full items-center justify-center bg-zinc-100 text-xs text-zinc-400 dark:bg-zinc-800">
        썸네일 없음
      </div>
      <div className="flex flex-col gap-1 p-4">
        <span className="text-xs text-zinc-400">{hostname}</span>
        <h3 className="line-clamp-1 text-sm font-semibold text-black dark:text-white">
          {link.title}
        </h3>
        <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
          {link.description}
        </p>
      </div>
    </a>
  );
}
