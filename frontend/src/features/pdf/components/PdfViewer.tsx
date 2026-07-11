type Props = {
  file: string | null;
};

export default function PdfViewer({ file }: Props) {
  if (!file) {
    return (
      <div className="flex items-center justify-center h-full">
        Upload a PDF
      </div>
    );
  }

  return (
    <div className="flex-1">
      PDF goes here
    </div>
  );
}