import { useState } from "react";

export function usePdf() {
  const [page, setPage] = useState(1);

  const [zoom, setZoom] = useState(1);

  return {
    page,
    zoom,
    setPage,
    setZoom,
  };
}