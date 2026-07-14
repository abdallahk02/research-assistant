"use client";

import { useEffect, useState } from "react";
import PdfWorkspace from "@/features/pdf/components/PdfWorkspace";

export default function Home() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setFileName(file.name);
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
      <PdfWorkspace
        file={fileUrl}
        fileName={fileName}
        onUpload={handleUpload}
      />
    </main>
  );
}
