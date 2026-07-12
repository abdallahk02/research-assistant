"use client";

import { useState } from "react";
import { useEffect } from 'react';
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
  const [pageNumber, setPageNumber] = useState(1);

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
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowRight") {
      if (numPages && pageNumber < numPages) {
        setPageNumber(pageNumber + 1);
      }
    }

    if (event.key === "ArrowLeft") {
      if (pageNumber > 1) {
        setPageNumber(pageNumber - 1);
      }
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
          pageNumber={pageNumber}
          width={700}
        />
      </Document>
      <div>
        <button
        disabled={pageNumber === 1}
        onClick={() => {
          if(pageNumber > 1){
            setPageNumber(pageNumber-1)
          }
        }}
        >
        Previous
        </button>
        <button
        disabled = {pageNumber >= (numPages ?? 1)}
        onClick={() => {
          if (numPages && pageNumber < numPages){
            setPageNumber(pageNumber+1)
          }
        }}
        >
        Next
        </button>
      </div>

      
      {numPages && (
        <div className="mt-4 text-sm text-gray-600">
          <div>
            Page {pageNumber}/{numPages}
          </div>
        </div>
      )}

    </div>
  );
}