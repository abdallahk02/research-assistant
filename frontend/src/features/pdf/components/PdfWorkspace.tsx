"use client";

import { useState } from "react";

import PdfViewer from "./PdfViewer";

type Props = {
  file: string | null;
  fileName: string | null;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PdfWorkspace({
  file,
  fileName,
  onUpload,
}: Props) {
  
  const [targetPage, setTargetPage] = useState<number | null>(null);


  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    onUpload(event);
  }

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-zinc-100">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 sm:px-6">
        <div className="min-w-0">
          <h1 className="font-semibold tracking-tight">
            Research Assistant
          </h1>

          {fileName && (
            <p className="max-w-48 truncate text-xs text-zinc-500 sm:max-w-sm">
              {fileName}
            </p>
          )}
        </div>

        <label className="cursor-pointer rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2 focus-within:ring-offset-zinc-900 sm:px-4">
          {file ? "Replace PDF" : "Upload PDF"}

          <input
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">

        <main className="min-w-0 flex-1 overflow-hidden bg-zinc-950">
          <PdfViewer file={file} />
        </main>

        <aside className="hidden w-72 shrink-0 border-l border-zinc-800 bg-zinc-900 p-5 md:block xl:w-80">
          <h2 className="text-sm font-medium text-zinc-300">
            AI Assistant
          </h2>

          <p className="mt-4 text-sm text-zinc-500">
            AI features coming soon.
          </p>
        </aside>
      </div>
    </div>
  );
}