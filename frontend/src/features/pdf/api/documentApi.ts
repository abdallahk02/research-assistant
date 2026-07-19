import type {
  AskDocumentRequest,
  AskDocumentResponse,
  ExtractDocumentResponse,
} from "../types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export async function extractDocument(
  file: File,
): Promise<ExtractDocumentResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/documents/extract`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }

  return response.json() as Promise<ExtractDocumentResponse>;
}

export async function askDocument(
  request: AskDocumentRequest,
): Promise<AskDocumentResponse> {
  const response = await fetch(
    `${API_BASE_URL}/documents/ask`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        document_id: request.document_id,
        question: request.question,
        limit: request.limit ?? 5,
        history: request.history ?? [],
      }),
    },
  );

  if (!response.ok) {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }

  return response.json() as Promise<AskDocumentResponse>;
}

async function getErrorMessage(
  response: Response,
): Promise<string> {
  try {
    const body = (await response.json()) as {
      detail?: string;
    };

    return body.detail ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}   