"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
  file: string | null;
};

export default function PdfViewer({ file }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({
    numPages,
  }: {
    numPages: number;
  }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);

    console.log(`Loaded PDF with ${numPages} pages`);
  }

  function onDocumentLoadError() {
    setLoading(false);
    setError("Unable to load PDF.");
  }

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Upload a PDF to begin
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center overflow-auto p-4">

      {loading && (
        <div className="mb-4 text-gray-500">
          Loading PDF...
        </div>
      )}

      {error && (
        <div className="mb-4 text-red-500">
          {error}
        </div>
      )}

      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <div>
            Loading document...
          </div>
        }
        onSourceSuccess={() => setLoading(true)}
      >
        <Page
          pageNumber={1}
          width={700}
        />
      </Document>

      {numPages && (
        <div className="mt-4 text-sm text-gray-600">
          Pages: {numPages}
        </div>
      )}

    </div>
  );
}