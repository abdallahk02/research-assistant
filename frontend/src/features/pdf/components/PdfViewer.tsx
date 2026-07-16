"use client";

import dynamic from "next/dynamic";

const PdfViewerClient = dynamic(
  () => import("./PdfViewerClient"),
  {
    ssr: false,
  },
);

type Props = {
  file: string | null;
};

export default function PdfViewer({
  file,
}: Props) {
  return (
    <PdfViewerClient
      file={file}
    />
  );
}