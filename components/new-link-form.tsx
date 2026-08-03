"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFolders } from "@/lib/folders-context";
import { useLinks } from "@/lib/links-context";
import type { OpenGraphData } from "@/app/api/og/route";

export default function NewLinkForm() {
  const { folders } = useFolders();
  const { addLink } = useLinks();
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [folderId, setFolderId] = useState(folders[0]?.id ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!folderId || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
      const data: OpenGraphData = await response.json();

      if (!response.ok) {
        throw new Error("failed to fetch open graph data");
      }

      await addLink({
        title: data.title,
        url: data.url,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        folderId,
      });

      router.push(`/folder/${folderId}`);
    } catch {
      setError(
        "링크를 추가하지 못했어요. 주소를 확인하고 다시 시도해주세요.",
      );
      isSubmittingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="url"
          className="text-sm font-medium text-[var(--text)]"
        >
          링크 주소
        </label>
        <input
          id="url"
          type="url"
          required
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="field px-3 py-2 text-base"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="folder"
          className="text-sm font-medium text-[var(--text)]"
        >
          폴더
        </label>
        <select
          id="folder"
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          className="field px-3 py-2 text-base"
        >
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-[var(--error)]">{error}</p>}

      <button
        type="submit"
        disabled={isSaving}
        className="btn-primary mt-2 self-start px-5 py-2 text-sm font-medium"
      >
        {isSaving ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}
