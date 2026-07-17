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
  targetPage: number | null;
};

export default function PdfViewer({
  file,
  targetPage,
}: Props) {
  return (
    <PdfViewerClient
      file={file}
      targetPage={targetPage}
    />
  );
}