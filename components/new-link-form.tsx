"use client";

import { useState } from "react";
import type { Folder } from "@/lib/mock-data";

export default function NewLinkForm({ folders }: { folders: Folder[] }) {
  const [url, setUrl] = useState("");
  const [folderId, setFolderId] = useState(folders[0]?.id ?? "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="url"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
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
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:focus:border-white/30"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="folder"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          폴더
        </label>
        <select
          id="folder"
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:focus:border-white/30"
        >
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="mt-2 self-start rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        저장
      </button>
    </form>
  );
}
