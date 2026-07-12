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
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({
    numPages,
  }: {
    numPages: number;
  }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);

    // Reset to first page when a new PDF loads
    setPageNumber(1);

    console.log(`Loaded PDF with ${numPages} pages`);
  }

  function onDocumentLoadError() {
    setLoading(false);
    setError("Unable to load PDF.");
  }

  function goToNextPage() {
    if (numPages && pageNumber < numPages) {
      setPageNumber((prev) => prev + 1);
    }
  }

  function goToPreviousPage() {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        goToNextPage();
      }

      if (event.key === "ArrowLeft") {
        goToPreviousPage();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pageNumber, numPages]);

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Upload a PDF to begin
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-auto p-4">

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

      <PdfToolbar
        pageNumber={pageNumber}
        numPages={numPages}
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
      />

      <div className="flex justify-center p-4">
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
            pageNumber={pageNumber}
            width={700}
          />
        </Document>
      </div>

    </div>
  );
}