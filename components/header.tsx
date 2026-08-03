"use client";

import { useState } from "react";
import Link from "next/link";
import { useFolders } from "@/lib/folders-context";

export default function Header() {
  const { addFolder } = useFolders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const openModal = () => {
    setFolderName("");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addFolder(folderName);
    closeModal();
  };

  return (
    <>
      <header className="nav-bar sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between px-4">
        <span className="text-base font-semibold text-[var(--text)]">
          한입 링크
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openModal}
            className="btn-secondary flex items-center gap-1.5 px-4 py-2 text-sm font-medium"
          >
            <span aria-hidden className="text-base leading-none">
              +
            </span>
            새 폴더
          </button>
          <Link
            href="/new"
            className="btn-primary flex items-center gap-1.5 px-4 py-2 text-sm font-medium"
          >
            <span aria-hidden className="text-base leading-none">
              +
            </span>
            새 링크
          </Link>
        </div>
      </header>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4"
          onClick={closeModal}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="card flex w-full max-w-sm flex-col gap-5 p-6"
          >
            <h2 className="text-base font-semibold text-[var(--text)]">
              새 폴더
            </h2>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="folder-name"
                className="text-sm font-medium text-[var(--text)]"
              >
                폴더 이름
              </label>
              <input
                id="folder-name"
                type="text"
                required
                autoFocus
                placeholder="폴더 이름을 입력하세요"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="field px-3 py-2 text-base"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
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
    </>
  );
}
