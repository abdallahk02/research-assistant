export interface Paper {
  id: string;

  title: string;

  file: string;
};

export type ExtractDocumentResponse = {
  document_id: string;
  page_count: number;
  chunk_count: number;
  embedding_count: number;
  embedding_dimensions: number;
};

export type AskDocumentRequest = {
  document_id: string;
  question: string;
  limit?: number;
};

export type AskSource = {
  chunk_id: number;
  page_number: number;
  text: string;
  distance: number;
};

export type AskDocumentResponse = {
  answer: string;
  sources: AskSource[];
};