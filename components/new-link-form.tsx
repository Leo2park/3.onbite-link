"use client";

import { useState } from "react";
import { useFolders } from "@/lib/folders-context";

export default function NewLinkForm() {
  const { folders } = useFolders();
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

      <button
        type="submit"
        className="btn-primary mt-2 self-start px-5 py-2 text-sm font-medium"
      >
        저장
      </button>
    </form>
  );
}
