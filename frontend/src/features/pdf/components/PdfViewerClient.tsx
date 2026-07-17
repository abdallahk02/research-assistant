"use client";

import { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
  file: string | null;
  targetPage: number | null;
};


export default function PdfViewerClient({
  file,
  targetPage
}: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(
    new Map(),
  );
  

  useEffect(() => {
    // Clear data from the previously opened document.
    setNumPages(null);
    setError(null);
  }, [file]);

  useEffect(() => {
    if (targetPage === null) {
      return;
    }

    const pageElement = pageRefs.current.get(targetPage);

    if (!pageElement) {
      return;
    }

    pageElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [targetPage, numPages]);

  function onDocumentLoadSuccess({
    numPages,
  }: {
    numPages: number;
  }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Unable to load PDF:", error);

    setNumPages(null);
    setLoading(false);
    setError("Unable to load PDF.");
  }

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <div className="max-w-sm rounded-xl border border-dashed border-zinc-600 bg-zinc-900/40 px-8 py-10">
          <p className="font-medium text-zinc-200">No paper open</p>

          <p className="mt-2 text-sm text-zinc-500">
            Upload a PDF to start reading and exploring your research.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {loading && (
        <div className="border-b border-zinc-700 px-4 py-2 text-center text-sm text-zinc-400">
          Loading PDF...
        </div>
      )}

      {error && (
        <div className="border-b border-red-900/50 bg-red-950/30 px-4 py-2 text-center text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="h-full overflow-y-auto">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
        >
          <div className="flex flex-col items-center gap-8 py-8">
            {Array.from(
              { length: numPages ?? 0 },
              (_, index) => {
                const pageNumber = index + 1;

                return (
                  <div
                    key={pageNumber}
                    ref={(element) => {
                      if (element) {
                        pageRefs.current.set(
                          pageNumber,
                          element,
                        );
                      } else {
                        pageRefs.current.delete(pageNumber);
                      }
                    }}
                    className="scroll-mt-6"
                  >
                    <Page
                      pageNumber={pageNumber}
                      width={700}
                    />
                  </div>
                );
              },
            )}
          </div>
        </Document>
      </div>
    </div>
  );
}