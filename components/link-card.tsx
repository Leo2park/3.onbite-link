import type { LinkItem } from "@/lib/mock-data";

export default function LinkCard({
  link,
  onEdit,
  onDelete,
}: {
  link: LinkItem;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const hostname = new URL(link.url).hostname;

  return (
    <div className="group relative">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="card card-hover flex flex-col overflow-hidden"
      >
        <div className="flex aspect-video w-full items-center justify-center overflow-hidden bg-[var(--hover-bg)] text-xs text-[var(--text-sub)]">
          {link.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- thumbnail domains are arbitrary and unknown ahead of time
            <img
              src={link.thumbnailUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            "썸네일 없음"
          )}
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

      {(onEdit || onDelete) && (
        <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit();
              }}
              aria-label={`${link.title} 링크 수정`}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--card-bg)] text-[var(--text-sub)] shadow-sm hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 15.5 6.5M12 6 4.5 13.5 4 16l2.5-.5L14.5 8m-1.5-3.5 1.5-1.5a1.06 1.06 0 0 1 1.5 0l.5.5a1.06 1.06 0 0 1 0 1.5L15 4.5"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              aria-label={`${link.title} 링크 삭제`}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--card-bg)] text-[var(--text-sub)] shadow-sm hover:bg-[var(--hover-bg)] hover:text-[var(--error)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6.5h8m-6.5 0V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.5m-6.5 0 .6 8.4A1.5 1.5 0 0 0 8.1 17.5h3.8a1.5 1.5 0 0 0 1.5-1.6l.6-8.4"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
