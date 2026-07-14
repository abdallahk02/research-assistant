"use client";

import { useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(700);
  const pageWidth = Math.min(containerWidth, 900);

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

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      const availableWidth = entry.contentRect.width;

      // Leave room for padding around the PDF.
      setContainerWidth(Math.max(320, availableWidth - 64));
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

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

      <div
        ref={containerRef}
        className="flex min-h-full w-full justify-center px-8 py-8"
      >
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div>Loading document...</div>}
          onSourceSuccess={() => setLoading(true)}
          className="flex flex-col items-center"
        >
          {numPages &&
            Array.from({ length: numPages }, (_, index) => (
              <div
                key={index + 1}
                className="mb-8 overflow-hidden rounded-md bg-white shadow-2xl"
              >
                <Page
                  pageNumber={index + 1}
                  width={pageWidth}
                />
              </div>
            ))}
        </Document>
      </div>

    </div>
  );
}