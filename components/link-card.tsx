import type { LinkItem } from "@/lib/mock-data";

export default function LinkCard({ link }: { link: LinkItem }) {
  const hostname = new URL(link.url).hostname;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card card-hover flex flex-col overflow-hidden"
    >
      <div className="flex aspect-video w-full items-center justify-center bg-[var(--hover-bg)] text-xs text-[var(--text-sub)]">
        썸네일 없음
      </div>
      <div className="flex flex-col gap-1 p-4">
        <span className="text-xs text-[var(--text-sub)]">{hostname}</span>
        <h3 className="line-clamp-1 text-sm font-semibold text-[var(--text)]">
          {link.title}
        </h3>
        <p className="line-clamp-2 text-xs text-[var(--text-sub)]">
          {link.description}
        </p>
      </div>
    </a>
  );
}
