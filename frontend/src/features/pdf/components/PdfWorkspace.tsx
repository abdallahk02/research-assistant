"use client";

import PdfViewer from "./PdfViewer";

type Props = {
  file: string | null;
};

export default function PdfWorkspace({ file }: Props) {
  return (
    <div className="flex h-full flex-col">
      <header className="h-14 border-b flex items-center px-6">
        Research Assistant
      </header>
      {/* Toolbar area */}
      <div className="border-b p-4">
        Research Assistant
      </div>


      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left sidebar */}
        <aside className="w-64 border-r p-4">
          Outline
        </aside>


        {/* PDF area */}
        <main className="flex-1 overflow-auto">
          <PdfViewer file={file} />
        </main>


        {/* AI panel */}
        <aside className="w-80 border-l p-4">
          AI Assistant
        </aside>

      </div>

    </div>
  );
}