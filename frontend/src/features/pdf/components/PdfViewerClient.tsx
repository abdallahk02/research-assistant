"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import PdfToolbar from "./PdfToolbar";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
  file: string | null;
};

export default function PdfViewerClient({ file }: Props) {
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
    <div className="flex flex-col items-center gap-4 overflow-auto p-4">

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

      <div className="flex flex-col items-center p-6">
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
          {numPages &&
            Array.from({ length: numPages }, (_, index) => (
              <div 
                key={index + 1}
                className="mb-8 rounded-lg shadow-2xl">
                <Page
                  pageNumber={index + 1}
                  width={700}
                />
              </div>
            ))}
        </Document>
      </div>

    </div>
  );
}