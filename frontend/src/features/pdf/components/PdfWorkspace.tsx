"use client";

import PdfViewer from "./PdfViewer";

type Props = {
  file: string | null;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PdfWorkspace({
  file,
  onUpload,
}: Props) {
  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-zinc-100">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6">
        <h1 className="font-semibold">
          Research Assistant
        </h1>

        <label className="cursor-pointer rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white">
          Upload PDF

          <input
            type="file"
            accept="application/pdf"
            onChange={onUpload}
            className="hidden"
          />
        </label>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="w-64 shrink-0 border-r border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-sm font-medium text-zinc-300">
            Outline
          </h2>

          <p className="mt-4 text-sm text-zinc-500">
            No outline available
          </p>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto bg-zinc-800">
          <PdfViewer file={file} />
        </main>

        <aside className="w-80 shrink-0 border-l border-zinc-800 bg-zinc-900 p-4">
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