"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFolders } from "@/lib/folders-context";
import type { Folder } from "@/lib/mock-data";

export default function Sidebar() {
  const pathname = usePathname();
  const { folders, removeFolder, renameFolder } = useFolders();
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null);
  const [editName, setEditName] = useState("");

  const requestDelete = (folder: Folder) => setFolderToDelete(folder);
  const cancelDelete = () => setFolderToDelete(null);

  const confirmDelete = () => {
    if (!folderToDelete) return;

    removeFolder(folderToDelete.id);
    setFolderToDelete(null);
  };

  const requestEdit = (folder: Folder) => {
    setFolderToEdit(folder);
    setEditName(folder.name);
  };
  const cancelEdit = () => setFolderToEdit(null);

  const confirmEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!folderToEdit) return;

    renameFolder(folderToEdit.id, editName);
    setFolderToEdit(null);
  };

  return (
    <>
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
              onEdit={() => requestEdit(folder)}
              onDelete={() => requestDelete(folder)}
            />
          ))}
        </nav>
      </aside>

      {folderToEdit && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4"
          onClick={cancelEdit}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={confirmEdit}
            className="card flex w-full max-w-sm flex-col gap-5 p-6"
          >
            <h2 className="text-base font-semibold text-[var(--text)]">
              폴더 이름 수정
            </h2>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="folder-edit-name"
                className="text-sm font-medium text-[var(--text)]"
              >
                폴더 이름
              </label>
              <input
                id="folder-edit-name"
                type="text"
                required
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="field px-3 py-2 text-base"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="btn-secondary px-4 py-2 text-sm font-medium"
              >
                취소
              </button>
              <button
                type="submit"
                className="btn-primary px-4 py-2 text-sm font-medium"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      )}

      {folderToDelete && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4"
          onClick={cancelDelete}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card flex w-full max-w-sm flex-col gap-5 p-6"
          >
            <h2 className="text-base font-semibold text-[var(--text)]">
              폴더 삭제
            </h2>
            <p className="text-sm text-[var(--text-sub)]">
              &apos;{folderToDelete.name}&apos; 폴더를 정말 삭제하시겠어요?
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelDelete}
                className="btn-secondary px-4 py-2 text-sm font-medium"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="btn-danger px-4 py-2 text-sm font-medium"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SidebarLink({
  href,
  label,
  isActive,
  onEdit,
  onDelete,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div className="group relative flex items-center">
      <Link
        href={href}
        className={`sidebar-item flex-1 truncate rounded-lg px-3 py-2 text-left text-sm font-medium ${
          hasActions ? "pr-14" : ""
        } ${isActive ? "sidebar-item-active" : ""}`}
      >
        {label}
      </Link>
      {hasActions && (
        <div className="absolute right-1.5 flex items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit();
              }}
              aria-label={`${label} 폴더 이름 수정`}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--text-sub)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"
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
              aria-label={`${label} 폴더 삭제`}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--text-sub)] hover:bg-[var(--hover-bg)] hover:text-[var(--error)]"
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
