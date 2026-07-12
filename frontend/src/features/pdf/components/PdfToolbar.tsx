"use client";

type Props = {
  pageNumber: number;
  numPages: number | null;
  onPrevious: () => void;
  onNext: () => void;
};

export default function PdfToolbar({
  pageNumber,
  numPages,
  onPrevious,
  onNext,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-4 border-b p-3">

      <button
        disabled={pageNumber === 1}
        onClick={onPrevious}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        Previous
      </button>

      <span>
        Page {pageNumber} / {numPages ?? "--"}
      </span>

      <button
        disabled={pageNumber >= (numPages ?? 1)}
        onClick={onNext}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        Next
      </button>

    </div>
  );
}