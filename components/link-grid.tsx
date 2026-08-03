"use client";

import { useState } from "react";
import type { LinkItem } from "@/lib/mock-data";
import LinkCard from "@/components/link-card";
import { useLinks } from "@/lib/links-context";
import { useFolders } from "@/lib/folders-context";

export default function LinkGrid({ links }: { links: LinkItem[] }) {
  const { removeLink, updateLink } = useLinks();
  const { folders } = useFolders();
  const [linkToDelete, setLinkToDelete] = useState<LinkItem | null>(null);
  const [linkToEdit, setLinkToEdit] = useState<LinkItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFolderId, setEditFolderId] = useState("");

  const cancelDelete = () => setLinkToDelete(null);

  const confirmDelete = () => {
    if (!linkToDelete) return;

    removeLink(linkToDelete.id);
    setLinkToDelete(null);
  };

  const requestEdit = (link: LinkItem) => {
    setLinkToEdit(link);
    setEditTitle(link.title);
    setEditDescription(link.description);
    setEditFolderId(link.folderId);
  };
  const cancelEdit = () => setLinkToEdit(null);

  const confirmEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!linkToEdit) return;

    updateLink(linkToEdit.id, {
      title: editTitle,
      description: editDescription,
      folderId: editFolderId,
    });
    setLinkToEdit(null);
  };

  if (links.length === 0) {
    return (
      <p className="text-sm text-[var(--text-sub)]">등록된 링크가 없습니다.</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {links.map((link) => (
          <LinkCard
            key={link.id}
            link={link}
            onEdit={() => requestEdit(link)}
            onDelete={() => setLinkToDelete(link)}
          />
        ))}
      </div>

      {linkToEdit && (
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
              링크 수정
            </h2>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit-folder"
                className="text-sm font-medium text-[var(--text)]"
              >
                폴더
              </label>
              <select
                id="edit-folder"
                value={editFolderId}
                onChange={(e) => setEditFolderId(e.target.value)}
                className="field px-3 py-2 text-base"
              >
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit-title"
                className="text-sm font-medium text-[var(--text)]"
              >
                제목
              </label>
              <input
                id="edit-title"
                type="text"
                required
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="field px-3 py-2 text-base"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit-description"
                className="text-sm font-medium text-[var(--text)]"
              >
                설명
              </label>
              <textarea
                id="edit-description"
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
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

      {linkToDelete && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4"
          onClick={cancelDelete}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card flex w-full max-w-sm flex-col gap-5 p-6"
          >
            <h2 className="text-base font-semibold text-[var(--text)]">
              링크 삭제
            </h2>
            <p className="text-sm text-[var(--text-sub)]">
              &apos;{linkToDelete.title}&apos; 링크를 정말 삭제하시겠어요?
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
