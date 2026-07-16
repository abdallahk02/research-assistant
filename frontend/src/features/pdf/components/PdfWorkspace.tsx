"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";

import {
  askDocument,
  extractDocument,
} from "../api/documentApi";
import type { AskSource } from "../types";

import PdfViewer from "./PdfViewer";

type Props = {
  file: string | null;
  fileName: string | null;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function PdfWorkspace({
  file,
  fileName,
  onUpload,
}: Props) {
  const [documentId, setDocumentId] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(
    null,
  );

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<AskSource[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);

  async function handleUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    // Preserve the existing frontend PDF-loading behavior.
    onUpload(event);

    // Reset state associated with the previous document.
    setDocumentId(null);
    setQuestion("");
    setAnswer(null);
    setSources([]);
    setAskError(null);
    setProcessingError(null);
    setIsProcessing(true);

    try {
      const result = await extractDocument(selectedFile);
      setDocumentId(result.document_id);
    } catch (error) {
      setProcessingError(
        getErrorMessage(error, "Failed to process the document."),
      );
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleAsk(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedQuestion = question.trim();

    if (!documentId || !normalizedQuestion || isAsking) {
      return;
    }

    setIsAsking(true);
    setAskError(null);
    setAnswer(null);
    setSources([]);

    try {
      const result = await askDocument({
        document_id: documentId,
        question: normalizedQuestion,
        limit: 5,
      });

      setAnswer(result.answer);
      setSources(result.sources);
    } catch (error) {
      setAskError(
        getErrorMessage(error, "Failed to answer the question."),
      );
    } finally {
      setIsAsking(false);
    }
  }

  const canAsk =
    documentId !== null &&
    question.trim().length > 0 &&
    !isAsking;

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-zinc-100">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 sm:px-6">
        <div className="min-w-0">
          <h1 className="font-semibold tracking-tight">
            Research Assistant
          </h1>

          {fileName && (
            <p className="max-w-48 truncate text-xs text-zinc-500 sm:max-w-sm">
              {fileName}
            </p>
          )}
        </div>

        <label className="cursor-pointer rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2 focus-within:ring-offset-zinc-900 sm:px-4">
          {file ? "Replace PDF" : "Upload PDF"}

          <input
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <main className="min-w-0 flex-1 overflow-hidden bg-zinc-950">
          <PdfViewer file={file} />
        </main>

        <aside className="hidden w-72 shrink-0 flex-col border-l border-zinc-800 bg-zinc-900 md:flex xl:w-80">
          <div className="border-b border-zinc-800 p-5">
            <h2 className="text-sm font-medium text-zinc-300">
              AI Assistant
            </h2>

            <DocumentStatus
              hasFile={file !== null}
              isProcessing={isProcessing}
              isReady={documentId !== null}
              error={processingError}
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {!file && (
              <p className="text-sm text-zinc-500">
                Upload a PDF to ask questions about it.
              </p>
            )}

            {file && !isProcessing && documentId && !answer && !askError && (
              <p className="text-sm text-zinc-500">
                Ask a question about the current document.
              </p>
            )}

            {askError && (
              <div className="rounded-md border border-red-900/60 bg-red-950/40 p-3">
                <p className="text-sm text-red-300">{askError}</p>
              </div>
            )}

            {answer && (
              <section>
                <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Answer
                </h3>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                  {answer}
                </p>
              </section>
            )}

            {sources.length > 0 && (
              <section className="mt-6">
                <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Sources
                </h3>

                <div className="mt-3 space-y-3">
                  {sources.map((source) => (
                    <article
                      key={source.chunk_id}
                      className="rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                    >
                      <p className="text-xs font-medium text-zinc-300">
                        Page {source.page_number}
                      </p>

                      <p className="mt-2 line-clamp-4 text-xs leading-5 text-zinc-500">
                        {source.text}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          <form
            onSubmit={handleAsk}
            className="border-t border-zinc-800 p-4"
          >
            <label
              htmlFor="document-question"
              className="sr-only"
            >
              Ask a question about the document
            </label>

            <textarea
              id="document-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={
                documentId
                  ? "Ask about this document..."
                  : "Upload and process a PDF first..."
              }
              disabled={!documentId || isProcessing}
              rows={3}
              className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!canAsk}
              className="mt-3 w-full rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAsking ? "Thinking..." : "Ask"}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

type DocumentStatusProps = {
  hasFile: boolean;
  isProcessing: boolean;
  isReady: boolean;
  error: string | null;
};

function DocumentStatus({
  hasFile,
  isProcessing,
  isReady,
  error,
}: DocumentStatusProps) {
  if (error) {
    return (
      <p className="mt-2 text-xs text-red-400">
        Document processing failed.
      </p>
    );
  }

  if (isProcessing) {
    return (
      <p className="mt-2 text-xs text-amber-400">
        Processing document...
      </p>
    );
  }

  if (isReady) {
    return (
      <p className="mt-2 text-xs text-emerald-400">
        Document ready
      </p>
    );
  }

  if (hasFile) {
    return (
      <p className="mt-2 text-xs text-zinc-500">
        Waiting to process document.
      </p>
    );
  }

  return (
    <p className="mt-2 text-xs text-zinc-500">
      No document uploaded
    </p>
  );
}

function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  return error instanceof Error
    ? error.message
    : fallbackMessage;
}