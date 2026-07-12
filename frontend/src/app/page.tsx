"use client";

import { useState } from "react";
import PaperSidebar from "@/features/pdf/components/PaperSidebar";
import PdfViewer from "@/features/pdf/components/PdfViewer";
import PdfToolbar from "@/features/pdf/components/PdfToolbar";
import UploadButton from "@/features/pdf/components/UploadButton";
import AiPanel from "@/features/pdf/components/AiPanel";

export default function Home() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  <PdfViewer file={fileUrl} />

  return (
    <div className="grid grid-cols-[260px_1fr_350px] h-screen">
      <aside className="border-r p-4">
        <UploadButton onUpload={setFileUrl} />
        <PaperSidebar />
      </aside>

      <main className="flex flex-col">
        <PdfToolbar />
        <PdfViewer file={fileUrl} />
      </main>

      <aside className="border-l p-4">
        <AiPanel />
      </aside>
    </div>
  );
}