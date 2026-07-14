type Props = {
  numPages: number | null;
};

export default function PdfToolbar({ numPages }: Props) {
  return (
    <div className="flex justify-center border-b p-3">
      <span>
        {numPages ? `${numPages} pages` : "Loading..."}
      </span>
    </div>
  );
}