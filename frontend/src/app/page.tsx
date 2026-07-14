"use client";

import { useState } from "react";
import PdfWorkspace from "@/features/pdf/components/PdfWorkspace";

export default function Home() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    const url = URL.createObjectURL(file);
    setFileUrl(url);
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
      <PdfWorkspace
        file={fileUrl}
        onUpload={handleUpload}
      />
    </main>
  );
}