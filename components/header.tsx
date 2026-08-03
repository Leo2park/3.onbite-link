"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useFolders } from "@/lib/folders-context";

export default function Header() {
  const { addFolder } = useFolders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  const openModal = () => {
    setFolderName("");
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      await addFolder(folderName);
      closeModal();
    } catch {
      setError("폴더를 추가하지 못했어요. 다시 시도해주세요.");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
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
                disabled={isSubmitting}
                placeholder="폴더 이름을 입력하세요"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="field px-3 py-2 text-base"
              />
            </div>

            {error && <p className="text-sm text-[var(--error)]">{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="btn-secondary px-4 py-2 text-sm font-medium"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-4 py-2 text-sm font-medium"
              >
                {isSubmitting ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
