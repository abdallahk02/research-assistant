"use client";

import { useState } from "react";
import type {
  ChangeEvent,
  KeyboardEvent,
  SyntheticEvent,
} from "react";

import {
  askDocument,
  extractDocument,
} from "../api/documentApi";
import type {
  AskSource,
  ChatMessage,
} from "../types";

import PdfViewer from "./PdfViewer";

type Props = {
  file: string | null;
  fileName: string | null;
  onUpload: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
};

export default function PdfWorkspace({
  file,
  fileName,
  onUpload,
}: Props) {
  const [documentId, setDocumentId] =
    useState<string | null>(null);

  const [targetPage, setTargetPage] =
    useState<number | null>(null);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [processingError, setProcessingError] =
    useState<string | null>(null);

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState<
    ChatMessage[]
  >([]);

  const [isAsking, setIsAsking] =
    useState(false);

  const [askError, setAskError] =
    useState<string | null>(null);

  async function handleUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    onUpload(event);

    setDocumentId(null);
    setTargetPage(null);
    setQuestion("");
    setMessages([]);
    setAskError(null);
    setProcessingError(null);
    setIsProcessing(true);

    try {
      const result =
        await extractDocument(selectedFile);

      setDocumentId(result.document_id);
    } catch (error) {
      setProcessingError(
        getErrorMessage(
          error,
          "Failed to process the document.",
        ),
      );
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleAsk(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedQuestion =
      question.trim();

    if (
      !documentId ||
      !normalizedQuestion ||
      isAsking
    ) {
      return;
    }

    const previousMessages = messages;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: normalizedQuestion,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setQuestion("");
    setAskError(null);
    setIsAsking(true);

    try {
      const result = await askDocument({
        document_id: documentId,
        question: normalizedQuestion,
        limit: 5,
        history: previousMessages
          .slice(-10)
          .map((message) => ({
            role: message.role,
            content: message.content,
          })),
      });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.answer,
        sources: result.sources,
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      setAskError(
        getErrorMessage(
          error,
          "Failed to answer the question.",
        ),
      );
    } finally {
      setIsAsking(false);
    }
  }

  function handleQuestionKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key !== "Enter" ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();

    if (!canAsk) {
      return;
    }

    event.currentTarget.form?.requestSubmit();
  }

  function handleSourceClick(
    source: AskSource,
  ) {
    setTargetPage(source.page_number);
  }

  const canAsk =
    documentId !== null &&
    question.trim().length > 0 &&
    !isAsking &&
    !isProcessing;

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
          {file
            ? "Replace PDF"
            : "Upload PDF"}

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
          <PdfViewer
            file={file}
            targetPage={targetPage}
          />
        </main>

        <aside className="hidden w-72 shrink-0 flex-col border-l border-zinc-800 bg-zinc-900 md:flex xl:w-80">
          <div className="shrink-0 border-b border-zinc-800 p-5">
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
              <p className="text-sm leading-6 text-zinc-500">
                Upload a PDF to ask questions
                about it.
              </p>
            )}

            {file &&
              isProcessing &&
              messages.length === 0 && (
                <p className="text-sm leading-6 text-zinc-500">
                  The document is being
                  extracted, chunked, and
                  embedded.
                </p>
              )}

            {documentId &&
              messages.length === 0 &&
              !isProcessing && (
                <p className="text-sm leading-6 text-zinc-500">
                  Ask a question about the
                  current document.
                </p>
              )}

            <div className="space-y-6">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "ml-6 rounded-lg bg-zinc-800 p-3"
                      : "mr-2"
                  }
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    {message.role === "user"
                      ? "You"
                      : "Assistant"}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                    {message.content}
                  </p>

                  {message.role ===
                    "assistant" &&
                    message.sources &&
                    message.sources.length >
                      0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                          Sources
                        </p>

                        {message.sources.map(
                          (source) => (
                            <button
                              key={`${message.id}-${source.chunk_id}`}
                              type="button"
                              onClick={() =>
                                handleSourceClick(
                                  source,
                                )
                              }
                              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-left transition-colors hover:border-zinc-600 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            >
                              <p className="text-xs font-medium text-zinc-300">
                                Page{" "}
                                {
                                  source.page_number
                                }
                              </p>

                              <p className="mt-2 line-clamp-4 text-xs leading-5 text-zinc-500">
                                {source.text}
                              </p>
                            </button>
                          ),
                        )}
                      </div>
                    )}
                </article>
              ))}

              {isAsking && (
                <div className="mr-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Assistant
                  </p>

                  <p className="mt-2 text-sm text-zinc-400">
                    Thinking...
                  </p>
                </div>
              )}

              {askError && (
                <div className="rounded-md border border-red-900/60 bg-red-950/40 p-3">
                  <p className="text-sm text-red-300">
                    {askError}
                  </p>
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={handleAsk}
            className="shrink-0 border-t border-zinc-800 p-4"
          >
            <label
              htmlFor="document-question"
              className="sr-only"
            >
              Ask a question about the
              document
            </label>

            <textarea
              id="document-question"
              value={question}
              onChange={(event) =>
                setQuestion(
                  event.target.value,
                )
              }
              onKeyDown={
                handleQuestionKeyDown
              }
              placeholder={
                documentId
                  ? "Ask about this document..."
                  : "Upload and process a PDF first..."
              }
              disabled={
                !documentId ||
                isProcessing ||
                isAsking
              }
              rows={3}
              className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-xs text-zinc-600">
                Enter to send · Shift+Enter
                for a new line
              </p>

              <button
                type="submit"
                disabled={!canAsk}
                className="shrink-0 rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAsking
                  ? "Thinking..."
                  : "Ask"}
              </button>
            </div>
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
        {error}
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
